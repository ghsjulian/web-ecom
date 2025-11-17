import React from "react";
import DashboardCard from "../components/DashboardCard";
import SalesChart from "../components/SalesChart";
import RecentTransactions from "../components/RecentTransactions";
import Shortcuts from "../components/Shortcuts";
import Activity from "../components/Activity";

const Dashboard = () => {
    return (
        <>
            <DashboardCard />
            <section className="dashboard-grid-layout">
                <SalesChart />
                <Shortcuts />
                <RecentTransactions />
                <Activity />
            </section>
        </>
    );
};

export default Dashboard;
