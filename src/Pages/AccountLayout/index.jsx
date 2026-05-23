import AccountSidebar from "../AccountSidebar";

import "./index.css";

const AccountLayout = ({ children }) => {
  return (
    <section className="accountLayout">
      <div className="container">
        <div className="accountWrapper">
          {/* LEFT */}

          <AccountSidebar />

          {/* RIGHT */}

          <div className="accountContent">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default AccountLayout;
