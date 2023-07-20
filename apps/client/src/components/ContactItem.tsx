import { faUserCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, TextInput, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Contact } from "@prisma/client";
import React from "react";
import { Button } from "./ui/button";
import { mantineInputClasses, mantineModalClasses } from "~/lib/styles";

interface Props {
  contact: Contact;
}

const ContactItem = ({ contact }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div
      key={contact.id}
      className="overflow-hidden rounded-xl border shadow-md"
    >
      <header className="flex bg-card p-4">
        <p className="flex items-center gap-3 text-card-foreground">
          <FontAwesomeIcon icon={faUserCircle} />
          {contact.name}
        </p>
      </header>

      {contact.notes ? (
        <p className="p-3 font-medium text-card-foreground">{contact.notes}</p>
      ) : (
        <p className="p-3 font-medium italic text-muted-foreground">No notes</p>
      )}

      <footer className="flex justify-end p-2 px-4">
        <Button variant="secondary" onClick={open}>
          Edit
        </Button>
      </footer>

      <Modal
        opened={opened}
        onClose={close}
        title="Editing contact"
        classNames={mantineModalClasses}
      >
        <form className="flex flex-col gap-4">
          <TextInput
            value={contact.name}
            label="Name"
            variant="filled"
            classNames={mantineInputClasses}
          />
          <Textarea
            value={contact?.notes || undefined}
            label="Notes"
            variant="filled"
            classNames={mantineInputClasses}
          />
          <footer className="flex justify-between gap-3">
            <button className="button simple !text-red-500">
              Delete contact
            </button>
            <button className="button main">Save</button>
          </footer>
        </form>
      </Modal>
    </div>
  );
};

export default ContactItem;
