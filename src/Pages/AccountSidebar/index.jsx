import {
  FaRegUser,
  FaRegHeart,
} from "react-icons/fa";

import {
  IoLocationOutline,
  IoBagHandleOutline,
  IoLogOutOutline,
} from "react-icons/io5";

import "./index.css";

const AccountSidebar = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="accountSidebar">
      {/* IMAGE */}

      <div className="sidebarTop">
        <div className="sidebarAvatar">
          <img
            src="https://cdn-icons-png.flaticon.com/512/8345/8345328.png"
            alt=""
          />
        </div>

        <h3 className="sidebarName">
          User Name
        </h3>

        <p className="sidebarEmail">
          user@gmail.com
        </p>
      </div>

      {/* MENU */}

      <ul className="sidebarMenu">
        {/* PROFILE */}

        <li
          className={
            activeTab === "profile"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("profile")
          }
        >
          <FaRegUser />

          <span>My Profile</span>
        </li>

        {/* ADDRESS */}

        <li
          className={
            activeTab === "address"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("address")
          }
        >
          <IoLocationOutline />

          <span>Address</span>
        </li>

        {/* WISHLIST */}

        <li
          className={
            activeTab === "wishlist"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("wishlist")
          }
        >
          <FaRegHeart />

          <span>My List</span>
        </li>

        {/* ORDERS */}

        <li
          className={
            activeTab === "orders"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("orders")
          }
        >
          <IoBagHandleOutline />

          <span>My Orders</span>
        </li>

        {/* LOGOUT */}

        <li className="logoutItem">
          <IoLogOutOutline />

          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default AccountSidebar;