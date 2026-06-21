"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";

import {
  AccountActionButton,
  AccountCard,
  AccountCardHeader,
  AccountListItem,
  AccountLoading,
} from "@/components/account/account-ui";
import { performLogout } from "@/lib/auth/logout";
import { useSessionQuery } from "@/lib/hooks/use-session-query";
import {
  deleteAllSessions,
  deleteSession,
  fetchSessions,
  type UserSession,
} from "@/lib/services/user-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";

export default function SecurityPageClient() {
  const loadSessions = useCallback(() => fetchSessions(), []);
  const { data: sessions, loading, reload } = useSessionQuery<UserSession[]>(
    loadSessions,
    [],
  );

  async function loadSessionsPage() {
    await reload();
  }

  const removeSession = async (id: string) => {
    try {
      await deleteSession(id);
      toast.success("Đã đăng xuất phiên");
      await loadSessionsPage();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể đăng xuất phiên"));
    }
  };

  const removeAllSessions = async () => {
    try {
      await deleteAllSessions();
      toast.success("Đã đăng xuất tất cả phiên");
      await performLogout("/auth/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể đăng xuất các phiên"));
    }
  };

  return (
    <AccountCard>
      <AccountCardHeader
        title="Bảo mật"
        description="Quản lý phiên đăng nhập và trạng thái bảo mật tài khoản."
        action={
          <AccountActionButton variant="outline" onClick={removeAllSessions}>
            Đăng xuất tất cả
          </AccountActionButton>
        }
      />

      {loading ? (
        <AccountLoading label="Đang tải phiên đăng nhập..." />
      ) : sessions.length === 0 ? (
        <p className="text-sm text-keyshop-muted">Không tìm thấy phiên đăng nhập.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <AccountListItem
              key={session.id}
              action={
                <AccountActionButton onClick={() => removeSession(session.id)}>
                  Xóa
                </AccountActionButton>
              }
            >
              <h3 className="text-lg font-bold text-white">
                {session.deviceName || "Trình duyệt"}
              </h3>
              <p className="text-sm text-keyshop-muted">
                {session.ipAddress || "IP không xác định"}
              </p>
              <p className="text-xs text-slate-500">
                Lần dùng cuối:{" "}
                {session.lastUsedAt
                  ? new Date(session.lastUsedAt).toLocaleString()
                  : "Không rõ"}
              </p>
            </AccountListItem>
          ))}
        </div>
      )}
    </AccountCard>
  );
}
