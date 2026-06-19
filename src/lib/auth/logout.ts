"use client";

import { signOut } from "next-auth/react";

import { logout as logoutRequest } from "@/lib/services/auth-service";
import { clearAccessToken } from "@/lib/api/client";

export async function performLogout(callbackUrl = "/") {
  try {
    await logoutRequest();
  } catch {
    // Still clear local session if backend logout fails.
  }

  clearAccessToken();
  await signOut({ callbackUrl });
}
