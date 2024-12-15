import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import NoSelectedPlan from "../NoSelectedPlan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

interface Props {
  disableSubmit: boolean;
  setSelectedPlan: (id: string) => void;
  currentPlan: string | null;
  loadingPaymentLink: boolean;
  createSubscriptionHandler: () => void;
}

const AccountPlanSelectModal = ({
  disableSubmit,
  setSelectedPlan,
  currentPlan,
  loadingPaymentLink,
  createSubscriptionHandler,
}: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">Choose a plan</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a plan</DialogTitle>
        </DialogHeader>

        <NoSelectedPlan
          setSelectedPlanHandler={setSelectedPlan}
          selectedPlan={currentPlan}
        />

        <Button
          disabled={disableSubmit}
          className="w-full"
          onClick={createSubscriptionHandler}
        >
          {loadingPaymentLink ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="mr-2" spin />{" "}
              Loading...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AccountPlanSelectModal;
