import React from 'react'

const SalesChart = () => {
  return (
    <div className="dashboard-card chart-card">
          <div className="dashboard-card-head">
            <h3>Sales — Last 30 days</h3>
            <div className="muted">Auto-updated</div>
          </div>
          <div className="chart-placeholder" role="img" aria-label="Area chart placeholder"> 
            <div className="line l1"></div>
            <div className="line l2"></div>
            <div className="line l3"></div>
            <div className="line l4"></div>
            <div className="line l5"></div>
            <div className="line l6"></div>
            <div className="line l7"></div>
            <div className="line l8"></div>
            <div className="line l9"></div>
            <div className="line l10"></div>
          </div>
        </div>
          )
}

export default SalesChart