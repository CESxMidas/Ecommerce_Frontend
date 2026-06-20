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
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type UserNotification,
} from "@/lib/services/user-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";

export default function NotificationsPageClient() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      setNotifications(await fetchNotifications());
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const data = await fetchNotifications();
        if (!cancelled) setNotifications(data);
      } catch {
        if (!cancelled) setNotifications([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  const markRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      await load();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể cập nhật thông báo"));
    }
  };

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      await load();
      toast.success("Đã cập nhật thông báo");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể cập nhật thông báo"));
    }
  };

  return (
    <AccountCard>
      <AccountCardHeader
        title="Thông báo"
        action={
          notifications.some((item) => !item.readAt) ? (
            <AccountActionButton onClick={markAll}>Đánh dấu tất cả đã đọc</AccountActionButton>
          ) : null
        }
      />

      {loading ? (
        <AccountLoading label="Đang tải thông báo..." />
      ) : notifications.length === 0 ? (
        <p className="text-sm text-keyshop-muted">Chưa có thông báo.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => (
            <AccountListItem
              key={item.id}
              unread={!item.readAt}
              action={
                !item.readAt ? (
                  <AccountActionButton onClick={() => markRead(item.id)}>
                    Đã đọc
                  </AccountActionButton>
                ) : null
              }
            >
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm text-keyshop-muted">{item.message}</p>
              {item.createdAt ? (
                <p className="text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              ) : null}
            </AccountListItem>
          ))}
        </div>
      )}
    </AccountCard>
  );
}
