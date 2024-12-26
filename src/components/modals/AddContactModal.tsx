import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CreateContactForm from "../forms/CreateContactForm";

const AddContactModal = ({
  name,
  children,
}: {
  name?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add contact</DialogTitle>
        </DialogHeader>

        <CreateContactForm name={name} />
      </DialogContent>
    </Dialog>
  );
};

export default AddContactModal;
