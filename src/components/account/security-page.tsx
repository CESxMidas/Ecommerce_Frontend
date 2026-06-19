"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  AccountActionButton,
  AccountCard,
  AccountCardHeader,
  AccountListItem,
  AccountLoading,
} from "@/components/account/account-ui";
import { performLogout } from "@/lib/auth/logout";
import {
  deleteAllSessions,
  deleteSession,
  fetchSessions,
  type UserSession,
} from "@/lib/services/user-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";

export default function SecurityPageClient() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSessions() {
    try {
      setLoading(true);
      setSessions(await fetchSessions());
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const data = await fetchSessions();
        if (!cancelled) setSessions(data);
      } catch {
        if (!cancelled) setSessions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  const removeSession = async (id: string) => {
    try {
      await deleteSession(id);
      toast.success("Session removed");
      await loadSessions();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to remove session"));
    }
  };

  const removeAllSessions = async () => {
    try {
      await deleteAllSessions();
      toast.success("All sessions removed");
      await performLogout("/auth/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to logout sessions"));
    }
  };

  return (
    <AccountCard>
      <AccountCardHeader
        title="Security"
        description="Manage active login sessions and account security state."
        action={
          <AccountActionButton variant="outline" onClick={removeAllSessions}>
            Logout all
          </AccountActionButton>
        }
      />

      {loading ? (
        <AccountLoading label="Loading sessions..." />
      ) : sessions.length === 0 ? (
        <p className="text-sm text-keyshop-muted">No active sessions found.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <AccountListItem
              key={session.id}
              action={
                <AccountActionButton onClick={() => removeSession(session.id)}>
                  Remove
                </AccountActionButton>
              }
            >
              <h3 className="text-lg font-bold text-white">
                {session.deviceName || "Browser"}
              </h3>
              <p className="text-sm text-keyshop-muted">
                {session.ipAddress || "Unknown IP"}
              </p>
              <p className="text-xs text-slate-500">
                Last used:{" "}
                {session.lastUsedAt
                  ? new Date(session.lastUsedAt).toLocaleString()
                  : "Unknown"}
              </p>
            </AccountListItem>
          ))}
        </div>
      )}
    </AccountCard>
  );
}
