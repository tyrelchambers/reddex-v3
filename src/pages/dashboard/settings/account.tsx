import { faSpinner } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Stripe from "stripe";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { settingsTabs } from "~/routes";
import { api } from "~/utils/api";
import SubscriptionCard from "~/components/SubscriptionCard";
import NoSelectedPlan from "~/components/NoSelectedPlan";
import { Button } from "~/components/ui/button";
import { captureException } from "@sentry/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

const formSchema = z.object({
  email: z.string().email(),
});

const Settings = () => {
  const { data: currentUser } = api.user.me.useQuery();
  const subscriptionQuery = api.billing.info.useQuery();
  const [selectedFrequency, setSelectedFrequency] = useState<
    "yearly" | "monthly"
  >("yearly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const subscription = subscriptionQuery.data?.customer.subscriptions
    ?.data[0] as Stripe.Subscription & {
    plan: Stripe.Plan & {
      product: Stripe.Product;
    };
  };
  const invoices = subscriptionQuery.data?.invoices;
  const paymentLink = api.stripe.createCheckout.useMutation();
  const createCustomer = api.billing.createCustomer.useMutation();
  const updateUser = api.user.saveProfile.useMutation();

  const [loadingPaymentLink, setLoadingPaymentLink] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const isLoading = subscriptionQuery.isLoading;

  const createSubscriptionHandler = async () => {
    const formValues = form.getValues();
    try {
      setLoadingPaymentLink(true);

      if (!selectedPlan) throw new Error("Missing selected plan");

      const customerEmail = currentUser?.email || formValues.email;

      const customerId =
        currentUser?.customerId ||
        (await createCustomer.mutateAsync(customerEmail));

      await updateUser.mutateAsync({
        email: formValues.email,
      });

      if (!customerId) {
        throw new Error("Missing customer ID");
      }

      const link = await paymentLink.mutateAsync({
        customerEmail,
        plan: selectedPlan,
        customerId,
      });

      if (link) {
        window.open(link, "_self", "rel=noopener,noreferrer");
        window.sessionStorage.removeItem("selected-plan");
      } else {
        throw new Error("Missing payment link");
      }

      setLoadingPaymentLink(false);
    } catch (error) {
      captureException(error, {
        extra: {
          userId: currentUser?.id,
          plan: selectedPlan,
        },
      });
    }
  };

  return (
    <WrapperWithNav
      loading={isLoading}
      loadingMessage="Loading account data..."
      tabs={settingsTabs}
    >
      <section className="flex max-w-screen-sm flex-col gap-8 px-4 lg:px-0">
        <h1 className="text-3xl text-foreground">Account</h1>

        <div className="flex flex-col">
          <h2 className="text-xl text-foreground">Billing</h2>
          <p className="text-sm text-muted-foreground">
            Your plan is managed with Stripe.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            You can manage your subscription through Stripe. There you can
            update your billing information, cancel or update your plan.
          </p>

          {subscription ? (
            <SubscriptionCard subscription={subscription} invoices={invoices} />
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">Choose a plan</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Select a plan</DialogHeader>
                {!currentUser?.email && (
                  <>
                    <p className="mb-4">
                      Please add an email to your account before we proceed.
                    </p>
                    <Form {...form}>
                      <FormField
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <Input
                              placeholder="Email"
                              required
                              type="email"
                              {...field}
                            />
                          </FormItem>
                        )}
                      />
                    </Form>
                  </>
                )}
                <NoSelectedPlan
                  setSelectedPlanHandler={setSelectedPlan}
                  frequency={selectedFrequency}
                  setFrequency={setSelectedFrequency}
                  selectedPlan={selectedPlan}
                />

                <Button
                  disabled={!selectedPlan || loadingPaymentLink}
                  className="w-full"
                  onClick={createSubscriptionHandler}
                >
                  {loadingPaymentLink ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="mr-2" spin />{" "}
                      Loading...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Separator className="border-border" />
        <div className="flex flex-col">
          <h2 className="text-xl text-foreground">Delete account</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            To delete your account, manage your subscription and cancel your
            membership. Your account will be deleted once your membership is
            cancelled and the billing cycle ends.
          </p>

          <Button variant="secondary">Delete account</Button>
        </div>
      </section>
    </WrapperWithNav>
  );
};

export default Settings;
