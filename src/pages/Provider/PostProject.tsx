import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Icon, getMediaUrl } from '../../App';
import './PostProject.css';

interface PostProjectProps {
  setActiveTab: (tab: string) => void;
}

type PackageTier = {
  enabled: boolean;
  name: string;
  summary: string;
  price: string;
  deliveryDays: string;
  revisions: string;
  expressDeliveryEnabled: boolean;
  expressDeliveryDays: string;
  expressDeliveryPrice: string;
  features: string[];
};

type ProjectItem = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  images?: string[];
  video?: string | null;
  videoUrl?: string | null;
  videos?: string[];
  category: string;
  price?: number;
  packages?: {
    basic: PackageTier;
    standard: PackageTier;
    premium: PackageTier;
  };
  createdAt?: string;
};

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Plumbing Services',
  'Electrical Works',
  'House Cleaning',
  'Home Painting',
  'Carpentry',
  'Appliance Repair',
  'Beauty & Makeup',
  'Tiling & Masonry',
  'CCTV & Security',
  'Academic Tutoring',
  'Graphic Design',
  'Other'
];

export default function PostProject({ setActiveTab }: PostProjectProps) {
  const { user, refreshUser } = useAuth();
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategorySelected, setIsCustomCategorySelected] = useState(false);
  const [description, setDescription] = useState('');

  // Media
  const [localImageFiles, setLocalImageFiles] = useState<File[]>([]);
  const [localVideoFiles, setLocalVideoFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);

  const [activeTierId, setActiveTierId] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const [tierData, setTierData] = useState<{
    basic: PackageTier;
    standard: PackageTier;
    premium: PackageTier;
  }>({
    basic: {
      enabled: false,
      name: 'Basic Package',
      summary: '',
      price: '',
      deliveryDays: '',
      revisions: '',
      expressDeliveryEnabled: false,
      expressDeliveryDays: '2',
      expressDeliveryPrice: '',
      features: ['']
    },
    standard: {
      enabled: true,
      name: 'Standard Package',
      summary: '',
      price: '',
      deliveryDays: '',
      revisions: '',
      expressDeliveryEnabled: false,
      expressDeliveryDays: '3',
      expressDeliveryPrice: '',
      features: ['']
    },
    premium: {
      enabled: false,
      name: 'Premium Package',
      summary: '',
      price: '',
      deliveryDays: '',
      revisions: '',
      expressDeliveryEnabled: false,
      expressDeliveryDays: '4',
      expressDeliveryPrice: '',
      features: ['']
    }
  });

  const myProjects: ProjectItem[] = Array.isArray(user?.providerProfile?.portfolio)
    ? user.providerProfile.portfolio
    : [];

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory(CATEGORIES[0]);
    setCustomCategory('');
    setIsCustomCategorySelected(false);
    setDescription('');
    setLocalImageFiles([]);
    setLocalVideoFiles([]);
    setExistingImages([]);
    setExistingVideos([]);
    setTierData({
      basic: { enabled: false, name: 'Basic Package', summary: '', price: '', deliveryDays: '', revisions: '', expressDeliveryEnabled: false, expressDeliveryDays: '2', expressDeliveryPrice: '', features: [''] },
      standard: { enabled: true, name: 'Standard Package', summary: '', price: '', deliveryDays: '', revisions: '', expressDeliveryEnabled: false, expressDeliveryDays: '3', expressDeliveryPrice: '', features: [''] },
      premium: { enabled: false, name: 'Premium Package', summary: '', price: '', deliveryDays: '', revisions: '', expressDeliveryEnabled: false, expressDeliveryDays: '4', expressDeliveryPrice: '', features: [''] }
    });
    setActiveTierId('standard');
  };

  const handleEditClick = (project: ProjectItem) => {
    setEditingId(project.id);
    setTitle(project.title);
    if (CATEGORIES.includes(project.category)) {
      setCategory(project.category);
      setIsCustomCategorySelected(false);
    } else {
      setCategory('Other');
      setCustomCategory(project.category);
      setIsCustomCategorySelected(true);
    }
    setDescription(project.description);
    setExistingImages(project.images || (project.imageUrl ? [project.imageUrl] : []));
    setExistingVideos(project.videos || (project.videoUrl ? [project.videoUrl] : []));
    
    if (project.packages) {
      setTierData(JSON.parse(JSON.stringify(project.packages)));
    } else {
      // Fallback if packages object does not exist
      setTierData({
        basic: { enabled: false, name: 'Basic Package', summary: '', price: String(project.price || ''), deliveryDays: '3', revisions: '1', expressDeliveryEnabled: false, expressDeliveryDays: '2', expressDeliveryPrice: '', features: [''] },
        standard: { enabled: true, name: 'Standard Package', summary: '', price: String(project.price || ''), deliveryDays: '5', revisions: '3', expressDeliveryEnabled: false, expressDeliveryDays: '3', expressDeliveryPrice: '', features: [''] },
        premium: { enabled: false, name: 'Premium Package', summary: '', price: String(project.price || ''), deliveryDays: '7', revisions: '5', expressDeliveryEnabled: false, expressDeliveryDays: '4', expressDeliveryPrice: '', features: [''] }
      });
    }
    setViewMode('FORM');
  };

  const handleDeleteClick = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project from your portfolio?')) return;
    try {
      const updated = myProjects.filter((p) => p.id !== projectId);
      await api.put('/users/profile', { portfolio: updated });
      await refreshUser();
      alert('Project deleted successfully.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete project.');
    }
  };

  // Dynamic Tier field updates
  const handleToggleTier = (tierId: 'basic' | 'standard' | 'premium') => {
    setTierData((prev) => ({
      ...prev,
      [tierId]: { ...prev[tierId], enabled: !prev[tierId].enabled }
    }));
  };

  const handleUpdateTierField = (
    tierId: 'basic' | 'standard' | 'premium',
    field: keyof PackageTier,
    val: any
  ) => {
    setTierData((prev) => ({
      ...prev,
      [tierId]: { ...prev[tierId], [field]: val }
    }));
  };

  const handleFeatureChange = (
    tierId: 'basic' | 'standard' | 'premium',
    idx: number,
    text: string
  ) => {
    setTierData((prev) => {
      const copy = { ...prev };
      const feats = [...copy[tierId].features];
      feats[idx] = text;
      copy[tierId].features = feats;
      return copy;
    });
  };

  const handleAddFeature = (tierId: 'basic' | 'standard' | 'premium') => {
    setTierData((prev) => {
      const copy = { ...prev };
      copy[tierId].features = [...copy[tierId].features, ''];
      return copy;
    });
  };

  const handleRemoveFeature = (
    tierId: 'basic' | 'standard' | 'premium',
    idx: number
  ) => {
    setTierData((prev) => {
      const copy = { ...prev };
      const feats = copy[tierId].features.filter((_, i) => i !== idx);
      copy[tierId].features = feats.length > 0 ? feats : [''];
      return copy;
    });
  };

  // Uploading handler
  const uploadSingleFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data?.url || response.data?.data?.url || '';
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a project title');
    if (!description.trim()) return alert('Please enter a project description');

    const enabledTiers = Object.keys(tierData)
      .filter((k) => tierData[k as 'basic' | 'standard' | 'premium'].enabled)
      .map((k) => {
        const item = tierData[k as 'basic' | 'standard' | 'premium'];
        return {
          id: k,
          name: item.name,
          price: Number(item.price || 0),
          deliveryDays: Number(item.deliveryDays || 3),
          revisions: Number(item.revisions || 1),
          features: item.features.filter((f) => f.trim().length > 0)
        };
      });

    if (enabledTiers.length === 0) {
      return alert('Please enable and configure at least one package tier.');
    }

    const finalCat = isCustomCategorySelected ? (customCategory.trim() || 'Other') : category;

    setIsSubmitting(true);
    setIsUploading(true);
    setUploadProgress('Uploading files to server...');

    try {
      // 1. Upload local images
      const uploadedImages = [...existingImages];
      for (let i = 0; i < localImageFiles.length; i++) {
        setUploadProgress(`Uploading image ${i + 1}/${localImageFiles.length}...`);
        const url = await uploadSingleFile(localImageFiles[i]);
        if (url) uploadedImages.push(url);
      }

      // 2. Upload local videos
      const uploadedVideos = [...existingVideos];
      for (let i = 0; i < localVideoFiles.length; i++) {
        setUploadProgress(`Uploading demo video ${i + 1}/${localVideoFiles.length}...`);
        const url = await uploadSingleFile(localVideoFiles[i]);
        if (url) uploadedVideos.push(url);
      }

      setUploadProgress('Saving project changes...');

      const primaryImage = uploadedImages[0] || (user?.avatar || '');
      const primaryVideo = uploadedVideos[0] || null;

      const projectPayload: ProjectItem = {
        id: editingId || `proj_${Date.now()}`,
        title: title.trim(),
        category: finalCat,
        description: description.trim(),
        imageUrl: primaryImage,
        images: uploadedImages,
        video: primaryVideo,
        videoUrl: primaryVideo,
        videos: uploadedVideos,
        price: Number(tierData.standard.enabled ? tierData.standard.price : enabledTiers[0]?.price || 0),
        packages: tierData,
        createdAt: new Date().toISOString()
      };

      let updatedPortfolio: ProjectItem[];
      if (editingId) {
        updatedPortfolio = myProjects.map((p) => (p.id === editingId ? projectPayload : p));
      } else {
        updatedPortfolio = [projectPayload, ...myProjects];
      }

      await api.put('/users/profile', { portfolio: updatedPortfolio });
      await refreshUser();
      
      alert(editingId ? 'Project updated successfully!' : 'Project published successfully!');
      resetForm();
      setViewMode('LIST');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to publish project. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setIsCustomCategorySelected(val === 'Other');
  };

  return (
    <div className="post-project-container animate-fade-in">
      <div className="dashboard-header-block">
        <div>
          <h1>{viewMode === 'LIST' ? 'My Published Projects' : editingId ? 'Edit Project Details' : 'Post a Project'}</h1>
          <p>Publish service packages and deliverable project gig offers to show on the client marketplace.</p>
        </div>
        <button
          className="btn-primary-pill"
          onClick={() => {
            if (viewMode === 'LIST') {
              resetForm();
              setViewMode('FORM');
            } else {
              setViewMode('LIST');
            }
          }}
        >
          {viewMode === 'LIST' ? 'Create New Project' : 'Back to Listings'}
        </button>
      </div>

      {viewMode === 'LIST' ? (
        <div className="projects-list-view">
          {myProjects.length === 0 ? (
            <div className="empty-state-card">
              <span className="empty-icon">📁</span>
              <h3>No Projects Published Yet</h3>
              <p>Create project gig packages with price tiers to present your work and services in detail to potential clients.</p>
              <button className="btn-primary-pill" onClick={() => setViewMode('FORM')}>
                Publish Your First Project
              </button>
            </div>
          ) : (
            <div className="projects-grid-layout">
              {myProjects.map((project) => (
                <div className="project-gig-card" key={project.id}>
                  <div className="gig-card-preview">
                    {project.imageUrl ? (
                      <img src={getMediaUrl(project.imageUrl)} alt={project.title} />
                    ) : (
                      <div className="placeholder-preview">👨‍🔧 Fixam Portfolio</div>
                    )}
                    <span className="gig-badge-category">{project.category}</span>
                  </div>
                  <div className="gig-card-body">
                    <h3>{project.title}</h3>
                    <p className="gig-desc">{project.description}</p>
                    <div className="gig-meta">
                      <strong>
                        {project.price ? `${project.price.toLocaleString()} XAF` : 'Custom Tiers'}
                      </strong>
                      <span>{(project.images?.length || 0) + (project.videos?.length || 0)} media files</span>
                    </div>
                    <div className="gig-actions-row">
                      <button className="btn-action edit" onClick={() => handleEditClick(project)}>
                        Edit
                      </button>
                      <button className="btn-action delete" onClick={() => handleDeleteClick(project.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handlePublish} className="project-publish-form">
          <div className="form-sections-grid">
            {/* Left Column: Core Fields */}
            <div className="form-left-col">
              <div className="form-card-panel">
                <h3>Core Project Info</h3>
                
                <div className="form-field-group">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Professional Kitchen & Bathroom Leakage Repair"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label>Service Category *</label>
                  <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {isCustomCategorySelected && (
                  <div className="form-field-group animate-fade-in">
                    <label>Custom Category Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Specialty Solar Grid Engineering"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                    />
                  </div>
                )}

                <div className="form-field-group">
                  <label>Project Description *</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Describe exactly what you deliver, your materials, techniques, and what you need from the client to get started..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className="form-card-panel">
                <h3>Media Attachments</h3>
                <p className="card-subtext">Add portfolio images and demo video footages (Max 1 min per video) to impress clients.</p>

                <div className="media-inputs-row">
                  <div className="media-uploader-box">
                    <label>Add Project Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          setLocalImageFiles([...localImageFiles, ...Array.from(e.target.files)]);
                        }
                      }}
                    />
                    <small>Select JPEG, PNG or WebP files</small>
                  </div>

                  <div className="media-uploader-box">
                    <label>Add Demo Videos (Max 1 Min)</label>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          setLocalVideoFiles([...localVideoFiles, ...Array.from(e.target.files)]);
                        }
                      }}
                    />
                    <small>Select MP4 or MOV files</small>
                  </div>
                </div>

                {/* Previews Grid */}
                {(localImageFiles.length > 0 || localVideoFiles.length > 0 || existingImages.length > 0 || existingVideos.length > 0) && (
                  <div className="media-previews-list">
                    <h4>Current Media Files:</h4>
                    <div className="media-previews-flex">
                      {/* Existing Image Links */}
                      {existingImages.map((img, idx) => (
                        <div className="preview-media-item" key={`ext-img-${idx}`}>
                          <img src={getMediaUrl(img)} alt="Existing Preview" />
                          <button
                            type="button"
                            className="remove-preview-btn"
                            onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {/* Local Uploading Image Links */}
                      {localImageFiles.map((file, idx) => (
                        <div className="preview-media-item local" key={`loc-img-${idx}`}>
                          <img src={URL.createObjectURL(file)} alt="Local Preview" />
                          <button
                            type="button"
                            className="remove-preview-btn"
                            onClick={() => setLocalImageFiles(localImageFiles.filter((_, i) => i !== idx))}
                          >
                            ✕
                          </button>
                          <span className="local-badge">Local</span>
                        </div>
                      ))}

                      {/* Existing Videos */}
                      {existingVideos.map((vid, idx) => (
                        <div className="preview-media-item video" key={`ext-vid-${idx}`}>
                          <div className="video-thumb-sim">🎥 Video #{idx + 1}</div>
                          <button
                            type="button"
                            className="remove-preview-btn"
                            onClick={() => setExistingVideos(existingVideos.filter((_, i) => i !== idx))}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {/* Local Videos */}
                      {localVideoFiles.map((file, idx) => (
                        <div className="preview-media-item video local" key={`loc-vid-${idx}`}>
                          <div className="video-thumb-sim">🎥 {file.name.slice(0, 10)}...</div>
                          <button
                            type="button"
                            className="remove-preview-btn"
                            onClick={() => setLocalVideoFiles(localVideoFiles.filter((_, i) => i !== idx))}
                          >
                            ✕
                          </button>
                          <span className="local-badge">Local</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Packages & Price Tiers */}
            <div className="form-right-col">
              <div className="form-card-panel pricing-panel">
                <h3>Pricing & Deliverable Packages</h3>
                
                {/* Segment Tabs */}
                <div className="pricing-tabs-row">
                  {['basic', 'standard', 'premium'].map((id) => (
                    <button
                      key={id}
                      type="button"
                      className={`pricing-tab-btn ${activeTierId === id ? 'active' : ''} ${
                        tierData[id as 'basic' | 'standard' | 'premium'].enabled ? 'enabled' : ''
                      }`}
                      onClick={() => setActiveTierId(id as any)}
                    >
                      {id.toUpperCase()} {tierData[id as 'basic' | 'standard' | 'premium'].enabled ? '✓' : ''}
                    </button>
                  ))}
                </div>

                {/* Active Tier Form Content */}
                <div className="pricing-tier-card">
                  <div className="tier-enable-checkbox">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={tierData[activeTierId].enabled}
                        onChange={() => handleToggleTier(activeTierId)}
                        disabled={activeTierId === 'standard'} // Standard tier is always required
                      />
                      <span className="checkmark"></span>
                      Enable {activeTierId.toUpperCase()} package details
                    </label>
                  </div>

                  {tierData[activeTierId].enabled ? (
                    <div className="tier-fields-block animate-fade-in">
                      <div className="form-field-group">
                        <label>Package Custom Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Standard Full Repair Package"
                          value={tierData[activeTierId].name}
                          onChange={(e) => handleUpdateTierField(activeTierId, 'name', e.target.value)}
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Short Deliverable Summary</label>
                        <input
                          type="text"
                          placeholder="e.g. Includes pipe installation, 3-month warranty, materials included"
                          value={tierData[activeTierId].summary}
                          onChange={(e) => handleUpdateTierField(activeTierId, 'summary', e.target.value)}
                        />
                      </div>

                      <div className="fields-row-three">
                        <div className="form-field-group">
                          <label>Price (XAF)</label>
                          <input
                            type="number"
                            placeholder="50000"
                            value={tierData[activeTierId].price}
                            onChange={(e) => handleUpdateTierField(activeTierId, 'price', e.target.value)}
                          />
                        </div>

                        <div className="form-field-group">
                          <label>Delivery (Days)</label>
                          <input
                            type="number"
                            placeholder="3"
                            value={tierData[activeTierId].deliveryDays}
                            onChange={(e) => handleUpdateTierField(activeTierId, 'deliveryDays', e.target.value)}
                          />
                        </div>

                        <div className="form-field-group">
                          <label>Revisions</label>
                          <input
                            type="number"
                            placeholder="2"
                            value={tierData[activeTierId].revisions}
                            onChange={(e) => handleUpdateTierField(activeTierId, 'revisions', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Express Add-on */}
                      <div className="express-addon-container">
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={tierData[activeTierId].expressDeliveryEnabled}
                            onChange={(e) => handleUpdateTierField(activeTierId, 'expressDeliveryEnabled', e.target.checked)}
                          />
                          <span className="checkmark"></span>
                          Enable Express Delivery Add-on
                        </label>

                        {tierData[activeTierId].expressDeliveryEnabled && (
                          <div className="express-fields-row animate-fade-in">
                            <div className="form-field-group">
                              <label>Express Delivery (Days)</label>
                              <input
                                type="number"
                                placeholder="1"
                                value={tierData[activeTierId].expressDeliveryDays}
                                onChange={(e) => handleUpdateTierField(activeTierId, 'expressDeliveryDays', e.target.value)}
                              />
                            </div>
                            <div className="form-field-group">
                              <label>Extra Cost (XAF)</label>
                              <input
                                type="number"
                                placeholder="15000"
                                value={tierData[activeTierId].expressDeliveryPrice}
                                onChange={(e) => handleUpdateTierField(activeTierId, 'expressDeliveryPrice', e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Included Features List */}
                      <div className="tier-features-list-section">
                        <label>Included Features / Deliverables</label>
                        {tierData[activeTierId].features.map((feat, idx) => (
                          <div className="feature-input-row-flex" key={idx}>
                            <input
                              type="text"
                              placeholder={`Deliverable feature #${idx + 1}`}
                              value={feat}
                              onChange={(e) => handleFeatureChange(activeTierId, idx, e.target.value)}
                            />
                            <button
                              type="button"
                              className="remove-feature-btn"
                              onClick={() => handleRemoveFeature(activeTierId, idx)}
                              disabled={tierData[activeTierId].features.length <= 1}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn-add-feature"
                          onClick={() => handleAddFeature(activeTierId)}
                        >
                          + Add Included Feature
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="tier-disabled-message">
                      <p>Enable this package tier to configure alternative pricing options for clients.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submission Row */}
          {isUploading && (
            <div className="form-upload-status-indicator">
              <span className="spinner">🌀</span>
              <span>{uploadProgress}</span>
            </div>
          )}

          <div className="form-actions-submit-bar">
            <button type="button" className="btn-secondary" onClick={resetForm} disabled={isSubmitting}>
              Cancel / Reset
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : editingId ? 'Update & Save Project' : 'Publish Project Package'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
