"use client";

import Link from "next/link";
import { useCallback } from "react";
import toast from "react-hot-toast";

import {
  AccountActionButton,
  AccountCard,
  AccountCardHeader,
  AccountEmptyState,
  AccountListItem,
  AccountLoading,
} from "@/components/account/account-ui";
import { useSessionQuery } from "@/lib/hooks/use-session-query";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/services/user-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import {
  formatNotificationDate,
  localizeNotificationMessage,
  localizeNotificationTitle,
} from "@/lib/utils/notification-display";

export default function NotificationsPageClient() {
  const loadNotifications = useCallback(() => fetchNotifications(), []);
  const { data: notifications, loading, reload } = useSessionQuery(
    loadNotifications,
    [],
  );

  const markRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      await reload();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể cập nhật thông báo"));
    }
  };

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      await reload();
      toast.success("Đã cập nhật thông báo");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể cập nhật thông báo"));
    }
  };

  return (
    <AccountCard>
      <AccountCardHeader
        title="Thông báo"
        description="Cập nhật đơn hàng, hỗ trợ và bảo mật tài khoản."
        action={
          notifications.some((item) => !item.readAt) ? (
            <AccountActionButton onClick={markAll}>Đánh dấu tất cả đã đọc</AccountActionButton>
          ) : null
        }
      />

      {loading ? (
        <AccountLoading label="Đang tải thông báo..." />
      ) : notifications.length === 0 ? (
        <AccountEmptyState
          title="Chưa có thông báo"
          description="Thông báo về đơn hàng, ticket hỗ trợ và bảo mật sẽ hiển thị tại đây."
          actionLabel="Xem sản phẩm"
          actionHref="/products"
        />
      ) : (
        <ul className="space-y-4" aria-label="Danh sách thông báo">
          {notifications.map((item) => {
            const unread = !item.readAt;
            const title = localizeNotificationTitle(item.title);
            const message = localizeNotificationMessage(item.message);
            const ticketId = item.data?.ticketId as string | undefined;

            return (
              <AccountListItem
                key={item.id}
                unread={unread}
                action={
                  unread ? (
                    <AccountActionButton onClick={() => markRead(item.id)}>
                      Đã đọc
                    </AccountActionButton>
                  ) : null
                }
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white sm:text-lg">{title}</h3>
                  {unread ? (
                    <span className="inline-flex rounded-full bg-keyshop-blue/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-200">
                      Mới
                    </span>
                  ) : null}
                </div>
                <p className="text-sm leading-relaxed text-white/85">{message}</p>
                {item.createdAt ? (
                  <time
                    dateTime={item.createdAt}
                    className="block text-xs font-medium text-white/55"
                  >
                    {formatNotificationDate(item.createdAt)}
                  </time>
                ) : null}
                {ticketId ? (
                  <Link
                    href="/account/tickets"
                    className="inline-block text-sm font-semibold text-keyshop-blue hover:underline"
                  >
                    Xem yêu cầu hỗ trợ →
                  </Link>
                ) : null}
              </AccountListItem>
            );
          })}
        </ul>
      )}
    </AccountCard>
  );
}
