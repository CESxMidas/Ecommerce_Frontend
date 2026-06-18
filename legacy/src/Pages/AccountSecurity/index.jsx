import { useContext, useEffect, useState } from "react";
import AccountSidebar from "../AccountSidebar";
import { MyContext } from "../../App";
import {
  deleteAllSessions,
  deleteSession,
  fetchSessions,
} from "../../services/userService";
import "../MyAccount/index.css";

const AccountSecurity = () => {
  const context = useContext(MyContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setSessions(await fetchSessions());
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialSessions = async () => {
      try {
        const data = await fetchSessions();

        if (!cancelled) {
          setSessions(data);
        }
      } catch {
        if (!cancelled) {
          setSessions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialSessions();

    return () => {
      cancelled = true;
    };
  }, []);

  const removeSession = async (id) => {
    try {
      await deleteSession(id);
      context.openAlertBox("success", "Session removed");
      await loadSessions();
    } catch (error) {
      context.openAlertBox("error", error.message || "Failed to remove session");
    }
  };

  const removeAllSessions = async () => {
    try {
      await deleteAllSessions();
      context.openAlertBox("success", "All sessions removed");
      context.logout();
    } catch (error) {
      context.openAlertBox("error", error.message || "Failed to logout sessions");
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
                <h2>Security</h2>
                <button type="button" onClick={removeAllSessions}>
                  LOGOUT ALL
                </button>
              </div>

              <p style={{ color: "#94a3b8", marginBottom: 20 }}>
                Manage active login sessions and account security state.
              </p>

              {loading ? (
                <p style={{ color: "#64748b" }}>Loading sessions...</p>
              ) : sessions.length === 0 ? (
                <p style={{ color: "#64748b" }}>No active sessions found.</p>
              ) : (
                <div className="accountList">
                  {sessions.map((session) => (
                    <article className="accountList__item" key={session.id}>
                      <div>
                        <h3>{session.deviceName || "Browser"}</h3>
                        <p>{session.ipAddress || "Unknown IP"}</p>
                        <p>
                          Last used:{" "}
                          {session.lastUsedAt
                            ? new Date(session.lastUsedAt).toLocaleString()
                            : "Unknown"}
                        </p>
                      </div>
                      <button type="button" onClick={() => removeSession(session.id)}>
                        REMOVE
                      </button>
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

export default AccountSecurity;
