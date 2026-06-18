import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { API_BASE_URL, API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { AuthUser } from "@/types/api";

function getServerApiUrl() {
  return (
    process.env.API_INTERNAL_URL
      ? `${process.env.API_INTERNAL_URL}/api`
      : API_BASE_URL.startsWith("http")
        ? API_BASE_URL
        : `http://localhost:888/api`
  );
}

async function loginWithCredentials(email: string, password: string) {
  const response = await fetch(
    `${getServerApiUrl()}${API_ENDPOINTS.auth.login}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Login failed");
  }

  return data as AuthUser;
}

async function loginWithGoogle(idToken: string, clientId: string) {
  const response = await fetch(
    `${getServerApiUrl()}${API_ENDPOINTS.auth.google}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: idToken, clientId }),
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Google login failed");
  }

  return data as AuthUser;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await loginWithCredentials(
          credentials.email,
          credentials.password,
        );

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.avatar || null,
          accessToken: user.token,
          role: user.role,
          verifyEmail: user.verify_email,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "google" && !account.id_token) {
        return false;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.role = (user as { role?: string }).role;
        token.userId = user.id;
      }

      if (account?.provider === "google" && account.id_token) {
        const clientId =
          process.env.GOOGLE_CLIENT_ID ||
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
          "";
        const beUser = await loginWithGoogle(account.id_token, clientId);

        token.accessToken = beUser.token;
        token.role = beUser.role;
        token.userId = beUser._id;
        token.name = beUser.name;
        token.email = beUser.email;
        token.picture = beUser.avatar;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
      }

      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
