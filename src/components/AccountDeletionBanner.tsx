import React from "react";
import { Button } from "./ui/button";

const AccountDeletionBanner = ({
  deleteHandler,
}: {
  deleteHandler: () => void;
}) => {
  return (
    <div className="flex flex-col rounded-xl bg-card p-4">
      <h2 className="text-xl text-foreground">Delete account</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        If you delete your account, your subscription will be canceled at the
        end of your current period. Your account will be scheduled for deletion
        at that time as well.
      </p>

      <Button variant="secondary" onClick={deleteHandler} type="button">
        Delete account
      </Button>
    </div>
  );
};

export default AccountDeletionBanner;
