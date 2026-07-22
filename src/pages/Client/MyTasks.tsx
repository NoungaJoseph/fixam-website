import './MyTasks.css';
import React, { useState } from 'react';
import { Icon } from '../../App';
import PostTaskFlow from '../../components/PostTaskFlow';
import { api } from '../../services/api';

interface MyTasksProps {
  clientTasks: any[];
  setClientTasks: (tasks: any[]) => void;
  setActiveTab: (tab: string) => void;
  walletBalance?: number;
  clientBookings?: any[];
}

export default function MyTasks({ clientTasks, setClientTasks, setActiveTab, walletBalance = 0, clientBookings = [] }: MyTasksProps) {
  const [isPostTaskOpen, setIsPostTaskOpen] = useState(false);

  const handlePostTaskSubmit = async (taskData: any) => {
    try {
      const res = await api.post('/jobs', {
        title: taskData.title,
        description: taskData.description || 'New task',
        budget: Number(taskData.budget),
        categoryId: taskData.category,
        location: 'Remote',
        urgencyLevel: 'NORMAL'
      });
      setClientTasks([res.data.job, ...clientTasks]);
      setIsPostTaskOpen(false);
      alert("Task published successfully!");
    } catch (err: any) {
      alert("Failed to publish task: " + err.response?.data?.message);
    }
  };

  const activeTasksCount = clientTasks.filter((t: any) => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;
  const completedCount = clientTasks.filter((t: any) => t.status === 'COMPLETED').length;

  return (
    <div className="my-tasks-tab-wrapper animate-fade-in">
      {/* Stats Cards Section - 3 up, 2 down with space */}
      <div className="dash-metrics-grid">
        <div className="metric-card-premium m-bookings" onClick={() => setActiveTab('My Bookings')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Bookings</span>
            <div className="metric-icon-box"><Icon name="calendar" /></div>
          </div>
          <strong className="metric-big-num">{clientBookings.length}</strong>
          <span className="metric-card-desc">Total Bookings</span>
        </div>

        <div className="metric-card-premium m-active" onClick={() => setActiveTab('My Tasks')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Active Tasks</span>
            <div className="metric-icon-box"><Icon name="briefcase" /></div>
          </div>
          <strong className="metric-big-num">{activeTasksCount}</strong>
          <span className="metric-card-desc">In Progress/Pending</span>
          <span className="metric-view-all">View all &gt;</span>
        </div>

        <div className="metric-card-premium m-completed">
          <div className="metric-card-header">
            <span>Completed</span>
            <div className="metric-icon-box"><Icon name="check" /></div>
          </div>
          <strong className="metric-big-num">{completedCount}</strong>
          <span className="metric-card-desc">Jobs Completed</span>
        </div>

        <div className="metric-card-premium m-coins" onClick={() => setActiveTab('Wallet & Coins')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Coins Balance</span>
            <div className="metric-icon-box"><Icon name="wallet" /></div>
          </div>
          <strong className="metric-big-num">{walletBalance.toLocaleString()}</strong>
          <span className="metric-card-desc">Available Coins</span>
          <button className="coins-plus-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('Wallet & Coins'); }}>+</button>
        </div>

        <div className="metric-card-premium m-saved" onClick={() => setActiveTab('Saved Providers')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Saved Providers</span>
            <div className="metric-icon-box"><Icon name="star" /></div>
          </div>
          <strong className="metric-big-num">0</strong>
          <span className="metric-card-desc">Saved</span>
          <span className="metric-view-all">View all &gt;</span>
        </div>
      </div>

      <div className="tasks-container-grid">
        <div className="bg-transparent border-0 p-0 w-full task-list-panel">
          <div className="dash-panel-header-new">
            <h2>My Posted Tasks</h2>
          </div>
          <div className="posted-tasks-list">
            {clientTasks.map((tk) => {
              const tkId = tk.id || tk._id;
              const tag = tk.category?.name || tk.categoryId || 'General';
              const price = tk.budget ? `${tk.budget} XAF` : 'Open';
              const bids = tk.applications?.length || 0;
              const status = tk.status || 'PENDING';

              return (
              <div className="task-detailed-card" key={tkId}>
                <div className="task-card-header">
                  <span className="task-tag">{tag}</span>
                  <strong className="task-price">{price}</strong>
                </div>
                <h3>{tk.title}</h3>
                <div className="task-card-footer">
                  <span className={`task-status-pill ${status.toLowerCase().replace(' ', '-')}`}>
                    {status}
                  </span>
                  <span className="task-bids-count">
                    <Icon name="user" /> {bids} offers received
                  </span>
                </div>
                <div className="task-actions-row">
                  {bids > 0 && (
                    <button className="btn-view-offers" onClick={() => alert(`Viewing ${bids} offers from local professionals.`)}>
                      View Offers
                    </button>
                  )}
                  {status !== 'COMPLETED' && status !== 'CANCELLED' && (
                  <button className="btn-delete-task" onClick={async () => {
                    if (confirm("Are you sure you want to remove this task?")) {
                      try {
                        await api.patch(`/jobs/${tkId}/status`, { status: 'CANCELLED' });
                        setClientTasks(clientTasks.map(t => (t.id || t._id) === tkId ? {...t, status: 'CANCELLED'} : t));
                      } catch (err) {
                        alert("Failed to cancel task");
                      }
                    }
                  }}>Cancel Task</button>
                  )}
                </div>
              </div>
            )})}
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
