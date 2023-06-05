import { TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import { useRouter } from "next/router";
import React, { FormEvent } from "react";
import { api } from "~/utils/api";

const AccountSetup = () => {
  const [loading, setLoading] = React.useState(false);
  const userQuery = api.user.me.useQuery();
  const updateUser = api.user.saveProfile.useMutation();
  const createCustomer = api.billing.createCustomer.useMutation();
  const paymentLink = api.stripe.createCheckout.useMutation();
  const createSubscription = api.billing.createSubscription.useMutation();
  const [selectedPlan] = useLocalStorage({
    key: "selected-plan",
  });

  const router = useRouter();
  const user = userQuery.data;

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: isNotEmpty(),
    },
  });

  React.useEffect(() => {
    // if (user?.email && user.Subscription?.customerId) {
    //   router.push("/dashboard");
    // }

    if (!userQuery.isLoading && !userQuery.data) {
      router.push("/");
    }
  }, [user?.email, router.isReady]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { hasErrors } = form.validate();

    if (hasErrors) {
      return setLoading(false);
    }

    await updateUser.mutateAsync({
      email: form.values.email,
    });

    const customerId = await createCustomer.mutateAsync(form.values.email);

    await createSubscription.mutateAsync({
      customerId,
    });

    const link = await paymentLink.mutateAsync({
      customerEmail: form.values.email,
      plan: selectedPlan,
      customerId: customerId,
    });

    if (link) {
      window.open(link, "_self", "rel=noopener,noreferrer");
    }

    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-screen-md py-20">
      <h1>Let&apos;s finish setting up your account.</h1>
      <p className="text-gray-500">
        We just need to add a thing or two to your accont, then you&apos;ll be
        all set!
      </p>
      <form
        className="mt-4 rounded-2xl bg-gray-50 p-4"
        onSubmit={submitHandler}
      >
        <TextInput
          label="Email"
          placeholder="Email"
          required
          type="email"
          {...form.getInputProps("email")}
        />
        <button
          type="submit"
          className="button main mt-4 w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </main>
  );
};

export default AccountSetup;
