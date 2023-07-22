import {
  faSquareArrowUpRight,
  faWarning,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { api } from "~/utils/api";

const WrongPlanBanner = () => {
  const updateLink = api.billing.updateLink.useQuery();

  if (updateLink.isLoading) {
    return null;
  }

  return (
    <div className="mb-4 rounded-2xl bg-warning p-4">
      <p className="mb-2 text-warning-foreground">
        <FontAwesomeIcon icon={faWarning} className="mr-3" />
        Insufficient plan
      </p>
      <p className="text-sm font-thin text-warning-foreground">
        You&apos;ll need to{" "}
        <a
          href={updateLink.data}
          className="text-accent underline"
          target="_blank"
        >
          upgrade your plan{" "}
          <FontAwesomeIcon
            icon={faSquareArrowUpRight}
            className="text-accent"
          />
        </a>{" "}
        to the Pro plan in order to use this feature. In the meantime, if you
        had a website created, it will be hidden until your plan is upgraded.
      </p>
    </div>
  );
};

export default WrongPlanBanner;
