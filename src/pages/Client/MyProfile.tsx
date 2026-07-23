import './MyProfile.css';
import { useState, useRef, useEffect } from 'react';
import { Icon, images, getMediaUrl } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface MyProfileProps {
  setActiveTab: (tab: string) => void;
  onRoleChange?: (role: 'client' | 'pro') => void;
  userRole?: string;
}

export default function MyProfile({ setActiveTab, onRoleChange, userRole }: MyProfileProps) {
  const { user, refreshUser } = useAuth();
  const [profileActiveSubTab, setProfileActiveSubTab] = useState('Overview');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preferences, setPreferences] = useState({ providerType: 'all' });
  
  const [reviews, setReviews] = useState([]);
  const [savedPros, setSavedPros] = useState([]);

  useEffect(() => {
    if (profileActiveSubTab === 'Saved Providers') {
      // api.get('/users/saved-providers').then((res: any) => setSavedPros(res.data)).catch(console.error);
    }
    if (profileActiveSubTab === 'Reviews') {
      if (user?.id) {
        api.get(`/reviews/users/${user.id}`).then((res: any) => setReviews(res.data?.data || [])).catch(console.error);
      }
    }
    if (profileActiveSubTab === 'Preferences') {
      const savedPrefs = localStorage.getItem('fixam_preferences');
      if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
    }
  }, [profileActiveSubTab]);

  const fullName = user?.fullName || `${user?.firstName} ${user?.lastName}`.trim() || 'Client';

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file); // Matches the backend acceptFile configuration

    try {
      await api.post('/upload/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await refreshUser(); // Refresh user data to get new image URL
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture.');
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem('fixam_preferences', JSON.stringify(preferences));
    alert('Preferences saved!');
  };

  const toggleRole = () => {
    if (user?.role === 'PROVIDER' && onRoleChange) {
      onRoleChange(userRole === 'client' ? 'pro' : 'client');
    } else {
      alert("You need to register as a provider first to switch to the provider dashboard.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in w-full">
      {/* Profile Header */}
      <div className="mb-8 relative bg-transparent">
        <div className="flex flex-col md:flex-row items-center md:items-end text-center md:text-left gap-6 relative">
          <div className="relative flex-shrink-0">
            <img src={user?.image ? getMediaUrl(user.image) : images.proJeff} alt={fullName} className="w-28 h-28 rounded-full shadow-md object-cover bg-gray-100" />
            <button 
              className="absolute bottom-0 right-0 bg-[#14B8A6] text-white p-1.5 rounded-full shadow-sm hover:bg-[#0F9788] transition" 
              aria-label="Change Avatar" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="user" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>
          <div className="flex-1 pb-1 w-full">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
              {(user as any)?.isVerified && (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  <Icon name="shield" /> Verified
                </span>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-sm text-gray-500 mt-4 w-full">
              <p className="flex items-center gap-1.5"><Icon name="message" /> {user?.email || 'No email provided'}</p>
              <p className="flex items-center gap-1.5"><Icon name="bell" /> {user?.phone || 'No phone provided'}</p>
              <p className="flex items-center gap-1.5"><Icon name="location" /> {user?.location || 'Your Area'}</p>
            </div>
          </div>
          <div className="pb-1 mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            {user?.role === 'PROVIDER' && (
              <button 
                className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-medium hover:bg-orange-200 transition flex items-center justify-center gap-2" 
                onClick={toggleRole}
              >
                <Icon name="user" /> Switch to {userRole === 'client' ? 'Provider' : 'Client'}
              </button>
            )}
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2" onClick={() => setActiveTab('Settings')}>
              <Icon name="wrench" /> Edit Profile
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
          <div className="text-center md:text-left">
            <span className="block text-xs text-gray-400 mb-1">Member Since</span>
            <strong className="flex items-center justify-center md:justify-start gap-2 text-gray-800 text-sm"><Icon name="calendar" /> {new Date((user as any)?.createdAt || Date.now()).toLocaleDateString()}</strong>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-xs text-gray-400 mb-1">Account Status</span>
            <strong className="flex items-center justify-center md:justify-start gap-2 text-green-600 text-sm"><span className="w-2 h-2 rounded-full bg-green-500"></span> Active</strong>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-xs text-gray-400 mb-1">Account Security</span>
            <strong className="flex items-center justify-center md:justify-start gap-2 text-gray-800 text-sm"><Icon name="shield" /> Strong</strong>
          </div>
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-200 mb-8 no-scrollbar pb-1">
        {['Overview', 'Reviews', 'Saved Providers', 'Verification', 'Preferences'].map((subTab) => (
          <button 
            key={subTab} 
            className={`whitespace-nowrap px-4 py-2 font-medium text-sm rounded-t-lg border-b-2 transition-colors ${profileActiveSubTab === subTab ? 'border-[#14B8A6] text-[#14B8A6]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setProfileActiveSubTab(subTab)}
          >
            {subTab}
          </button>
        ))}
      </div>

      {profileActiveSubTab === 'Overview' && (
        <div className="space-y-8 animate-fade-in w-full">
          <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">About the Fixam Profile</h3>
            <p className="text-gray-600 leading-relaxed text-sm mb-4">
              Your profile is your digital identity on Fixam. A complete profile helps providers trust you, resulting in faster booking acceptances and better service. It gives professionals an idea of who they are working with before they even arrive.
            </p>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col py-2 border-b border-gray-100">
                <span className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Icon name="user" /> Full Name</span>
                <strong className="text-sm font-semibold text-gray-800">{fullName}</strong>
              </div>
              <div className="flex flex-col py-2 border-b border-gray-100">
                <span className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Icon name="message" /> Email Address</span>
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-semibold text-gray-800">{user?.email}</strong>
                </div>
              </div>
              <div className="flex flex-col py-2 border-b border-gray-100">
                <span className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Icon name="bell" /> Phone Number</span>
                <strong className="text-sm font-semibold text-gray-800">{user?.phone || 'Not set'}</strong>
              </div>
              <div className="flex flex-col py-2 border-b border-gray-100">
                <span className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Icon name="location" /> Location</span>
                <strong className="text-sm font-semibold text-gray-800">{user?.location || 'Not set'}</strong>
              </div>
            </div>
          </section>
        </div>
      )}

      {profileActiveSubTab === 'Verification' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-fade-in max-w-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Identity Verification</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg">
                  <Icon name="message" />
                </div>
                <div>
                  <span className="block text-base font-bold text-gray-800">Email Address</span>
                  <span className="block text-sm text-gray-500">Verified</span>
                </div>
              </div>
              <Icon name="check" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg">
                  <Icon name="bell" />
                </div>
                <div>
                  <span className="block text-base font-bold text-gray-800">Phone Number</span>
                  <span className="block text-sm text-gray-500">Verified</span>
                </div>
              </div>
              <Icon name="check" />
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${(user as any)?.isVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Icon name="shield" />
                </div>
                <div>
                  <span className="block text-base font-bold text-gray-800">ID Document</span>
                  <span className="block text-sm text-gray-500">{(user as any)?.isVerified ? 'Verified' : 'Not Verified'}</span>
                </div>
              </div>
              {!(user as any)?.isVerified ? (
                <a href="https://fixam.verify.usefixam.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#14B8A6] hover:text-[#0F9788] px-4 py-2 border border-[#14B8A6] rounded hover:bg-teal-50 transition whitespace-nowrap">
                  Verify Now
                </a>
              ) : (
                <Icon name="check" />
              )}
            </div>
          </div>
        </div>
      )}

      {profileActiveSubTab === 'Preferences' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-fade-in max-w-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Account Preferences</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Provider Discovery</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#14B8A6]"
                value={preferences.providerType}
                onChange={(e) => setPreferences({...preferences, providerType: e.target.value})}
              >
                <option value="all">Show all available providers</option>
                <option value="local">Show only local providers in my area</option>
                <option value="verified">Show only verified providers</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">Choose what type of providers you want to see primarily in your feed.</p>
            </div>
            
            <button 
              className="bg-[#14B8A6] text-white px-6 py-2.5 rounded font-bold hover:bg-[#0F9788] transition"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {profileActiveSubTab === 'Reviews' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">My Reviews</h3>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((r: any) => (
                <div key={r.id} className="p-4 border border-gray-100 rounded bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">{r.serviceName || 'Review'}</span>
                    <span className="text-[#F59E0B] flex items-center gap-1"><Icon name="star" /> {r.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">You haven't left any reviews yet.</p>
          )}
        </div>
      )}

      {profileActiveSubTab === 'Saved Providers' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Saved Providers</h3>
          {savedPros.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {savedPros.map((pro: any) => (
                <div key={pro.id} className="p-4 border border-gray-200 rounded flex items-center gap-4">
                  <img src={getMediaUrl(pro.image)} alt={pro.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">{pro.name}</h4>
                    <span className="text-xs text-gray-500">{pro.role}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">You haven't saved any providers yet.</p>
          )}
        </div>
      )}

    </div>
  );
}
