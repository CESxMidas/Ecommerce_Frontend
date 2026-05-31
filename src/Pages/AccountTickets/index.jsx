import { useContext, useEffect, useState } from "react";
import AccountSidebar from "../AccountSidebar";
import { MyContext } from "../../App";
import {
  addTicketReply,
  createTicket,
  fetchTickets,
} from "../../services/userService";
import "../MyAccount/index.css";

const emptyTicket = {
  orderId: "",
  subject: "",
  message: "",
  priority: "normal",
};

const AccountTickets = () => {
  const context = useContext(MyContext);
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState(emptyTicket);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setTickets(await fetchTickets());
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialTickets = async () => {
      try {
        const data = await fetchTickets();

        if (!cancelled) {
          setTickets(data);
        }
      } catch {
        if (!cancelled) {
          setTickets([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialTickets();

    return () => {
      cancelled = true;
    };
  }, []);

  const submitTicket = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      await createTicket(form);
      setForm(emptyTicket);
      context.openAlertBox("success", "Ticket created");
      await load();
    } catch (error) {
      context.openAlertBox("error", error.message || "Failed to create ticket");
    } finally {
      setSaving(false);
    }
  };

  const submitReply = async (ticketId) => {
    try {
      await addTicketReply(ticketId, replyText[ticketId] || "");
      setReplyText({ ...replyText, [ticketId]: "" });
      await load();
    } catch (error) {
      context.openAlertBox("error", error.message || "Failed to add reply");
    }
  };

  return (
    <section className="myAccount">
      <div className="container">
        <div className="myAccount__wrapper">
          <AccountSidebar />
          <div className="myAccount__content">
            <div className="myAccount__card">
              <div className="myAccount__header">
                <h2>Support Tickets</h2>
              </div>

              <form className="myAccount__form" onSubmit={submitTicket}>
                <div className="myAccount__formGroup">
                  <input
                    placeholder="Order ID"
                    value={form.orderId}
                    onChange={(event) =>
                      setForm({ ...form, orderId: event.target.value })
                    }
                  />
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm({ ...form, priority: event.target.value })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="myAccount__formGroup">
                  <input
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(event) =>
                      setForm({ ...form, subject: event.target.value })
                    }
                  />
                  <input
                    placeholder="Message"
                    value={form.message}
                    onChange={(event) =>
                      setForm({ ...form, message: event.target.value })
                    }
                  />
                </div>
                <button type="submit" disabled={saving}>
                  {saving ? "CREATING..." : "CREATE TICKET"}
                </button>
              </form>
            </div>

            <div className="myAccount__card">
              {loading ? (
                <p style={{ color: "#64748b" }}>Loading tickets...</p>
              ) : tickets.length === 0 ? (
                <p style={{ color: "#64748b" }}>No support tickets yet.</p>
              ) : (
                <div className="accountList">
                  {tickets.map((ticket) => (
                    <article className="accountList__item" key={ticket.id}>
                      <div>
                        <h3>{ticket.subject}</h3>
                        <p>
                          Status: {ticket.status} | Priority: {ticket.priority}
                        </p>
                        {ticket.orderId && <p>Order #{ticket.orderId}</p>}
                        <p>{ticket.message}</p>
                        {(ticket.replies || []).map((reply) => (
                          <p key={reply.id}>
                            <strong>{reply.authorRole}:</strong> {reply.message}
                          </p>
                        ))}
                        <div className="accountInlineForm">
                          <input
                            placeholder="Reply"
                            value={replyText[ticket.id] || ""}
                            onChange={(event) =>
                              setReplyText({
                                ...replyText,
                                [ticket.id]: event.target.value,
                              })
                            }
                          />
                          <button
                            type="button"
                            onClick={() => submitReply(ticket.id)}
                          >
                            SEND
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountTickets;
