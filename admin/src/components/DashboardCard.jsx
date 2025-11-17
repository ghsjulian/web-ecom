import React from "react";

const DashboardCard = () => {
    return (
        <section className="kpis" aria-label="Key performance indicators">
            <div className="kpi">
                <small>Revenue</small>
                <div className="kpi-row">
                    <strong>$18,450</strong>
                    <span className="delta up">+8.2%</span>
                </div>
                <div className="kpi-sub">Monthly revenue</div>
            </div>
            <div className="kpi">
                <small>Orders</small>
                <div className="kpi-row">
                    <strong>3,112</strong>
                    <span className="delta down">-1.4%</span>
                </div>
                <div className="kpi-sub">Last 7 days</div>
            </div>
            <div className="kpi">
                <small>Active Users</small>
                <div className="kpi-row">
                    <strong>1,874</strong>
                    <span className="delta up">+2.9%</span>
                </div>
                <div className="kpi-sub">Realtime</div>
            </div>
            <div className="kpi">
                <small>Conversion</small>
                <div className="kpi-row">
                    <strong>4.7%</strong>
                    <span className="delta up">+0.6%</span>
                </div>
                <div className="kpi-sub">Store-wide</div>
            </div>
        </section>
    );
};

export default DashboardCard;
