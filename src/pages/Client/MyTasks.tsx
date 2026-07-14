import './MyTasks.css';
import React, { useState } from 'react';
import { Icon } from '../../App';
import PostTaskFlow from '../../components/PostTaskFlow';

interface MyTasksProps {
  clientTasks: any[];
  setClientTasks: (tasks: any[]) => void;
  setActiveTab: (tab: string) => void;
}

export default function MyTasks({ clientTasks, setClientTasks, setActiveTab }: MyTasksProps) {
  const [isPostTaskOpen, setIsPostTaskOpen] = useState(false);

  const handlePostTaskSubmit = (taskData: any) => {
    const newT = {
      id: Date.now(),
      title: taskData.title,
      tag: taskData.category,
      price: taskData.budget + (taskData.budgetType === 'fixed' ? ' XAF' : ''),
      status: 'Pending Offers',
      bids: 0
    };
    setClientTasks([newT, ...clientTasks]);
    setIsPostTaskOpen(false);
    alert("Task published successfully!");
  };

  return (
    <div className="my-tasks-tab-wrapper animate-fade-in">
      {/* Stats Cards Section - 3 up, 2 down with space */}
      <div className="dash-metrics-grid">
        <div className="metric-card-premium m-bookings" onClick={() => setActiveTab('My Bookings')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Bookings</span>
            <div className="metric-icon-box"><Icon name="calendar" /></div>
          </div>
          <strong className="metric-big-num">12</strong>
          <span className="metric-card-desc">Total Bookings</span>
          <span className="metric-trend trend-up">↑ 20% this month</span>
        </div>

        <div className="metric-card-premium m-active" onClick={() => setActiveTab('My Tasks')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Active Tasks</span>
            <div className="metric-icon-box"><Icon name="briefcase" /></div>
          </div>
          <strong className="metric-big-num">4</strong>
          <span className="metric-card-desc">In Progress</span>
          <span className="metric-view-all">View all &gt;</span>
        </div>

        <div className="metric-card-premium m-completed">
          <div className="metric-card-header">
            <span>Completed</span>
            <div className="metric-icon-box"><Icon name="check" /></div>
          </div>
          <strong className="metric-big-num">8</strong>
          <span className="metric-card-desc">Jobs Completed</span>
          <span className="metric-trend trend-up">↑ 15% this month</span>
        </div>

        <div className="metric-card-premium m-coins" onClick={() => setActiveTab('Wallet & Coins')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Coins Balance</span>
            <div className="metric-icon-box"><Icon name="wallet" /></div>
          </div>
          <strong className="metric-big-num">1,250</strong>
          <span className="metric-card-desc">Available Coins</span>
          <button className="coins-plus-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('Wallet & Coins'); }}>+</button>
        </div>

        <div className="metric-card-premium m-saved" onClick={() => setActiveTab('Saved Providers')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Saved Providers</span>
            <div className="metric-icon-box"><Icon name="star" /></div>
          </div>
          <strong className="metric-big-num">18</strong>
          <span className="metric-card-desc">Saved</span>
          <span className="metric-view-all">View all &gt;</span>
        </div>
      </div>

      <div className="tasks-container-grid">
        <div className="dash-panel-premium task-list-panel">
          <div className="dash-panel-header-new">
            <h2>My Posted Tasks</h2>
          </div>
          <div className="posted-tasks-list">
            {clientTasks.map((tk) => (
              <div className="task-detailed-card" key={tk.id}>
                <div className="task-card-header">
                  <span className="task-tag">{tk.tag}</span>
                  <strong className="task-price">{tk.price}</strong>
                </div>
                <h3>{tk.title}</h3>
                <div className="task-card-footer">
                  <span className={`task-status-pill ${tk.status.toLowerCase().replace(' ', '-')}`}>
                    {tk.status}
                  </span>
                  <span className="task-bids-count">
                    <Icon name="user" /> {tk.bids} offers received
                  </span>
                </div>
                <div className="task-actions-row">
                  {tk.bids > 0 && (
                    <button className="btn-view-offers" onClick={() => alert(`Viewing ${tk.bids} offers from local professionals.`)}>
                      View Offers
                    </button>
                  )}
                  <button className="btn-delete-task" onClick={() => {
                    if (confirm("Are you sure you want to remove this task?")) {
                      setClientTasks(clientTasks.filter(t => t.id !== tk.id));
                    }
                  }}>Cancel Task</button>
                </div>
              </div>
            ))}
          </div>
          <div className="dash-panel-premium full-width-panel" style={{ marginTop: '2rem' }}>
            <div className="dash-panel-header-new">
              <h3>Post a New Task</h3>
              <button className="btn-tab-action" onClick={() => setIsPostTaskOpen(true)}>
                + Create Task
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <PostTaskFlow 
        isOpen={isPostTaskOpen} 
        onClose={() => setIsPostTaskOpen(false)} 
        onSubmit={handlePostTaskSubmit} 
      />
    </div>
  );
}
