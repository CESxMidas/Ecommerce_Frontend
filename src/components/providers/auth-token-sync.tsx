"use client";

import { useSession } from "next-auth/react";

import { clearAccessToken, setAccessToken } from "@/lib/api/client";

/** Gán token ngay khi render — tránh race với useEffect của trang con sau F5 */
export function AuthTokenSync() {
  const { data: session, status } = useSession();

  if (status === "authenticated" && session?.accessToken) {
    setAccessToken(session.accessToken);
  } else if (status === "unauthenticated") {
    clearAccessToken();
  }

  return null;
}
