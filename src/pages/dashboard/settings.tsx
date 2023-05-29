import { Divider, NumberInput, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import React, { FormEvent } from "react";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { api } from "~/utils/api";

const Settings = () => {
  const userQuery = api.user.me.useQuery();
  const subscriptionQuery = api.user.subscription.useQuery(
    userQuery.data?.email || undefined,
    {
      enabled: !!userQuery.data?.email,
    }
  );
  const saveProfile = api.user.saveProfile.useMutation();

  const profileForm = useForm({
    initialValues: {
      words_per_minute: userQuery.data?.Profile?.words_per_minute || 200,
      email: userQuery.data?.email || "",
    },
    validate: {
      email: isNotEmpty("This field is required"),
    },
  });

  const messagesForm = useForm({
    initialValues: {
      greeting: userQuery.data?.Profile?.greeting || undefined,
      recurring: userQuery.data?.Profile?.recurring || undefined,
    },
  });

  const currentUser = userQuery.data;

  if (!currentUser) return null;

  const saveProfileHandler = (e: FormEvent) => {
    e.preventDefault();

    const { hasErrors } = profileForm.validate();

    if (hasErrors) return;

    saveProfile.mutate(profileForm.values);
  };

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 max-w-screen-2xl">
        <h1 className="h1 text-3xl">Settings</h1>

        <section className="my-10 flex max-w-lg flex-col gap-10 rounded-xl bg-white p-4 shadow-sm">
          <form className="flex flex-col gap-4" onSubmit={saveProfileHandler}>
            <h2 className="text-xl font-semibold text-gray-800">Profile</h2>

            <div className="flex flex-col gap-2">
              <NumberInput
                variant="filled"
                label="Words per minute"
                description="This will help better calculate the time it takes to read a
                story."
                {...profileForm.getInputProps("words_per_minute")}
              />

              <TextInput
                variant="filled"
                label="Email"
                placeholder="Add your email"
                {...profileForm.getInputProps("email")}
              />
            </div>
            <button className="button main" type="submit">
              Save profile
            </button>
          </form>

          <Divider />

          <div className="flex flex-col">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Recent searches
            </h2>

            {currentUser?.Profile?.searches &&
            currentUser?.Profile?.searches.length > 0 ? (
              currentUser?.Profile?.searches.map((s, id) => (
                <div key={`${s}_${id}`} className="flex items-baseline">
                  <button className="button simple mr-4">Clear</button>
                  <p className="font-thin text-gray-600">{s}</p>
                </div>
              ))
            ) : (
              <div className="flex justify-center rounded-xl bg-gray-50 p-4">
                <p className="fint-thin text-sm text-gray-700">
                  Nothing searched yet.
                </p>
              </div>
            )}
          </div>

          <Divider />

          <div className="flex flex-col gap-3">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Messages
            </h2>

            <Textarea
              variant="filled"
              label="Greeting"
              description="This message is used when you haven't messaged an author before. Think of it as an initial greeting. Say hello, introduce yourself, go from there."
              {...messagesForm.getInputProps("greeting")}
            />

            <Textarea
              variant="filled"
              label="Recurring"
              description="This is used when you've already messaged an author. It's useful so users don't feel like they're just getting copy and pasted messages."
              {...messagesForm.getInputProps("recurring")}
            />
          </div>
          <button className="button main mt-3">Save messages</button>
          <Divider />

          <div className="flex flex-col">
            <h2 className=" text-xl font-semibold text-gray-800">Billing</h2>
            <p className="text-sm text-gray-700">
              Your plan is managed with Stripe.
            </p>

            <div className="mt-4 rounded-xl bg-gray-50 p-4">
              <h3 className="mb-4 font-semibold text-gray-800">Your plan</h3>
              <p className="text-sm font-thin text-gray-700">
                You can manage your subscription through Stripe. There you can
                update your billing information, cancel or update your plan, and
                add payment information.
              </p>
            </div>

            <div className="mt-4 rounded-xl border-[1px] border-indigo-500 p-4"></div>
          </div>

          <Divider />
          <div className="flex flex-col">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Delete account
            </h2>
            <p className="text-sm text-gray-700">
              To delete your account, manage your subscription and cancel your
              membership. Your account will be deleted once your membership is
              cancelled and the billing cycle ends.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Settings;
