"use client";

import { FormEvent, useEffect, useState } from "react";
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
import {
  addTicketReply,
  createTicket,
  fetchTickets,
  type SupportTicket,
} from "@/lib/services/user-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";

const emptyTicket = {
  orderId: "",
  subject: "",
  message: "",
  priority: "normal",
};

export default function TicketsPageClient() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [form, setForm] = useState(emptyTicket);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setTickets(await fetchTickets());
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const data = await fetchTickets();
        if (!cancelled) setTickets(data);
      } catch {
        if (!cancelled) setTickets([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  const submitTicket = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.subject.trim() || !form.message.trim()) {
      toast.error("Subject and message are required");
      return;
    }

    try {
      setSaving(true);
      await createTicket(form);
      setForm(emptyTicket);
      toast.success("Ticket created");
      await load();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create ticket"));
    } finally {
      setSaving(false);
    }
  };

  const submitReply = async (ticketId: string) => {
    const message = replyText[ticketId]?.trim();
    if (!message) {
      toast.error("Reply message is required");
      return;
    }

    try {
      await addTicketReply(ticketId, message);
      setReplyText({ ...replyText, [ticketId]: "" });
      await load();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add reply"));
    }
  };

  return (
    <div className="space-y-6">
      <AccountCard>
        <AccountCardHeader title="Support Tickets" />

        <form onSubmit={submitTicket} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Order ID (optional)"
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
                Low
              </option>
              <option value="normal" className="bg-keyshop-bg">
                Normal
              </option>
              <option value="high" className="bg-keyshop-bg">
                High
              </option>
            </select>
          </div>
          <input
            placeholder="Subject"
            value={form.subject}
            onChange={(event) => setForm({ ...form, subject: event.target.value })}
            className={accountFieldClass}
          />
          <textarea
            placeholder="Message"
            rows={4}
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            className={accountFieldClass}
          />
          <AccountActionButton type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create ticket"}
          </AccountActionButton>
        </form>
      </AccountCard>

      <AccountCard>
        {loading ? (
          <AccountLoading label="Loading tickets..." />
        ) : tickets.length === 0 ? (
          <p className="text-sm text-keyshop-muted">No support tickets yet.</p>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <AccountListItem key={ticket.id}>
                <h3 className="text-lg font-bold text-white">{ticket.subject}</h3>
                <p className="text-sm text-keyshop-muted">
                  Status: {ticket.status} | Priority: {ticket.priority}
                </p>
                {ticket.orderId ? (
                  <p className="text-sm text-keyshop-muted">Order #{ticket.orderId}</p>
                ) : null}
                <p className="text-sm text-white/80">{ticket.message}</p>
                {(ticket.replies || []).map((reply) => (
                  <p key={reply.id} className="rounded-control bg-white/[0.03] px-3 py-2 text-sm text-keyshop-muted">
                    <strong className="text-white">{reply.authorRole}:</strong>{" "}
                    {reply.message}
                  </p>
                ))}
                <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                  <input
                    placeholder="Reply"
                    value={replyText[ticket.id] || ""}
                    onChange={(event) =>
                      setReplyText({ ...replyText, [ticket.id]: event.target.value })
                    }
                    className={accountFieldClass}
                  />
                  <AccountActionButton onClick={() => submitReply(ticket.id)}>
                    Send
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
