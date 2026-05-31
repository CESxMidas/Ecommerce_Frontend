import { useContext, useEffect, useState } from "react";
import AccountSidebar from "../AccountSidebar";
import { MyContext } from "../../App";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/userService";
import "../MyAccount/index.css";

const AccountNotifications = () => {
  const context = useContext(MyContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      setNotifications(await fetchNotifications());
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialNotifications = async () => {
      try {
        const data = await fetchNotifications();

        if (!cancelled) {
          setNotifications(data);
        }
      } catch {
        if (!cancelled) {
          setNotifications([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);
      await load();
    } catch (error) {
      context.openAlertBox("error", error.message || "Failed to update notification");
    }
  };

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      await load();
      context.openAlertBox("success", "Notifications updated");
    } catch (error) {
      context.openAlertBox("error", error.message || "Failed to update notifications");
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
                <h2>Notifications</h2>
                <button type="button" onClick={markAll}>
                  MARK ALL READ
                </button>
              </div>

              {loading ? (
                <p style={{ color: "#64748b" }}>Loading notifications...</p>
              ) : notifications.length === 0 ? (
                <p style={{ color: "#64748b" }}>No notifications yet.</p>
              ) : (
                <div className="accountList">
                  {notifications.map((item) => (
                    <article
                      className={`accountList__item ${item.readAt ? "" : "unread"}`}
                      key={item.id}
                    >
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.message}</p>
                        <p>
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : ""}
                        </p>
                      </div>
                      {!item.readAt && (
                        <button type="button" onClick={() => markRead(item.id)}>
                          READ
                        </button>
                      )}
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

export default AccountNotifications;
