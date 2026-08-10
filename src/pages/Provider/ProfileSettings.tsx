import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import './ProfileSettings.css';

type Certificate = {
  title: string;
  issuer: string;
  year: string;
  imageUrl?: string;
};

export default function ProfileSettings() {
  const { user, refreshUser } = useAuth();

  // Basic Information States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [dob, setDob] = useState('');

  // Professional Details States
  const [bio, setBio] = useState('');
  const [rate, setRate] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');

  // Skills States
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Certificates States
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certYear, setCertYear] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);

  // Global UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingCert, setIsUploadingCert] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.fullName?.split(' ')[0] || '');
      setLastName(user.lastName || user.fullName?.split(' ')[1] || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setDob(user.dob ? new Date(user.dob).toISOString().split('T')[0] : '');

      if (user.providerProfile) {
        setBio(user.providerProfile.bio || '');
        setRate(user.providerProfile.rate ? String(user.providerProfile.rate) : '');
        setServiceArea(user.providerProfile.serviceArea || '');
        setExperienceLevel(user.providerProfile.experienceLevel || 'Intermediate');
        setSkills(Array.isArray(user.providerProfile.skills) ? user.providerProfile.skills : []);
        setCertificates(Array.isArray(user.providerProfile.certificates) ? user.providerProfile.certificates : []);
      }
    }
  }, [user]);

  // Uploading Profile Photo
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploadingPhoto(true);
    setUploadStatus('Uploading profile image...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/upload/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const avatarUrl = response.data?.url || response.data?.data?.url;
      if (avatarUrl) {
        await api.put('/users/profile', { avatar: avatarUrl });
        await refreshUser();
        alert('Profile photo updated successfully!');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setIsUploadingPhoto(false);
      setUploadStatus('');
    }
  };

  // Add Skill Pill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkill = newSkill.trim();
    if (!cleanSkill) return;
    if (skills.includes(cleanSkill)) {
      setNewSkill('');
      return;
    }
    setSkills([...skills, cleanSkill]);
    setNewSkill('');
  };

  // Remove Skill Pill
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Add Certificate Flow
  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim() || !certYear.trim()) {
      return alert('Please fill in certificate Title, Issuer, and Year');
    }

    setIsUploadingCert(true);
    setUploadStatus('Uploading certificate document...');

    try {
      let documentUrl = '';
      if (certFile) {
        const formData = new FormData();
        formData.append('file', certFile);
        const response = await api.post('/upload/portfolio', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        documentUrl = response.data?.url || response.data?.data?.url || '';
      }

      const newCert: Certificate = {
        title: certTitle.trim(),
        issuer: certIssuer.trim(),
        year: certYear.trim(),
        imageUrl: documentUrl || undefined
      };

      const updatedCerts = [...certificates, newCert];
      
      await api.put('/users/profile', { certificates: updatedCerts });
      await refreshUser();
      
      setCertificates(updatedCerts);
      setCertTitle('');
      setCertIssuer('');
      setCertYear('');
      setCertFile(null);
      
      // Reset input element
      const fileInput = document.getElementById('cert-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      alert('Certificate added successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add certificate');
    } finally {
      setIsUploadingCert(false);
      setUploadStatus('');
    }
  };

  // Delete Certificate
  const handleDeleteCertificate = async (idx: number) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    
    try {
      const updatedCerts = certificates.filter((_, i) => i !== idx);
      await api.put('/users/profile', { certificates: updatedCerts });
      await refreshUser();
      setCertificates(updatedCerts);
      alert('Certificate deleted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete certificate');
    }
  };

  // Save General Profile Info
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      dob: dob ? new Date(dob).toISOString() : null,
      bio: bio.trim(),
      rate: rate ? parseFloat(rate) : null,
      serviceArea: serviceArea.trim(),
      experienceLevel,
      skills
    };

    try {
      await api.put('/users/profile', payload);
      await refreshUser();
      alert('Profile details updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save profile changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-settings-page animate-fade-in">
      <div className="settings-header">
        <h2>Profile & Work Settings</h2>
        <p>Manage your public professional profile, hourly rates, skills, and certifications.</p>
      </div>

      <div className="settings-split-grid">
        {/* Left Form: Details & Skills */}
        <div className="settings-left-col">
          <form onSubmit={handleSaveProfile} className="settings-main-form">
            
            {/* Avatar Section */}
            <div className="settings-panel photo-panel">
              <h3>Profile Picture</h3>
              <div className="avatar-uploader-row">
                <div className="avatar-frame">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Provider avatar" />
                  ) : (
                    <div className="avatar-placeholder">👨‍🔧</div>
                  )}
                  {isUploadingPhoto && <div className="avatar-loading-overlay">⌛</div>}
                </div>
                <div className="uploader-controls">
                  <h4>{user?.fullName || 'Professional Provider'}</h4>
                  <p>{user?.email}</p>
                  <label className="btn-file-select">
                    Change Profile Photo
                    <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={isUploadingPhoto} />
                  </label>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="settings-panel">
              <h3>Personal Information</h3>
              <div className="form-row-two">
                <div className="settings-field">
                  <label>First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="settings-field">
                  <label>Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              <div className="form-row-two">
                <div className="settings-field">
                  <label>Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="settings-field">
                  <label>Date of Birth</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
              </div>

              <div className="settings-field">
                <label>Base Location (City/Region)</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>

            {/* Service & Rate Details */}
            <div className="settings-panel">
              <h3>Professional Profile</h3>
              <div className="form-row-three">
                <div className="settings-field">
                  <label>Hourly Rate (XAF)</label>
                  <input type="number" placeholder="3500" value={rate} onChange={(e) => setRate(e.target.value)} />
                </div>
                <div className="settings-field">
                  <label>Service Area Coverage</label>
                  <input type="text" placeholder="e.g. Douala V, Akwa" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
                </div>
                <div className="settings-field">
                  <label>Experience Level</label>
                  <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                    <option value="Beginner">Beginner (1-2 years)</option>
                    <option value="Intermediate">Intermediate (3-5 years)</option>
                    <option value="Expert">Expert (5+ years)</option>
                  </select>
                </div>
              </div>

              <div className="settings-field">
                <label>About Me / Professional Bio</label>
                <textarea rows={4} placeholder="Write a short summary about your background, tools, and specialty services..." value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
            </div>

            {/* Skills Tag Management */}
            <div className="settings-panel">
              <h3>My Skills</h3>
              <p className="panel-subtext">Add skills or keywords to help clients find you in search results.</p>
              
              <div className="skills-tags-container">
                {skills.length === 0 ? (
                  <span className="no-skills-tag">No skills listed. Add some skills below!</span>
                ) : (
                  skills.map((skill, index) => (
                    <span className="skill-pill-tag animate-fade-in" key={index}>
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="btn-skill-remove">
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="skill-add-form-group">
                <input
                  type="text"
                  placeholder="e.g. Pipe Welding, Lighting installation..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                />
                <button type="button" onClick={handleAddSkill} className="btn-skill-add">
                  Add Skill
                </button>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="settings-submit-row">
              {uploadStatus && (
                <div className="upload-status-pills animate-fade-in">
                  <span>⌛ {uploadStatus}</span>
                </div>
              )}
              <button type="submit" className="btn-save-settings-main" disabled={isSubmitting || isUploadingPhoto || isUploadingCert}>
                {isSubmitting ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Certificates & Documents */}
        <div className="settings-right-col">
          {/* Add Certificate panel */}
          <div className="settings-panel cert-add-panel">
            <h3>Add Certificate / Credentials</h3>
            <p className="panel-subtext">Verify your credentials to increase your credibility index.</p>
            
            <form onSubmit={handleAddCertificate} className="cert-subform">
              <div className="settings-field">
                <label>Certificate Title *</label>
                <input type="text" required placeholder="e.g. Master Plumber Certificate" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} />
              </div>
              
              <div className="settings-field">
                <label>Issuing Institution *</label>
                <input type="text" required placeholder="e.g. National Technical Institute" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} />
              </div>

              <div className="form-row-two">
                <div className="settings-field">
                  <label>Year Issued *</label>
                  <input type="number" required placeholder="2025" value={certYear} onChange={(e) => setCertYear(e.target.value)} />
                </div>
                <div className="settings-field">
                  <label>Upload Document / Badge</label>
                  <input
                    type="file"
                    id="cert-file-input"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      if (e.target.files) setCertFile(e.target.files[0]);
                    }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-cert-add-submit" disabled={isUploadingCert}>
                {isUploadingCert ? 'Uploading & Adding...' : '+ Add Certificate'}
              </button>
            </form>
          </div>

          {/* Certificates list panel */}
          <div className="settings-panel cert-list-panel">
            <h3>My Certificates ({certificates.length})</h3>
            
            {certificates.length === 0 ? (
              <div className="empty-certificates-state">
                <span className="cert-empty-icon">📜</span>
                <p>No certifications added yet. Uploading credentials can boost client bookings by up to 40%.</p>
              </div>
            ) : (
              <div className="certificates-grid-list">
                {certificates.map((cert, index) => (
                  <div className="certificate-item-card" key={index}>
                    <div className="cert-details">
                      <h4>{cert.title}</h4>
                      <p className="cert-meta">{cert.issuer} • Issued {cert.year}</p>
                      {cert.imageUrl && (
                        <a href={cert.imageUrl} target="_blank" rel="noopener noreferrer" className="cert-doc-link">
                          👁️ View Attachment
                        </a>
                      )}
                    </div>
                    <button type="button" className="btn-delete-cert" onClick={() => handleDeleteCertificate(index)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
