import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import RedditProvider from "next-auth/providers/reddit";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(prisma),
  events: {
    async createUser(message) {
      const { user } = message;

      await prisma.profile.create({
        data: {
          userId: user.id,
        },
      });
      await prisma.website.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          submissionPage: {
            create: {
              submissionFormModules: {
                createMany: {
                  data: [
                    {
                      name: "email",
                    },
                    {
                      name: "title",
                    },
                    {
                      name: "author",
                    },
                  ],
                },
              },
            },
          },
        },
      });
    },
    async signIn(message) {
      const { user, account, isNewUser } = message;

      if (account && !isNewUser) {
        await prisma.account.updateMany({
          where: {
            providerAccountId: account.providerAccountId,
            userId: user.id,
            provider: "reddit",
          },
          data: {
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
          },
        });
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          lastLogin: new Date(Date.now()),
        },
      });
    },
  },
  providers: [
    RedditProvider({
      clientId: env.REDDIT_CLIENT_ID,
      clientSecret: env.REDDIT_CLIENT_SECRET,
      authorization: {
        params: {
          duration: "permanent",
          scope: "privatemessages identity",
          redirect_uri: `${env.NEXTAUTH_URL}/api/auth/callback/reddit`,
        },
      },
      profile(profile: {
        id: string;
        name: string;
        email: string | null;
        snoovatar_img: string;
      }) {
        return {
          id: profile.id,
          name: profile.name,
          email: null,
          image: profile.snoovatar_img,
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],

  pages: {
    signIn: "/login",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
