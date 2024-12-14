import { zodResolver } from "@hookform/resolvers/zod";
import { captureException } from "@sentry/nextjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { getPrices, plans } from "~/constants";
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
  const updateUser = api.user.saveProfile.useMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (session.data?.user.email) {
      form.setValue("email", session.data.user.email);
    }
  }, []);

  const submitHandler = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      await updateUser.mutateAsync({
        email: data.email,
      });

      const link = await paymentLink.mutateAsync({
        price: getPrices().ultimate,
        email: data.email,
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
        userId: session.data?.user.id,
      });
    }
    setLoading(false);
  };

  const plan = plans[0];

  return (
    <main className="mx-auto max-w-screen-md py-20">
      <h1 className="mb-6 text-3xl font-medium text-foreground">Onboarding</h1>

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
                <FormLabel className="required">Email</FormLabel>
                <Input placeholder="Email" type="email" {...field} />
              </FormItem>
            )}
          />
          <p className="my-4">
            We only have one plan, to keep things simple. You&apos;ll be
            redirected to a checkout screen to subscribe to the plan below.
          </p>
          <section className="my-4 rounded-sm border border-border p-6">
            <h2 className="text-xl font-medium">{plan?.name}</h2>
            <p className="text-muted-foreground">{plan?.desc}</p>
          </section>

          <Button
            type="submit"
            disabled={loading || !form.getValues().email}
            className="mt-4"
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default AccountSetup;
