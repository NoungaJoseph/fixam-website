import React, { useMemo, useState } from 'react';

type Props = { isOpen: boolean; onClose: () => void; onGenerated: (letter: string) => void; job: any; user: any; isFr: boolean };
const clean = (value: any) => String(value || '').replace(/\s+/g, ' ').trim();

export default function CoverLetterAssistant({ isOpen, onClose, onGenerated, job, user, isFr }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const questions = useMemo(() => isFr ? [
    `Quel travail réel avez-vous déjà réalisé qui ressemble à « ${job?.title || 'ce projet'} » ?`,
    'Quelle méthode allez-vous utiliser pour réaliser cette mission ?',
    'Quand pouvez-vous commencer et quel délai estimez-vous ?',
  ] : [
    `What real work have you completed that is similar to “${job?.title || 'this project'}”?`,
    'What method will you use to complete this job?',
    'When can you start and what timeline do you estimate?',
  ], [job?.title, isFr]);
  if (!isOpen) return null;
  const createLetter = () => {
    const profile = user?.providerProfile || {};
    const skills = Array.isArray(profile.skills) ? profile.skills : (Array.isArray(user?.skills) ? user.skills : []);
    const reviews = Array.isArray(user?.reviews) ? user.reviews : [];
    const review = reviews.map((item: any) => clean(item.comment || item.text || item.message || item.review)).find(Boolean);
    const facts = [
      skills.length ? (isFr ? `Compétences indiquées dans mon profil : ${skills.slice(0, 4).join(', ')}.` : `My profile lists these skills: ${skills.slice(0, 4).join(', ')}.`) : '',
      clean(profile.bio || user?.bio).slice(0, 220),
      profile.yearsExperience ? (isFr ? `${profile.yearsExperience} années d'expérience indiquées dans mon profil.` : `${profile.yearsExperience} years of experience listed on my profile.`) : '',
      profile.rating ? (isFr ? `Évaluation moyenne : ${profile.rating}/5.` : `Average rating: ${profile.rating}/5.`) : '',
      review ? (isFr ? `Un avis client récent souligne : « ${review.slice(0, 150)} ».` : `Recent client feedback highlights: “${review.slice(0, 150)}”.`) : '',
    ].filter(Boolean).join(' ');
    const description = clean(job?.description || job?.whatNeedsDone || job?.requirements).slice(0, 170);
    const name = user?.fullName || user?.name || (isFr ? 'Professionnel Fixam' : 'Fixam professional');
    const answer = (key: string) => clean(answers[key]);
    const letter = isFr ? [
      `Bonjour, je souhaite vous proposer mon aide pour « ${job?.title || 'votre projet'} ».`, description ? `J'ai bien compris votre besoin : ${description}.` : '', facts || 'Consultez mon profil pour découvrir mes informations vérifiées.', answer('experience') ? `Pour une mission similaire, mon expérience réelle est : ${answer('experience')}.` : '', answer('approach') ? `Pour ce projet, je procéderai ainsi : ${answer('approach')}.` : 'Je confirmerai les priorités avec vous avant de commencer.', answer('availability') ? `Disponibilité et délai estimé : ${answer('availability')}.` : '', 'Je serais heureux d’échanger avec vous sur les détails.', `Cordialement,\n${name}`,
    ].filter(Boolean).join('\n\n') : [
      `Hello, I would like to help with “${job?.title || 'your project'}”.`, description ? `I understand that you need: ${description}.` : '', facts || 'Please review my profile for my verified information.', answer('experience') ? `For similar work, my real experience is: ${answer('experience')}.` : '', answer('approach') ? `For this project, I will work as follows: ${answer('approach')}.` : 'I will confirm the priorities with you before starting.', answer('availability') ? `Availability and estimated timeline: ${answer('availability')}.` : '', 'I would be glad to discuss the details with you.', `Best regards,\n${name}`,
    ].filter(Boolean).join('\n\n');
    onGenerated(letter); onClose();
  };
  return <div className="fixed inset-0 z-[1000030] flex items-end justify-center bg-slate-950/50 p-3 sm:items-center" onClick={onClose}><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-black text-slate-900">{isFr ? 'Créer ma lettre de motivation' : 'Make my cover letter'}</h3><p className="mt-1 text-sm text-slate-500">{isFr ? "Répondez uniquement avec des informations vraies. Nous n'inventons pas votre expérience." : 'Answer only with true information. We never invent your experience.'}</p></div><button type="button" onClick={onClose} className="text-2xl text-slate-400">×</button></div><div className="mt-4 space-y-4">{questions.map((question, index) => { const key = ['experience', 'approach', 'availability'][index]; return <label key={key} className="block text-sm font-bold text-slate-800">{question}<textarea rows={3} value={answers[key] || ''} onChange={(event) => setAnswers({ ...answers, [key]: event.target.value })} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-teal-500" placeholder={isFr ? 'Réponse facultative, uniquement si elle est vraie.' : 'Optional, only provide information that is true.'} /></label>; })}</div><button type="button" onClick={createLetter} className="mt-5 w-full rounded-xl bg-teal-600 px-4 py-3 font-black text-white hover:bg-teal-700">{isFr ? 'Créer ma lettre de motivation' : 'Create my cover letter'}</button></div></div>;
}
