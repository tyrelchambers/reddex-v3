import { faEnvelope, faUser } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React from "react";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { storiesTabs } from "~/routes";
import { api } from "~/utils/api";

const Story = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const submittedStory = api.story.storyById.useQuery(id, {
    enabled: !!id,
  });

  const story = submittedStory.data;

  const title = story?.title || `A story by: ${story?.author ?? "unknown"}`;

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <section className="flex flex-col">
        {" "}
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <header className="mt-3 flex flex-col items-center gap-6 rounded-md bg-card p-4 md:flex-row">
          <p className="flex items-center gap-2 text-card-foreground">
            <FontAwesomeIcon
              icon={faUser}
              className="text-muted-foreground/60"
            />
            {story?.author}
          </p>
          <p className="flex items-center gap-2 text-card-foreground">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-muted-foreground/60"
            />{" "}
            {story?.email}
          </p>
        </header>
        <article
          dangerouslySetInnerHTML={{ __html: story?.body || "" }}
          className="mt-10 w-full max-w-xl whitespace-pre-wrap leading-relaxed text-foreground/80"
        ></article>
      </section>
    </WrapperWithNav>
  );
};

export default Story;
