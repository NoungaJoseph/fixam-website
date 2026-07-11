import './SavedProviders.css';
import { Icon } from '../../App';

interface SavedProvidersProps {
  savedProsState: any[];
  setSavedProsState: (pros: any[]) => void;
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
}

export default function SavedProviders({ savedProsState, setSavedProsState, setActiveTab, setActiveChatUser }: SavedProvidersProps) {
  return (
    <div className="dash-panel-premium full-width-panel animate-fade-in">
      <div className="dash-panel-header-new">
        <h2>Saved Providers</h2>
        <button className="panel-link" onClick={() => setActiveTab('Find Services')}>Browse More</button>
      </div>
      {savedProsState.length === 0 ? (
        <p>No saved providers yet.</p>
      ) : (
        <div className="saved-providers-grid">
          {savedProsState.map((pro, index) => (
            <div className="recommended-card-premium saved-card" key={index}>
              <div className="avatar-wrapper">
                <img src={pro.image} alt={pro.name} />
              </div>
              <h4>{pro.name}</h4>
              <span className="provider-cat-badge">{pro.role}</span>
              <div className="rating-row-premium">
                <Icon name="star" />
                <span>{pro.rating}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '1rem' }}>
                <button 
                  className="btn-card-primary" 
                  style={{ flex: 1 }}
                  onClick={() => {
                    setActiveTab('Messages');
                    setActiveChatUser(pro.name);
                  }}
                >
                  Chat
                </button>
                <button 
                  className="outline-button"
                  style={{ padding: '0.4rem', border: '1px solid var(--line)', minHeight: 'auto', borderRadius: '6px' }}
                  onClick={() => {
                    setSavedProsState(savedProsState.filter(p => p.id !== pro.id));
                    alert(`${pro.name} removed from saved.`);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
