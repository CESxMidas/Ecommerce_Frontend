import { useContext } from "react";
import { NavLink } from "react-router-dom";

import {
  FaRegUser,
  FaRegHeart,
} from "react-icons/fa";

import {
  IoLocationOutline,
  IoBagHandleOutline,
  IoLogOutOutline,
  IoKeyOutline,
  IoNotificationsOutline,
  IoShieldCheckmarkOutline,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";

import { MyContext } from "../../App";

import "./index.css";

const AccountSidebar = () => {
  const context = useContext(MyContext);

  const displayName = context?.user?.name || "Guest";
  const displayEmail = context?.user?.email || "";
  const avatarSrc =
    context?.user?.avatar ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <div className="accountSidebar">
      <div className="accountSidebar__top">
        <div className="accountSidebar__avatar">
          <img
            src={avatarSrc}
            alt=""
          />
        </div>

        <h3 className="accountSidebar__name">{displayName}</h3>

        <p className="accountSidebar__email">{displayEmail}</p>

        <div className="accountSidebar__badge">
          <span>{context?.user?.verify_email ? "Verified" : "Account"}</span>
        </div>
      </div>

      <div className="accountSidebar__menu">
        <NavLink
          to="/myAccount"
          className={({ isActive }) =>
            isActive
              ? "accountSidebar__link active"
              : "accountSidebar__link"
          }
        >
          <FaRegUser />

          <span>My Profile</span>
        </NavLink>

        <NavLink
          to="/address"
          className={({ isActive }) =>
            isActive
              ? "accountSidebar__link active"
              : "accountSidebar__link"
          }
        >
          <IoLocationOutline />

          <span>Address</span>
        </NavLink>

        <NavLink
          to="/my-list"
          className={({ isActive }) =>
            isActive
              ? "accountSidebar__link active"
              : "accountSidebar__link"
          }
        >
          <FaRegHeart />

          <span>My List</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? "accountSidebar__link active"
              : "accountSidebar__link"
          }
        >
          <IoBagHandleOutline />

          <span>My Orders</span>
        </NavLink>

        <NavLink
          to="/licenses"
          className={({ isActive }) =>
            isActive
              ? "accountSidebar__link active"
              : "accountSidebar__link"
          }
        >
          <IoKeyOutline />

          <span>License Keys</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            isActive
              ? "accountSidebar__link active"
              : "accountSidebar__link"
          }
        >
          <IoNotificationsOutline />

          <span>Notifications</span>
        </NavLink>

        <NavLink
          to="/tickets"
          className={({ isActive }) =>
            isActive
              ? "accountSidebar__link active"
              : "accountSidebar__link"
          }
        >
          <IoChatbubbleEllipsesOutline />

          <span>Support</span>
        </NavLink>

        <NavLink
          to="/security"
          className={({ isActive }) =>
            isActive
              ? "accountSidebar__link active"
              : "accountSidebar__link"
          }
        >
          <IoShieldCheckmarkOutline />

          <span>Security</span>
        </NavLink>

        <button
          type="button"
          className="accountSidebar__logout"
          onClick={() => context?.logout()}
        >
          <IoLogOutOutline />

          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AccountSidebar;
