import React from "react";
import { Card, CardContent } from "~/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCheckToSlot,
  faInboxIn,
} from "@fortawesome/pro-solid-svg-icons";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";

interface Props {
  data: {
    submittedStoriesCount: number | undefined;
    approvedStoriesCount: number | undefined;
    completedStoriesCount: number | undefined;
  };
}
const OverviewStats = ({ data }: Props) => {
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
            <p className="text-3xl font-bold">{data?.submittedStoriesCount}</p>
            <Dialog>
              <DialogTrigger>
                <Button variant="secondary">Share</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share your stats</DialogTitle>
                </DialogHeader>

                <div>
                  <div className="relative">
                    <Image
                      src="/images/blob.jpg"
                      width={800}
                      height={418}
                      alt=""
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className=" bg-background p-6">
          <p className="mb-2 flex items-center justify-between text-sm text-foreground">
            Approved stories{" "}
            <FontAwesomeIcon
              icon={faCheckToSlot}
              className="text-muted-foreground"
            />
          </p>
          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row">
            <p className="text-3xl font-bold">{data?.approvedStoriesCount}</p>
            <Button variant="secondary">Share</Button>
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
            <p className="text-3xl font-bold">{data?.completedStoriesCount}</p>
            <Button variant="secondary">Share</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default OverviewStats;
