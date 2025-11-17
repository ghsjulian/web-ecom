import React from 'react'

const Activity = () => {
  return (
            <div className="dashboard-card activity-card">
          <h3>Activity</h3>
          <ul className="dashboard-timeline" aria-live="polite">
            <li><strong>Julian</strong> published "Ultra Sneakers" • 2m</li>
            <li><strong>Payments</strong> processed $3,200 • 10m</li>
            <li><strong>Server</strong> backup succeeded • 1h</li>
            <li><strong>Anna</strong> left a review • 3h</li>
          </ul>
        </div>

  )
}

export default Activity