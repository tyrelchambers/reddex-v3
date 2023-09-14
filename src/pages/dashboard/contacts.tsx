import { Modal, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import React, { FormEvent } from "react";
import ContactItem from "~/components/ContactItem";
import EmptyState from "~/components/EmptyState";
import { Button } from "~/components/ui/button";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineInputClasses, mantineModalClasses } from "~/lib/styles";
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
      <main className="mx-auto max-w-screen-2xl px-4 lg:px-0">
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

        <Modal
          opened={opened}
          onClose={close}
          title="Add contact"
          classNames={mantineModalClasses}
        >
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <TextInput
              variant="filled"
              label="Name"
              placeholder="Add your contact's name"
              classNames={mantineInputClasses}
              {...form.getInputProps("name")}
            />
            <Textarea
              label="Notes"
              {...form.getInputProps("notes")}
              variant="filled"
              classNames={mantineInputClasses}
            />
            <Button type="submit" className="mt-6 w-full">
              Save
            </Button>
          </form>
        </Modal>
      </main>
    </WrapperWithNav>
  );
};

export default Contacts;
