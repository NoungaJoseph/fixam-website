import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { Icon } from '../../App';

interface ProviderSupportProps {
  setActiveTab?: (tab: string) => void;
  setActiveChatUser?: (user: string) => void;
}

export default function ProviderSupport({ setActiveTab, setActiveChatUser }: ProviderSupportProps) {
  const { i18n } = useTranslation();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create support chat
      const res = await api.post('/chat/support');
      const supportConvId = res.data?.data?.id;
      
      // Send the initial message
      if (supportConvId && message) {
        await api.post('/chat/send', {
          conversationId: supportConvId,
          content: `Subject: ${subject}\n\n${message}`
        });
        
        alert(i18n.language === 'fr' ? 'Ticket d\'assistance soumis avec succès !' : 'Support ticket submitted successfully!');
        if (setActiveTab && setActiveChatUser) {
          setActiveChatUser(supportConvId);
          setActiveTab('Messages');
        }
      } else {
        alert(i18n.language === 'fr' ? 'Chat d\'assistance créé. Un agent de support vous contactera bientôt.' : 'Support chat created. A support agent will contact you soon.');
      }
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error("Failed to submit support ticket", err);
      alert(err.response?.data?.message || (i18n.language === 'fr' ? 'Échec de la soumission du ticket' : 'Failed to submit ticket'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: i18n.language === 'fr' ? 'Comment suis-je payé par les clients ?' : 'How do I get paid by clients?',
      a: i18n.language === 'fr'
        ? 'Les clients vous paient directement en espèces à la fin du service. Fixam ne gère pas les paiements et ne prélevé aucun frais de transfert.'
        : 'Clients pay you cash directly upon completion of the service. Fixam does not handle payments or charge transfer fees.'
    },
    {
      q: i18n.language === 'fr' ? 'Comment soumettre des propositions de mission ?' : 'How do I submit job proposals?',
      a: i18n.language === 'fr'
        ? 'Parcourez les opportunités dans votre tableau de bord, cliquez sur "Envoyer une proposition" et indiquez votre estimation. Si acceptée, vous serez mis en relation avec le client.'
        : 'Browse leads under "Job Leads", click "Send Proposal", and specify your estimate. If accepted, you will get linked with the client.'
    },
    {
      q: i18n.language === 'fr' ? 'À quoi servent les pièces Fixam ?' : 'What are Fixam coins used for?',
      a: i18n.language === 'fr'
        ? 'Postuler et être mis en relation avec les clients est 100% gratuit. Les pièces Fixam sont des crédits optionnels utilisés uniquement si vous choisissez de booster votre profil ou de mettre vos propositions en tête de liste.'
        : 'Applying for jobs and connecting with clients is 100% free. Fixam coins are optional credits used only if you choose to boost your profile or highlight your proposals at the top of client listings.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in w-full space-y-8">
      
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {i18n.language === 'fr' ? 'Centre d\'assistance prestataire' : 'Provider Support Center'}
        </h2>
        <p className="text-gray-500">
          {i18n.language === 'fr' ? 'Besoin d\'aide ? Parcourez nos FAQ ou soumettez une demande ci-dessous.' : 'Need help? Browse our FAQs or submit a support request below.'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT: FAQ & Help */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {i18n.language === 'fr' ? 'Centre d\'aide & FAQ' : 'Help Center & FAQs'}
            </h3>
            <p className="text-xs text-gray-400">
              {i18n.language === 'fr' ? 'Réponses rapides aux questions fréquentes des prestataires.' : 'Quick answers to frequently asked provider questions.'}
            </p>
          </div>
          
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details 
                key={i} 
                className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer transition hover:border-[#14B8A6] group [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="font-bold text-sm text-slate-800 outline-none flex items-center justify-between">
                  <span>{f.q}</span>
                  <span className="text-[#14B8A6] transition group-open:rotate-180">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </span>
                </summary>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed border-t border-gray-50 pt-2">{f.a}</p>
              </details>
            ))}
          </div>

          {/* Contact Details Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
              {i18n.language === 'fr' ? 'Coordonnées de contact direct' : 'Direct Contact Information'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-[#14B8A6] text-white flex items-center justify-center text-sm">
                  <Icon name="message" />
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">
                    {i18n.language === 'fr' ? 'Assistance e-mail' : 'Email Support'}
                  </span>
                  <a href="mailto:fixam8899@gmail.com" className="block text-sm font-bold text-slate-800 hover:text-[#14B8A6]">
                    fixam8899@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                  <Icon name="bell" />
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">WhatsApp</span>
                  <a href="https://wa.me/237682803006" target="_blank" rel="noopener noreferrer" className="block text-sm font-bold text-slate-800 hover:text-green-600">
                    +237 682803006
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Ticket Submission Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📧</span>
            <h3 className="text-lg font-bold text-gray-800">
              {i18n.language === 'fr' ? 'Soumettre un ticket d\'assistance' : 'Submit Support Ticket'}
            </h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            {i18n.language === 'fr'
              ? 'Décrivez votre problème et notre équipe de support ouvrira une discussion directe pour vous aider.'
              : 'Describe your issue and our support team will open a direct chat conversation to assist you.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-550 uppercase tracking-wider mb-2">
                {i18n.language === 'fr' ? 'Sujet' : 'Subject'}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={i18n.language === 'fr' ? 'ex: Problème de portefeuille' : 'e.g., Wallet payout issue'}
                className="w-full h-11 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-550 uppercase tracking-wider mb-2">
                {i18n.language === 'fr' ? 'Message détaillé' : 'Detailed Message'}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={i18n.language === 'fr' ? 'Veuillez décrire votre problème ou question en détail...' : 'Please describe your problem or question in detail...'}
                rows={5}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] transition resize-none font-sans"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-11 font-bold rounded-xl transition shadow-sm flex items-center justify-center text-white ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#14B8A6] hover:bg-[#0F9788]'
              }`}
            >
              {isSubmitting 
                ? (i18n.language === 'fr' ? 'Envoi en cours...' : 'Submitting...') 
                : (i18n.language === 'fr' ? 'Soumettre le ticket d\'assistance' : 'Submit Support Ticket')}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
