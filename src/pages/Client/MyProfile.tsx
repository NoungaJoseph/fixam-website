import './MyProfile.css';
import { useState, useRef, useEffect } from 'react';
import { Icon, images, getMediaUrl } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useTranslation } from 'react-i18next';

interface MyProfileProps {
  setActiveTab: (tab: string) => void;
  onRoleChange?: (role: 'client' | 'pro') => void;
  userRole?: string;
}

export default function MyProfile({ setActiveTab, onRoleChange, userRole }: MyProfileProps) {
  const { user, refreshUser } = useAuth();
  const { t, i18n } = useTranslation();
  const [profileActiveSubTab, setProfileActiveSubTab] = useState('Overview');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preferences, setPreferences] = useState({ providerType: 'all' });
  
  const [reviews, setReviews] = useState([]);
  const [savedPros, setSavedPros] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [accountStatusActive, setAccountStatusActive] = useState(true);

  // Verification Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [docType, setDocType] = useState<{ id: 'id' | 'passport' | 'license'; titleEn: string; titleFr: string; sides: number } | null>(null);
  const [docFrontFile, setDocFrontFile] = useState<File | null>(null);
  const [docBackFile, setDocBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startWebcam = async () => {
    try {
      setIsWebcamActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Failed to access camera:", err);
      alert("Could not access camera. Please upload a selfie manually.");
      setIsWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = match ? match[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const captureSelfie = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setSelfiePreview(dataUrl);
        const file = dataURLtoFile(dataUrl, 'selfie.png');
        setSelfieFile(file);
      }
      stopWebcam();
    }
  };

  const uploadOne = async (file: File, label: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'verification');
    const res = await api.post('/upload/verification', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.url;
  };

  const handleSubmitVerification = async () => {
    if (!selfieFile) {
      alert("Selfie image is required to complete verification.");
      return;
    }
    setIsSubmittingVerification(true);
    try {
      const uploads = [
        { type: `${docType?.id || 'document'}_front`, file: docFrontFile },
        docBackFile ? { type: `${docType?.id || 'document'}_back`, file: docBackFile } : null,
        { type: 'selfie', file: selfieFile }
      ].filter((item): item is { type: string; file: File } => item !== null && item.file !== null);

      for (const item of uploads) {
        const url = await uploadOne(item.file, item.type);
        await api.post('/providers/verify', { type: item.type, url });
      }

      await refreshUser();
      setWizardStep(4);
    } catch (error: any) {
      console.error(error);
      alert("Verification submission failed: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmittingVerification(false);
    }
  };

  useEffect(() => {
    if (user) {
      setEditFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || ''
      });
    }
  }, [user]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/users/profile', editFormData);
      await refreshUser();
      alert('Profile updated successfully!');
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

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
              <p className="flex items-center gap-1.5"><Icon name="phone" /> {user?.phone || 'No phone provided'}</p>
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
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2" onClick={() => setIsEditModalOpen(true)}>
              <Icon name="wrench" /> Edit Profile
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
          <div className="text-center md:text-left">
            <span className="block text-xs text-gray-400 mb-1">Member Since</span>
            <strong className="flex items-center justify-center md:justify-start gap-2 text-gray-800 text-sm"><Icon name="calendar" /> {new Date((user as any)?.createdAt || Date.now()).toLocaleDateString()}</strong>
          </div>
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <span className="block text-xs text-gray-400 mb-1">Account Status</span>
            <div className="flex items-center gap-3">
              <strong className={`flex items-center gap-2 text-sm ${accountStatusActive ? 'text-green-600' : 'text-gray-500'}`}>
                <span className={`w-2 h-2 rounded-full ${accountStatusActive ? 'bg-green-500' : 'bg-gray-400'}`}></span> 
                {accountStatusActive ? 'Active' : 'Inactive'}
              </strong>
              <button 
                onClick={() => setAccountStatusActive(!accountStatusActive)}
                className={`w-8 h-4 rounded-full relative transition-colors ${accountStatusActive ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${accountStatusActive ? 'left-[18px]' : 'left-0.5'}`}></div>
              </button>
            </div>
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
                <span className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Icon name="phone" /> Phone Number</span>
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
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-fade-in max-w-2xl w-full">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            {i18n.language === 'fr' ? "Vérification d'identité" : "Identity Verification"}
          </h3>

          {user?.providerProfile?.verification === 'VERIFIED' || (user as any)?.isVerified ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                <Icon name="check" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                {i18n.language === 'fr' ? "Votre compte est vérifié !" : "Your Account is Verified!"}
              </h4>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                {i18n.language === 'fr' 
                  ? "Merci d'avoir vérifié votre identité. Votre profil affiche désormais le badge de confiance." 
                  : "Thank you for verifying your identity. Your profile now displays the trusted verification badge."}
              </p>
            </div>
          ) : user?.providerProfile?.verification === 'PENDING' || wizardStep === 4 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">
                ⏰
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                {i18n.language === 'fr' ? "Vérification en cours d'examen" : "Verification Under Review"}
              </h4>
              <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                {i18n.language === 'fr' 
                  ? "Vos documents et votre selfie ont été soumis avec succès. Notre équipe les examine dans un délai de 24 à 48 heures." 
                  : "Your verification documents and selfie have been submitted successfully. Our team will review them within 24-48 hours."}
              </p>
            </div>
          ) : (
            <div>
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8 px-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 flex items-center relative">
                    <div className="flex flex-col items-center mx-auto z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${wizardStep === s ? 'bg-teal-500 text-white shadow-md ring-4 ring-teal-100' : wizardStep > s ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {wizardStep > s ? '✓' : s}
                      </div>
                      <span className={`text-[11px] font-semibold mt-2 ${wizardStep === s ? 'text-teal-600 font-bold' : 'text-gray-400'}`}>
                        {s === 1 
                          ? (i18n.language === 'fr' ? '1. Document' : '1. Document') 
                          : s === 2 
                          ? (i18n.language === 'fr' ? '2. Charger' : '2. Upload') 
                          : (i18n.language === 'fr' ? '3. Selfie' : '3. Selfie')}
                      </span>
                    </div>
                    {s < 3 && (
                      <div className={`absolute top-4 left-1/2 w-full h-[2px] -z-0 ${wizardStep > s ? 'bg-teal-500' : 'bg-gray-100'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Select Document Type */}
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center md:text-left">
                    <h4 className="text-base font-bold text-gray-900 mb-1">
                      {i18n.language === 'fr' ? "Sélectionnez le type de document" : "Select Document Type"}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {i18n.language === 'fr' ? "Choisissez le document officiel que vous souhaitez utiliser pour la vérification." : "Choose the official document you wish to use for identity verification."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'id' as const, titleEn: 'National ID Card', titleFr: 'Carte Nationale d\'Identité', sides: 2, descEn: 'Front and Back scans required', descFr: 'Scans recto et verso requis', icon: '💳' },
                      { id: 'passport' as const, titleEn: 'International Passport', titleFr: 'Passeport International', sides: 1, descEn: 'Main photo data page scan required', descFr: 'Scan de la page photo principale requis', icon: '📖' },
                      { id: 'license' as const, titleEn: 'Drivers License', titleFr: 'Permis de Conduire', sides: 2, descEn: 'Front and Back scans required', descFr: 'Scans recto et verso requis', icon: '🚗' }
                    ].map((doc) => {
                      const isSelected = docType?.id === doc.id;
                      return (
                        <button
                          key={doc.id}
                          onClick={() => setDocType(doc)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all hover:bg-gray-50 ${isSelected ? 'border-teal-500 bg-teal-50/20 ring-1 ring-teal-500' : 'border-gray-200'}`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{doc.icon}</span>
                            <div>
                              <strong className="block text-sm text-gray-800">
                                {i18n.language === 'fr' ? doc.titleFr : doc.titleEn}
                              </strong>
                              <span className="block text-xs text-gray-500">
                                {i18n.language === 'fr' ? doc.descFr : doc.descEn}
                              </span>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      if (!docType) {
                        alert(i18n.language === 'fr' ? "Veuillez sélectionner un type de document." : "Please select a document type.");
                        return;
                      }
                      setWizardStep(2);
                    }}
                    className="w-full bg-teal-500 text-white py-3 rounded-xl font-bold hover:bg-teal-600 transition shadow-sm"
                  >
                    {i18n.language === 'fr' ? "Continuer" : "Continue"}
                  </button>
                </div>
              )}

              {/* Step 2: Upload Files */}
              {wizardStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center md:text-left">
                    <h4 className="text-base font-bold text-gray-900 mb-1">
                      {i18n.language === 'fr' ? "Télécharger les documents" : "Upload Documents"}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {i18n.language === 'fr' ? "Veuillez fournir des photos ou scans clairs et lisibles." : "Please provide clear, legible scans or photos of your document."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Front upload */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">
                        {i18n.language === 'fr' ? "Recto du document" : "Front Side of Document"}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          id="docFront"
                          className="hidden"
                          onChange={(e) => setDocFrontFile(e.target.files?.[0] || null)}
                        />
                        <label
                          htmlFor="docFront"
                          className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                        >
                          <span className="text-xl mb-1">📂</span>
                          <span className="text-xs font-bold text-teal-600">
                            {docFrontFile ? docFrontFile.name : (i18n.language === 'fr' ? 'Sélectionner le fichier' : 'Select file')}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Back upload (if two sided) */}
                    {docType?.sides === 2 && (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase">
                          {i18n.language === 'fr' ? "Verso du document" : "Back Side of Document"}
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            id="docBack"
                            className="hidden"
                            onChange={(e) => setDocBackFile(e.target.files?.[0] || null)}
                          />
                          <label
                            htmlFor="docBack"
                            className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                          >
                            <span className="text-xl mb-1">📂</span>
                            <span className="text-xs font-bold text-teal-600">
                              {docBackFile ? docBackFile.name : (i18n.language === 'fr' ? 'Sélectionner le fichier' : 'Select file')}
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="flex-1 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                    >
                      {i18n.language === 'fr' ? "Retour" : "Back"}
                    </button>
                    <button
                      onClick={() => {
                        if (!docFrontFile || (docType?.sides === 2 && !docBackFile)) {
                          alert(i18n.language === 'fr' ? "Veuillez charger tous les fichiers requis." : "Please upload all required files.");
                          return;
                        }
                        setWizardStep(3);
                      }}
                      className="flex-1 bg-teal-500 text-white py-3 rounded-xl font-bold hover:bg-teal-600 transition shadow-sm"
                    >
                      {i18n.language === 'fr' ? "Continuer" : "Continue"}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Take Selfie */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center md:text-left">
                    <h4 className="text-base font-bold text-gray-900 mb-1">
                      {i18n.language === 'fr' ? "Prendre un selfie" : "Take a Selfie"}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {i18n.language === 'fr' ? "Utilisez votre webcam pour prendre une photo claire de votre visage." : "Use your webcam to take a clear profile picture of your face."}
                    </p>
                  </div>

                  {/* Selfie Capture Box */}
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-xl relative overflow-hidden min-h-[220px]">
                    {selfiePreview ? (
                      <div className="relative text-center">
                        <img
                          src={selfiePreview}
                          alt="Selfie Preview"
                          className="w-48 h-48 rounded-full border-4 border-teal-500 shadow object-cover mx-auto"
                        />
                        <button
                          onClick={() => {
                            setSelfiePreview(null);
                            setSelfieFile(null);
                            startWebcam();
                          }}
                          className="mt-3 text-xs font-bold text-red-600 border border-red-200 bg-white hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                        >
                          {i18n.language === 'fr' ? "Reprendre la photo" : "Retake Photo"}
                        </button>
                      </div>
                    ) : isWebcamActive ? (
                      <div className="relative w-full flex flex-col items-center">
                        <video
                          ref={videoRef}
                          className="w-64 h-48 rounded-lg border-2 border-gray-300 object-cover bg-black"
                        />
                        <div className="flex gap-2 mt-3 w-full max-w-[260px]">
                          <button
                            onClick={captureSelfie}
                            className="flex-1 bg-teal-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-teal-600 transition"
                          >
                            📸 {i18n.language === 'fr' ? "Prendre la photo" : "Capture"}
                          </button>
                          <button
                            onClick={stopWebcam}
                            className="flex-1 bg-white text-gray-700 text-xs font-bold py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          >
                            {i18n.language === 'fr' ? "Annuler" : "Cancel"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <button
                          onClick={startWebcam}
                          className="bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-teal-600 transition shadow-sm inline-flex items-center gap-2 mb-4"
                        >
                          📹 {i18n.language === 'fr' ? "Activer la caméra" : "Start Camera"}
                        </button>
                        <div className="text-xs text-gray-400 mb-2">— OR —</div>
                        <input
                          type="file"
                          accept="image/*"
                          id="selfieBackup"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelfieFile(file);
                              const reader = new FileReader();
                              reader.onloadend = () => setSelfiePreview(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label
                          htmlFor="selfieBackup"
                          className="text-xs font-bold text-teal-600 hover:underline cursor-pointer"
                        >
                          {i18n.language === 'fr' ? "Charger un selfie manuellement" : "Upload selfie file manually"}
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        stopWebcam();
                        setWizardStep(2);
                      }}
                      className="flex-1 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                      disabled={isSubmittingVerification}
                    >
                      {i18n.language === 'fr' ? "Retour" : "Back"}
                    </button>
                    <button
                      onClick={handleSubmitVerification}
                      disabled={!selfieFile || isSubmittingVerification}
                      className={`flex-1 text-white py-3 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2 ${(!selfieFile || isSubmittingVerification) ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
                    >
                      {isSubmittingVerification ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {i18n.language === 'fr' ? "Soumission..." : "Submitting..."}
                        </>
                      ) : (
                        i18n.language === 'fr' ? "Soumettre pour examen" : "Submit for Review"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#14B8A6]"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#14B8A6]"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#14B8A6]"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#14B8A6]"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#14B8A6]"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#14B8A6] text-white font-bold rounded-lg hover:bg-[#0F9788] transition"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
