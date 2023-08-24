import { db } from "@/server/db";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: {
      sub: string;
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    email: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials, _) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        if (!email || !password) {
          throw new Error("Missing email or password");
        }
        const user = await db.user.findFirst({
          where: {
            email: email,
          },
        });
        if (!user) {
          throw new Error("User not found!");
        }
        const matchPassword = bcrypt.compareSync(password, user?.password);
        if (!matchPassword) {
          throw new Error("email or password is not match.");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email as string;
      }
      return token;
    },
    session({ session, token }) {
      session.user.sub = token.sub;
      session.user.email = token.email;

      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
};

const authHandler = NextAuth(authOptions);

export default async function handler(...params: any[]) {
  await authHandler(...params);
}
