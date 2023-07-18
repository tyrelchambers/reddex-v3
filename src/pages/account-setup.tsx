import { TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { mantineInputClasses } from "~/lib/styles";
import { routes } from "~/routes";
import { api } from "~/utils/api";

const AccountSetup = () => {
  const [loading, setLoading] = React.useState(true);
  const session = useSession();
  const userQuery = api.user.me.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });
  const updateUser = api.user.saveProfile.useMutation();
  const createCustomer = api.billing.createCustomer.useMutation();
  const paymentLink = api.stripe.createCheckout.useMutation();
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
    const redirectTo = (router.query.redirectTo as string) || routes.APPROVED;
    if (user?.email && user?.customerId) {
      router.push(redirectTo);
    } else if (!userQuery.isLoading && !userQuery.data) {
      router.push("/");
    } else if (!userQuery.isLoading && userQuery.data) {
      setLoading(false);
    }
  }, [user]);

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

    const link = await paymentLink.mutateAsync({
      customerEmail: form.values.email,
      plan: selectedPlan,
      customerId: customerId,
    });

    if (link) {
      window.open(link, "_self", "rel=noopener,noreferrer");
      window.localStorage.removeItem("selected-plan");
    }

    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-screen-md py-20">
      {loading ? (
        <div>
          <h1>Checking your account setup. Just a second...</h1>
        </div>
      ) : (
        <>
          <h1 className="text-foreground">
            Let&apos;s finish setting up your account.
          </h1>
          <p className="text-foreground/70">
            We just need to add a thing or two to your accont, then you&apos;ll
            be all set!
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
            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? "Saving..." : "Continue"}
            </Button>
          </form>
        </>
      )}
    </main>
  );
};

export default AccountSetup;
