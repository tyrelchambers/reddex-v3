import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import React from "react";
import Header from "~/layouts/Header";
import { faReddit } from "@fortawesome/free-brands-svg-icons";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "~/server/auth";
import { routes } from "~/routes";
import { useRouter } from "next/router";
import { plans } from "~/constants";
import { Divider, List } from "@mantine/core";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import PricingChip from "~/components/PricingChip";
import PricingFrequencySelect from "~/components/PricingFrequencySelect";
import { useLocalStorage } from "@mantine/hooks";

interface Props {
  providers: ClientSafeProvider[];
}

interface NoSelectedPlanProps {
  setSelectedPlanHandler: (id: string) => void;
  frequency: "yearly" | "monthly";
  setFrequency: React.Dispatch<React.SetStateAction<"yearly" | "monthly">>;
}

const Login = ({ providers }: Props) => {
  const [selectedFrequency, setSelectedFrequency] = React.useState<
    "yearly" | "monthly"
  >("yearly");
  const [selectedPlan, setSelectedPlan] = useLocalStorage({
    key: "selected-plan",
  });

  const router = useRouter();
  const plan = (router.query.plan as string | undefined) || selectedPlan;

  const signInHandler = async (p: Pick<ClientSafeProvider, "id" | "name">) => {
    await signIn(p.id, {
      callbackUrl: routes.ACCOUNT_CHECK,
    });
  };

  const redditProvider = providers[0];

  const setSelectedPlanHandler = (plan: string) => {
    setSelectedPlan(plan);
  };

  return (
    <>
      <Head>
        <title>Reddex | Login</title>
      </Head>
      <main>
        <Header />

        <section className="mx-auto my-20 flex max-w-screen-lg gap-4">
          <div className="flex w-1/2 flex-col">
            <h1 className="text-2xl text-foreground">Login to Reddex</h1>
            <p className=" text-foreground/70">
              Login with Reddit to create an account if you don&apos;t have one,
              or login to an existing account.
            </p>

            {redditProvider && (
              <button
                type="button"
                onClick={() => signInHandler(redditProvider)}
                className="mt-6 flex items-center justify-center rounded-xl border-[1px] border-orange-400 p-2 font-bold text-orange-600 transition-all hover:bg-orange-600 hover:text-white"
              >
                <FontAwesomeIcon icon={faReddit} className="mr-4 text-3xl" />
                Login with {redditProvider.name}
              </button>
            )}
          </div>

          {plan ? (
            <SelectedPlan plan={plan} />
          ) : (
            <NoSelectedPlan
              setSelectedPlanHandler={setSelectedPlanHandler}
              frequency={selectedFrequency}
              setFrequency={setSelectedFrequency}
            />
          )}
        </section>
      </main>
    </>
  );
};

const SelectedPlan = ({ plan }: { plan: string }) => {
  const selectedPlan = plans.find(
    (p) => p.monthly.productId === plan || p.yearly.productId === plan
  );

  return (
    <div className="flex w-1/2 flex-col rounded-2xl bg-card p-8">
      <p className="text-2xl text-card-foreground">
        That&apos;s a nice looking plan!
      </p>
      <p className="text-card-foreground/70">
        Here&apos;s what you&apos;ve chosen.
      </p>
      <Divider className="my-8 border-border" />
      <div>
        <h2 className="text-3xl font-medium text-card-foreground">
          {selectedPlan?.name}
        </h2>
        <p className="text-card-foreground/70">{selectedPlan?.desc}</p>
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <FontAwesomeIcon className="text-rose-500" icon={faCheckCircle} />
          }
          className="mt-6"
        >
          {selectedPlan?.features.map((feature, idx) => (
            <List.Item key={idx} className="text-card-foreground/70">
              {feature}
            </List.Item>
          ))}
        </List>
      </div>
    </div>
  );
};

const NoSelectedPlan = ({
  setSelectedPlanHandler,
  frequency,
  setFrequency,
}: NoSelectedPlanProps) => {
  return (
    <div className="flex w-1/2 flex-col rounded-2xl bg-card p-8">
      <p className="mb-2 text-2xl text-card-foreground">
        Looks like we haven&apos;t chosen a plan yet!
      </p>
      <p className="text-card-foreground/70">
        That&apos;s okay, just select one below and we will get started.
      </p>
      <Divider className="my-8" />

      <div className="flex flex-col gap-6">
        <PricingFrequencySelect
          frequency={frequency}
          setFrequency={setFrequency}
        />

        {plans.map((item) => (
          <PricingChip
            plan={item}
            setSelectedPlanHandler={setSelectedPlanHandler}
            frequency={frequency}
            key={item.name}
          />
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = (await getProviders()) || {};

  return {
    props: { providers: Object.values(providers) ?? [] },
  };
}

export default Login;
