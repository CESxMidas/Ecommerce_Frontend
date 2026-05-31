import { useContext, useEffect, useState } from "react";
import AccountSidebar from "../AccountSidebar";
import { MyContext } from "../../App";
import {
  fetchLicenses,
  resendLicenseKeys,
} from "../../services/userService";
import "../MyAccount/index.css";

const AccountLicenses = () => {
  const context = useContext(MyContext);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        setLicenses(await fetchLicenses());
      } catch {
        setLicenses([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const copyKey = async (key) => {
    await navigator.clipboard.writeText(key);
    context.openAlertBox("success", "License key copied");
  };

  const resend = async (orderId) => {
    try {
      await resendLicenseKeys(orderId);
      context.openAlertBox("success", "License keys resent by email");
    } catch (error) {
      context.openAlertBox("error", error.message || "Failed to resend keys");
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
                <h2>License Keys</h2>
              </div>

              {loading ? (
                <p style={{ color: "#64748b" }}>Loading licenses...</p>
              ) : licenses.length === 0 ? (
                <p style={{ color: "#64748b" }}>No license keys yet.</p>
              ) : (
                <div className="accountList">
                  {licenses.map((item) => (
                    <article className="accountList__item" key={item.id}>
                      <div>
                        <h3>{item.productName}</h3>
                        <p>Order #{item.orderId}</p>
                        {(item.keys || []).map((key) => (
                          <code className="accountCode" key={key}>
                            {visible[key] ? key : "••••-•••••"}
                            <button
                              type="button"
                              onClick={() =>
                                setVisible({ ...visible, [key]: !visible[key] })
                              }
                            >
                              {visible[key] ? "HIDE" : "SHOW"}
                            </button>
                            <button type="button" onClick={() => copyKey(key)}>
                              COPY
                            </button>
                          </code>
                        ))}
                      </div>
                      <button type="button" onClick={() => resend(item.orderId)}>
                        RESEND
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

export default AccountLicenses;
