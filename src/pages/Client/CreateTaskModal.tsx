import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '../../App';
import { MaterialsListEditor, MaterialItem } from '../../components/MaterialsListEditor';

const SERVICE_CATEGORIES = [
  { value: 'plumbing', label: 'Plumbing', fr: 'Plomberie', icon: '🔧' },
  { value: 'electrical', label: 'Electrical', fr: 'Électricité', icon: '⚡' },
  { value: 'cleaning', label: 'Cleaning', fr: 'Nettoyage', icon: '🧹' },
  { value: 'painting', label: 'Painting', fr: 'Peinture', icon: '🎨' },
  { value: 'carpentry', label: 'Carpentry', fr: 'Menuiserie', icon: '🪚' },
  { value: 'moving', label: 'Moving & Delivery', fr: 'Déménagement', icon: '📦' },
  { value: 'gardening', label: 'Gardening', fr: 'Jardinage', icon: '🌿' },
  { value: 'appliance', label: 'Appliance Repair', fr: 'Réparation d\'appareils', icon: '🔌' },
  { value: 'cctv', label: 'CCTV Installation', fr: 'Installation CCTV', icon: '📷' },
  { value: 'tiling', label: 'Tiling', fr: 'Carrelage', icon: '🏠' },
  { value: 'ac', label: 'AC & Cooling', fr: 'Climatisation', icon: '❄️' },
  { value: 'it_support', label: 'IT Support', fr: 'Support informatique', icon: '💻' },
  { value: 'tutoring', label: 'Tutoring', fr: 'Cours particuliers', icon: '📚' },
  { value: 'photography', label: 'Photography', fr: 'Photographie', icon: '📸' },
  { value: 'other', label: 'Other', fr: 'Autre', icon: '🔩' },
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low - Flexible schedule', fr: 'Faible - Flexible' },
  { value: 'NORMAL', label: 'Normal - Within a few days', fr: 'Normal - Dans quelques jours' },
  { value: 'HIGH', label: 'Urgent - As soon as possible', fr: 'Urgent - Dès que possible' },
];

const PROVIDER_TIERS = [
  { value: '1', label: '1 Provider (1 Coin)', fr: '1 Prestataire (1 Pièce)', coins: 1 },
  { value: '2', label: '2 Providers (2 Coins)', fr: '2 Prestataires (2 Pièces)', coins: 2 },
  { value: '3', label: '3+ Providers (3 Coins)', fr: '3+ Prestataires (3 Pièces)', coins: 3 },
  { value: '7', label: '7+ Providers (4 Coins)', fr: '7+ Prestataires (4 Pièces)', coins: 4 },
  { value: '10', label: '10+ Providers (5 Coins)', fr: '10+ Prestataires (5 Pièces)', coins: 5 },
];

const SCOPE_OPTIONS = [
  { value: 'SMALL', label: 'Small - Less than a day', fr: 'Petit - Moins d\'une journée' },
  { value: 'MEDIUM', label: 'Medium - 1 to 3 days', fr: 'Moyen - 1 à 3 jours' },
  { value: 'LARGE', label: 'Large - More than 3 days', fr: 'Grand - Plus de 3 jours' },
];

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (job: any) => void;
  isFr?: boolean;
}

type Step = 'category' | 'details' | 'budget' | 'schedule' | 'review';

export default function CreateTaskModal({ isOpen, onClose, onSuccess, isFr = false }: CreateTaskModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('category');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const [form, setForm] = useState({
    category: '',
    customCategoryName: '',
    title: '',
    description: '',
    whatNeedsDone: '',
    importantDetails: '',
    location: '',
    isRemote: false,
    budgetMin: '',
    budgetMax: '',
    providersNeeded: '1',
    priority: 'NORMAL',
    taskScope: 'SMALL',
    scheduledTime: '',
    materialsList: [] as MaterialItem[],
    requiresDiagnosis: false,
  });

  useEffect(() => {
    if (isOpen) {
      // Reset when opening
      setStep('category');
      setError('');
      setSearchQuery('');
      setShowConfirmClose(false);
      setForm({
        category: '',
        customCategoryName: '',
        title: '',
        description: '',
        whatNeedsDone: '',
        importantDetails: '',
        location: '',
        isRemote: false,
        budgetMin: '',
        budgetMax: '',
        providersNeeded: '1',
        priority: 'NORMAL',
        taskScope: 'SMALL',
        scheduledTime: '',
        materialsList: [],
        requiresDiagnosis: false,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const t = {
    title: isFr ? 'Créer une tâche' : 'Create a New Task',
    step1: isFr ? 'Catégorie' : 'Category',
    step2: isFr ? 'Détails' : 'Details',
    step3: isFr ? 'Budget' : 'Budget',
    step4: isFr ? 'Planning' : 'Schedule',
    step5: isFr ? 'Aperçu' : 'Review',
    next: isFr ? 'Suivant' : 'Next',
    back: isFr ? 'Retour' : 'Back',
    cancel: isFr ? 'Annuler' : 'Cancel',
    submit: isFr ? 'Poster la tâche' : 'Post Task',
    submitting: isFr ? 'Publication...' : 'Posting...',
    selectCategory: isFr ? 'Sélectionnez ou recherchez une catégorie' : 'Select or search a category',
    searchPlaceholder: isFr ? 'Rechercher une catégorie (ex: plomberie)...' : 'Search category (e.g. plumbing)...',
    customCategoryLabel: isFr ? 'Nom de votre catégorie personnalisée' : 'Your Custom Category Name',
    customCategoryPlaceholder: isFr ? 'Ex: Coiffure à domicile, Élevage...' : 'E.g. Home Barber, Dog Training...',
    taskType: isFr ? 'Type de tâche' : 'Task Type',
    physicalLabel: isFr ? 'Sur place / Physique' : 'On-Site / Physical',
    physicalDesc: isFr ? 'Nécessite votre présence locale' : 'Requires local presence',
    remoteLabel: isFr ? 'En ligne / À distance' : 'Online / Remote',
    remoteDesc: isFr ? 'Peut être fait de n\'importe où' : 'Can be done from anywhere',
    jobTitle: isFr ? 'Titre de la tâche' : 'Task Title',
    jobTitlePlaceholder: isFr ? 'Ex: Réparer une fuite de robinet' : 'E.g. Fix a leaking kitchen faucet',
    description: isFr ? 'Description' : 'Description',
    descriptionPlaceholder: isFr ? 'Décrivez en détail ce que vous voulez...' : 'Describe in detail what needs to be done...',
    whatNeedsDone: isFr ? 'Ce qui doit être fait' : 'What needs to be done',
    whatNeedsDonePlaceholder: isFr ? 'Listez les tâches spécifiques...' : 'List specific tasks...',
    importantDetails: isFr ? 'Détails importants' : 'Important Details',
    importantDetailsPlaceholder: isFr ? 'Matériel requis, contraintes...' : 'Materials needed, constraints...',
    location: isFr ? 'Lieu' : 'Location',
    locationPlaceholder: isFr ? 'Ex: Douala, Bonapriso' : 'E.g. Douala, Bonapriso',
    budgetMin: isFr ? 'Budget minimum (XAF)' : 'Minimum Budget (XAF)',
    budgetMax: isFr ? 'Budget maximum (XAF)' : 'Maximum Budget (XAF)',
    providersNeeded: isFr ? 'Prestataires nécessaires' : 'Providers needed',
    priority: isFr ? 'Priorité' : 'Priority',
    taskScope: isFr ? 'Durée estimée' : 'Estimated Duration',
    scheduledTime: isFr ? 'Date de début souhaitée' : 'Preferred Start Date',
    unsavedTitle: isFr ? 'Modifications non enregistrées' : 'Unsaved Changes',
    unsavedText: isFr ? 'Vous avez commencé à remplir la tâche. Voulez-vous abandonner ?' : 'You have entered some details for this task. Do you want to discard them?',
    discard: isFr ? 'Abandonner' : 'Discard All',
    verificationRequired: isFr
      ? 'Votre compte doit être vérifié pour poster une tâche.'
      : 'Your account must be verified to post a task.',
  };

  const update = (field: string, value: any) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'isRemote') {
        if (value === true) {
          next.location = isFr ? 'À distance / En ligne' : 'Remote / Online';
        } else if (prev.location === 'Remote / Online' || prev.location === 'À distance / En ligne') {
          next.location = '';
        }
      }
      return next;
    });
  };

  const steps: Step[] = ['category', 'details', 'budget', 'schedule', 'review'];
  const stepIndex = steps.indexOf(step);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const hasEnteredData = () => {
    return !!form.category || !!form.title || !!form.description || !!form.location || !!form.budgetMin;
  };

  const handleCloseAttempt = () => {
    if (hasEnteredData()) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const canProceed = () => {
    if (step === 'category') {
      if (!form.category) return false;
      if (form.category === 'other' && !form.customCategoryName.trim()) return false;
      return true;
    }
    if (step === 'details') {
      return form.title.length >= 5 && form.description.length >= 10 && form.location.trim().length > 0;
    }
    if (step === 'budget') {
      return Number(form.budgetMin) > 0 && Number(form.budgetMax) >= Number(form.budgetMin);
    }
    return true;
  };

  const goNext = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };

  const goBack = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const selectedCategory = form.category === 'other' ? form.customCategoryName : form.category;
      const payload: any = {
        category: selectedCategory,
        title: form.title,
        description: form.description,
        location: form.location,
        isRemote: form.isRemote,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        budget: Number(form.budgetMax),
        providersNeeded: Number(form.providersNeeded),
        priority: form.priority,
        taskScope: form.taskScope,
        scheduledTime: form.scheduledTime || undefined,
        materialsList: form.materialsList,
        requiresDiagnosis: form.requiresDiagnosis,
      };
      if (form.whatNeedsDone) payload.whatNeedsDone = form.whatNeedsDone;
      if (form.importantDetails) payload.importantDetails = form.importantDetails;
      if (form.scheduledTime) payload.scheduledTime = new Date(form.scheduledTime).toISOString();

      const res = await api.post('/jobs', payload);
      if (res.data.success) {
        if (onSuccess) onSuccess(res.data.data);
        onClose();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || (isFr ? 'Échec de la publication.' : 'Failed to publish job.');
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter categories based on search input
  const filteredCategories = SERVICE_CATEGORIES.filter(cat => {
    const term = searchQuery.toLowerCase();
    const labelMatches = cat.label.toLowerCase().includes(term);
    const frMatches = cat.fr.toLowerCase().includes(term);
    return labelMatches || frMatches;
  });

  // If search matches nothing or user wants other, they can select "Other"
  const isOtherVisible = filteredCategories.some(c => c.value === 'other') || searchQuery.trim().length > 0;

  const currentCategoryObj = SERVICE_CATEGORIES.find(c => c.value === form.category);

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleCloseAttempt(); }}
    >
      <div 
        style={{
          background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '720px',
          maxHeight: '92vh', overflowY: 'auto', display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', fontFamily: "'Inter', sans-serif"
        }}
      >
        {showConfirmClose ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '24px' }}>⚠️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>{t.unsavedTitle}</h2>
            <p style={{ color: '#64748B', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>{t.unsavedText}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={onClose} style={{ padding: '0.8rem 1.8rem', background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>{t.discard}</button>
              <button onClick={() => setShowConfirmClose(false)} style={{ padding: '0.8rem 1.8rem', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>{t.cancel}</button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{t.title}</h2>
                <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                  {isFr ? `Étape ${stepIndex + 1} sur ${steps.length}` : `Step ${stepIndex + 1} of ${steps.length}`}
                </p>
              </div>
              <button onClick={handleCloseAttempt} style={{ background: '#f8fafc', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <Icon name="x" />
              </button>
            </div>

            {/* Progress bar */}
            <div style={{ padding: '0.75rem 1.75rem 0.5rem' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                {steps.map((s, i) => (
                  <div key={s} style={{ height: '5px', flex: 1, borderRadius: '4px', backgroundColor: i <= stepIndex ? '#14b8a6' : '#e2e8f0', transition: 'all 0.3s' }} />
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#14b8a6', fontWeight: 600 }}>
                {step === 'category' ? t.step1 : step === 'details' ? t.step2 : step === 'budget' ? t.step3 : step === 'schedule' ? t.step4 : t.step5}
              </span>
            </div>

            {/* Error message */}
            {error && (
              <div style={{ margin: '0.5rem 1.75rem 0', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', fontSize: '0.85rem', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', gap: '8px' }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Body contents */}
            <div style={{ padding: '1.25rem 1.75rem', flex: 1, overflowY: 'auto' }}>
              
              {/* STEP 1: Search & Category */}
              {step === 'category' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem' }}>{t.selectCategory}</p>
                  
                  {/* Search Box */}
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                        border: '1px solid #CBD5E1', borderRadius: '10px',
                        fontSize: '0.9rem', outline: 'none', background: '#F8FAFC'
                      }}
                    />
                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>🔍</span>
                  </div>

                  {/* Filtered category list */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', maxHeight: '300px', overflowY: 'auto', padding: '2px' }}>
                    {filteredCategories.map(cat => {
                      if (cat.value === 'other') return null; // handle other below
                      const isSel = form.category === cat.value;
                      return (
                        <button
                          key={cat.value}
                          onClick={() => update('category', cat.value)}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            gap: '6px', padding: '12px 6px', border: `2px solid ${isSel ? '#14b8a6' : '#e2e8f0'}`,
                            borderRadius: '12px', background: isSel ? '#f0fdfa' : '#fff',
                            cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                            color: isSel ? '#0f766e' : '#334155'
                          }}
                        >
                          <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{isFr ? cat.fr : cat.label}</span>
                        </button>
                      );
                    })}

                    {/* Fallback/Other option always available if query is typed or other list item */}
                    {isOtherVisible && (
                      <button
                        onClick={() => update('category', 'other')}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          gap: '6px', padding: '12px 6px', border: `2px solid ${form.category === 'other' ? '#14b8a6' : '#e2e8f0'}`,
                          borderRadius: '12px', background: form.category === 'other' ? '#f0fdfa' : '#fff',
                          cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                          color: form.category === 'other' ? '#0f766e' : '#334155'
                        }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>🔩</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{isFr ? 'Autre' : 'Other'}</span>
                      </button>
                    )}
                  </div>

                  {filteredCategories.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748B', fontSize: '0.85rem' }}>
                      {isFr ? 'Aucun résultat trouvé. Sélectionnez "Autre" pour entrer le vôtre.' : 'No matches found. Select "Other" to write your own.'}
                    </div>
                  )}

                  {/* Input for custom category */}
                  {form.category === 'other' && (
                    <div className="animate-fade-in" style={{ marginTop: '0.5rem', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '12px', background: '#F8FAFC' }}>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{t.customCategoryLabel} *</label>
                      <input
                        type="text"
                        placeholder={t.customCategoryPlaceholder}
                        value={form.customCategoryName}
                        onChange={e => update('customCategoryName', e.target.value)}
                        style={{
                          width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #CBD5E1',
                          borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#fff'
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Details & Type */}
              {step === 'details' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Task Type: Physical vs Remote (Side-by-side buttons just like mobile!) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.6rem' }}>{t.taskType}</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => update('isRemote', false)}
                        style={{
                          display: 'flex', flexDirection: 'column', gap: '4px', padding: '1rem',
                          borderRadius: '12px', border: `2px solid ${!form.isRemote ? '#0D9488' : '#E2E8F0'}`,
                          backgroundColor: !form.isRemote ? '#F8FFFD' : '#FFF', cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.15s'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem', color: !form.isRemote ? '#0D9488' : '#64748B' }}>📍</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: !form.isRemote ? '#0F172A' : '#475569' }}>{t.physicalLabel}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.physicalDesc}</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => update('isRemote', true)}
                        style={{
                          display: 'flex', flexDirection: 'column', gap: '4px', padding: '1rem',
                          borderRadius: '12px', border: `2px solid ${form.isRemote ? '#0D9488' : '#E2E8F0'}`,
                          backgroundColor: form.isRemote ? '#F8FFFD' : '#FFF', cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.15s'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem', color: form.isRemote ? '#0D9488' : '#64748B' }}>💻</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: form.isRemote ? '#0F172A' : '#475569' }}>{t.remoteLabel}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.remoteDesc}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>{t.jobTitle} *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => update('title', e.target.value)}
                      placeholder={t.jobTitlePlaceholder}
                      maxLength={80}
                      style={{
                        width: '100%', border: '1px solid #E2E8F0', borderRadius: '10px',
                        padding: '0.7rem 1rem', fontSize: '0.875rem', outline: 'none'
                      }}
                    />
                    <span style={{ float: 'right', fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>{form.title.length}/80</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>{t.description} *</label>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={e => update('description', e.target.value)}
                      placeholder={t.descriptionPlaceholder}
                      style={{
                        width: '100%', border: '1px solid #E2E8F0', borderRadius: '10px',
                        padding: '0.7rem 1rem', fontSize: '0.875rem', outline: 'none', resize: 'vertical'
                      }}
                    />
                  </div>

                  <MaterialsListEditor
                    items={form.materialsList}
                    onChangeItems={(items) => setForm(f => ({ ...f, materialsList: items }))}
                    requiresDiagnosis={form.requiresDiagnosis}
                    onToggleDiagnosis={(val) => setForm(f => ({ ...f, requiresDiagnosis: val }))}
                  />

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>{t.whatNeedsDone} ({isFr ? 'optionnel' : 'optional'})</label>
                    <textarea
                      value={form.whatNeedsDone}
                      onChange={e => update('whatNeedsDone', e.target.value)}
                      placeholder={t.whatNeedsDonePlaceholder}
                      rows={2}
                      style={{
                        width: '100%', border: '1px solid #E2E8F0', borderRadius: '10px',
                        padding: '0.7rem 1rem', fontSize: '0.875rem', outline: 'none', resize: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>{t.importantDetails} ({isFr ? 'optionnel' : 'optional'})</label>
                    <textarea
                      value={form.importantDetails}
                      onChange={e => update('importantDetails', e.target.value)}
                      placeholder={t.importantDetailsPlaceholder}
                      rows={2}
                      style={{
                        width: '100%', border: '1px solid #E2E8F0', borderRadius: '10px',
                        padding: '0.7rem 1rem', fontSize: '0.875rem', outline: 'none', resize: 'none'
                      }}
                    />
                  </div>

                  {/* Location is disabled/prefilled if isRemote is true */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>{t.location} *</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={e => update('location', e.target.value)}
                      placeholder={t.locationPlaceholder}
                      disabled={form.isRemote}
                      style={{
                        width: '100%', border: '1px solid #E2E8F0', borderRadius: '10px',
                        padding: '0.7rem 1rem', fontSize: '0.875rem', outline: 'none',
                        backgroundColor: form.isRemote ? '#F1F5F9' : '#FFF',
                        color: form.isRemote ? '#64748B' : '#0F172A'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Budget */}
              {step === 'budget' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>{t.budgetMin} *</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>XAF</span>
                        <input
                          type="number"
                          value={form.budgetMin}
                          onChange={e => update('budgetMin', e.target.value)}
                          placeholder="5000"
                          min="0"
                          style={{
                            width: '100%', border: '1px solid #E2E8F0', borderRadius: '10px',
                            padding: '0.7rem 1rem 0.7rem 2.5rem', fontSize: '0.875rem', outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>{t.budgetMax} *</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>XAF</span>
                        <input
                          type="number"
                          value={form.budgetMax}
                          onChange={e => update('budgetMax', e.target.value)}
                          placeholder="20000"
                          min="0"
                          style={{
                            width: '100%', border: '1px solid #E2E8F0', borderRadius: '10px',
                            padding: '0.7rem 1rem 0.7rem 2.5rem', fontSize: '0.875rem', outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>{t.providersNeeded}</label>
                    <select
                      value={form.providersNeeded}
                      onChange={(e) => update('providersNeeded', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#0F172A',
                        background: '#FFF',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      {PROVIDER_TIERS.map(tier => (
                        <option key={tier.value} value={tier.value}>
                          {isFr ? tier.fr : tier.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>{t.priority}</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {PRIORITY_OPTIONS.map(opt => (
                        <label
                          key={opt.value}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                            border: '1px solid #E2E8F0', borderRadius: '10px', cursor: 'pointer',
                            transition: 'border 0.2s'
                          }}
                        >
                          <input
                            type="radio"
                            name="priority"
                            value={opt.value}
                            checked={form.priority === opt.value}
                            onChange={() => update('priority', opt.value)}
                            style={{ accentColor: '#14b8a6' }}
                          />
                          <span style={{ fontSize: '0.85rem', color: '#334155' }}>{isFr ? opt.fr : opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Schedule */}
              {step === 'schedule' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>{t.taskScope}</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {SCOPE_OPTIONS.map(opt => (
                        <label
                          key={opt.value}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                            border: '1px solid #E2E8F0', borderRadius: '10px', cursor: 'pointer',
                            transition: 'border 0.2s'
                          }}
                        >
                          <input
                            type="radio"
                            name="taskScope"
                            value={opt.value}
                            checked={form.taskScope === opt.value}
                            onChange={() => update('taskScope', opt.value)}
                            style={{ accentColor: '#14b8a6' }}
                          />
                          <span style={{ fontSize: '0.85rem', color: '#334155' }}>{isFr ? opt.fr : opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>{t.scheduledTime} ({isFr ? 'optionnel' : 'optional'})</label>
                    <input
                      type="datetime-local"
                      value={form.scheduledTime}
                      onChange={e => update('scheduledTime', e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      style={{
                        width: '100%', border: '1px solid #E2E8F0', borderRadius: '10px',
                        padding: '0.7rem 1rem', fontSize: '0.875rem', outline: 'none'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Review */}
              {step === 'review' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '1.75rem' }}>{currentCategoryObj?.icon || '🔩'}</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: 800, color: '#0F172A' }}>{form.title}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                          {form.category === 'other' ? form.customCategoryName : (currentCategoryObj ? (isFr ? currentCategoryObj.fr : currentCategoryObj.label) : '')}
                        </p>
                      </div>
                    </div>
                    <ReviewRow label={isFr ? 'Description' : 'Description'} value={form.description} />
                    {form.whatNeedsDone && <ReviewRow label={t.whatNeedsDone} value={form.whatNeedsDone} />}
                    {form.importantDetails && <ReviewRow label={t.importantDetails} value={form.importantDetails} />}
                    <ReviewRow label={t.location} value={`${form.location}${form.isRemote ? (isFr ? ' (À distance)' : ' (Remote)') : ''}`} />
                    <ReviewRow label={t.budgetMin} value={`XAF ${Number(form.budgetMin).toLocaleString()} - ${Number(form.budgetMax).toLocaleString()}`} />
                    <ReviewRow label={t.providersNeeded} value={form.providersNeeded} />
                    <ReviewRow label={t.priority} value={PRIORITY_OPTIONS.find(o => o.value === form.priority)?.[isFr ? 'fr' : 'label'] || form.priority} />
                    <ReviewRow label={t.taskScope} value={SCOPE_OPTIONS.find(o => o.value === form.taskScope)?.[isFr ? 'fr' : 'label'] || form.taskScope} />
                    {form.scheduledTime && <ReviewRow label={t.scheduledTime} value={new Date(form.scheduledTime).toLocaleString()} />}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', padding: '10px 14px', border: '1px solid #FDE68A', borderRadius: '10px', backgroundColor: '#FFFBEB', color: '#B45309', fontSize: '0.75rem' }}>
                    <span>ℹ️</span>
                    <span>
                      {isFr
                        ? 'Votre tâche sera soumise à validation avant d\'être publiée pour les prestataires.'
                        : 'Your task will be reviewed for verification before it is visible to providers.'}
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              {step !== 'category' ? (
                <button
                  type="button"
                  onClick={goBack}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.65rem 1.25rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer', background: '#FFF' }}
                >
                  ← {t.back}
                </button>
              ) : <div />}
              
              {step !== 'review' ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '0.65rem 1.5rem',
                    background: '#14B8A6', border: 'none', borderRadius: '8px', fontWeight: 700,
                    color: '#fff', cursor: 'pointer', opacity: canProceed() ? 1 : 0.5
                  }}
                >
                  {t.next} →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '0.65rem 1.75rem',
                    background: '#14B8A6', border: 'none', borderRadius: '8px', fontWeight: 700,
                    color: '#fff', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? t.submitting : t.submit}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <span style={{ width: '130px', color: '#94A3B8', fontWeight: 600, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#334155', fontWeight: 600 }}>{String(value)}</span>
    </div>
  );
}
