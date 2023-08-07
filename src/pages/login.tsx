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
import { captureException } from "@sentry/nextjs";

interface Props {
  providers: ClientSafeProvider[];
}

const Login = ({ providers }: Props) => {
  const signInHandler = async (p: Pick<ClientSafeProvider, "id" | "name">) => {
    await signIn(p.id, {
      callbackUrl: routes.ACCOUNT_CHECK,
    });
  };

  const redditProvider = providers[0];

  return (
    <>
      <Head>
        <title>Reddex | Login</title>
      </Head>
      <main>
        <Header />

        <section className="mx-auto my-20 flex max-w-screen-sm flex-col-reverse gap-4 rounded-2xl bg-card p-6 px-4 lg:flex-row">
          <div className="flex flex-col">
            <h1 className="text-2xl text-foreground">Login to Reddex</h1>
            <p className=" text-foreground/50">
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
        </section>
      </main>
    </>
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

  const providers = (await getProviders()) || null;

  if (!providers) {
    captureException(new Error("No providers"), {
      extra: {
        providers,
      },
    });
  }

  return {
    props: { providers: providers ? Object.values(providers) : [] },
  };
}

export default Login;
