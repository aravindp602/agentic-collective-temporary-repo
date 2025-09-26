// src/pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('No user found or account created with a provider.');
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password.');
        }

        return user;
      }
    })
  ],

  session: {
    strategy: "jwt",
  },

  // --- THIS IS THE KEY UPDATE ---
  callbacks: {
    // This callback now handles both initial sign-in and manual session updates
    async jwt({ token, user, trigger, session }) {
      // Handle the trigger for session updates (e.g., after profile picture change)
      if (trigger === "update" && session?.image) {
        token.picture = session.image;
      }

      // Handle the initial sign-in
      if (user) {
        token.id = user.id;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.image = token.picture; // This will now have the updated image
      }
      return session;
    },
  },
  // --- END OF UPDATE ---

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);