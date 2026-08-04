import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  { value: 'LOW', label: 'Low – Flexible schedule', fr: 'Faible – Flexible' },
  { value: 'NORMAL', label: 'Normal – Within a few days', fr: 'Normal – Dans quelques jours' },
  { value: 'HIGH', label: 'Urgent – As soon as possible', fr: 'Urgent – Dès que possible' },
];

const SCOPE_OPTIONS = [
  { value: 'SMALL', label: 'Small – Less than a day', fr: 'Petit – Moins d\'une journée' },
  { value: 'MEDIUM', label: 'Medium – 1 to 3 days', fr: 'Moyen – 1 à 3 jours' },
  { value: 'LARGE', label: 'Large – More than 3 days', fr: 'Grand – Plus de 3 jours' },
];

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (job: any) => void;
  isFr?: boolean;
}

type Step = 'category' | 'details' | 'budget' | 'schedule' | 'review';

export default function PostJobModal({ isOpen, onClose, onSuccess, isFr = false }: PostJobModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('category');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    category: '',
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
  });

  if (!isOpen) return null;

  const t = {
    title: isFr ? 'Poster une tâche' : 'Post a Job',
    step1: isFr ? 'Catégorie' : 'Category',
    step2: isFr ? 'Détails' : 'Details',
    step3: isFr ? 'Budget' : 'Budget',
    step4: isFr ? 'Planning' : 'Schedule',
    step5: isFr ? 'Aperçu' : 'Review',
    next: isFr ? 'Suivant' : 'Next',
    back: isFr ? 'Retour' : 'Back',
    submit: isFr ? 'Publier la tâche' : 'Publish Job',
    submitting: isFr ? 'Publication...' : 'Publishing...',
    selectCategory: isFr ? 'Sélectionnez une catégorie' : 'Select a category',
    jobTitle: isFr ? 'Titre du travail' : 'Job Title',
    jobTitlePlaceholder: isFr ? 'Ex: Réparer une fuite d\'eau...' : 'E.g. Fix a water leak...',
    description: isFr ? 'Description' : 'Description',
    descriptionPlaceholder: isFr ? 'Décrivez le travail en détail...' : 'Describe the job in detail...',
    whatNeedsDone: isFr ? 'Que doit-on faire ?' : 'What needs to be done?',
    whatNeedsDonePlaceholder: isFr ? 'Listez les tâches spécifiques...' : 'List specific tasks...',
    importantDetails: isFr ? 'Détails importants' : 'Important Details',
    importantDetailsPlaceholder: isFr ? 'Outils, matériaux requis...' : 'Tools, materials needed...',
    location: isFr ? 'Lieu de travail' : 'Work Location',
    locationPlaceholder: isFr ? 'Ex: Yaoundé, Bastos' : 'E.g. Yaoundé, Bastos',
    isRemote: isFr ? 'Travail à distance possible' : 'Can be done remotely',
    budgetMin: isFr ? 'Budget minimum (FCFA)' : 'Minimum Budget (FCFA)',
    budgetMax: isFr ? 'Budget maximum (FCFA)' : 'Maximum Budget (FCFA)',
    providersNeeded: isFr ? 'Nombre de prestataires' : 'Number of providers needed',
    priority: isFr ? 'Priorité' : 'Priority',
    taskScope: isFr ? 'Durée estimée' : 'Estimated Duration',
    scheduledTime: isFr ? 'Date souhaitée' : 'Preferred Start Date',
    verificationRequired: isFr
      ? 'Votre compte doit être vérifié pour poster une tâche.'
      : 'Your account must be verified to post a job.',
    insufficientCoins: isFr
      ? 'Solde de coins insuffisant. Rechargez votre portefeuille.'
      : 'Insufficient coins. Please top up your wallet.',
  };

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const steps: Step[] = ['category', 'details', 'budget', 'schedule', 'review'];
  const stepIndex = steps.indexOf(step);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const canProceed = () => {
    if (step === 'category') return !!form.category;
    if (step === 'details') return form.title.length >= 5 && form.description.length >= 10 && form.location.length > 0;
    if (step === 'budget') return Number(form.budgetMin) > 0 && Number(form.budgetMax) >= Number(form.budgetMin);
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
      const payload: any = {
        category: form.category,
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
      };
      if (form.whatNeedsDone) payload.whatNeedsDone = form.whatNeedsDone;
      if (form.importantDetails) payload.importantDetails = form.importantDetails;
      if (form.scheduledTime) payload.scheduledTime = new Date(form.scheduledTime).toISOString();

      const res = await api.post('/jobs', payload);
      if (res.data.success) {
        onSuccess(res.data.data);
        onClose();
        // Reset
        setStep('category');
        setForm({
          category: '', title: '', description: '', whatNeedsDone: '', importantDetails: '',
          location: '', isRemote: false, budgetMin: '', budgetMax: '',
          providersNeeded: '1', priority: 'NORMAL', taskScope: 'SMALL', scheduledTime: '',
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || (isFr ? 'Échec de la publication.' : 'Failed to publish job.');
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = SERVICE_CATEGORIES.find(c => c.value === form.category);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isFr ? `Étape ${stepIndex + 1} sur ${steps.length}` : `Step ${stepIndex + 1} of ${steps.length}`}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-3">
          <div className="flex gap-1.5 mb-1">
            {steps.map((s, i) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= stepIndex ? 'bg-[#14B8A6]' : 'bg-gray-200'}`} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span className="font-medium text-[#14B8A6]">
              {step === 'category' ? t.step1 : step === 'details' ? t.step2 : step === 'budget' ? t.step3 : step === 'schedule' ? t.step4 : t.step5}
            </span>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mb-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
            {error}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 flex-1">

          {/* STEP 1: Category */}
          {step === 'category' && (
            <div className="animate-fade-in">
              <p className="text-gray-500 text-sm mb-4">{t.selectCategory}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SERVICE_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => update('category', cat.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                      form.category === cat.value
                        ? 'border-[#14B8A6] bg-teal-50 text-[#0F9788]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-medium leading-tight">{isFr ? cat.fr : cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Details */}
          {step === 'details' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t.jobTitle} *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  placeholder={t.jobTitlePlaceholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t.description} *</label>
                <textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder={t.descriptionPlaceholder}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t.whatNeedsDone}</label>
                <textarea
                  value={form.whatNeedsDone}
                  onChange={e => update('whatNeedsDone', e.target.value)}
                  placeholder={t.whatNeedsDonePlaceholder}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t.importantDetails}</label>
                <textarea
                  value={form.importantDetails}
                  onChange={e => update('importantDetails', e.target.value)}
                  placeholder={t.importantDetailsPlaceholder}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t.location} *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => update('location', e.target.value)}
                  placeholder={t.locationPlaceholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => update('isRemote', !form.isRemote)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.isRemote ? 'bg-[#14B8A6]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isRemote ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-800">{t.isRemote}</span>
              </label>
            </div>
          )}

          {/* STEP 3: Budget */}
          {step === 'budget' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t.budgetMin} *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">XAF</span>
                    <input
                      type="number"
                      value={form.budgetMin}
                      onChange={e => update('budgetMin', e.target.value)}
                      placeholder="5,000"
                      min="0"
                      className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t.budgetMax} *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">XAF</span>
                    <input
                      type="number"
                      value={form.budgetMax}
                      onChange={e => update('budgetMax', e.target.value)}
                      placeholder="20,000"
                      min="0"
                      className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t.providersNeeded}</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => update('providersNeeded', String(Math.max(1, Number(form.providersNeeded) - 1)))}
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-lg"
                  >−</button>
                  <span className="text-xl font-bold text-gray-900 w-6 text-center">{form.providersNeeded}</span>
                  <button
                    onClick={() => update('providersNeeded', String(Math.min(30, Number(form.providersNeeded) + 1)))}
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-lg"
                  >+</button>
                  <span className="text-xs text-gray-400 ml-2">
                    {isFr ? `Coût: ${Number(form.providersNeeded) <= 5 ? 1 : Number(form.providersNeeded) <= 10 ? 2 : 3} coin(s)` : `Cost: ${Number(form.providersNeeded) <= 5 ? 1 : Number(form.providersNeeded) <= 10 ? 2 : 3} coin(s)`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.priority}</label>
                <div className="space-y-2">
                  {PRIORITY_OPTIONS.map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-teal-300 transition">
                      <input
                        type="radio"
                        name="priority"
                        value={opt.value}
                        checked={form.priority === opt.value}
                        onChange={() => update('priority', opt.value)}
                        className="accent-[#14B8A6]"
                      />
                      <span className="text-sm text-gray-700">{isFr ? opt.fr : opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Schedule */}
          {step === 'schedule' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.taskScope}</label>
                <div className="space-y-2">
                  {SCOPE_OPTIONS.map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-teal-300 transition">
                      <input
                        type="radio"
                        name="taskScope"
                        value={opt.value}
                        checked={form.taskScope === opt.value}
                        onChange={() => update('taskScope', opt.value)}
                        className="accent-[#14B8A6]"
                      />
                      <span className="text-sm text-gray-700">{isFr ? opt.fr : opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t.scheduledTime} ({isFr ? 'optionnel' : 'optional'})</label>
                <input
                  type="datetime-local"
                  value={form.scheduledTime}
                  onChange={e => update('scheduledTime', e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Review */}
          {step === 'review' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <span className="text-2xl">{selectedCategory?.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900">{form.title}</p>
                    <p className="text-gray-500 text-xs">{isFr ? selectedCategory?.fr : selectedCategory?.label}</p>
                  </div>
                </div>
                <ReviewRow label={isFr ? 'Description' : 'Description'} value={form.description} />
                {form.whatNeedsDone && <ReviewRow label={t.whatNeedsDone} value={form.whatNeedsDone} />}
                {form.importantDetails && <ReviewRow label={t.importantDetails} value={form.importantDetails} />}
                <ReviewRow label={t.location} value={`${form.location}${form.isRemote ? (isFr ? ' (distance possible)' : ' (remote ok)') : ''}`} />
                <ReviewRow label={t.budgetMin} value={`XAF ${Number(form.budgetMin).toLocaleString()} – ${Number(form.budgetMax).toLocaleString()}`} />
                <ReviewRow label={t.providersNeeded} value={form.providersNeeded} />
                <ReviewRow label={t.priority} value={PRIORITY_OPTIONS.find(o => o.value === form.priority)?.[isFr ? 'fr' : 'label'] || form.priority} />
                <ReviewRow label={t.taskScope} value={SCOPE_OPTIONS.find(o => o.value === form.taskScope)?.[isFr ? 'fr' : 'label'] || form.taskScope} />
                {form.scheduledTime && <ReviewRow label={t.scheduledTime} value={new Date(form.scheduledTime).toLocaleString()} />}
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-xs flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {isFr
                  ? 'Votre tâche sera examinée avant publication. Cela peut prendre quelques minutes.'
                  : 'Your job will be reviewed before it goes live. This usually takes a few minutes.'}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 gap-3">
          {step !== 'category' ? (
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              {t.back}
            </button>
          ) : <div />}

          {step !== 'review' ? (
            <button
              onClick={goNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#14B8A6] text-white rounded-xl text-sm font-semibold hover:bg-[#0F9788] transition disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              {t.next}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#14B8A6] text-white rounded-xl text-sm font-semibold hover:bg-[#0F9788] transition disabled:opacity-50 ml-auto"
            >
              {isSubmitting && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
              {isSubmitting ? t.submitting : t.submit}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex gap-3">
      <span className="text-gray-400 w-32 shrink-0">{label}</span>
      <span className="text-gray-700 font-medium">{String(value)}</span>
    </div>
  );
}
