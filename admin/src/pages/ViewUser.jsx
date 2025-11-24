import React from "react";
import "../styles/view-user.css";

const ViewUser = () => {
  return (
    <>
      <div className="user-header">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="User Photo"
          className="user-photo"
        />
        <div className="user-info">
          <h2>Md. Rahman Khan</h2>
          <span className="role">Premium Member</span>
          <div className="email">rahman.khan@example.com</div>
          <div style={{ marginTop: "0.5rem" }}>
            <span className="status-badge status-active">Active</span>
          </div>
        </div>
        <div className="user-actions">
          <button className="btn btn-primary">
            <i className="fas fa-edit"></i> Edit User
          </button>
          <button className="btn btn-outline">
            <i className="fas fa-envelope"></i> Send Message
          </button>
          <button className="btn btn-danger">
            <i className="fas fa-ban"></i> Suspend
          </button>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>
            <i className="fas fa-user"></i> Personal Information
          </h3>
          <div className="info-item">
            <span className="info-label">User ID</span>
            <span className="info-value">#USR-8429</span>
          </div>
          <div className="info-item">
            <span className="info-label">Full Name</span>
            <span className="info-value">Md. Rahman Khan</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone</span>
            <span className="info-value">+880 17xxx xxxxx</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date of Birth</span>
            <span className="info-value">15 Mar 1992</span>
          </div>
          <div className="info-item">
            <span className="info-label">Gender</span>
            <span className="info-value">Male</span>
          </div>
        </div>
        <div className="info-card">
          <h3>
            <i className="fas fa-map-marker-alt"></i> Address
          </h3>
          <div className="info-item">
            <span className="info-label">Street</span>
            <span className="info-value">House 12, Road 5, Block B</span>
          </div>
          <div className="info-item">
            <span className="info-label">City</span>
            <span className="info-value">Dhaka</span>
          </div>
          <div className="info-item">
            <span className="info-label">Area</span>
            <span className="info-value">Mirpur</span>
          </div>
          <div className="info-item">
            <span className="info-label">Postal Code</span>
            <span className="info-value">1216</span>
          </div>
          <div className="info-item">
            <span className="info-label">Country</span>
            <span className="info-value">Bangladesh</span>
          </div>
        </div>
        <div className="info-card">
          <h3>
            <i className="fas fa-chart-line"></i> Account Statistics
          </h3>
          <div className="info-item">
            <span className="info-label">Joined Date</span>
            <span className="info-value">12 Jun 2023</span>
          </div>
          <div className="info-item">
            <span className="info-label">Last Login</span>
            <span className="info-value">10 Nov 2025, 07:15 PM</span>
          </div>
          <div className="info-item">
            <span className="info-label">Total Orders</span>
            <span className="info-value">47</span>
          </div>
          <div className="info-item">
            <span className="info-label">Total Spent</span>
            <span className="info-value">BDT 38,450</span>
          </div>
          <div className="info-item">
            <span className="info-label">Account Status</span>
            <span className="info-value">
              <span className="status-badge status-active">Active</span>
            </span>
          </div>
        </div>

        <div className="info-card">
          <h3>
            <i className="fas fa-cog"></i> Preferences
          </h3>
          <div className="info-item">
            <span className="info-label">Language</span>
            <span className="info-value">English / বাংলা</span>
          </div>
          <div className="info-item">
            <span className="info-label">Currency</span>
            <span className="info-value">BDT (৳)</span>
          </div>
          <div className="info-item">
            <span className="info-label">Newsletter</span>
            <span className="info-value">Subscribed</span>
          </div>
          <div className="info-item">
            <span className="info-label">SMS Alerts</span>
            <span className="info-value">Enabled</span>
          </div>
          <div className="info-item">
            <span className="info-label">2FA</span>
            <span className="info-value">Enabled</span>
          </div>
        </div>
      </div>

      <div className="info-card">
        <h3>
          <i className="fas fa-history"></i> Recent Activity
        </h3>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-content">
              <div className="timeline-title">Placed Order #1247</div>
              <div className="timeline-time">Today, 06:42 PM</div>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <div className="timeline-title">Updated Profile Picture</div>
              <div className="timeline-time">Yesterday, 03:15 PM</div>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <div className="timeline-title">
                Reviewed Product: Wireless Earbuds
              </div>
              <div className="timeline-time">Nov 8, 2025, 11:20 AM</div>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <div className="timeline-title">Password Changed</div>
              <div className="timeline-time">Nov 5, 2025, 09:30 PM</div>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <div className="timeline-title">Account Created</div>
              <div className="timeline-time">Jun 12, 2023, 02:10 PM</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewUser;
