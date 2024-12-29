import React, { useEffect } from "react";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "~/server/schemas";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { MixpanelEvents } from "~/types";
import { z } from "zod";
import { toast } from "sonner";

const CreateContactForm = ({ name }: { name?: string }) => {
  const apiContext = api.useUtils();
  const saveContact = api.contact.save.useMutation({
    onSuccess: () => {
      close();
      toast.success("Contact saved");
      apiContext.contact.invalidate();
    },
  });
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (name) {
      form.reset({
        name,
      });
    }
  }, [name]);

  const submitHandler = (data: z.infer<typeof contactSchema>) => {
    trackUiEvent(MixpanelEvents.SAVE_CONTACT_FORM);
    saveContact.mutate(data);
  };

  return (
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
              <Input placeholder="Add your contact's name" {...field} />
            </FormItem>
          )}
        />

        <FormField
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>

              <Textarea
                autoFocus={!!name}
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
  );
};

export default CreateContactForm;
