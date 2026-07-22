import React, { useState } from 'react';
import './PostTaskFlow.css';
import { Icon, IconName } from '../App';

interface PostTaskFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => void;
}

const CATEGORIES: { name: string; icon: IconName }[] = [
  { name: 'Plumbing', icon: 'plumbing' },
  { name: 'Electrical', icon: 'electrical' },
  { name: 'Cleaning', icon: 'cleaning' },
  { name: 'Painting', icon: 'painting' },
  { name: 'Carpentry', icon: 'wrench' },
  { name: 'Other', icon: 'search' }
];

const PREFERENCES = [
  { id: 'verified', label: 'Verified Professionals Only', icon: 'check' },
  { id: 'fast', label: 'Fast Response Needed', icon: 'lightning' },
  { id: 'rated', label: 'Highly Rated (4.5+)', icon: 'star' },
  { id: 'today', label: 'Available Today', icon: 'calendar' }
];

export default function PostTaskFlow({ isOpen, onClose, onSubmit }: PostTaskFlowProps) {
  const [step, setStep] = useState(1);

  // Step 1: Details
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Step 2: Scope
  const [location, setLocation] = useState('');
  const [budgetType, setBudgetType] = useState<'fixed' | 'range'>('fixed');
  const [budget, setBudget] = useState('');

  // Step 3: Schedule
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [preferences, setPreferences] = useState<string[]>(['verified']);

  if (!isOpen) return null;

  const togglePreference = (id: string) => {
    if (preferences.includes(id)) {
      setPreferences(preferences.filter(p => p !== id));
    } else {
      setPreferences([...preferences, id]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title || !category) {
        alert("Please provide a title and select a category.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!location || !budget) {
        alert("Please provide a location and budget.");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = () => {
    if (!date || !time) {
      alert("Please specify a date and time.");
      return;
    }
    onSubmit({
      title,
      category,
      description,
      location,
      budgetType,
      budget,
      date,
      time,
      preferences
    });
  };

  return (
    <div className="post-task-overlay">
      <div className="post-task-modal">
        <div className="post-task-header">
          <div>
            <h2>Post a Task</h2>
            <div className="step-indicator">
              <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
              <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`step-dot ${step >= 3 ? 'active' : ''}`}></div>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>

        <div className="post-task-content">
          {step === 1 && (
            <>
              <div className="form-group">
                <h4>What do you need help with?</h4>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Fix a leaking kitchen pipe" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <h4>Select Category</h4>
                <div className="categories-grid">
                  {CATEGORIES.map(cat => (
                    <div 
                      key={cat.name} 
                      className={`category-card ${category === cat.name ? 'selected' : ''}`}
                      onClick={() => setCategory(cat.name)}
                    >
                      <Icon name={cat.icon} />
                      <span>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <h4>Description (Optional)</h4>
                <textarea 
                  className="input-field" 
                  placeholder="Provide more details about the task..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <h4>Where is the task located?</h4>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Your neighborhood or area" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <h4>Budget</h4>
                <div className="urgency-selector" style={{ marginBottom: '1rem' }}>
                  <button 
                    className={`urgency-btn ${budgetType === 'fixed' ? 'active' : ''}`}
                    onClick={() => setBudgetType('fixed')}
                  >
                    Fixed Price
                  </button>
                  <button 
                    className={`urgency-btn ${budgetType === 'range' ? 'active' : ''}`}
                    onClick={() => setBudgetType('range')}
                  >
                    Price Range
                  </button>
                </div>
                
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder={budgetType === 'fixed' ? "e.g. 15000 XAF" : "e.g. 10000 - 25000 XAF"}
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <h4>Date</h4>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <h4>Time</h4>
                  <input 
                    type="time" 
                    className="input-field" 
                    value={time}
                    onChange={e => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <h4>Preferences</h4>
                <div className="preferences-grid">
                  {PREFERENCES.map(pref => (
                    <div 
                      key={pref.id}
                      className={`preference-card ${preferences.includes(pref.id) ? 'selected' : ''}`}
                      onClick={() => togglePreference(pref.id)}
                    >
                      <Icon name={pref.icon as IconName} />
                      <span>{pref.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="post-task-footer">
          {step > 1 ? (
            <button className="btn-cancel" onClick={() => setStep(step - 1)}>Back</button>
          ) : (
            <div></div> // Spacer
          )}
          
          {step < 3 ? (
            <button className="btn-confirm" onClick={handleNext}>Next Step</button>
          ) : (
            <button className="btn-confirm" onClick={handleSubmit}>Publish Task</button>
          )}
        </div>
      </div>
    </div>
  );
}
