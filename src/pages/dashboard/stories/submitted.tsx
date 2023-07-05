import { Badge, Table } from "@mantine/core";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineBadgeClasses } from "~/lib/styles";
import { storiesTabs } from "~/routes";
import { api } from "~/utils/api";

const Submitted = () => {
  const submittedStories = api.story.submittedList.useQuery();

  const stories = submittedStories.data;

  const rows = stories?.map((story) => (
    <tr key={story.id} className=" !bg-card">
      <td className="flex-1 font-light !text-foreground">{story.title}</td>
      <td className=" font-light !text-foreground">{story.author}</td>
      <td className=" font-light !text-foreground">{story.email}</td>

      <td className=" font-light !text-foreground">
        {format(new Date(story.date), "MMMM do, yyyy")}
      </td>

      <td className=" font-light !text-foreground">
        {story.completed ? (
          <Badge classNames={mantineBadgeClasses}>Read</Badge>
        ) : null}
      </td>

      <td className="flex justify-end">
        <Link
          href={"/story/" + story.id}
          className="rounded-full border-[1px] border-border px-5 py-1 text-muted-foreground  hover:bg-gray-200 hover:text-background"
        >
          View
        </Link>
      </td>
    </tr>
  ));

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <section className="flex flex-col">
        <header className="flex flex-col px-4 lg:px-0">
          <h1 className="text-2xl text-foreground">Submitted</h1>
          <p className="font-light text-muted-foreground">
            These are your stories submitted via your website.
          </p>
        </header>
        <div className="flex-1">
          {stories && (
            <Table
              verticalSpacing="md"
              highlightOnHover
              striped
              className="mt-4"
            >
              <thead>
                <tr>
                  <th className="!flex-1 !border-border !text-muted-foreground">
                    Title
                  </th>
                  <th className="!border-border !text-muted-foreground">
                    Author
                  </th>
                  <th className="!border-border !text-muted-foreground">
                    Email
                  </th>

                  <th className="!border-border !text-muted-foreground">
                    Date
                  </th>

                  <th className="!border-border !text-muted-foreground">
                    Read
                  </th>
                  <th className="!border-border !text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          )}
        </div>
      </section>
    </WrapperWithNav>
  );
};

export default Submitted;
