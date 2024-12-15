import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecentlySearched } from "@prisma/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { settingsTabs } from "~/routes";
import { api } from "~/utils/api";

const profileFormSchema = z.object({
  email: z.string().email(),
  words_per_minute: z.string(),
});

const messageFormSchema = z.object({
  greeting: z.string(),
  recurring: z.string(),
});

const Profile = () => {
  const apiContext = api.useUtils();
  const saveProfile = api.user.saveProfile.useMutation({
    onSuccess: () => {
      apiContext.user.invalidate();
      toast.success("Profile saved");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const { data: user } = api.user.me.useQuery();
  const deleteSearched = api.user.removeSearch.useMutation({
    onSuccess: () => {
      apiContext.user.invalidate();
    },
  });
  const currentUser = user;

  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      words_per_minute: "200",
      email: "",
    },
  });
  const messagesForm = useForm({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      greeting: "",
      recurring: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        email: currentUser.email || "",
        words_per_minute:
          String(currentUser.Profile?.words_per_minute) || "150",
      });

      messagesForm.reset({
        greeting: currentUser.Profile?.greeting || "",
        recurring: currentUser.Profile?.recurring || "",
      });
    }
  }, [currentUser]);

  const saveProfileHandler = (data: z.infer<typeof profileFormSchema>) => {
    saveProfile.mutate(data);
  };

  const saveMessagesHandler = (data: z.infer<typeof messageFormSchema>) => {
    saveProfile.mutate(data);
  };

  const deleteRecentlySearchedItem = (id: RecentlySearched["id"]) => {
    deleteSearched.mutate(id);
  };

  return (
    <WrapperWithNav tabs={settingsTabs}>
      <div className="flex max-w-screen-sm flex-col gap-8 px-4 lg:px-0">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <Form {...profileForm}>
          <form
            className="form"
            onSubmit={profileForm.handleSubmit(saveProfileHandler)}
          >
            <div className="flex flex-col gap-4">
              <FormField
                name="words_per_minute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Words per minute</FormLabel>
                    <FormDescription>
                      This will help better calculate the time it takes to read
                      a story.
                    </FormDescription>
                    <Input type="number" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add your email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Add your email"
                      {...field}
                    />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Save profile</Button>
          </form>
        </Form>
        <Separator />

        <div className="flex flex-col">
          <h2 className="mb-4 text-xl text-foreground">Recent searches</h2>
          {currentUser?.Profile?.searches &&
          currentUser?.Profile?.searches.length > 0 ? (
            <div className="flex gap-4">
              {currentUser?.Profile?.searches?.map((s, id) => (
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
        <Separator />
        <div className="flex flex-col">
          <h2 className="mb-4 text-xl text-foreground">Messages</h2>

          <Form {...messagesForm}>
            <form
              className="form"
              onSubmit={messagesForm.handleSubmit(saveMessagesHandler)}
            >
              <FormField
                name="greeting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Greeting message</FormLabel>
                    <Textarea
                      placeholder="This message is used when you haven't messaged an author before. Think of it as an initial greeting. Say hello, introduce yourself, go from there."
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <FormField
                name="recurring"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurring message</FormLabel>

                    <Textarea
                      placeholder="This is used when you've already messaged an author. It's useful so users don't feel like they're just getting copy and pasted messages."
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <Button className="mt-3" type="submit">
                Save messages
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </WrapperWithNav>
  );
};

export default Profile;
