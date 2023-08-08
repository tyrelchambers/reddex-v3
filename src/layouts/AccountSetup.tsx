import { faCheckCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, List, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { captureException } from "@sentry/nextjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import PricingChip from "~/components/PricingChip";
import PricingFrequencySelect from "~/components/PricingFrequencySelect";
import { Button } from "~/components/ui/button";
import { plans } from "~/constants";
import { mantineInputClasses } from "~/lib/styles";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

interface NoSelectedPlanProps {
  setSelectedPlanHandler: (id: string) => void;
  frequency: "yearly" | "monthly";
  setFrequency: React.Dispatch<React.SetStateAction<"yearly" | "monthly">>;
}

interface Props {
  setStep: (step: string) => void;
}
const AccountSetup = ({ setStep }: Props) => {
  const session = useSession();
  const [loading, setLoading] = useState(false);

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
      const params = new URLSearchParams(window.location.search);
      const customerId = await createCustomer.mutateAsync(form.values.email);

      if (hasErrors) {
        return setLoading(false);
      }

      await updateUser.mutateAsync({
        email: form.values.email,
      });

      if (!customerId) throw new Error("Missing customer ID");

      params.set("step", "2");

      setStep("2");
      router.push(router.asPath, {
        query: params.toString(),
      });
    } catch (error) {
      captureException(error);
      trackUiEvent(MixpanelEvents.ONBOARDING_STEP_1_FAILED, {
        plan: selectedPlan,
        userId: session.data?.user.id,
        step: "1",
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

const NoSelectedPlan = ({
  setSelectedPlanHandler,
  frequency,
  setFrequency,
}: NoSelectedPlanProps) => {
  return (
    <div className="flex flex-col rounded-2xl bg-card p-8">
      <p className="mb-2 text-2xl text-card-foreground">
        Looks like we haven&apos;t chosen a plan yet!
      </p>
      <p className="text-card-foreground/70">
        That&apos;s okay, just select one below and we will get started.
      </p>
      <Divider className="my-8" />

      <div className="flex flex-col gap-6">
        <PricingFrequencySelect
          frequency={frequency}
          setFrequency={setFrequency}
        />

        {plans.map((item) => (
          <PricingChip
            plan={item}
            setSelectedPlanHandler={setSelectedPlanHandler}
            frequency={frequency}
            key={item.name}
          />
        ))}
      </div>
    </div>
  );
};

export default AccountSetup;
