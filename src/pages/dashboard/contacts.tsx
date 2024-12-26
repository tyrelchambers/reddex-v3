import React from "react";
import ContactItem from "~/components/ContactItem";
import EmptyState from "~/components/EmptyState";
import AddContactModal from "~/components/modals/AddContactModal";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { api } from "~/utils/api";

const Contacts = () => {
  const contactsQuery = api.contact.all.useQuery();

  return (
    <WrapperWithNav>
      <section className="px-4">
        <header className="flex items-center justify-between gap-8">
          <h1 className="text-2xl font-bold text-foreground">Contacts</h1>

          <AddContactModal />
        </header>

        {contactsQuery.data && contactsQuery.data.length > 0 ? (
          <section className="my-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
