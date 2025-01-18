import React from "react";
import { Button } from "./ui/button";

const CancelAccountDeletionBanner = ({
  cancelHandler,
}: {
  cancelHandler: () => void;
}) => {
  return (
    <div className="flex flex-col rounded-xl bg-card p-4">
      <h2 className="text-xl text-foreground">
        Your account is scheduled for deletion
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        If you&apos;d like to cancel your account deletion, please click the
        button below.
      </p>

      <Button variant="secondary" onClick={cancelHandler} type="button">
        Cancel deletion
      </Button>
    </div>
  );
};

export default CancelAccountDeletionBanner;
