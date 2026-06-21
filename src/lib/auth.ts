import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { API_BASE_URL, API_ENDPOINTS } from "@/constants/apiEndpoints";
import {
  encodeEmailNotVerifiedError,
  EMAIL_NOT_VERIFIED_PREFIX,
  REMEMBER_ME_MAX_AGE_SECONDS,
} from "@/lib/auth/constants";
import { authCookies } from "@/lib/auth/cookies";
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

type LoginErrorBody = {
  message?: string;
  code?: string;
  email?: string;
  emailSent?: boolean;
};

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

  const data = (await response.json()) as AuthUser & LoginErrorBody;

  if (!response.ok) {
    if (data?.code === "EMAIL_NOT_VERIFIED") {
      throw new Error(
        encodeEmailNotVerifiedError({
          message: data.message || "Please verify your account",
          email: data.email,
          emailSent: data.emailSent,
        }),
      );
    }

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
    throw new Error(data?.message || "Đăng nhập Google thất bại");
  }

  return data as AuthUser;
}

const googleOAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" },
        googleCredential: { label: "Google Credential", type: "text" },
        googleClientId: { label: "Google Client ID", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.googleCredential?.trim()) {
          try {
            const clientId =
              credentials.googleClientId?.trim() ||
              process.env.GOOGLE_CLIENT_ID ||
              process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
              "";
            const user = await loginWithGoogle(
              credentials.googleCredential.trim(),
              clientId,
            );

            return {
              id: user._id,
              name: user.name,
              email: user.email,
              image: user.avatar || null,
              accessToken: user.token,
              role: user.role,
              verifyEmail: user.verify_email,
              rememberMe: true,
            };
          } catch (error) {
            throw new Error(
              error instanceof Error
                ? error.message
                : "Đăng nhập Google thất bại",
            );
          }
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
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
            rememberMe: credentials.rememberMe === "true",
          };
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.startsWith(EMAIL_NOT_VERIFIED_PREFIX)
          ) {
            throw error;
          }

          return null;
        }
      },
    }),
    ...(googleOAuthEnabled
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: REMEMBER_ME_MAX_AGE_SECONDS,
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

        const rememberMe = Boolean((user as { rememberMe?: boolean }).rememberMe);
        token.rememberMe = rememberMe;

        const sessionLength = rememberMe
          ? REMEMBER_ME_MAX_AGE_SECONDS
          : 60 * 60;

        token.exp = Math.floor(Date.now() / 1000) + sessionLength;
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
        token.rememberMe = true;
        token.exp =
          Math.floor(Date.now() / 1000) + REMEMBER_ME_MAX_AGE_SECONDS;
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
  cookies: authCookies,
  secret: process.env.NEXTAUTH_SECRET,
};
