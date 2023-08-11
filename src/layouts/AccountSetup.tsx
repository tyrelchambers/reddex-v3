import { faCheckCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, List, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { captureException } from "@sentry/nextjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import NoSelectedPlan from "~/components/NoSelectedPlan";
import { Button } from "~/components/ui/button";
import { plans } from "~/constants";
import { mantineInputClasses } from "~/lib/styles";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const AccountSetup = () => {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const paymentLink = api.stripe.createCheckout.useMutation();

  const updateUser = api.user.saveProfile.useMutation();
  const createCustomer = api.billing.createCustomer.useMutation();
  const [selectedFrequency, setSelectedFrequency] = useState<
    "yearly" | "monthly"
  >("yearly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: isNotEmpty(),
    },
  });

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { hasErrors } = form.validate();
      const customerId = await createCustomer.mutateAsync(form.values.email);

      if (hasErrors) {
        return setLoading(false);
      }

      await updateUser.mutateAsync({
        email: form.values.email,
      });

      if (!customerId) throw new Error("Missing customer ID");

      const selectedPlan = new URLSearchParams(window.location.search).get(
        "plan"
      );
      if (!form.values.email || !customerId)
        throw new Error("Missing user email or customer id");

      if (!selectedPlan) throw new Error("Missing selected plan");

      const link = await paymentLink.mutateAsync({
        customerEmail: form.values.email,
        plan: selectedPlan,
        customerId,
      });

      if (link) {
        window.open(link, "_self", "rel=noopener,noreferrer");
        window.sessionStorage.removeItem("selected-plan");
      } else {
        throw new Error("Missing payment link");
      }
    } catch (error) {
      captureException(error);
      trackUiEvent(MixpanelEvents.ONBOARDING, {
        plan: selectedPlan,
        userId: session.data?.user.id,
      });
    }
  };

  const setSelectedPlanHandler = (plan: string) => {
    if (!plan) return;

    const params = new URLSearchParams(window.location.search);
    params.set("plan", plan);

    setSelectedPlan(plan);

    router.push(router.asPath, {
      query: params.toString(),
    });
  };

  const clearPlan = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("plan");

    setSelectedPlan(null);
    router.push(router.asPath, {
      query: params.toString(),
    });
  };

  return (
    <main className="mx-auto max-w-screen-md py-20">
      <>
        <h1 className="text-foreground">
          Let&apos;s finish setting up your account.
        </h1>
        <p className="text-foreground/70">
          We just need to add a thing or two to your accont, then you&apos;ll be
          all set!
        </p>
        <form
          className="mt-4 rounded-2xl border-[1px] border-border p-4"
          onSubmit={submitHandler}
        >
          <TextInput
            label="Email"
            placeholder="Email"
            required
            type="email"
            classNames={mantineInputClasses}
            {...form.getInputProps("email")}
          />
          <section className="my-4">
            {selectedPlan ? (
              <SelectedPlan plan={selectedPlan} />
            ) : (
              <NoSelectedPlan
                setSelectedPlanHandler={setSelectedPlanHandler}
                frequency={selectedFrequency}
                setFrequency={setSelectedFrequency}
              />
            )}
            <div className="flex w-full justify-end">
              <Button
                variant="outline"
                className="mt-2"
                type="button"
                onClick={clearPlan}
              >
                Change plan
              </Button>
            </div>
          </section>

          <Button
            type="submit"
            disabled={loading || !selectedPlan || !form.values.email}
            className="mt-4"
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </form>
      </>
    </main>
  );
};

const SelectedPlan = ({ plan }: { plan: string }) => {
  const selectedPlan = plans.find(
    (p) => p.monthly.productId === plan || p.yearly.productId === plan
  );

  return (
    <div className="flex flex-col rounded-2xl bg-card p-8">
      <p className="text-2xl text-card-foreground">
        That&apos;s a nice looking plan!
      </p>
      <p className="text-card-foreground/70">
        Here&apos;s what you&apos;ve chosen.
      </p>
      <Divider className="my-8 border-border" />
      <div>
        <h2 className="text-3xl font-medium text-card-foreground">
          {selectedPlan?.name}
        </h2>
        <p className="text-card-foreground/70">{selectedPlan?.desc}</p>
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <FontAwesomeIcon className="text-rose-500" icon={faCheckCircle} />
          }
          className="mt-6"
        >
          {selectedPlan?.features.map((feature, idx) => (
            <List.Item key={idx} className="text-card-foreground/70">
              {feature}
            </List.Item>
          ))}
        </List>
      </div>
    </div>
  );
};

export default AccountSetup;
