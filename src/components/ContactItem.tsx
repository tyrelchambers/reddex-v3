import { faUserCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, TextInput, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Contact } from "@prisma/client";
import React from "react";

interface Props {
  contact: Contact;
}

const ContactItem = ({ contact }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div key={contact.id} className="overflow-hidden rounded-xl shadow-md">
      <header className="flex bg-indigo-700 p-4">
        <p className="flex items-center gap-3 text-white">
          <FontAwesomeIcon icon={faUserCircle} />
          {contact.name}
        </p>
      </header>

      <p className="p-3 font-medium text-gray-700">{contact.notes}</p>

      <footer className="flex justify-end bg-gray-100 p-2 px-4">
        <button className="button secondary" onClick={open}>
          Edit
        </button>
      </footer>

      <Modal opened={opened} onClose={close} title="Editing contact">
        <form className="flex flex-col gap-4">
          <TextInput value={contact.name} label="Name" variant="filled" />
          <Textarea
            value={contact?.notes || undefined}
            label="Notes"
            variant="filled"
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
