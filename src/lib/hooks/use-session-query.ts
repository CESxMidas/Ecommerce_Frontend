"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

/** Fetch API sau khi NextAuth + access token sẵn sàng (F5-safe) */
export function useSessionQuery<T>(fetchFn: () => Promise<T>, fallback: T) {
  const { status } = useSession();
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const fetchRef = useRef(fetchFn);
  const fallbackRef = useRef(fallback);

  fetchRef.current = fetchFn;
  fallbackRef.current = fallback;

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setData(await fetchRef.current());
    } catch {
      setData(fallbackRef.current);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      setData(fallbackRef.current);
      setLoading(false);
      return;
    }

    reload();
  }, [status, reload]);

  return { data, setData, loading, reload, isAuthenticated: status === "authenticated" };
}
