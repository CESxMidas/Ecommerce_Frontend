"use client";

import { FormEvent, useCallback, useState } from "react";
import toast from "react-hot-toast";

import {
  AccountActionButton,
  AccountCard,
  AccountCardHeader,
  AccountListItem,
  AccountLoading,
  accountFieldClass,
  accountSelectClass,
} from "@/components/account/account-ui";
import { useSessionQuery } from "@/lib/hooks/use-session-query";
import {
  addTicketReply,
  createTicket,
  fetchTickets,
} from "@/lib/services/user-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import { tAuthorRole, tTicketPriority, tTicketStatus } from "@/lib/constants/vi";

const emptyTicket = {
  orderId: "",
  subject: "",
  message: "",
  priority: "normal",
};

export default function TicketsPageClient() {
  const loadTickets = useCallback(() => fetchTickets(), []);
  const { data: tickets, loading, reload } = useSessionQuery(loadTickets, []);
  const [form, setForm] = useState(emptyTicket);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const submitTicket = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.subject.trim() || !form.message.trim()) {
      toast.error("Tiêu đề và nội dung là bắt buộc");
      return;
    }

    try {
      setSaving(true);
      await createTicket(form);
      setForm(emptyTicket);
      toast.success("Đã tạo yêu cầu hỗ trợ");
      await reload();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể tạo yêu cầu hỗ trợ"));
    } finally {
      setSaving(false);
    }
  };

  const submitReply = async (ticketId: string) => {
    const message = replyText[ticketId]?.trim();
    if (!message) {
      toast.error("Nội dung phản hồi là bắt buộc");
      return;
    }

    try {
      await addTicketReply(ticketId, message);
      setReplyText({ ...replyText, [ticketId]: "" });
      await reload();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không thể gửi phản hồi"));
    }
  };

  return (
    <div className="space-y-6">
      <AccountCard>
        <AccountCardHeader title="Yêu cầu hỗ trợ" />

        <form onSubmit={submitTicket} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Mã đơn (tùy chọn)"
              value={form.orderId}
              onChange={(event) => setForm({ ...form, orderId: event.target.value })}
              className={accountFieldClass}
            />
            <select
              value={form.priority}
              onChange={(event) => setForm({ ...form, priority: event.target.value })}
              className={accountSelectClass}
            >
              <option value="low" className="bg-keyshop-bg">
                Thấp
              </option>
              <option value="normal" className="bg-keyshop-bg">
                Bình thường
              </option>
              <option value="high" className="bg-keyshop-bg">
                Cao
              </option>
            </select>
          </div>
          <input
            placeholder="Tiêu đề"
            value={form.subject}
            onChange={(event) => setForm({ ...form, subject: event.target.value })}
            className={accountFieldClass}
          />
          <textarea
            placeholder="Nội dung"
            rows={4}
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            className={accountFieldClass}
          />
          <AccountActionButton type="submit" disabled={saving}>
            {saving ? "Đang tạo..." : "Tạo yêu cầu"}
          </AccountActionButton>
        </form>
      </AccountCard>

      <AccountCard>
        {loading ? (
          <AccountLoading label="Đang tải yêu cầu..." />
        ) : tickets.length === 0 ? (
          <p className="text-sm text-keyshop-muted">Chưa có yêu cầu hỗ trợ.</p>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <AccountListItem key={ticket.id}>
                <h3 className="text-lg font-bold text-white">{ticket.subject}</h3>
                <p className="text-sm text-keyshop-muted">
                  Trạng thái: {tTicketStatus(ticket.status)} · Ưu tiên:{" "}
                  {tTicketPriority(ticket.priority)}
                </p>
                {ticket.orderId ? (
                  <p className="text-sm text-keyshop-muted">Đơn hàng #{ticket.orderId}</p>
                ) : null}
                <p className="text-sm text-white/80">{ticket.message}</p>
                {(ticket.replies || []).map((reply) => (
                  <p key={reply.id} className="rounded-control bg-white/[0.03] px-3 py-2 text-sm text-keyshop-muted">
                    <strong className="text-white">{tAuthorRole(reply.authorRole)}:</strong>{" "}
                    {reply.message}
                  </p>
                ))}
                <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                  <input
                    placeholder="Phản hồi"
                    value={replyText[ticket.id] || ""}
                    onChange={(event) =>
                      setReplyText({ ...replyText, [ticket.id]: event.target.value })
                    }
                    className={accountFieldClass}
                  />
                  <AccountActionButton onClick={() => submitReply(ticket.id)}>
                    Gửi
                  </AccountActionButton>
                </div>
              </AccountListItem>
            ))}
          </div>
        )}
      </AccountCard>
    </div>
  );
}
