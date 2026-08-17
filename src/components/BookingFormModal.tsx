import React, { useState } from 'react';
import './BookingFormModal.css';
import { Icon } from '../App';
import { MaterialsListEditor, MaterialItem } from './MaterialsListEditor';

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: any) => void;
  providerName: string;
  providerService: string;
  providerImage?: string;
  basePrice?: string;
}

export default function BookingFormModal({
  isOpen,
  onClose,
  onSubmit,
  providerName,
  providerService,
  providerImage,
  basePrice = '1 Coin'
}: BookingFormModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('Nearby');
  const [duration, setDuration] = useState('1 Hour');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [urgency, setUrgency] = useState<'NORMAL' | 'URGENT' | 'EMERGENCY'>('NORMAL');
  const [notes, setNotes] = useState('');
  const [materialsList, setMaterialsList] = useState<MaterialItem[]>([]);
  const [requiresDiagnosis, setRequiresDiagnosis] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      alert('Please select both date and time.');
      return;
    }
    onSubmit({
      date,
      time,
      location,
      duration,
      budget: budgetAmount ? Number(budgetAmount) : 0,
      urgency,
      notes,
      materialsList,
      requiresDiagnosis,
      provider: providerName,
      service: providerService,
      price: basePrice,
      image: providerImage
    });
  };

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <div className="booking-modal-header">
          <h3>Book {providerName}</h3>
          <button className="btn-close-modal" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-modal-content">
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                className="input-field" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input 
                type="time" 
                className="input-field" 
                value={time} 
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                className="input-field" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Your neighborhood or city"
                required
              />
            </div>
            <div className="form-group">
              <label>Service Duration</label>
              <select 
                className="input-field" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="1 Hour">1 Hour</option>
                <option value="2-3 Hours">2 - 3 Hours</option>
                <option value="Half Day (4 Hours)">Half Day (4 Hours)</option>
                <option value="Full Day (8 Hours)">Full Day (8 Hours)</option>
                <option value="Multi-Day Project">Multi-Day Project</option>
                <option value="Flexible">Flexible / To be agreed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Proposed Job Budget (FCFA / XAF)</label>
            <input 
              type="number" 
              className="input-field" 
              value={budgetAmount} 
              onChange={(e) => setBudgetAmount(e.target.value)}
              placeholder="e.g. 15000"
              min="0"
            />
            <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
              Specify your estimated pay for this job. You pay the provider directly upon job completion.
            </span>
          </div>

          <div className="form-group">
            <label>Urgency Level</label>
            <div className="urgency-selector">
              <button 
                type="button"
                className={`urgency-btn ${urgency === 'NORMAL' ? 'active' : ''}`}
                onClick={() => setUrgency('NORMAL')}
              >
                Normal
              </button>
              <button 
                type="button"
                className={`urgency-btn ${urgency === 'URGENT' ? 'active' : ''}`}
                onClick={() => setUrgency('URGENT')}
              >
                Urgent
              </button>
              <button 
                type="button"
                className={`urgency-btn ${urgency === 'EMERGENCY' ? 'active emergency' : ''}`}
                onClick={() => setUrgency('EMERGENCY')}
              >
                Emergency
              </button>
            </div>
          </div>

          <MaterialsListEditor
            items={materialsList}
            onChangeItems={setMaterialsList}
            requiresDiagnosis={requiresDiagnosis}
            onToggleDiagnosis={setRequiresDiagnosis}
          />

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea 
              className="input-field" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the issue or any specific requirements..."
            />
          </div>

          <div className="booking-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-confirm">Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  );
}
