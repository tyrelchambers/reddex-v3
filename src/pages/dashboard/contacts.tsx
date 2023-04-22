import React from "react";
import ContactItem from "~/components/ContactItem";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { api } from "~/utils/api";

const contacts = () => {
  const contactsQuery = api.contact.all.useQuery();

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 max-w-screen-2xl">
        <h1 className="h1 text-3xl">Contacts</h1>

        <section className="my-10 grid grid-cols-3">
          {contactsQuery.data?.map((ct) => (
            <ContactItem key={ct.id} contact={ct} />
          )) || null}
        </section>
      </main>
    </>
  );
};

export default contacts;
