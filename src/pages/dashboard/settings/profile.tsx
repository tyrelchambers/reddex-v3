import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, NumberInput, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { RecentlySearched } from "@prisma/client";
import React, { FormEvent, useEffect } from "react";
import { Button } from "~/components/ui/button";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineInputClasses, mantineNumberClasses } from "~/lib/styles";
import { settingsTabs } from "~/routes";
import { api } from "~/utils/api";

const Profile = () => {
  const apiContext = api.useContext();
  const saveProfile = api.user.saveProfile.useMutation();
  const userQuery = api.user.me.useQuery();
  const deleteSearched = api.user.removeSearch.useMutation({
    onSuccess: () => {
      apiContext.user.invalidate();
    },
  });
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

  const deleteRecentlySearchedItem = (id: RecentlySearched["id"]) => {
    deleteSearched.mutate(id);
  };

  return (
    <WrapperWithNav tabs={settingsTabs}>
      <div className="flex max-w-screen-sm flex-col gap-8 px-4 lg:px-0">
        <h1 className="text-3xl text-foreground">Profile</h1>
        <form className=" form" onSubmit={saveProfileHandler}>
          <div className="flex flex-col gap-2">
            <NumberInput
              variant="filled"
              classNames={mantineNumberClasses}
              label="Words per minute"
              description="This will help better calculate the time it takes to read a
                story."
              {...profileForm.getInputProps("words_per_minute")}
            />

            <TextInput
              variant="filled"
              label="Email"
              placeholder="Add your email"
              classNames={mantineInputClasses}
              {...profileForm.getInputProps("email")}
            />
          </div>
          <Button type="submit">Save profile</Button>
        </form>
        <Divider className="border-border" />

        <div className="flex flex-col">
          <h2 className="mb-4 text-xl text-foreground">Recent searches</h2>
          {currentUser?.Profile?.searches &&
          currentUser?.Profile?.searches.length > 0 ? (
            <div className="flex gap-4">
              {currentUser?.Profile?.searches.map((s, id) => (
                <button
                  key={`${s.text}_${id}`}
                  className="flex w-fit items-center gap-4 rounded-full bg-card p-2"
                  onClick={() => deleteRecentlySearchedItem(s.id)}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="rounded-full text-card-foreground"
                  />

                  <p className="font-thin text-card-foreground">{s.text}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex justify-center rounded-xl bg-card p-4">
              <p className="fint-thin text-sm text-card-foreground">
                Nothing searched yet.
              </p>
            </div>
          )}
        </div>
        <Divider className="border-border" />
        <div className="flex flex-col gap-3">
          <h2 className="mb-4 text-xl text-foreground">Messages</h2>

          <form action="" className="form" onSubmit={saveMessagesHandler}>
            <Textarea
              variant="filled"
              label="Greeting"
              description="This message is used when you haven't messaged an author before. Think of it as an initial greeting. Say hello, introduce yourself, go from there."
              minRows={10}
              classNames={mantineInputClasses}
              {...messagesForm.getInputProps("greeting")}
            />
            <Textarea
              variant="filled"
              label="Recurring"
              description="This is used when you've already messaged an author. It's useful so users don't feel like they're just getting copy and pasted messages."
              minRows={10}
              classNames={mantineInputClasses}
              {...messagesForm.getInputProps("recurring")}
            />
            <Button className=" mt-3" type="submit">
              Save messages
            </Button>
          </form>
        </div>
      </div>
    </WrapperWithNav>
  );
};

export default Profile;
