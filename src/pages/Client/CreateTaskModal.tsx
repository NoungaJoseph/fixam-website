import React, { useState } from 'react';
import { Icon } from '../../App';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: '', category: '', description: '', location: '', budget: '' });
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  if (!isOpen) return null;

  const hasData = Object.values(formData).some(val => val.trim() !== '');

  const handleCloseAttempt = () => {
    if (hasData) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const handleDiscard = () => {
    setFormData({ title: '', category: '', description: '', location: '', budget: '' });
    setStep(1);
    setShowConfirmClose(false);
    onClose();
  };

  const handleSaveDraft = () => {
    alert("Draft saved!");
    setShowConfirmClose(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '700px',
        maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }}>
        {showConfirmClose ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>Unsaved Changes</h2>
            <p style={{ color: '#64748B', marginBottom: '2rem' }}>You have entered some details for this task. Do you want to save it as a draft or discard?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={handleDiscard} style={{ padding: '0.8rem 1.5rem', background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Discard All</button>
              <button onClick={handleSaveDraft} style={{ padding: '0.8rem 1.5rem', background: '#14B8A6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Save Draft</button>
              <button onClick={() => setShowConfirmClose(false)} style={{ padding: '0.8rem 1.5rem', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Create a New Task</h2>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>Step {step} of 3</p>
              </div>
              <button onClick={handleCloseAttempt} style={{ background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                <Icon name="x" />
              </button>
            </div>

            <div style={{ padding: '2rem', flex: 1 }}>
              {step === 1 && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1E293B' }}>What do you need help with?</h3>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Task Title</label>
                    <input type="text" placeholder="e.g. Fix leaking kitchen sink" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.95rem' }} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Category</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.95rem', background: '#fff' }}>
                      <option value="">Select a category</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="carpentry">Carpentry</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1E293B' }}>Task Details</h3>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Description</label>
                    <textarea rows={4} placeholder="Describe what you need done..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.95rem', resize: 'vertical' }} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Location</label>
                    <input type="text" placeholder="Enter your address" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.95rem' }} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1E293B' }}>Budget & Review</h3>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Estimated Budget (XAF)</label>
                    <input type="number" placeholder="e.g. 15000" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.95rem' }} />
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}><strong>Title:</strong> {formData.title || 'N/A'}</p>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}><strong>Category:</strong> {formData.category || 'N/A'}</p>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}><strong>Location:</strong> {formData.location || 'N/A'}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}><strong>Budget:</strong> {formData.budget ? `${formData.budget} XAF` : 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', background: '#F8FAFC' }}>
              <button 
                onClick={() => step > 1 ? setStep(step - 1) : handleCloseAttempt()} 
                style={{ padding: '0.75rem 1.5rem', background: '#fff', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
              >
                {step > 1 ? 'Back' : 'Cancel'}
              </button>
              
              <button 
                onClick={() => {
                  if (step < 3) setStep(step + 1);
                  else { alert("Task Created!"); handleDiscard(); }
                }} 
                style={{ padding: '0.75rem 2rem', background: '#14B8A6', border: 'none', borderRadius: '8px', fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(20, 184, 166, 0.2)' }}
              >
                {step < 3 ? 'Next Step' : 'Post Task'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
