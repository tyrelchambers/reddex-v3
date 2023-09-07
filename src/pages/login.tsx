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
import Logo from "../../public/images/reddex-dark.svg";
import LogoLight from "../../public/images/reddex-light.svg";
import { useTheme } from "~/hooks/useTheme";
interface Props {
  providers: ClientSafeProvider[];
}

const Login = ({ providers }: Props) => {
  const { isDark } = useTheme();

  const signInHandler = async (p: Pick<ClientSafeProvider, "id" | "name">) => {
    await signIn(p.id, {
      callbackUrl: routes.ONBOARDING,
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

        <section className="mx-auto my-20 flex max-w-md flex-col-reverse gap-4 rounded-2xl border-[1px] border-border p-6 px-4  lg:flex-row">
          <div className="flex flex-col">
            {isDark ? (
              <LogoLight alt="" className="z-0 w-12" />
            ) : (
              <Logo alt="" className="z-0 w-12" />
            )}
            <h1 className="mb-2 mt-4 text-2xl text-foreground">
              Welcome back!
            </h1>
            <p className="text-sm font-light text-foreground/70">
              Get started with Reddex by signing in with your Reddit account. If
              you don&apos;t have an account, one will be made for you!
            </p>

            {redditProvider && (
              <button
                type="button"
                onClick={() => signInHandler(redditProvider)}
                className="mt-6 flex items-center justify-center rounded-xl bg-card p-2 font-bold text-orange-600 transition-all hover:bg-orange-600 hover:text-white"
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

  return {
    props: { providers: providers ? Object.values(providers) : [] },
  };
}

export default Login;
