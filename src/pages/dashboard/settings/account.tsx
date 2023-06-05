import {
  faReceipt,
  faSquareArrowUpRight,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Divider, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import React from "react";
import InvoicesList from "~/components/InvoicesList";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { settingsTabs } from "~/routes";
import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/formatCurrency";

const Settings = () => {
  const subscriptionQuery = api.billing.info.useQuery();
  const updateLink = api.billing.updateLink.useQuery();

  const subscription = subscriptionQuery.data?.subscription;
  const invoices = subscriptionQuery.data?.invoices;
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <WrapperWithNav tabs={settingsTabs}>
      <section className="flex max-w-screen-sm flex-col gap-8">
        <h1 className="h1 text-3xl">Account</h1>

        <div className="flex flex-col">
          <h2 className=" text-xl font-semibold text-gray-800">Billing</h2>
          <p className="mt-2 text-sm text-gray-700">
            Your plan is managed with Stripe.
          </p>

          <p className="mt-2 text-sm font-thin text-gray-700">
            You can manage your subscription through Stripe. There you can
            update your billing information, cancel or update your plan.
          </p>

          <div className="mt-4 flex flex-col gap-2 rounded-xl border-[1px] border-gray-300 bg-gray-50 p-4">
            <header className="flex justify-between">
              <p className="text-sm">
                <span className="font-thin text-gray-500">Your plan:</span>{" "}
                <span className="font-semibold">
                  {subscription?.plan.product.name}
                </span>
              </p>
              <p className="font-semibold text-gray-800">
                {formatCurrency(
                  subscription?.plan.amount,
                  subscription?.plan.currency
                )}
                <span className="text-sm font-thin text-gray-700">
                  /{subscription?.plan.interval}
                </span>
              </p>
            </header>
            <Badge variant="dot" className="w-fit" color="green">
              {subscription?.status === "active" ? "active" : "inactive"}
            </Badge>

            <footer className="mt-2 flex justify-end gap-4 border-t-[1px] border-t-gray-200 pt-3">
              {invoices && (
                <button
                  type="button"
                  className="rounded-lg border-[1px] border-gray-300 px-6  py-2 text-sm  text-gray-700 hover:bg-gray-50"
                  onClick={open}
                >
                  View invoices{" "}
                  <FontAwesomeIcon icon={faReceipt} className="ml-2" />
                </button>
              )}
              {updateLink.data && (
                <Link
                  href={updateLink.data}
                  className="flex-1 rounded-lg border-[1px] border-gray-300 bg-white px-6 py-2 text-center text-sm  text-gray-700 hover:bg-gray-50"
                  target="_blank"
                >
                  Manage subscription{" "}
                  <FontAwesomeIcon
                    icon={faSquareArrowUpRight}
                    className="ml-2"
                  />
                </Link>
              )}
            </footer>
          </div>
        </div>

        <Divider />
        <div className="flex flex-col">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Delete account
          </h2>
          <p className="text-sm text-gray-700">
            To delete your account, manage your subscription and cancel your
            membership. Your account will be deleted once your membership is
            cancelled and the billing cycle ends.
          </p>
        </div>
      </section>

      <Modal opened={opened} onClose={close} title="Invoices" size="xl">
        {invoices && <InvoicesList invoices={invoices.data} />}
      </Modal>
    </WrapperWithNav>
  );
};

export default Settings;
