import { faCheckCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { List } from "@mantine/core";
import { captureException } from "@sentry/nextjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import NoSelectedPlan from "~/components/NoSelectedPlan";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Plan, plans } from "~/constants";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const formSchema = z.object({
  email: z.string().email(),
});

const AccountSetup = () => {
  const session = useSession();
  const [loading, setLoading] = useState(false);

  const paymentLink = api.stripe.createCheckout.useMutation();
  const updateUser = api.user.saveProfile.useMutation({
    onError() {
      toast.error("Something went wrong");
    },
    onSettled() {
      setLoading(false);
    },
  });
  const createCustomer = api.billing.createCustomer.useMutation();

  const [selectedFrequency, setSelectedFrequency] = useState<
    "yearly" | "monthly"
  >("yearly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const submitHandler = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const customerId = await createCustomer.mutateAsync(data.email);

      await updateUser.mutateAsync({
        email: data.email,
      });

      if (!customerId) throw new Error("Missing customer ID");

      const selectedPlan = new URLSearchParams(window.location.search).get(
        "plan",
      );
      if (!data.email || !customerId)
        throw new Error("Missing user email or customer id");

      if (!selectedPlan) throw new Error("Missing selected plan");

      const link = await paymentLink.mutateAsync({
        customerEmail: data.email,
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
    } finally {
      setLoading(false);
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
        <h1 className="mb-6 text-3xl font-medium text-foreground">
          Onboarding
        </h1>

        <p className="text-foreground/70">
          Let&apos;s finish setting up your account. We just need to add a thing
          or two to your accont, then you&apos;ll be all set!
        </p>
        <Form {...form}>
          <form
            className="mt-4 rounded-2xl border-[1px] border-border p-4"
            onSubmit={form.handleSubmit(submitHandler)}
          >
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="Email" required type="email" {...field} />
                </FormItem>
              )}
            />
            <section className="my-4">
              {selectedPlan ? (
                <SelectedPlan plan={selectedPlan} />
              ) : (
                <NoSelectedPlan
                  setSelectedPlanHandler={setSelectedPlanHandler}
                  setFrequency={setSelectedFrequency}
                />
              )}
              {selectedPlan && (
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
              )}
            </section>

            <Button
              type="submit"
              disabled={loading || !selectedPlan || !form.getValues().email}
              className="mt-4"
            >
              {loading ? "Saving..." : "Continue"}
            </Button>
          </form>
        </Form>
      </>
    </main>
  );
};

const SelectedPlan = ({ plan }: { plan: Plan }) => {
  return (
    <div className="flex flex-col rounded-2xl bg-card p-8">
      <p className="text-2xl text-card-foreground">
        That&apos;s a nice looking plan!
      </p>
      <p className="text-card-foreground/70">
        Here&apos;s what you&apos;ve chosen.
      </p>
      <Separator className="my-8 border-border" />
      <div>
        <h2 className="text-3xl font-medium text-card-foreground">
          {plan?.name}
        </h2>
        <p className="text-card-foreground/70">{plan?.desc}</p>
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <FontAwesomeIcon className="text-rose-500" icon={faCheckCircle} />
          }
          className="mt-6"
        >
          {plan?.features.map((feature, idx) => (
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
