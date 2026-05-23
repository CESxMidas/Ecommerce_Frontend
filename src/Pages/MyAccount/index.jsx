import { useState } from "react";

import "./index.css";

import AccountSidebar from "../AccountSidebar";

import MyOrders from "../Orders";

const MyAccount = () => {
  const [activeTab, setActiveTab] =
    useState("profile");

  return (
    <section className="myAccountPage">
      <div className="container">
        <div className="myAccountLayout">
          {/* SIDEBAR */}

          <AccountSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* RIGHT CONTENT */}

          <div className="accountContent">
            {/* {activeTab === "profile" && (
              <Profile />
            )}

            {activeTab === "address" && (
              <Address />
            )}

            {activeTab === "wishlist" && (
              <MyList />
            )} */}

            {activeTab === "orders" && (
              <MyOrders />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;