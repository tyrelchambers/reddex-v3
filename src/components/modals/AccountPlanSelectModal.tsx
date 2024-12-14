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
  form: any;
  hasEmail: boolean;
  setSelectedPlan: (id: string) => void;
  currentPlan: string | null;
  loadingPaymentLink: boolean;
  createSubscriptionHandler: () => void;
}

const AccountPlanSelectModal = ({
  form,
  hasEmail,
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
        {!hasEmail && (
          <>
            <p className="mb-4">
              Please add an email to your account before we proceed.
            </p>
            <Form {...form}>
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input
                      placeholder="Email"
                      required
                      type="email"
                      {...field}
                    />
                  </FormItem>
                )}
              />
            </Form>
          </>
        )}
        <NoSelectedPlan
          setSelectedPlanHandler={setSelectedPlan}
          selectedPlan={currentPlan}
        />

        <Button
          disabled={!currentPlan || loadingPaymentLink}
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
