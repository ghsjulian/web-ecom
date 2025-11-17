import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/404.css";
const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-error-code" aria-label="404">
        404
      </h1>
      <h2 className="notfound-title">Oops! Page Not Found</h2>
      <p className="notfound-description">
        The page you're looking for seems to have wandered off into the digital
        wilderness. Don't worry — let's get you back on track!
      </p>
      <div className="notfound-illustration" aria-hidden="true">
        {/*
                <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                    <ellipse
                        cx="200"
                        cy="280"
                        rx="180"
                        ry="30"
                        fill="#ddd"
                        opacity="0.5"
                    />
                    <circle
                        cx="120"
                        cy="120"
                        r="60"
                        fill="none"
                        stroke="#4ecdc4"
                        stroke-width="12"
                    />
                    <line
                        x1="170"
                        y1="170"
                        x2="230"
                        y2="230"
                        stroke="#4ecdc4"
                        stroke-width="12"
                        stroke-linecap="round"
                    />
                    <path
                        d="M 260 80 Q 240 80, 240 100 Q 240 120, 260 125 Q 280 130, 290 115 Q 295 100, 285 90 Q 275 80, 260 80"
                        fill="none"
                        stroke="#ff6b6b"
                        stroke-width="10"
                        stroke-linecap="round"
                    />
                    <circle cx="275" cy="150" r="15" fill="#ff6b6b" />
                    <rect
                        x="50"
                        y="200"
                        width="50"
                        height="60"
                        rx="5"
                        fill="#ff6b6b"
                        opacity="0.7"
                        transform="rotate(-15 75 230)"
                    />
                    <rect
                        x="320"
                        y="180"
                        width="50"
                        height="60"
                        rx="5"
                        fill="#4ecdc4"
                        opacity="0.7"
                        transform="rotate(20 345 210)"
                    />
                </svg>
                */}
      </div>

      <NavLink to="/" className="notfound-btn" aria-label="Go to homepage">
        <span className="sr-only">Return to </span>Home Page
      </NavLink>
      <NavLink
        to="javascript:history.back()"
        className="notfound-btn notfound-btn-secondary"
        aria-label="Go back to previous page"
      >
        Go Back
      </NavLink>
      <p className="notfound-sr-only">Error 404: Page not found</p>
    </div>
  );
};

export default NotFound;
