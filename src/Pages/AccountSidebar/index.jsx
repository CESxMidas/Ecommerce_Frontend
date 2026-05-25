import { NavLink } from "react-router-dom";

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

const AccountSidebar = () => {
  return (
    <div className="accountSidebar">
      {/* TOP */}

      <div className="accountSidebar__top">
        <div className="accountSidebar__avatar">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt=""
          />
        </div>

        <h3 className="accountSidebar__name">
          Hoang Do
        </h3>

        <p className="accountSidebar__email">
          hoangdo@gmail.com
        </p>
      </div>

      {/* MENU */}

      <div className="accountSidebar__menu">
        <NavLink
          to="/myaccount"
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

        <button className="accountSidebar__logout">
          <IoLogOutOutline />

          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AccountSidebar;