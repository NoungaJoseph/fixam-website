import './MyTasks.css';
import React, { useState } from 'react';
import { Icon } from '../../App';
import PostJobModal from '../../components/PostJobModal';
import { api } from '../../services/api';

interface MyTasksProps {
  clientTasks: any[];
  setClientTasks: (tasks: any[]) => void;
  setActiveTab: (tab: string) => void;
  walletBalance?: number;
  clientBookings?: any[];
  savedProsState?: any[];
  setSelectedTask?: (task: any) => void;
}

export default function MyTasks({ clientTasks, setClientTasks, setActiveTab, walletBalance = 0, clientBookings = [], savedProsState = [], setSelectedTask }: MyTasksProps) {
  const [isPostTaskOpen, setIsPostTaskOpen] = useState(false);

  const handleJobCreated = (newJob: any) => {
    setClientTasks([newJob, ...clientTasks]);
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
          <strong className="metric-big-num">{savedProsState.length}</strong>
          <span className="metric-card-desc">Saved</span>
          <span className="metric-view-all">View all &gt;</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-transparent border-0 p-0 w-full task-list-panel">
          <div className="dash-panel-header-new">
            <h2>My Posted Tasks</h2>
          </div>
          <div className="posted-tasks-list max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {clientTasks.map((tk) => {
              const tkId = tk.id || tk._id;
              const tag = tk.category?.name || tk.categoryId || 'General';
              const price = tk.budget ? `${tk.budget} XAF` : '';
              const bids = tk.applications?.length || 0;
              const status = tk.status || 'PENDING';

              return (
              <div 
                className="task-detailed-card cursor-pointer hover:border-teal-300 transition-colors" 
                key={tkId}
                onClick={() => {
                  if (setSelectedTask) setSelectedTask(tk);
                  setActiveTab('Task Details');
                }}
              >
                <div className="task-card-header">
                  <span className="task-tag">{tag}</span>
                  {price && <strong className="task-price">{price}</strong>}
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
                    <button className="btn-view-offers" onClick={(e) => {
                      e.stopPropagation();
                      alert(`Viewing ${bids} offers from local professionals.`);
                    }}>
                      View Offers
                    </button>
                  )}
                  {status !== 'COMPLETED' && status !== 'CANCELLED' && (
                  <button className="btn-delete-task" onClick={async (e) => {
                    e.stopPropagation();
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
        </div>

        <div className="bg-transparent border-0 p-0 w-full flex flex-col">
          <div className="dash-panel-premium w-full h-full p-6 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
              <Icon name="briefcase" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Post a New Task</h3>
            <p className="text-gray-500 mb-6 max-w-sm">Need help with something? Create a new task to start receiving offers from verified professionals in your area.</p>
            <button className="bg-[#14B8A6] text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-[#0F9788] transition-colors" onClick={() => setIsPostTaskOpen(true)}>
              + Create Task
            </button>
          </div>
        </div>
      </div>
      
      <PostJobModal
        isOpen={isPostTaskOpen}
        onClose={() => setIsPostTaskOpen(false)}
        onSuccess={handleJobCreated}
      />
    </div>
  );
}
