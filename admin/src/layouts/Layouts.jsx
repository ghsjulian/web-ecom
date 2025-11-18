import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../styles/app.layout.css";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layouts = () => {
  return (
    <>
      <div className="app">
        <input id="mobile-menu-toggle" type="checkbox" hidden />
        <label
          htmlFor="mobile-menu-toggle"
          className="overlay"
          area-hidden="true"
        ></label>
        <Header />
        <Sidebar />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layouts;
