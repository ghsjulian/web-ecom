import React from "react";
import * as icons from "react-icons/fc";
import { IoMdLogOut } from "react-icons/io";
import { FaPowerOff } from "react-icons/fa";
import useAuth from "../store/useAuth";
import { BsBell } from "react-icons/bs";

const Header = () => {
  const { adminLogout } = useAuth();

  return (
    <header className="topbar" role="banner">
      <div className="top-left">
        <div className="search" role="search">
          <input
            type="search"
            placeholder="Search for orders, users, products..."
            aria-label="Search"
          />
          <button className="search-btn" aria-hidden="true">
            <icons.FcSearch size={24} />
          </button>
        </div>
      </div>
      <div className="top-right">
        <button
          className="icon-btn"
          title="Admin Profile"
          aria-label="Admin Profile"
        >
          <icons.FcBusinessman size={25} />
        </button>
        <button className="icon-btn" title="Notification" aria-label="Messages">
          <BsBell size={23} color="#56adf5ff" />
        </button>
        <button
          onClick={adminLogout}
          className="icon-btn"
          title="Logout"
          aria-label="Logout"
        >
          <FaPowerOff style={{ color: "#cf0000ff" }} size={23} />
        </button>
        <label
          style={{ marginTop: "5px" }}
          htmlFor="mobile-menu-toggle"
          className="mobile-burger"
          title="Open menu"
          aria-hidden="true"
        >
          <icons.FcMenu size={23} />
        </label>
      </div>
    </header>
  );
};

export default Header;
