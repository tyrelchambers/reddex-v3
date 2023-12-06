import { SubmissionFormModule, SubmissionPage, Website } from "@prisma/client";
import { GetServerSideProps } from "next";
import React from "react";
import { prisma } from "~/server/db";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk } from "@fortawesome/pro-solid-svg-icons";
import CustomerSiteHeader from "~/layouts/CustomSite/CustomerSiteHeader";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "react-toastify";
import { Separator } from "~/components/ui/separator";

interface Props {
  website:
    | (Website & {
        submissionPage: SubmissionPage & {
          submissionFormModules: SubmissionFormModule[];
        };
      })
    | null;
}

const Submit = ({ website }: Props) => {
  const submitStory = api.website.submit.useMutation({
    onSuccess: () => {
      toast.success("Your story has been submitted");
      form.reset();
      editor?.commands.clearContent();
    },
  });
  const modules = website?.submissionPage.submissionFormModules || [];
  const titleModule = modules.find(
    (module) => module.name.toLowerCase() === "title"
  );
  const authorModule = modules.find(
    (module) => module.name.toLowerCase() === "author"
  );
  const emailModule = modules.find(
    (module) => module.name.toLowerCase() === "email"
  );

  const formSchema = z
    .object({
      title: z.string(),
      author: z.string(),
      email: z.string().email(),
      story: z.string(),
    })
    .superRefine((data, ctx) => {
      if (authorModule?.required && !data.author) {
        ctx.addIssue({
          code: "custom",
          message: "Author is required",
        });
      }
      if (titleModule?.required && !data.title) {
        ctx.addIssue({
          code: "custom",
          message: "Title is required",
        });
      }
      if (emailModule?.required && !data.email) {
        ctx.addIssue({
          code: "custom",
          message: "Email is required",
        });
      }
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      email: "",
      story: "",
    },
  });
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  if (!website) return null;

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    if (!editor) return null;

    submitStory.mutate({
      ...data,
      siteId: website.id,
    });
  };

  return (
    <section className="min-h-screen bg-background">
      <CustomerSiteHeader website={website} />
      <main className="mx-auto mt-10 w-full max-w-screen-md p-4">
        <header className="flex flex-col gap-3 text-foreground">
          <h1 className="text-3xl font-semibold">
            {website?.submissionPage.name}
          </h1>
          <p className="whitespace-pre-wrap text-foreground">
            {website?.submissionPage.subtitle}
          </p>
          <p className="whitespace-pre-wrap text-sm leading-loose text-foreground/70">
            {website?.submissionPage.description}
          </p>
        </header>

        <Separator className="my-6 border-border" />

        <Form {...form}>
          <form
            className="flex flex-col gap-4 text-foreground"
            onSubmit={form.handleSubmit(submitHandler)}
          >
            <h2 className="text-3xl font-semibold">What&apos;s your story?</h2>
            {titleModule?.enabled && (
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Input
                      placeholder="Story title"
                      required={titleModule.required}
                      {...field}
                    />
                  </FormItem>
                )}
              />
            )}

            {authorModule?.enabled && (
              <FormField
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <Input
                      placeholder="Your name"
                      required={authorModule.required}
                      {...field}
                    />
                  </FormItem>
                )}
              />
            )}

            {emailModule?.enabled && (
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input
                      placeholder="Your email"
                      {...field}
                      required={emailModule.required}
                    />
                  </FormItem>
                )}
              />
            )}

            <FormField
              name="story"
              render={({ field }) => (
                <FormItem>
                  <div className="flex w-full flex-col">
                    <FormLabel>
                      Story{" "}
                      <FontAwesomeIcon
                        icon={faAsterisk}
                        className="mb-[5px] text-[7px] text-red-500"
                      />
                    </FormLabel>
                    <Textarea placeholder="Write your story" {...field} />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" style={{ backgroundColor: website?.colour }}>
              Submit story
            </Button>
          </form>
        </Form>
      </main>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const subdomain = ctx.query.subdomain as string;

  if (!subdomain) return { props: {} };

  const website = await prisma.website.findUnique({
    where: {
      subdomain,
    },
    include: {
      submissionPage: {
        include: {
          submissionFormModules: true,
        },
      },
    },
  });

  if (!website || website?.submissionPage.hidden || website.hidden)
    return {
      notFound: true,
    };

  return {
    props: {
      website,
    },
  };
};

export default Submit;
