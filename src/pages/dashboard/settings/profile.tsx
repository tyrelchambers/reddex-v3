import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, NumberInput, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import React, { FormEvent, useEffect } from "react";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { settingsTabs } from "~/routes";
import { api } from "~/utils/api";

const Profile = () => {
  const saveProfile = api.user.saveProfile.useMutation();
  const userQuery = api.user.me.useQuery();

  const currentUser = userQuery.data;

  const profileForm = useForm({
    initialValues: {
      words_per_minute: 200,
      email: "",
    },
    validate: {
      email: isNotEmpty("This field is required"),
    },
  });
  const messagesForm = useForm({
    initialValues: {
      greeting: "",
      recurring: "",
    },
  });

  useEffect(() => {
    if (userQuery.data) {
      profileForm.setValues({
        email: userQuery.data.email || "",
        words_per_minute: userQuery.data.Profile?.words_per_minute || 150,
      });

      messagesForm.setValues({
        greeting: userQuery.data.Profile?.greeting || "",
        recurring: userQuery.data.Profile?.recurring || "",
      });
    }
  }, [userQuery.data]);

  const saveProfileHandler = (e: FormEvent) => {
    e.preventDefault();

    const { hasErrors } = profileForm.validate();

    if (hasErrors) return;

    saveProfile.mutate(profileForm.values);
  };

  const saveMessagesHandler = (e: FormEvent) => {
    e.preventDefault();

    const { hasErrors } = messagesForm.validate();

    if (hasErrors) return;

    saveProfile.mutate(messagesForm.values);
  };

  return (
    <WrapperWithNav tabs={settingsTabs}>
      <div className="flex max-w-screen-sm flex-col gap-8">
        <h1 className="h1 text-3xl">Profile</h1>
        <form className=" form" onSubmit={saveProfileHandler}>
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
              <div
                key={`${s}_${id}`}
                className="flex w-fit items-baseline rounded-full bg-gray-50 p-2"
              >
                <button className="button simple mr-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                    <FontAwesomeIcon icon={faTimes} className="rounded-full" />
                  </div>
                </button>
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
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Messages</h2>

          <form action="" className="form" onSubmit={saveMessagesHandler}>
            <Textarea
              variant="filled"
              label="Greeting"
              description="This message is used when you haven't messaged an author before. Think of it as an initial greeting. Say hello, introduce yourself, go from there."
              minRows={10}
              {...messagesForm.getInputProps("greeting")}
            />
            <Textarea
              variant="filled"
              label="Recurring"
              description="This is used when you've already messaged an author. It's useful so users don't feel like they're just getting copy and pasted messages."
              minRows={10}
              {...messagesForm.getInputProps("recurring")}
            />
            <button className="button main mt-3" type="submit">
              Save messages
            </button>
          </form>
        </div>
      </div>
    </WrapperWithNav>
  );
};

export default Profile;
