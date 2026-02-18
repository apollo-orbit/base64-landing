import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM || "Base64 API <noreply@base64api.com>",
      sendVerificationRequest: async ({ identifier: email, url }) => {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || "Base64 API <noreply@base64api.com>",
            to: email,
            subject: "Sign in to Base64 API",
            html: `
              <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                <h1 style="color: #1e3a5f; font-size: 24px;">Sign in to Base64 API</h1>
                <p style="color: #666; font-size: 16px; line-height: 1.5;">
                  Click the button below to sign in to your account. This link will expire in 24 hours.
                </p>
                <a href="${url}" style="display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 20px 0;">
                  Sign in
                </a>
                <p style="color: #999; font-size: 14px;">
                  If you didn't request this email, you can safely ignore it.
                </p>
              </div>
            `,
          });
        } catch (error) {
          console.error("Error sending email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
    // Add OAuth providers when ready
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
