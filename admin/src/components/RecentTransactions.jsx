import React from "react";

const RecentTransactions = () => {
    return (
        <div className="dashboard-card dashboard-table-card">
            <div className="dashboard-card-head">
                <h3>Recent Transactions</h3>
                <div className="dashboard-muted">Most recent 8</div>
            </div>
            <div className="dashboard-table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Item</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Anna P.</td>
                            <td>Sneakers</td>
                            <td>$120</td>
                            <td>
                                <span className="pill paid">Paid</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Marcus L.</td>
                            <td>Watch</td>
                            <td>$220</td>
                            <td>
                                <span className="pill pending">Pending</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Sara W.</td>
                            <td>Bag</td>
                            <td>$90</td>
                            <td>
                                <span className="pill refunded">Refunded</span>
                            </td>
                        </tr>
                        <tr>
                            <td>John D.</td>
                            <td>Headphones</td>
                            <td>$45</td>
                            <td>
                                <span className="pill paid">Paid</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Elena R.</td>
                            <td>Sunglasses</td>
                            <td>$80</td>
                            <td>
                                <span className="pill paid">Paid</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Ken T.</td>
                            <td>Backpack</td>
                            <td>$68</td>
                            <td>
                                <span className="pill disputed">Disputed</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTransactions;
