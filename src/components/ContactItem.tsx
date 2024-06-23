import { faUserCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Contact } from "@prisma/client";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "./ui/form";

interface Props {
  contact: Contact;
}

const formSchema = z.object({
  name: z.string(),
  notes: z.string().optional(),
});

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
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (contactQuery.data) {
      form.reset({
        ...contactQuery.data,
        notes: contactQuery.data.notes || "",
      });
    }
  }, [contactQuery.data]);

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    trackUiEvent(MixpanelEvents.SAVE_EDIT_CONTACT_FORM);
    updateContact.mutate({
      id: contact.id,
      ...data,
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              onClick={() => {
                trackUiEvent(MixpanelEvents.OPEN_EDIT_CONTACT_MODAL);
              }}
            >
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Editing contact</DialogHeader>
            <Form {...form}>
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(submitHandler)}
              >
                <FormField
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <Input placeholder="Contact name" {...field} />
                    </FormItem>
                  )}
                />

                <FormField
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <Textarea {...field} />
                    </FormItem>
                  )}
                />
                <footer className="flex justify-between gap-3">
                  <Button variant="link" onClick={deleteHandler}>
                    Delete contact
                  </Button>
                  <Button>Save</Button>
                </footer>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </footer>
    </div>
  );
};

export default ContactItem;
