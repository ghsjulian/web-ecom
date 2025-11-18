import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as icons from "react-icons/fc";

const Sidebar = () => {
  const location = useLocation();
  const [path, setPath] = useState("");
  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  return (
    <aside>
      <h3>Dashboard</h3>
      <nav className="nav" role="navigation" aria-label="Main">
        <ul>
          <li className="nav-section">
            <span className="section-title">Main Menu</span>
            <ul>
              <li className={path === "/" ? "active" : ""}>
                <NavLink to="/">
                  <span className="ico">
                    <icons.FcPieChart size={24} />
                  </span>
                  <span className="label">Dashboard</span>
                </NavLink>
              </li>
              <li className={path === "/analytics" ? "active" : ""}>
                <NavLink to="/analytics">
                  <span className="ico">
                    <icons.FcBarChart size={24} />
                  </span>
                  <span className="label">Analytics</span>
                </NavLink>
              </li>
              <li className={path === "/overview" ? "active" : ""}>
                <NavLink to="/overview">
                  <span className="ico">
                    <icons.FcFlashOn size={24} />
                  </span>
                  <span className="label">Overview</span>
                </NavLink>
              </li>
            </ul>
          </li>

          <li className="nav-section">
            <span className="section-title">Commerce</span>
            <ul>
              <li className={path === "/products" ? "active" : ""}>
                <NavLink to="/products">
                  <span className="ico">
                    <icons.FcBriefcase size={24} />
                  </span>
                  <span className="label">Products</span>
                </NavLink>
              </li>
              <li className={path === "/orders" ? "active" : ""}>
                <NavLink to="/orders">
                  <span className="ico">
                    <icons.FcRules size={24} />
                  </span>
                  <span className="label">Orders</span>
                </NavLink>
              </li>
              <li className={path === "/customers" ? "active" : ""}>
                <NavLink to="/customers">
                  <span className="ico">
                    <icons.FcConferenceCall size={24} />
                  </span>
                  <span className="label">Customers</span>
                </NavLink>
              </li>
              <li className={path === "/billing-info" ? "active" : ""}>
                <NavLink to="/billing-info">
                  <span className="ico">
                    <icons.FcViewDetails size={24} />
                  </span>
                  <span className="label">Billing</span>
                </NavLink>
              </li>
              <li className={path === "/deliveries" ? "active" : ""}>
                <NavLink to="/deliveries">
                  <span className="ico">
                    <icons.FcShipped size={24} />
                  </span>
                  <span className="label">Deliveries</span>
                </NavLink>
              </li>
              <li className={path === "/earnings" ? "active" : ""}>
                <NavLink to="/earnings">
                  <span className="ico">
                    <icons.FcCurrencyExchange size={24} />
                  </span>
                  <span className="label">Earnings</span>
                </NavLink>
              </li>
              <li className={path === "/categories" ? "active" : ""}>
                <NavLink to="/categories">
                  <span className="ico">
                    <icons.FcFlowChart size={24} />
                  </span>
                  <span className="label">Categories</span>
                </NavLink>
              </li>
              <li className={path === "/add-product" ? "active" : ""}>
                <NavLink to="/add-product">
                  <span className="ico">
                    <icons.FcPlus size={24} />
                  </span>
                  <span className="label">Add New Product</span>
                </NavLink>
              </li>
            </ul>
          </li>

          <li className="nav-section">
            <span className="section-title">Engage</span>
            <ul>
              <li className={path === "/messages" ? "active" : ""}>
                <NavLink to="/messages">
                  <span className="ico">
                    <icons.FcInvite size={24} />
                  </span>
                  <span className="label">Messages</span>
                </NavLink>
              </li>
              <li className={path === "/marketing" ? "active" : ""}>
                <NavLink to="/marketing">
                  <span className="ico">
                    <icons.FcAdvertising size={24} />
                  </span>
                  <span className="label">Marketing</span>
                </NavLink>
              </li>
              <li className={path === "/integration" ? "active" : ""}>
                <NavLink to="/integrations">
                  <span className="ico">🔗</span>
                  <span className="label">Integrations</span>
                </NavLink>
              </li>
            </ul>
          </li>

          <li className="nav-section">
            <span className="section-title">Settings</span>
            <ul>
              <li className={path === "/settings" ? "active" : ""}>
                <NavLink to="/settings">
                  <span className="ico">
                    <icons.FcSettings size={24} />
                  </span>
                  <span className="label">Settings</span>
                </NavLink>
              </li>
              <li className={path === "/security" ? "active" : ""}>
                <NavLink to="/security">
                  <span className="ico">
                    <icons.FcPrivacy size={24} />
                  </span>
                  <span className="label">Security</span>
                </NavLink>
              </li>
              <li className={path === "/help-support" ? "active" : ""}>
                <NavLink to="/help-support">
                  <span className="ico">
                    <icons.FcBullish size={24} />
                  </span>
                  <span className="label">Help & Support</span>
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
