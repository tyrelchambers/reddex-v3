import { Table } from "@mantine/core";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { storiesTabs } from "~/routes";
import { api } from "~/utils/api";

const Submitted = () => {
  const submittedStories = api.post.submittedList.useQuery();

  const stories = submittedStories.data;

  const rows = stories?.map((story) => (
    <tr key={story.id}>
      <td className="w-[200px] font-light text-gray-700">{story.title}</td>
      <td className="w-[200px] font-light text-gray-700">{story.author}</td>
      <td className="w-[200px] font-light text-gray-700">{story.email}</td>
      <td className="flex-1">
        <p className="line-clamp-1  font-light text-gray-700">{story.body}</p>
      </td>
      <td className="w-[200px] font-light text-gray-700">
        {format(new Date(story.date), "MMMM do, yyyy")}
      </td>
      <td>
        <Link
          href="#"
          className="rounded-full border-[1px] border-gray-200 px-5 py-1 text-indigo-500 hover:bg-gray-200"
        >
          View
        </Link>
      </td>
    </tr>
  ));

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <section className="flex flex-col">
        <h1 className="h1 text-2xl">Submitted</h1>
        <p className="font-light text-gray-700">
          These are your stories submitted via your website.
        </p>
        {stories && (
          <Table verticalSpacing="md" highlightOnHover striped className="mt-4">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Email</th>
                <th>Story</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        )}
      </section>
    </WrapperWithNav>
  );
};

export default Submitted;
