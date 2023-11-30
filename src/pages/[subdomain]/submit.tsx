import { Divider, Text, TextInput, Title } from "@mantine/core";
import { SubmissionFormModule, SubmissionPage, Website } from "@prisma/client";
import { GetServerSideProps } from "next";
import React, { FormEvent } from "react";
import { prisma } from "~/server/db";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk } from "@fortawesome/pro-solid-svg-icons";
import { mantineInputClasses } from "~/lib/styles";
import CustomerSiteHeader from "~/layouts/CustomSite/CustomerSiteHeader";
import CustomTextEditor from "~/layouts/CustomSite/CustomTextEditor";

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
  const submitStory = api.website.submit.useMutation();
  const modules = website?.submissionPage.submissionFormModules || [];
  const titleModule = modules.find((module) => module.name === "title");
  const authorModule = modules.find((module) => module.name === "author");
  const emailModule = modules.find((module) => module.name === "email");

  const form = useForm({
    initialValues: {
      title: "",
      author: "",
      email: "",
    },
    validate: {
      author: (value) => {
        if (!authorModule?.enabled) return null;
        if (authorModule.required && !isNotEmpty(value))
          return "Author is required";
      },
      title: (value) => {
        if (!titleModule?.enabled) return null;
        if (titleModule.required && !isNotEmpty(value))
          return "Title is required";
      },
      email: (value) => {
        if (!emailModule?.enabled) return null;
        if (emailModule.required && !isNotEmpty(value))
          return "Email is required";
      },
    },
  });
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  if (!website) return null;

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    const { hasErrors } = form.validate();

    if (hasErrors || !website || !editor) return;

    submitStory.mutate({
      ...form.values,
      story: editor.getText(),
      siteId: website.id,
    });
  };

  return (
    <section className="min-h-screen bg-background">
      <CustomerSiteHeader website={website} />
      <main className="mx-auto mt-10 w-full max-w-screen-md p-4">
        <header className="flex flex-col gap-3 text-foreground">
          <Title>{website?.submissionPage.name}</Title>
          <Text color="gray" size="lg">
            {website?.submissionPage.subtitle}
          </Text>
          <Text color="dimmed" fw="lighter" className="whitespace-pre-wrap">
            {website?.submissionPage.description}
          </Text>
        </header>

        <Divider className="my-6 border-border" />

        <form
          className="flex flex-col gap-4 text-foreground"
          onSubmit={submitHandler}
        >
          <Title order={2} size="h3">
            Paste your story
          </Title>
          {titleModule?.enabled && (
            <TextInput
              label="Title"
              variant="filled"
              classNames={mantineInputClasses}
              {...form.getInputProps("title")}
              required={titleModule.required}
            />
          )}

          {authorModule?.enabled && (
            <TextInput
              variant="filled"
              label="Author"
              classNames={mantineInputClasses}
              {...form.getInputProps("author")}
              required={authorModule.required}
            />
          )}

          {emailModule?.enabled && (
            <TextInput
              label="Email"
              variant="filled"
              classNames={mantineInputClasses}
              {...form.getInputProps("email")}
              required={emailModule.required}
            />
          )}

          <div className="flex w-full flex-col">
            <p className="text-sm">
              Story{" "}
              <FontAwesomeIcon
                icon={faAsterisk}
                className="mb-[5px] text-[7px] text-red-500"
              />
            </p>
            <CustomTextEditor editor={editor} />
          </div>
          <Button type="submit" style={{ backgroundColor: website?.colour }}>
            Submit story
          </Button>
        </form>
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
