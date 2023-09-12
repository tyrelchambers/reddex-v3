import {
  faSquareArrowUpRight,
  faWarning,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { api } from "~/utils/api";

interface Props {
  title: string;
  text: string;
  actions?: React.ReactNode | React.ReactNode[];
  type?: "upgrade_plan";
}

const WrongPlanBanner = ({ title, text, actions, type }: Props) => {
  const updateLink = api.billing.updateLink.useMutation({
    onSuccess: (res) => {
      if (res) {
        window.open(res, "_blank");
      }
    },
  });

  return (
    <div className="mx-auto my-10 mb-4 w-full max-w-screen-2xl rounded-2xl bg-warning p-4">
      <p className="mb-2 text-warning-foreground">
        <FontAwesomeIcon icon={faWarning} className="mr-3" />
        {title}
      </p>
      <p className="text-sm font-thin text-warning-foreground">{text}</p>

      {actions}

      {type === "upgrade_plan" && (
        <button
          onClick={() => updateLink.mutate()}
          className="text-accent underline"
          type="button"
        >
          Upgrade your plan{" "}
          <FontAwesomeIcon
            icon={faSquareArrowUpRight}
            className="ml-2 text-accent"
          />
        </button>
      )}
    </div>
  );
};

export default WrongPlanBanner;
