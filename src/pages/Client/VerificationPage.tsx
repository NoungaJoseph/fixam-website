import { useState, useRef, useEffect } from 'react';
import { Icon, images, getMediaUrl } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useTranslation } from 'react-i18next';
import './MyProfile.css';

interface VerificationPageProps {
  setActiveTab: (tab: string) => void;
}

export default function VerificationPage({ setActiveTab }: VerificationPageProps) {
  const { user, refreshUser } = useAuth();
  const { t, i18n } = useTranslation();

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
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in w-full">
      {/* Header row with Back button */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('My Profile')} 
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
          aria-label="Go back to profile"
        >
          ← {i18n.language === 'fr' ? 'Retour' : 'Back'}
        </button>
        <h2 className="text-2xl font-black text-slate-800">
          {i18n.language === 'fr' ? "Vérification d'identité" : "Identity Verification"}
        </h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto w-full">
        {user?.providerProfile?.verification === 'VERIFIED' || (user as any)?.isVerified ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {i18n.language === 'fr' ? "Votre compte est vérifié !" : "Your Account is Verified!"}
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
              {i18n.language === 'fr' 
                ? "Merci d'avoir vérifié votre identité. Votre profil affiche désormais le badge de confiance." 
                : "Thank you for verifying your identity. Your profile now displays the trusted verification badge."}
            </p>
            <button 
              onClick={() => setActiveTab('My Profile')}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 py-2.5 rounded-xl transition"
            >
              {i18n.language === 'fr' ? "Retour au profil" : "Return to Profile"}
            </button>
          </div>
        ) : user?.providerProfile?.verification === 'PENDING' || wizardStep === 4 ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-pulse">
              ⏰
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {i18n.language === 'fr' ? "Vérification en cours d'examen" : "Verification Under Review"}
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
              {i18n.language === 'fr' 
                ? "Vos documents et votre selfie ont été soumis avec succès. Notre équipe les examine dans un délai de 24 à 48 heures." 
                : "Your verification documents and selfie have been submitted successfully. Our team will review them within 24-48 hours."}
            </p>
            <button 
              onClick={() => setActiveTab('My Profile')}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 py-2.5 rounded-xl transition"
            >
              {i18n.language === 'fr' ? "Retour au profil" : "Return to Profile"}
            </button>
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
                        type="button"
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
                  type="button"
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
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="flex-1 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                  >
                    {i18n.language === 'fr' ? "Retour" : "Back"}
                  </button>
                  <button
                    type="button"
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
                        type="button"
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
                          type="button"
                          onClick={captureSelfie}
                          className="flex-1 bg-teal-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-teal-600 transition"
                        >
                          📸 {i18n.language === 'fr' ? "Prendre la photo" : "Capture"}
                        </button>
                        <button
                          type="button"
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
                        type="button"
                        onClick={startWebcam}
                        className="bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-teal-600 transition shadow-sm inline-flex items-center gap-2 mb-4"
                      >
                        📹 {i18n.language === 'fr' ? "Activer la caméra" : "Start Camera"}
                      </button>
                      <div className="text-xs text-gray-400 mb-2">OR</div>
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
                    type="button"
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
                    type="button"
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
    </div>
  );
}
