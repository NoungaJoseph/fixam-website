import { useState } from 'react';

export default function ProfileSettings() {
  const [category, setCategory] = useState('Plumbing');
  const [experience, setExperience] = useState('3-5 years');
  const [bio, setBio] = useState('Experienced plumbing professional in Douala. Specialized in leak detection, emergency kitchen repairs, and complete bathroom refurbishments.');
  const [availability, setAvailability] = useState('Available');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile settings saved successfully!');
  };

  return (
    <div className="dash-panel-premium animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="dash-panel-header-new">
        <h2>Profile & Service Settings</h2>
      </div>

      <form onSubmit={handleSave} style={{ marginTop: '24px' }}>
        {/* Profile photo placeholder */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E2E8F0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'
          }}>
            👨‍🔧
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Nounga Joseph</h4>
            <span style={{ fontSize: '13px', color: '#6B7280', display: 'block', marginBottom: '8px' }}>Douala, Cameroon</span>
            <button
              type="button"
              onClick={() => alert('Photo upload flow coming soon!')}
              style={{
                backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px',
                padding: '6px 12px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer'
              }}
            >
              Change Photo
            </button>
          </div>
        </div>

        {/* Form groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#4B5563', marginBottom: '6px' }}>Service Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%', height: '44px', borderRadius: '6px', border: '1px solid #D1D5DB',
                padding: '0 12px', fontSize: '14px', boxSizing: 'border-box'
              }}
            >
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Repairs">Repairs & Maintenance</option>
              <option value="Beauty">Beauty & Wellness</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#4B5563', marginBottom: '6px' }}>Years of Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              style={{
                width: '100%', height: '44px', borderRadius: '6px', border: '1px solid #D1D5DB',
                padding: '0 12px', fontSize: '14px', boxSizing: 'border-box'
              }}
            >
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1-2 years">1-2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5-10 years">5-10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#4B5563', marginBottom: '6px' }}>Availability Status</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              style={{
                width: '100%', height: '44px', borderRadius: '6px', border: '1px solid #D1D5DB',
                padding: '0 12px', fontSize: '14px', boxSizing: 'border-box'
              }}
            >
              <option value="Available">Available for Work</option>
              <option value="Busy">Currently Busy</option>
              <option value="Offline">Offline / On Leave</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#4B5563', marginBottom: '6px' }}>About Me (Bio)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              style={{
                width: '100%', borderRadius: '6px', border: '1px solid #D1D5DB',
                padding: '12px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical'
              }}
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: '28px', width: '100%', height: '48px', backgroundColor: '#14B8A6', color: 'white',
            border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', transition: 'all 200ms ease'
          }}
        >
          Save Profile Changes
        </button>
      </form>
    </div>
  );
}
