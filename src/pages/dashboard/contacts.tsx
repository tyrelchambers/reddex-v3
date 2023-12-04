import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import React, { FormEvent } from "react";
import ContactItem from "~/components/ContactItem";
import EmptyState from "~/components/EmptyState";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const Contacts = () => {
  const apiContext = api.useContext();
  const [opened, { open, close }] = useDisclosure(false);
  const contactsQuery = api.contact.all.useQuery();
  const saveContact = api.contact.save.useMutation({
    onSuccess: () => {
      close();
      apiContext.contact.invalidate();
    },
  });
  const form = useForm({
    initialValues: {
      name: "",
      notes: "",
    },
  });

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    trackUiEvent(MixpanelEvents.SAVE_CONTACT_FORM);
    saveContact.mutate(form.values);
  };

  return (
    <WrapperWithNav>
      <section className="mx-auto max-w-screen-2xl px-4 lg:px-0">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl text-foreground">Contacts</h1>

          <Button
            variant="secondary"
            onClick={() => {
              trackUiEvent(MixpanelEvents.OPEN_ADD_CONTACT_MODAL);
              open();
            }}
          >
            Add contact
          </Button>
        </header>

        {contactsQuery.data && contactsQuery.data.length > 0 ? (
          <section className="my-10 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {contactsQuery.data?.map((ct) => (
              <ContactItem key={ct.id} contact={ct} />
            ))}
          </section>
        ) : (
          <EmptyState label="contacts" />
        )}

        <Dialog open={opened} onOpenChange={close}>
          <DialogContent>
            <DialogHeader>Add contact</DialogHeader>
            <form onSubmit={submitHandler} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <Label>Name</Label>
                <Input
                  placeholder="Add your contact's name"
                  {...form.getInputProps("name")}
                />
              </div>
              <div className="flex flex-col">
                <Label>Notes</Label>

                <Textarea
                  placeholder="Add notes about this contact"
                  {...form.getInputProps("notes")}
                />
              </div>
              <Button type="submit" className="mt-6 w-full">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>
    </WrapperWithNav>
  );
};

export default Contacts;
