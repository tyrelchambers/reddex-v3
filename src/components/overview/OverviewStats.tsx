import React from "react";
import { Card, CardContent } from "~/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCheckToSlot,
  faInboxIn,
} from "@fortawesome/pro-solid-svg-icons";
import { Button } from "../ui/button";
import { api } from "~/utils/api";
import StatShareDialog from "./StatShareDialog";

interface Props {
  data: {
    submittedStoriesCount: number;
    approvedStoriesCount: number;
    completedStoriesCount: number;
  };
}

const OverviewStats = ({ data }: Props) => {
  const { data: user } = api.user.me.useQuery();
  const username = user?.name;

  return (
    <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="overflow-hidden">
        <CardContent className=" bg-background  p-6">
          <p className="mb-2 flex items-center justify-between text-sm text-foreground">
            Submitted stories{" "}
            <FontAwesomeIcon
              icon={faInboxIn}
              className="text-muted-foreground"
            />
          </p>
          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row">
            <p className="text-3xl font-bold">{data.submittedStoriesCount}</p>
            <StatShareDialog
              count={data.submittedStoriesCount}
              description={`Thank you to all our amazing viewers for sending us ${data.submittedStoriesCount} stories on https://reddex.app! We appreciate your support and engagement. Keep them coming! 🙌📚`}
              username={username}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className=" h-full bg-background  p-6">
          <p className="mb-2 flex items-center justify-between text-sm text-foreground">
            Approved stories{" "}
            <FontAwesomeIcon
              icon={faCheckToSlot}
              className="text-muted-foreground"
            />
          </p>
          <div className="mt-4 flex  flex-col justify-between gap-4 md:flex-row">
            <p className="text-3xl font-bold">{data.approvedStoriesCount}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className=" bg-background p-6">
          <p className="mb-2 flex items-center justify-between text-sm text-foreground">
            Completed stories{" "}
            <FontAwesomeIcon icon={faBolt} className="text-muted-foreground" />
          </p>
          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row">
            <p className="text-3xl font-bold">{data.completedStoriesCount}</p>
            <StatShareDialog
              count={data.submittedStoriesCount}
              description={`So far, I've read ⭐️${data.completedStoriesCount} stories⭐️ on https://reddex.app!`}
              username={username}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default OverviewStats;
