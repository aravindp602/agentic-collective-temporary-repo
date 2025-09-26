// src/pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Resend } from 'resend';

// This imports the stable, shared Prisma Client instance.
// It is the key to fixing the database connection issue.
import prisma from "../../../../lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions = {
  // Use the Prisma Adapter to connect NextAuth to your database.
  adapter: PrismaAdapter(prisma),

  // Configure one or more authentication providers.
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 465,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: "onboarding@yourverifieddomain.com", // Replace with your verified Resend domain
      async sendVerificationRequest({ identifier: email, url, provider: { from } }) {
        await resend.emails.send({
          from: from,
          to: email,
          subject: "Sign in to Agentic Collective",
          html: `<div style="font-family: sans-serif;">Click the link to sign in: <a href="${url}">Sign In</a></div>`,
        });
      },
    }),
    // The credentials provider is for demo purposes.
    // In a real app, you would hash and compare passwords.
    CredentialsProvider({
      async authorize(credentials, req) {
        const user = { email: 'test@example.com', password: 'password' }; // Dummy check
        if (user && credentials.password === user.password) {
          return { id: "1", name: "Test User", email: "test@example.com" };
        } else {
          throw new Error("Invalid credentials");
        }
      }
    })
  ],

  // Use JSON Web Tokens for session management.
  session: {
    strategy: "jwt",
  },

  // Callbacks are used to control what happens when an action is performed.
  callbacks: {
    // This callback runs when a JWT is created (i.e., on sign-in).
    async jwt({ token, user }) {
      // The `user` object is only available on the initial sign-in.
      // We persist the user's ID and image from the database to the token.
      if (user) {
        token.id = user.id;
        token.picture = user.image;
      }
      return token;
    },
    
    // This callback runs whenever a session is checked.
    async session({ session, token }) {
      // We take the user ID and image from the token and add them to the `session.user` object.
      // This makes them available to the client-side components like the Header.
      if (token && session.user) {
        session.user.id = token.id;
        session.user.image = token.picture;
      }
      return session;
    },
  },

  // Custom pages for sign-in and email verification.
  pages: {
    signIn: '/login',
    verifyRequest: '/auth/check-email',
  },

  // A secret is required to sign the JWT.
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);