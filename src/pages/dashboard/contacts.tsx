import { Modal, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import React, { FormEvent } from "react";
import ContactItem from "~/components/ContactItem";
import EmptyState from "~/components/EmptyState";
import { Button } from "~/components/ui/button";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { api } from "~/utils/api";

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

    saveContact.mutate(form.values);
  };

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 max-w-screen-2xl">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl text-foreground">Contacts</h1>

          <Button variant="secondary" onClick={open}>
            Add contact
          </Button>
        </header>

        {contactsQuery.data && contactsQuery.data.length > 0 ? (
          <section className="my-10 grid grid-cols-3 gap-6">
            {contactsQuery.data?.map((ct) => (
              <ContactItem key={ct.id} contact={ct} />
            ))}
          </section>
        ) : (
          <EmptyState label="contacts" />
        )}

        <Modal opened={opened} onClose={close} title="Add contact">
          <form onSubmit={submitHandler}>
            <TextInput
              variant="filled"
              label="Name"
              placeholder="Add your contact's name"
              {...form.getInputProps("name")}
            />
            <Textarea
              label="Notes"
              {...form.getInputProps("notes")}
              variant="filled"
            />
            <button type="submit" className="button main mt-4 w-full">
              Save
            </button>
          </form>
        </Modal>
      </main>
    </>
  );
};

export default Contacts;
