import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ContactItem from "~/components/ContactItem";
import EmptyState from "~/components/EmptyState";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { contactSchema } from "~/server/schemas";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const formSchema = contactSchema;
const Contacts = () => {
  const apiContext = api.useUtils();
  const contactsQuery = api.contact.all.useQuery();
  const saveContact = api.contact.save.useMutation({
    onSuccess: () => {
      close();
      apiContext.contact.invalidate();
    },
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      notes: "",
    },
  });

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    trackUiEvent(MixpanelEvents.SAVE_CONTACT_FORM);
    saveContact.mutate(data);
  };

  return (
    <WrapperWithNav>
      <section className="mx-auto max-w-screen-2xl px-4 lg:px-0">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Contacts</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                onClick={() => {
                  trackUiEvent(MixpanelEvents.OPEN_ADD_CONTACT_MODAL);
                }}
              >
                Add contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add contact</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(submitHandler)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <Input
                          placeholder="Add your contact's name"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>

                        <Textarea
                          placeholder="Add notes about this contact"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-6 w-full">
                    Save
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
      </section>
    </WrapperWithNav>
  );
};

export default Contacts;
