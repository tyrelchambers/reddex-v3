import { faUserCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDisclosure } from "@mantine/hooks";
import { Contact } from "@prisma/client";
import React, { FormEvent, useEffect } from "react";
import { Button } from "./ui/button";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { MixpanelEvents } from "~/types";
import { useForm } from "@mantine/form";
import { api } from "~/utils/api";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "react-toastify";

interface Props {
  contact: Contact;
}

const ContactItem = ({ contact }: Props) => {
  const apiContext = api.useUtils();

  const contactQuery = api.contact.getContactById.useQuery(contact.id, {
    enabled: !!contact.id,
  });
  const deleteContact = api.contact.deleteContact.useMutation({
    onSuccess: () => {
      apiContext.contact.invalidate();
    },
  });
  const updateContact = api.contact.updateContact.useMutation({
    onSuccess: () => {
      apiContext.contact.invalidate();
      toast.success("Contact updated!");
    },
  });
  const [opened, { open, close }] = useDisclosure(false);
  const forms = useForm({
    initialValues: {
      name: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (contactQuery.data) {
      forms.setValues({
        name: contactQuery.data.name,
        notes: contactQuery.data.notes ?? undefined,
      });
    }
  }, [contact]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    trackUiEvent(MixpanelEvents.SAVE_EDIT_CONTACT_FORM);
    updateContact.mutate({
      id: contact.id,
      name: forms.values.name,
      notes: forms.values.notes,
    });
  };

  const deleteHandler = () => {
    trackUiEvent(MixpanelEvents.DELETE_CONTACT);
    deleteContact.mutate(contact.id);
  };
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
        <p className="p-3 font-medium text-foreground/70">{contact.notes}</p>
      ) : (
        <p className="p-3 font-medium italic text-muted-foreground">No notes</p>
      )}

      <footer className="flex justify-end p-2 px-4">
        <Button
          variant="secondary"
          onClick={() => {
            trackUiEvent(MixpanelEvents.OPEN_EDIT_CONTACT_MODAL);
            open();
          }}
        >
          Edit
        </Button>
      </footer>

      <Dialog open={opened}>
        <DialogContent onClose={close}>
          <DialogHeader>Editing contact</DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={submitHandler}>
            <div className="flex flex-col">
              <Label>Name</Label>
              <Input {...forms.getInputProps("name")} />
            </div>

            <div className="flex flex-col">
              <Label>Notes</Label>
              <Textarea {...forms.getInputProps("notes")} />
            </div>
            <footer className="flex justify-between gap-3">
              <Button variant="link" onClick={deleteHandler}>
                Delete contact
              </Button>
              <Button>Save</Button>
            </footer>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactItem;
