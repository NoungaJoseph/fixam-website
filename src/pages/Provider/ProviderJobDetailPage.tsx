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
    <main className="animate-fade-in" style={{ maxWidth: 1060, margin: '0 auto', padding: '28px 28px 72px' }}>
      <button className="upwork-btn-text" onClick={onBack} style={{ marginBottom: 30 }}>
        ← {isFr ? 'Retour aux opportunités' : 'Back to opportunities'}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(260px, 320px)', gap: 56, alignItems: 'start' }}>
        <article>
          <p style={{ margin: 0, color: '#0D9488', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            {job.companyName || job.category || (isFr ? 'Opportunité' : 'Opportunity')}
          </p>
          <h1 style={{ margin: '12px 0 10px', color: '#0F172A', fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 1.08, letterSpacing: '-.04em' }}>{job.title}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, color: '#64748B', fontSize: 14, paddingBottom: 28, borderBottom: '1px solid #E2E8F0' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="location" />{job.location || (job.isRemote ? (isFr ? 'À distance' : 'Remote') : (isFr ? 'Lieu à confirmer' : 'Location to be confirmed'))}</span>
            <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : (isFr ? 'Publié récemment' : 'Posted recently')}</span>
          </div>

          <section style={{ padding: '34px 0', borderBottom: '1px solid #E2E8F0' }}>
            <h2 style={{ margin: '0 0 14px', color: '#0F172A', fontSize: 21 }}>{isFr ? 'À propos du poste' : 'About this job'}</h2>
            <p style={{ margin: 0, color: '#475569', fontSize: 16, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{job.description || (isFr ? 'Les détails seront communiqués par le recruteur.' : 'The recruiter will provide the full details.')}</p>
          </section>

          {details.map((item: any) => (
            <section key={item.key || item.label} style={{ padding: '26px 0', borderBottom: '1px solid #E2E8F0' }}>
              <h2 style={{ margin: '0 0 10px', color: '#0F172A', fontSize: 18 }}>{item.label || item.key}</h2>
              <p style={{ margin: 0, color: '#475569', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{item.content}</p>
            </section>
          ))}
          {job.requirements && <section style={{ padding: '26px 0', borderBottom: '1px solid #E2E8F0' }}><h2 style={{ margin: '0 0 10px', color: '#0F172A', fontSize: 18 }}>{isFr ? 'Exigences' : 'Requirements'}</h2><p style={{ margin: 0, color: '#475569', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{job.requirements}</p></section>}
        </article>

        <aside style={{ position: 'sticky', top: 24, borderTop: '2px solid #0D9488', paddingTop: 22 }}>
          <p style={{ margin: 0, color: '#64748B', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em' }}>{job.isExternal ? (isFr ? 'Salaire' : 'Salary') : (isFr ? 'Budget' : 'Budget')}</p>
          <strong style={{ display: 'block', color: '#0F172A', fontSize: 24, margin: '7px 0 22px' }}>{pay}</strong>
          <button className="btn-upwork-primary" onClick={onApply} style={{ width: '100%', justifyContent: 'center' }}>
            {isFr ? 'Postuler maintenant' : 'Apply now'}
          </button>
          <p style={{ color: '#64748B', fontSize: 12, lineHeight: 1.55, marginTop: 14 }}>
            {isFr ? 'Votre CV ne sera joint que si vous le choisissez dans le formulaire de candidature.' : 'Your CV is attached only if you choose it in the application form.'}
          </p>
        </aside>
      </div>
    </main>
  );
}
