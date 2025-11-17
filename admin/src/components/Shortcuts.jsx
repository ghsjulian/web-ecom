import React from "react";

const Shortcuts = () => {
    return (
        <div className="dashboard-card quick-panel">
            <h3>Shortcuts</h3>
            <div className="shortcuts">
                <a className="shortcut" href="#">
                    Create Product
                </a>
                <a className="shortcut" href="#">
                    New Order
                </a>
                <a className="shortcut" href="#">
                    Send Campaign
                </a>
                <a className="shortcut" href="#">
                    Export Data
                </a>
            </div>
            <h4 style={{ marginTop: "14px" }}>Top product</h4>
            <div className="top-product">
                <img
                    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect rx='8' width='64' height='64' fill='%230b1220'/><text x='50%' y='55%' text-anchor='middle' fill='%23fff' font-family='Arial' font-size='10'>Ultra Sneakers</text></svg>"
                    alt=""
                />
                <div>
                    <strong>Ultra Sneakers</strong>
                    <small className="muted">1,920 sold</small>
                </div>
            </div>
        </div>
    );
};

export default Shortcuts;
