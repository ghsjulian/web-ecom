import React from "react";
import "../styles/billing-styles.css";

const BillingInfo = () => {
  return (
    <div className="billing-container">
      <div className="billing-header">
        <h1>Billing & Invoices</h1>
        <button className="export-btn">
          <span className="icon-export"></span> Export CSV
        </button>
      </div>
      <div className="summary-cards">
        <div className="card total">
          <div className="card-icon">
            <span className="icon-total"></span>
          </div>
          <div className="card-content">
            <h3>Total Billed</h3>
            <p>৳85,420.00</p>
          </div>
        </div>
        <div className="card paid">
          <div className="card-icon">
            <span className="icon-paid"></span>
          </div>
          <div className="card-content">
            <h3>Paid</h3>
            <p>৳62,150.00</p>
          </div>
        </div>
        <div className="card pending">
          <div className="card-icon">
            <span className="icon-pending"></span>
          </div>
          <div className="card-content">
            <h3>Pending</h3>
            <p>৳18,270.00</p>
          </div>
        </div>
        <div className="card overdue">
          <div className="card-icon">
            <span className="icon-overdue"></span>
          </div>
          <div className="card-content">
            <h3>Overdue</h3>
            <p>৳5,000.00</p>
          </div>
        </div>
      </div>
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by invoice ID, customer, email..."
          />
        </div>
        <select className="filter-select">
          <option>All Status</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Partial</option>
          <option>Overdue</option>
        </select>
        <input type="date" className="date-input" placeholder="From Date" />
        <input type="date" className="date-input" placeholder="To Date" />
      </div>
      <div className="billing-table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Invoice ID">
                <span className="invoice-id">#INV-00124</span>
              </td>
              <td data-label="Customer">
                <div className="customer-info">
                  <div className="customer-name">Rahim Khan</div>
                  <div className="customer-email">rahim@example.com</div>
                </div>
              </td>
              <td data-label="Amount" className="amount paid">
                ৳12,500.00
              </td>
              <td data-label="Status">
                <span className="status paid">Paid</span>
              </td>
              <td data-label="Issue Date">Nov 05, 2025</td>
              <td data-label="Due Date">Nov 10, 2025</td>
              <td data-label="Actions">
                <div className="actions">
                  <button className="btn btn-view" title="View Invoice">
                    <span className="icon-view"></span>
                  </button>
                  <button className="btn btn-download" title="Download PDF">
                    <span className="icon-download"></span>
                  </button>
                  <button className="btn btn-email" title="Send Email">
                    <span className="icon-email"></span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td data-label="Invoice ID">
                <span className="invoice-id">#INV-00123</span>
              </td>
              <td data-label="Customer">
                <div className="customer-info">
                  <div className="customer-name">Ayesha Siddika</div>
                  <div className="customer-email">ayesha@company.com</div>
                </div>
              </td>
              <td data-label="Amount" className="amount pending">
                ৳8,750.00
              </td>
              <td data-label="Status">
                <span className="status pending">Pending</span>
              </td>
              <td data-label="Issue Date">Nov 08, 2025</td>
              <td data-label="Due Date">Nov 15, 2025</td>
              <td data-label="Actions">
                <div className="actions">
                  <button className="btn btn-view" title="View Invoice">
                    <span className="icon-view"></span>
                  </button>
                  <button className="btn btn-download" title="Download PDF">
                    <span className="icon-download"></span>
                  </button>
                  <button className="btn btn-email" title="Send Email">
                    <span className="icon-email"></span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td data-label="Invoice ID">
                <span className="invoice-id">#INV-00122</span>
              </td>
              <td data-label="Customer">
                <div className="customer-info">
                  <div className="customer-name">Karim Enterprise</div>
                  <div className="customer-email">billing@karim.biz</div>
                </div>
              </td>
              <td data-label="Amount" className="amount overdue">
                ৳5,000.00
              </td>
              <td data-label="Status">
                <span className="status overdue">Overdue</span>
              </td>
              <td data-label="Issue Date">Oct 28, 2025</td>
              <td data-label="Due Date" className="due-date overdue">
                Nov 04, 2025
              </td>
              <td data-label="Actions">
                <div className="actions">
                  <button className="btn btn-view" title="View Invoice">
                    <span className="icon-view"></span>
                  </button>
                  <button className="btn btn-download" title="Download PDF">
                    <span className="icon-download"></span>
                  </button>
                  <button className="btn btn-email" title="Send Email">
                    <span className="icon-email"></span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td data-label="Invoice ID">
                <span className="invoice-id">#INV-00121</span>
              </td>
              <td data-label="Customer">
                <div className="customer-info">
                  <div className="customer-name">Fatema Akter</div>
                  <div className="customer-email">fatema.shop@gmail.com</div>
                </div>
              </td>
              <td data-label="Amount" className="amount partial">
                ৳15,200.00
              </td>
              <td data-label="Status">
                <span className="status partial">Partial</span>
              </td>
              <td data-label="Issue Date">Nov 01, 2025</td>
              <td data-label="Due Date">Nov 12, 2025</td>
              <td data-label="Actions">
                <div className="actions">
                  <button className="btn btn-view" title="View Invoice">
                    <span className="icon-view"></span>
                  </button>
                  <button className="btn btn-download" title="Download PDF">
                    <span className="icon-download"></span>
                  </button>
                  <button className="btn btn-email" title="Send Email">
                    <span className="icon-email"></span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <div className="pagination-info">Showing 1 to 4 of 156 invoices</div>
        <div className="pagination-controls">
          <button className="page-btn disabled">
            <span className="icon-prev"></span>
          </button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">4</button>
          <button className="page-btn">5</button>
          <button className="page-btn">...</button>
          <button className="page-btn">39</button>
          <button className="page-btn">
            <span className="icon-next"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingInfo;
