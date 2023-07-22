import {
  faSquareArrowUpRight,
  faWarning,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { api } from "~/utils/api";

const WrongPlanBanner = () => {
  const updateLink = api.billing.updateLink.useMutation({
    onSuccess: (res) => {
      if (res) {
        window.open(res, "_blank");
      }
    },
  });

  return (
    <div className="mb-4 rounded-2xl bg-warning p-4">
      <p className="mb-2 text-warning-foreground">
        <FontAwesomeIcon icon={faWarning} className="mr-3" />
        Insufficient plan
      </p>
      <p className="text-sm font-thin text-warning-foreground">
        You&apos;ll need to{" "}
        <button
          onClick={() => updateLink.mutate()}
          className="text-accent underline"
          type="button"
        >
          upgrade your plan{" "}
          <FontAwesomeIcon
            icon={faSquareArrowUpRight}
            className="text-accent"
          />
        </button>{" "}
        to the Pro plan in order to use this feature. In the meantime, if you
        had a website created, it will be hidden until your plan is upgraded.
      </p>
    </div>
  );
};

export default WrongPlanBanner;
