import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '../../App';
import { MaterialsListEditor, MaterialItem } from '../../components/MaterialsListEditor';
import i18n from '../../i18n';

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
  { value: '1', label: '1 Provider', fr: '1 Prestataire', desc: 'Needs 1 provider', defaultCount: 1 },
  { value: '2', label: '2 Providers', fr: '2 Prestataires', desc: 'Needs 2 providers', defaultCount: 2 },
  { value: '3', label: '3 to 6 Providers', fr: '3 à 6 Prestataires', desc: 'This job needs 3 to 6 providers', defaultCount: 5 },
  { value: '7', label: '7 to 9 Providers', fr: '7 à 9 Prestataires', desc: 'This job needs 7 to 9 providers', defaultCount: 7 },
  { value: '10', label: '10+ Providers', fr: '10+ Prestataires', desc: 'This job needs more than 10 providers', defaultCount: 10 },
  { value: 'custom', label: 'Custom Number of Providers...', fr: 'Nombre personnalisé de prestataires...', desc: 'Enter the exact number of people needed', defaultCount: 5 },
];

const deriveCategoryFromTitle = (title: string) => {
  const t = (title || '').toLowerCase();
  if (/plumb|pipe|leak|drain|faucet|water|sink|toilet|robinet|fuite|tuyau/i.test(t)) {
    return { value: 'plumbing', label: 'Plumbing', fr: 'Plomberie', icon: '🔧' };
  }
  if (/electr|wire|cable|socket|breaker|light|switch|câble|prise|disjoncteur|lumière/i.test(t)) {
    return { value: 'electrical', label: 'Electrical', fr: 'Électricité', icon: '⚡' };
  }
  if (/clean|wash|mop|dust|laundry|housekeep|nettoy|ménage|lessive|balai/i.test(t)) {
    return { value: 'cleaning', label: 'Cleaning', fr: 'Nettoyage', icon: '🧹' };
  }
  if (/paint|wall|brush|roller|color|peint|mur|pinceau/i.test(t)) {
    return { value: 'painting', label: 'Painting', fr: 'Peinture', icon: '🎨' };
  }
  if (/carpenter|wood|door|furniture|table|chair|menuis|bois|porte|meuble/i.test(t)) {
    return { value: 'carpentry', label: 'Carpentry', fr: 'Menuiserie', icon: '🪚' };
  }
  if (/mov|deliver|transport|package|box|déménag|livrais|colis|carton/i.test(t)) {
    return { value: 'moving', label: 'Moving & Delivery', fr: 'Déménagement', icon: '📦' };
  }
  if (/garden|grass|lawn|tree|plant|jardin|pelouse|arbre|plante/i.test(t)) {
    return { value: 'gardening', label: 'Gardening', fr: 'Jardinage', icon: '🌿' };
  }
  if (/fridge|ac|cool|refrigerat|clim|froid|climatis/i.test(t)) {
    return { value: 'ac', label: 'AC & Cooling', fr: 'Climatisation', icon: '❄️' };
  }
  if (/it|computer|laptop|network|wifi|software|ordinateur|réseau|informatique/i.test(t)) {
    return { value: 'it_support', label: 'IT Support', fr: 'Support informatique', icon: '💻' };
  }
  if (/tutor|teach|lesson|cours|soutien|enseign/i.test(t)) {
    return { value: 'tutoring', label: 'Tutoring', fr: 'Cours particuliers', icon: '📚' };
  }
  if (/photo|video|camera|shoot|mariage|shooting/i.test(t)) {
    return { value: 'photography', label: 'Photography', fr: 'Photographie', icon: '📸' };
  }
  return { value: 'general', label: 'General Service', fr: 'Service général', icon: '🛠️' };
};

const categorySymbol = (category: string) => ({
  plumbing: 'plumbing', electrical: 'bolt', cleaning: 'cleaning_services', painting: 'format_paint',
  carpentry: 'carpenter', moving: 'local_shipping', gardening: 'yard', appliance: 'kitchen',
  cctv: 'videocam', tiling: 'grid_view', ac: 'ac_unit', it_support: 'computer',
  tutoring: 'school', photography: 'photo_camera', general: 'handyman', other: 'handyman',
}[category] || 'handyman');

interface PostJobProps {
  setActiveTab: (tab: string) => void;
  setClientTasks?: (tasks: any[]) => void;
  clientTasks?: any[];
}

type Step = 'details' | 'budget' | 'schedule' | 'review';

export default function PostJob({ setActiveTab, setClientTasks, clientTasks = [] }: PostJobProps) {
  const { user } = useAuth();
  const isFr = i18n.language === 'fr';
  const [step, setStep] = useState<Step>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>({
    responsibilities: false, requirements: false, skills: false, benefits: false, instructions: false,
  });
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({
    responsibilities: '', requirements: '', skills: '', benefits: '', instructions: '',
  });

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
    providerTier: '1',
    exactProviders: '1',
    priority: 'NORMAL',
    taskScope: 'SMALL',
    scheduledTime: '',
    expiryDate: '',
    materialsList: [] as MaterialItem[],
    requiresDiagnosis: false,
    isPinned: false,
    forwardToEmail: false,
    hiringEmail: (user as any)?.email || '',
    applicationQuestions: [] as any[],
  });

  const t = {
    title: isFr ? 'Publier une nouvelle mission' : 'Post a New Job',
    subtitle: isFr ? 'Trouvez les meilleurs prestataires vérifiés pour votre travail' : 'Find the best verified professionals for your work',
    step1: isFr ? '1. Détails du travail' : '1. Job Details',
    step2: isFr ? '2. Budget & Prestataires' : '2. Budget & Providers',
    step3: isFr ? '3. Planning & Urgence' : '3. Schedule & Urgency',
    step4: isFr ? '4. Révision & Publication' : '4. Review & Publish',
    next: isFr ? 'Suivant' : 'Next Step',
    back: isFr ? 'Retour' : 'Back',
    cancel: isFr ? 'Annuler' : 'Cancel',
    submit: isFr ? 'Publier la mission' : 'Publish Job',
    submitting: isFr ? 'Publication en cours...' : 'Publishing...',
    selectCategory: isFr ? 'Catégorie du travail' : 'Job Category',
    jobType: isFr ? 'Type de mission' : 'Job Type',
    physicalLabel: isFr ? 'Sur place / Physique' : 'On-Site / Physical',
    physicalDesc: isFr ? 'Nécessite une présence locale' : 'Requires physical presence',
    remoteLabel: isFr ? 'En ligne / À distance' : 'Online / Remote',
    remoteDesc: isFr ? 'Peut être réalisé de n\'importe où' : 'Can be done anywhere online',
    jobTitle: isFr ? 'Titre de la mission' : 'Job Title',
    jobTitlePlaceholder: isFr ? 'Ex: Réparer une fuite d\'eau sous l\'évier' : 'E.g. Repair water leak under the kitchen sink',
    description: isFr ? 'Description détaillée' : 'Detailed Description',
    descriptionPlaceholder: isFr ? 'Décrivez précisément ce dont vous avez besoin...' : 'Describe specifically what needs to be done...',
    whatNeedsDone: isFr ? 'Ce qui doit être fait (optionnel)' : 'Key deliverables (Optional)',
    importantDetails: isFr ? 'Précisions & contraintes (optionnel)' : 'Special requirements & constraints (Optional)',
    organize: isFr ? 'Organisez votre annonce' : 'Organize your job post',
    organizeHint: isFr ? 'Cochez les sections utiles, puis ajoutez vos détails. Utilisez une ligne par point pour les listes.' : 'Select the sections that matter, then add your details. Use one line per point for lists.',
    responsibilities: isFr ? 'Responsabilités / livrables' : 'Responsibilities / deliverables',
    requirements: isFr ? 'Exigences' : 'Requirements',
    skills: isFr ? 'Compétences recherchées' : 'Skills needed',
    benefits: isFr ? 'Matériel ou avantages fournis' : 'Materials or benefits provided',
    instructions: isFr ? 'Instructions supplémentaires' : 'Additional instructions',
    location: isFr ? 'Ville ou quartier' : 'Location / City',
    locationPlaceholder: isFr ? 'Ex: Douala, Akwa' : 'E.g. Douala, Akwa',
    budgetMin: isFr ? 'Budget minimum (XAF)' : 'Minimum Budget (XAF)',
    budgetMax: isFr ? 'Budget maximum (XAF)' : 'Maximum Budget (XAF)',
    providersNeeded: isFr ? 'Nombre de prestataires requis' : 'Number of Providers Needed',
    priority: isFr ? 'Niveau d\'urgence' : 'Urgency Level',
    scheduledTime: isFr ? 'Date d\'intervention souhaitée' : 'Preferred Start Date',
    expiryDate: isFr ? 'Date d\'expiration de l\'annonce' : 'Listing Expiry Date',
    expiryDateDesc: isFr ? 'L\'annonce sera automatiquement masquée des flux après cette date.' : 'The job will automatically be removed from public feeds after this date.',
    unsavedTitle: isFr ? 'Abandonner la création ?' : 'Discard Job Creation?',
    unsavedText: isFr ? 'Vous avez saisi des informations. Voulez-vous quitter sans publier ?' : 'You have entered job details. Are you sure you want to leave without publishing?',
    discard: isFr ? 'Abandonner' : 'Discard',
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

  const steps: Step[] = ['details', 'budget', 'schedule', 'review'];
  const stepIndex = steps.indexOf(step);

  const canProceed = () => {
    if (step === 'details') {
      return form.title.trim().length >= 5 && form.description.trim().length >= 10 && form.location.trim().length > 0;
    }
    if (step === 'budget') {
      return Number(form.budgetMin) > 0 && Number(form.budgetMax) >= Number(form.budgetMin);
    }
    return true;
  };

  const goNext = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) {
      setError('');
      setStep(steps[idx + 1]);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) {
      setError('');
      setStep(steps[idx - 1]);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const derived = deriveCategoryFromTitle(form.title);
      const selectedCategory = derived.label || derived.value || 'General Service';

      const cleanedMaterialsList = (form.materialsList || [])
        .filter((item: any) => item && typeof item.name === 'string' && item.name.trim().length > 0)
        .map((item: any) => ({
          id: item.id || undefined,
          name: item.name.trim(),
          quantity: item.quantity ? String(item.quantity).trim() : null,
          suppliedBy: 'PROVIDER'
        }));

      const numProviders = parseInt(form.exactProviders || form.providersNeeded, 10) || 1;
      const bMin = Number(form.budgetMin) || 0;
      const bMax = Number(form.budgetMax) || bMin;

      const payload: any = {
        category: selectedCategory,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        isRemote: Boolean(form.isRemote),
        budgetMin: bMin > 0 ? bMin : bMax,
        budgetMax: bMax > 0 ? bMax : bMin,
        budget: bMax > 0 ? bMax : bMin,
        providersNeeded: numProviders,
        priority: form.priority || 'NORMAL',
        taskScope: form.taskScope || 'SMALL',
        scheduledTime: form.scheduledTime ? new Date(form.scheduledTime).toISOString() : undefined,
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : undefined,
        materialsList: cleanedMaterialsList.length > 0 ? cleanedMaterialsList : undefined,
        requiresDiagnosis: Boolean(form.requiresDiagnosis),
        isPinned: Boolean(form.isPinned),
        forwardToEmail: Boolean(form.forwardToEmail),
        hiringEmail: form.forwardToEmail && form.hiringEmail ? form.hiringEmail.trim() : undefined,
        applicationQuestions: form.applicationQuestions,
      };
      if (form.whatNeedsDone) payload.whatNeedsDone = form.whatNeedsDone.trim();
      if (form.importantDetails) payload.importantDetails = form.importantDetails.trim();
      const details = Object.entries(selectedSections)
        .filter(([key, enabled]) => enabled && sectionContent[key]?.trim())
        .map(([key]) => ({ key, label: (t as any)[key], content: sectionContent[key].trim() }));
      if (details.length) payload.details = details;

      const res = await api.post('/jobs', payload);
      if (res.data.success) {
        const createdJob = res.data.data;
        if (setClientTasks) {
          setClientTasks([createdJob, ...clientTasks]);
        }
        alert(isFr ? '🎉 Mission créée avec succès ! Elle sera examinée et publiée rapidement.' : '🎉 Job created successfully! It will be reviewed and published shortly.');
        setActiveTab('My Jobs');
      }
    } catch (err: any) {
      const backendErrors = err.response?.data?.errors;
      let msg = err.response?.data?.message;
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        msg = backendErrors.map((e: any) => `${e.message} (${e.path})`).join(' • ');
      }
      setError(msg || (isFr ? 'Échec de la publication de la mission.' : 'Failed to publish job.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const derivedCategoryObj = deriveCategoryFromTitle(form.title);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 animate-fade-in font-sans">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <button 
            onClick={() => setActiveTab('My Jobs')} 
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-teal-600 mb-1 transition-colors border-0 bg-transparent cursor-pointer p-0"
          >
            ← {isFr ? 'Retour à mes missions' : 'Back to My Jobs'}
          </button>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{t.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
        </div>
      </div>

      {/* Stepper Tabs Bar */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {steps.map((s, idx) => {
          const isActive = s === step;
          const isDone = idx < stepIndex;
          return (
            <div 
              key={s} 
              className={`p-3 rounded-xl border transition-all text-center ${
                isActive 
                  ? 'bg-teal-50 border-teal-500 shadow-sm' 
                  : isDone 
                    ? 'bg-white border-gray-200 text-teal-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}
            >
              <div className={`text-xs font-bold ${isActive ? 'text-teal-700' : isDone ? 'text-teal-600' : 'text-gray-400'}`}>
                {s === 'details' ? t.step1 : s === 'budget' ? t.step2 : s === 'schedule' ? t.step3 : t.step4}
              </div>
            </div>
          );
        })}
      </div>

      {/* Error notification */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
        
        {/* STEP 1: Details */}
        {step === 'details' && (
          <div className="space-y-6">
            
            {/* Job Type: Physical vs Remote */}
            <div>
              <label className="block text-sm font-extrabold text-gray-800 mb-2">{t.jobType}</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => update('isRemote', false)}
                  className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    !form.isRemote ? 'border-teal-600 bg-teal-50/50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="material-symbols-rounded text-teal-700 mb-1">location_on</span>
                  <div className={`text-sm font-bold ${!form.isRemote ? 'text-teal-900' : 'text-gray-700'}`}>{t.physicalLabel}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.physicalDesc}</div>
                </button>

                <button
                  type="button"
                  onClick={() => update('isRemote', true)}
                  className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    form.isRemote ? 'border-teal-600 bg-teal-50/50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="material-symbols-rounded text-teal-700 mb-1">language</span>
                  <div className={`text-sm font-bold ${form.isRemote ? 'text-teal-900' : 'text-gray-700'}`}>{t.remoteLabel}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.remoteDesc}</div>
                </button>
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-extrabold text-gray-800 mb-1">{t.jobTitle} *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => update('title', e.target.value)}
                placeholder={t.jobTitlePlaceholder}
                maxLength={80}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
              />
              <span className="text-[11px] text-gray-400 mt-1 block text-right">{form.title.length}/80</span>
            </div>

            {/* Auto-detected category */}
            {form.title.trim().length >= 3 && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  {isFr ? 'Catégorie détectée :' : 'Detected Category:'} <strong className="text-teal-900 font-bold inline-flex items-center gap-1"><span className="material-symbols-rounded text-base">{categorySymbol(derivedCategoryObj.value)}</span>{isFr ? derivedCategoryObj.fr : derivedCategoryObj.label}</strong>
                </span>
                <span className="text-teal-600 font-semibold">{isFr ? 'Automatique' : 'Auto-assigned'}</span>
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-extrabold text-gray-800 mb-1">{t.location} *</label>
              <input
                type="text"
                value={form.location}
                onChange={e => update('location', e.target.value)}
                placeholder={t.locationPlaceholder}
                disabled={form.isRemote}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-extrabold text-gray-800 mb-1">{t.description} *</label>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                placeholder={t.descriptionPlaceholder}
                rows={4}
                className="w-full border border-gray-300 rounded-xl p-4 text-sm text-gray-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
              />
              <p className="mt-1 text-xs text-gray-500">
                {isFr ? 'Utilisez Entrée pour un nouveau paragraphe et commencez une ligne par • ou - pour une liste.' : 'Press Enter for a new paragraph. Start a line with • or - to make a list.'}
              </p>
            </div>

            {/* Legacy fields retained in source for existing-job compatibility; new posts use structured sections. */}
            {false && <>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t.whatNeedsDone}</label>
              <textarea
                value={form.whatNeedsDone}
                onChange={e => update('whatNeedsDone', e.target.value)}
                placeholder={isFr ? 'Ex: • Remplacer le joint\n• Tester l\'étanchéité' : 'E.g. • Replace the faucet\n• Test the pipe for leaks'}
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:border-teal-500 outline-none resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t.importantDetails}</label>
              <textarea
                value={form.importantDetails}
                onChange={e => update('importantDetails', e.target.value)}
                placeholder={isFr ? 'Ex: • Appelez avant d\'arriver\n• Apportez votre propre matériel' : 'E.g. • Call before arriving\n• Bring your own tools'}
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:border-teal-500 outline-none resize-y"
              />
            </div>
            </>}

            <section className="border-y border-slate-200 py-5 space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{t.organize}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{t.organizeHint}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['responsibilities', 'requirements', 'skills', 'benefits', 'instructions'] as const).map(key => (
                  <button key={key} type="button" onClick={() => setSelectedSections(current => ({ ...current, [key]: !current[key] }))}
                    className={`rounded-full border px-3 py-2 text-xs font-bold transition ${selectedSections[key] ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300'}`}>
                    <span className="mr-1.5">{selectedSections[key] ? '✓' : '+'}</span>{(t as any)[key]}
                  </button>
                ))}
              </div>
              {(['responsibilities', 'requirements', 'skills', 'benefits', 'instructions'] as const).filter(key => selectedSections[key]).map(key => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-bold text-slate-800">{(t as any)[key]}</label>
                  <textarea value={sectionContent[key]} onChange={e => setSectionContent(current => ({ ...current, [key]: e.target.value }))}
                    placeholder={isFr ? 'Ajoutez vos points ici, un par ligne si nécessaire.' : 'Add your points here, one per line when needed.'} rows={3}
                    className="w-full resize-y border-0 border-b border-slate-300 bg-transparent px-0 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-600" />
                </div>
              ))}
            </section>

            {/* Materials List Editor */}
            <div className="pt-2">
              <MaterialsListEditor
                items={form.materialsList}
                onChangeItems={(items: MaterialItem[]) => update('materialsList', items)}
                requiresDiagnosis={form.requiresDiagnosis}
                onToggleDiagnosis={(val: boolean) => update('requiresDiagnosis', val)}
              />
            </div>

          </div>
        )}

        {/* STEP 2: Budget & Providers */}
        {step === 'budget' && (
          <div className="space-y-6">
            
            <div>
              <label className="block text-sm font-extrabold text-gray-800 mb-3">{isFr ? 'Budget estimé (XAF)' : 'Estimated Budget Range (XAF)'}</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-gray-500 block mb-1">{t.budgetMin}</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">XAF</span>
                    <input
                      type="number"
                      value={form.budgetMin}
                      onChange={e => update('budgetMin', e.target.value)}
                      placeholder="5,000"
                      className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-800 focus:border-teal-500 outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-500 block mb-1">{t.budgetMax}</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">XAF</span>
                    <input
                      type="number"
                      value={form.budgetMax}
                      onChange={e => update('budgetMax', e.target.value)}
                      placeholder="15,000"
                      className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-800 focus:border-teal-500 outline-none font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Number of Providers Needed */}
            <div>
              <label className="block text-sm font-extrabold text-gray-800 mb-2">{t.providersNeeded}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROVIDER_TIERS.map(pt => {
                  const isSelected = form.providerTier === pt.value;
                  return (
                    <div
                      key={pt.value}
                      onClick={() => {
                        update('providerTier', pt.value);
                        update('providersNeeded', String(pt.defaultCount));
                        update('exactProviders', String(pt.defaultCount));
                      }}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected ? 'border-teal-600 bg-teal-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-bold text-gray-900">{isFr ? pt.fr : pt.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{pt.desc}</div>
                    </div>
                  );
                })}
              </div>

              {form.providerTier === 'custom' && (
                <div className="mt-3">
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    {isFr ? 'Entrez le nombre exact de prestataires requis :' : 'Enter the exact number of providers needed:'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={form.exactProviders}
                    onChange={e => {
                      update('exactProviders', e.target.value);
                      update('providersNeeded', e.target.value);
                    }}
                    className="w-32 border border-gray-300 rounded-xl px-4 py-2 text-sm font-bold text-teal-800 outline-none focus:border-teal-500"
                  />
                </div>
              )}
            </div>

          </div>
        )}

        {/* STEP 3: Schedule & Urgency */}
        {step === 'schedule' && (
          <div className="space-y-6">
            
            {/* Preferred Date & Time */}
            <div>
              <label className="block text-sm font-extrabold text-gray-800 mb-1">{t.scheduledTime}</label>
              <input
                type="datetime-local"
                value={form.scheduledTime}
                onChange={e => update('scheduledTime', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:border-teal-500 outline-none"
              />
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-extrabold text-gray-800 mb-2">{t.priority}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRIORITY_OPTIONS.map(opt => {
                  const isSel = form.priority === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => update('priority', opt.value)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                        isSel ? 'border-teal-600 bg-teal-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-bold text-gray-900">{isFr ? opt.fr : opt.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expiry Date (Auto-removal from feed) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <label className="block text-sm font-extrabold text-gray-800">{t.expiryDate}</label>
                <span className="text-xs text-slate-500">{t.expiryDateDesc}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="date"
                  value={form.expiryDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => update('expiryDate', e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:border-teal-500 outline-none bg-white"
                />
                <div className="flex items-center gap-2">
                  {[7, 14, 30].map(days => {
                    const targetDate = new Date();
                    targetDate.setDate(targetDate.getDate() + days);
                    const dateStr = targetDate.toISOString().split('T')[0];
                    const isSelected = form.expiryDate === dateStr;
                    return (
                      <button
                        key={days}
                        type="button"
                        onClick={() => update('expiryDate', dateStr)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                          isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        +{days} {isFr ? 'Jours' : 'Days'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 4: Review */}
        {step === 'review' && (
          <div className="space-y-6">
            
            <div className="border border-gray-200 rounded-xl p-5 space-y-4 bg-gray-50/50">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-xs font-bold text-gray-500 uppercase">{isFr ? 'Titre de la mission' : 'Job Title'}</span>
                <span className="text-sm font-extrabold text-gray-900">{form.title}</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-xs font-bold text-gray-500 uppercase">{isFr ? 'Catégorie' : 'Category'}</span>
                <span className="text-sm font-bold text-teal-700 inline-flex items-center gap-1"><span className="material-symbols-rounded text-base">{categorySymbol(derivedCategoryObj.value)}</span>{isFr ? derivedCategoryObj.fr : derivedCategoryObj.label}</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-xs font-bold text-gray-500 uppercase">{isFr ? 'Lieu / Type' : 'Location / Type'}</span>
                <span className="text-sm font-bold text-gray-800">{form.isRemote ? (isFr ? '💻 À distance' : '💻 Remote') : `📍 ${form.location}`}</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-xs font-bold text-gray-500 uppercase">{isFr ? 'Fourchette budgétaire' : 'Budget Range'}</span>
                <span className="text-sm font-black text-teal-800">
                  {Number(form.budgetMin).toLocaleString()} - {Number(form.budgetMax).toLocaleString()} XAF
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-xs font-bold text-gray-500 uppercase">{isFr ? 'Prestataires requis' : 'Providers Needed'}</span>
                <span className="text-sm font-extrabold text-gray-800">{form.exactProviders || form.providersNeeded} provider(s)</span>
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold text-gray-500 uppercase block mb-1">{isFr ? 'Description' : 'Description'}</span>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-200">{form.description}</p>
              </div>
              {form.whatNeedsDone && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-gray-500 uppercase block mb-1">{t.whatNeedsDone}</span>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-200">{form.whatNeedsDone}</p>
                </div>
              )}
              {form.importantDetails && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-gray-500 uppercase block mb-1">{t.importantDetails}</span>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-200">{form.importantDetails}</p>
                </div>
              )}
            </div>

            <div className="bg-white border border-teal-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-3"><div><h4 className="text-sm font-extrabold text-gray-900">{isFr ? 'Questions de candidature' : 'Application Questions'}</h4><p className="text-xs text-gray-500">{isFr ? 'Questions facultatives auxquelles les candidats doivent répondre.' : 'Optional questions applicants must answer.'}</p></div><button type="button" onClick={() => update('applicationQuestions', [...form.applicationQuestions, { id: `q_${Date.now()}`, prompt: '', type: 'YES_NO', required: false, options: [] }])} className="px-3 py-2 rounded-lg bg-teal-600 text-white text-xs font-bold">+ {isFr ? 'Ajouter' : 'Add question'}</button></div>
              {form.applicationQuestions.map((question: any, index: number) => <div key={question.id} className="border border-gray-200 rounded-xl p-3 space-y-2"><div className="flex gap-2"><input value={question.prompt} onChange={(e) => update('applicationQuestions', form.applicationQuestions.map((q: any, i: number) => i === index ? { ...q, prompt: e.target.value } : q))} placeholder={isFr ? 'Saisissez la question' : 'Enter the question'} className="flex-1 px-3 py-2 text-xs border rounded-lg"/><button type="button" onClick={() => update('applicationQuestions', form.applicationQuestions.filter((_: any, i: number) => i !== index))} className="text-red-600">×</button></div><div className="flex gap-3"><select value={question.type} onChange={(e) => { const type = e.target.value; update('applicationQuestions', form.applicationQuestions.map((q: any, i: number) => i === index ? { ...q, type, options: ['SINGLE_CHOICE','MULTI_CHOICE'].includes(type) ? (q.options.length ? q.options : ['', '']) : [] } : q)); }} className="px-3 py-2 text-xs border rounded-lg">{['YES_NO','CHECKBOX','SHORT_TEXT','LONG_TEXT','NUMBER','DATE','SINGLE_CHOICE','MULTI_CHOICE'].map(type => <option key={type}>{type}</option>)}</select><label className="text-xs font-bold flex items-center gap-2"><input type="checkbox" checked={question.required} onChange={(e) => update('applicationQuestions', form.applicationQuestions.map((q: any, i: number) => i === index ? { ...q, required: e.target.checked } : q))}/>{isFr ? 'Obligatoire' : 'Required'}</label></div>{['SINGLE_CHOICE','MULTI_CHOICE'].includes(question.type) && <div>{question.options.map((option: string, oi: number) => <input key={oi} value={option} onChange={(e) => update('applicationQuestions', form.applicationQuestions.map((q: any, i: number) => i === index ? { ...q, options: q.options.map((o: string, j: number) => j === oi ? e.target.value : o) } : q))} placeholder={`Option ${oi + 1}`} className="w-full mt-2 px-3 py-2 text-xs border rounded-lg"/>)}<button type="button" onClick={() => update('applicationQuestions', form.applicationQuestions.map((q: any, i: number) => i === index ? { ...q, options: [...q.options, ''] } : q))} className="text-xs text-teal-700 font-bold mt-2">+ Option</button></div>}</div>)}
            </div>

            {/* Premium Monetization & Delivery Options */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900">
                    {isFr ? 'Options de mise en avant et réception' : 'Boost and Delivery Options'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isFr ? 'Options facultatives pour maximiser la visibilité de votre offre' : 'Optional upgrades to accelerate your hiring'}
                  </p>
                </div>
              </div>

              {/* Option 1: Pin at top (5 coins) */}
              <div
                onClick={() => update('isPinned', !form.isPinned)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                  form.isPinned ? 'border-amber-400 bg-amber-50/60' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center font-black text-xs shrink-0 ${
                  form.isPinned ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300 bg-white'
                }`}>
                  {form.isPinned ? '✓' : ''}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">
                      {isFr ? 'Épingler en haut des offres (7 jours)' : 'Pin Job at Top of Feed (7 Days)'}
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                      5 {isFr ? 'Pièces' : 'Coins'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {isFr
                      ? "Votre annonce restera épinglée en haut de page avec la mention 'EN VEDETTE' pour attirer les meilleurs prestataires en premier."
                      : "Your listing stays pinned at the very top of provider job discovery with a 'FEATURED' badge for 7 days."}
                  </p>
                </div>
              </div>

              {/* Option 2: Forward applicants to email (3 coins) */}
              <div
                onClick={() => update('forwardToEmail', !form.forwardToEmail)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col gap-3 ${
                  form.forwardToEmail ? 'border-teal-400 bg-teal-50/50' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center font-black text-xs shrink-0 ${
                    form.forwardToEmail ? 'border-teal-600 bg-teal-600 text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {form.forwardToEmail ? '✓' : ''}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">
                        {isFr ? 'Transférer les candidatures par e-mail' : 'Direct Candidate Email Forwarding'}
                      </span>
                      <span className="bg-teal-100 text-teal-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                        3 {isFr ? 'Pièces' : 'Coins'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {isFr
                        ? "Recevez instantanément chaque CV et dossier de candidat directement dans votre boîte de messagerie professionnelle."
                        : "Instantly receive candidate resumes and full profiles directly in your recruitment inbox."}
                    </p>
                  </div>
                </div>

                {form.forwardToEmail && (
                  <div className="pl-8 pt-1" onClick={(e) => e.stopPropagation()}>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {isFr ? 'Adresse e-mail de réception :' : 'Recruiter / Hiring Email:'}
                    </label>
                    <input
                      type="email"
                      value={form.hiringEmail}
                      onChange={(e) => update('hiringEmail', e.target.value)}
                      placeholder="recruitment@yourcompany.com"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-teal-500 bg-white"
                    />
                  </div>
                )}
              </div>

              {(form.isPinned || form.forwardToEmail) && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <span className="text-gray-600 font-medium">{isFr ? 'Frais d\'options supplémentaires :' : 'Extra Options Fee:'}</span>
                  <span className="font-black text-teal-800 text-sm">
                    {(form.isPinned ? 5 : 0) + (form.forwardToEmail ? 3 : 0)} Fixam Coins
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800 flex items-start gap-2">
              <span className="text-base">🛡️</span>
              <p className="leading-relaxed">
                {isFr 
                  ? 'Toutes les missions sont vérifiées par notre équipe avant publication pour garantir une sécurité maximale à nos utilisateurs.' 
                  : 'All jobs require admin approval before going live to ensure top quality and safety across our platform.'}
              </p>
            </div>

          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition cursor-pointer"
            >
              ← {t.back}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('My Jobs')}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition cursor-pointer"
            >
              {t.cancel}
            </button>
          )}

          {step !== 'review' ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-xl font-extrabold text-sm text-white transition shadow-sm cursor-pointer ${
                canProceed() ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-300 cursor-not-allowed opacity-60'
              }`}
            >
              {t.next} →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl font-extrabold text-sm text-white bg-teal-600 hover:bg-teal-700 transition shadow-md cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>{t.submitting}</span>
              ) : (
                <span>{t.submit}</span>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
