import { useTranslation } from 'react-i18next';
import { Icon } from '../../App';

type Props = {
  job: any;
  onBack: () => void;
  onApply: () => void;
};

export default function ProviderJobDetailPage({ job, onBack, onApply }: Props) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const details = Array.isArray(job.details) ? job.details.filter((item: any) => item?.content && item.key !== 'description') : [];
  const pay = job.salary || (Number(job.budget || job.budgetMax || 0) ? `${Number(job.budget || job.budgetMax).toLocaleString()} XAF` : (isFr ? 'À convenir' : 'Negotiable'));

  return (
    <main className="provider-job-detail-page animate-fade-in">
      <button className="upwork-btn-text provider-job-detail-back" onClick={onBack}>
        ← {isFr ? 'Retour aux opportunités' : 'Back to opportunities'}
      </button>

      <div className="provider-job-detail-layout">
        <article>
          <p className="provider-job-detail-eyebrow">
            {job.companyName || job.category || (isFr ? 'Opportunité' : 'Opportunity')}
          </p>
          <h1 className="provider-job-detail-title">{job.title}</h1>
          <div className="provider-job-detail-meta">
            <span><Icon name="location" />{job.location || (job.isRemote ? (isFr ? 'À distance' : 'Remote') : (isFr ? 'Lieu à confirmer' : 'Location to be confirmed'))}</span>
            <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : (isFr ? 'Publié récemment' : 'Posted recently')}</span>
          </div>

          <section className="provider-job-detail-section">
            <h2>{isFr ? 'À propos du poste' : 'About this job'}</h2>
            <p>{job.description || (isFr ? 'Les détails seront communiqués par le recruteur.' : 'The recruiter will provide the full details.')}</p>
          </section>

          {details.map((item: any) => (
            <section className="provider-job-detail-section" key={item.key || item.label}>
              <h2>{item.label || item.key}</h2>
              <p>{item.content}</p>
            </section>
          ))}
          {job.requirements && <section className="provider-job-detail-section"><h2>{isFr ? 'Exigences' : 'Requirements'}</h2><p>{job.requirements}</p></section>}
        </article>

        <aside className="provider-job-detail-sidebar">
          <p className="provider-job-detail-label">{job.isExternal ? (isFr ? 'Salaire' : 'Salary') : 'Budget'}</p>
          <strong className="provider-job-detail-pay">{pay}</strong>
          <button className="btn-upwork-primary provider-job-detail-apply" onClick={onApply}>
            {isFr ? 'Postuler maintenant' : 'Apply now'}
          </button>
          <p className="provider-job-detail-note">
            {isFr ? 'Votre CV ne sera joint que si vous le choisissez dans le formulaire de candidature.' : 'Your CV is attached only if you choose it in the application form.'}
          </p>
        </aside>
      </div>
    </main>
  );
}
