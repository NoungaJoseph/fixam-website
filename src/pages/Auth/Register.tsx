import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '../../App';
import FloatingParticles from '../../components/FloatingParticles';
import './Auth.css';

// 10 regions of Cameroon with their major cities/quarters
const regionData: Record<string, { nameEn: string; nameFr: string; cities: string[] }> = {
  central: {
    nameEn: 'Central Region',
    nameFr: 'Région Centrale',
    cities: ['Downtown', 'Metro Area', 'City Center', 'Suburbs', 'North District']
  },
  north: {
    nameEn: 'Northern Region',
    nameFr: 'Région Nord',
    cities: ['North Metro', 'Highland Area', 'Lakeside', 'North Valley', 'Eastside']
  },
  south: {
    nameEn: 'Southern Region',
    nameFr: 'Région Sud',
    cities: ['South Harbor', 'Coastal Area', 'Bay District', 'South Metro', 'Valley District']
  },
  east: {
    nameEn: 'Eastern Region',
    nameFr: 'Région Est',
    cities: ['East Metro', 'River District', 'East Hills', 'Parkside', 'Summit']
  },
  west: {
    nameEn: 'Western Region',
    nameFr: 'Région Ouest',
    cities: ['West Metro', 'Sunset District', 'West Valley', 'Highland Park', 'Oakridge']
  }
};

export default function Register({ onNavigate, onRegister }: { onNavigate: (page: Page) => void; onRegister?: (role: 'client' | 'pro') => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [accountType, setAccountType] = useState<'client' | 'pro'>('client');
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+237');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  // Provider-only fields
  const [serviceCategory, setServiceCategory] = useState('');
  const [experience, setExperience] = useState('');

  // Checkbox States
  const [sendUpdates, setSendUpdates] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validation States (error texts)
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [regionError, setRegionError] = useState('');
  const [cityError, setCityError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [experienceError, setExperienceError] = useState('');
  
  // Custom alerts and UI states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  // Password Requirements (live checks)
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Network Detection
  const [networkType, setNetworkType] = useState<'MTN' | 'Orange' | ''>('');

  useEffect(() => {
    // Detect Cameroonian carrier network
    const cleanPhone = phone.replace(/\s+/g, '');
    if (countryCode === '+237' && cleanPhone.length === 9) {
      const mtnPrefixes = ['650', '651', '652', '653', '654', '67', '68'];
      const orangePrefixes = ['655', '656', '657', '658', '659', '69'];
      
      const isMtn = mtnPrefixes.some(pref => cleanPhone.startsWith(pref));
      const isOrange = orangePrefixes.some(pref => cleanPhone.startsWith(pref));

      if (isMtn) setNetworkType('MTN');
      else if (isOrange) setNetworkType('Orange');
      else setNetworkType('');
    } else {
      setNetworkType('');
    }
  }, [phone, countryCode]);

  // Reset city if region changes
  useEffect(() => {
    setCity('');
    if (cityError) setCityError('');
  }, [region]);

  const countries = [
    { code: '+237', name: 'Cameroon', flag: 'https://flagcdn.com/w40/cm.png' },
    { code: '+254', name: 'Kenya', flag: 'https://flagcdn.com/w40/ke.png' },
    { code: '+233', name: 'Ghana', flag: 'https://flagcdn.com/w40/gh.png' },
    { code: '+225', name: 'Côte d\'Ivoire', flag: 'https://flagcdn.com/w40/ci.png' },
    { code: '+255', name: 'Tanzania', flag: 'https://flagcdn.com/w40/tz.png' },
    { code: '+20', name: 'Egypt', flag: 'https://flagcdn.com/w40/eg.png' },
  ];

  const getStrengthScore = () => {
    return [hasLength, hasNumber, hasUpper, hasSpecial].filter(Boolean).length;
  };

  const getStrengthFeedback = () => {
    const score = getStrengthScore();
    if (password.length === 0) return { label: '', color: '', pct: '0%' };
    if (score <= 1) return { label: isFr ? 'Faible' : 'Weak', color: '#EF4444', pct: '25%' };
    if (score === 2) return { label: isFr ? 'Moyen' : 'Fair', color: '#F97316', pct: '50%' };
    if (score === 3) return { label: isFr ? 'Bon' : 'Good', color: '#EAB308', pct: '75%' };
    return { label: isFr ? 'Fort' : 'Strong', color: '#22C55E', pct: '100%' };
  };

  const validateStep1 = (): boolean => {
    let isValid = true;
    setFullNameError('');
    setPhoneError('');
    setEmailError('');

    if (!fullName.trim()) {
      setFullNameError(isFr ? 'Veuillez entrer votre nom complet' : 'Please enter your full name');
      isValid = false;
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setPhoneError(isFr ? 'Veuillez entrer un numéro valide' : 'Please enter a valid phone number');
      isValid = false;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError(isFr ? 'Format d\'email invalide' : 'Invalid email format');
        isValid = false;
      }
    }

    return isValid;
  };

  const validateStep2 = (): boolean => {
    let isValid = true;
    setRegionError('');
    setCityError('');
    setCategoryError('');
    setExperienceError('');

    if (!region) {
      setRegionError(isFr ? 'Veuillez choisir une région' : 'Please select a region');
      isValid = false;
    }

    if (!city) {
      setCityError(isFr ? 'Veuillez choisir une ville / un quartier' : 'Please select a city / quarter');
      isValid = false;
    }

    if (accountType === 'pro') {
      if (!serviceCategory) {
        setCategoryError(isFr ? 'Veuillez choisir une catégorie' : 'Please select a category');
        isValid = false;
      }
      if (!experience) {
        setExperienceError(isFr ? 'Veuillez choisir votre expérience' : 'Please select your experience');
        isValid = false;
      }
    }

    return isValid;
  };

  const validateStep3 = (): boolean => {
    let isValid = true;
    setPasswordError('');
    setConfirmPasswordError('');
    setTermsError('');

    if (password.length < 8) {
      setPasswordError(isFr ? 'Le mot de passe doit comporter au moins 8 caractères' : 'Password must be at least 8 characters');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(isFr ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match');
      isValid = false;
    }

    if (!agreeTerms) {
      setTermsError(isFr ? 'Vous devez accepter pour continuer' : 'You must agree to continue');
      isValid = false;
    }

    return isValid;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) {
      return;
    }

    setIsLoading(true);

    // Mock API register
    setTimeout(() => {
      setIsLoading(false);
      setSuccessBanner(
        isFr
          ? 'Compte créé! Vérifiez votre téléphone pour un code de vérification.'
          : 'Account created! Check your phone for a verification code.'
      );
      
      // Redirect after 2 seconds
      setTimeout(() => {
        onRegister?.(accountType);
        onNavigate('otp');
      }, 2000);
    }, 1500);
  };

  // Translations
  const t = {
    alreadyHaveAccount: isFr ? 'Vous avez déjà un compte ?' : 'Already have an account?',
    signIn: isFr ? 'Se connecter' : 'Sign In',
    registerTitle: isFr ? 'Créez votre compte Fixam' : 'Create your Fixam account',
    registerSub: isFr ? 'Rejoignez des milliers d\'utilisateurs au Cameroun' : 'Join thousands of users in Cameroon',
    clientTab: isFr ? 'Client' : 'Client',
    providerTab: isFr ? 'Prestataire' : 'Provider',
    
    nameLabel: isFr ? 'Nom Complet' : 'Full Name',
    namePlaceholder: isFr ? 'Entrez votre nom complet' : 'Enter your full name',
    
    phoneLabel: isFr ? 'Numéro de Téléphone' : 'Phone Number',
    phonePlaceholder: '6XX XXX XXX',
    
    emailLabel: isFr ? 'Adresse Email (optionnel)' : 'Email Address (optional)',
    emailPlaceholder: 'your@email.com',
    
    regionLabel: isFr ? 'Région' : 'Region',
    regionPlaceholder: isFr ? '-- Choisissez une région --' : '-- Choose a region --',
    
    cityLabel: isFr ? 'Ville / Quartier' : 'City / Quarter',
    cityPlaceholder: isFr ? '-- Choisissez votre ville --' : '-- Choose your city --',
    cityChooseRegion: isFr ? 'Choisissez d\'abord une région' : 'Select a region first',
    
    passwordLabel: isFr ? 'Mot de Passe' : 'Password',
    passwordPlaceholder: isFr ? 'Créez un mot de passe (min 8 caractères)' : 'Create a password (min 8 characters)',
    
    confirmPasswordLabel: isFr ? 'Confirmer le Mot de Passe' : 'Confirm Password',
    confirmPasswordPlaceholder: isFr ? 'Répétez votre mot de passe' : 'Repeat your password',
    
    referralLabel: isFr ? 'Code de Parrainage (optionnel)' : 'Referral Code (optional)',
    referralPlaceholder: isFr ? 'Entrez le code de parrainage' : 'Enter referral code if you have one',
    referralHint: isFr ? '🎁 Utiliser un code vous donne 1 pièce bonus' : '🎁 Using a referral code gives you 1 bonus coin',

    categoryLabel: isFr ? 'Votre Catégorie de Service' : 'Your Service Category',
    categoryPlaceholder: isFr ? '-- Choisissez une catégorie --' : '-- Choose a category --',
    
    expLabel: isFr ? 'Années d\'Expérience' : 'Years of Experience',
    expPlaceholder: isFr ? '-- Choisissez l\'expérience --' : '-- Choose experience --',

    updatesLabel: isFr ? 'Envoyez-moi des mises à jour sur les nouvelles fonctionnalités de Fixam' : 'Send me updates about new features and tips for using Fixam',
    termsLabel: isFr ? 'J\'accepte les Conditions d\'Utilisation et la Politique de Confidentialité de Fixam' : 'I agree to Fixam\'s Terms of Service and Privacy Policy',
    
    createAccountBtn: isFr ? 'Créer un Compte' : 'Create Account',
    creatingAccount: isFr ? 'Création du compte...' : 'Creating account...',
    
    reqLength: isFr ? 'Au moins 8 caractères' : '8+ characters',
    reqNumber: isFr ? 'Contient un chiffre' : 'Number',
    reqUpper: isFr ? 'Lettre majuscule' : 'Uppercase',
    reqSpecial: isFr ? 'Caractère spécial' : 'Special character',
  };

  // Dropdown Options
  const categories = [
    { value: 'electrical', labelEn: 'Electrical', labelFr: 'Électricité' },
    { value: 'plumbing', labelEn: 'Plumbing', labelFr: 'Plomberie' },
    { value: 'cleaning', labelEn: 'Cleaning', labelFr: 'Nettoyage' },
    { value: 'moving', labelEn: 'Moving & Delivery', labelFr: 'Déménagement' },
    { value: 'beauty', labelEn: 'Beauty & Wellness', labelFr: 'Beauté & Bien-être' },
    { value: 'security', labelEn: 'Security', labelFr: 'Sécurité' },
    { value: 'repairs', labelEn: 'Repairs', labelFr: 'Réparations' },
    { value: 'carpentry', labelEn: 'Carpentry', labelFr: 'Menuiserie' },
    { value: 'painting', labelEn: 'Painting', labelFr: 'Peinture' },
    { value: 'gardening', labelEn: 'Gardening', labelFr: 'Jardinage' },
    { value: 'tutoring', labelEn: 'Tutoring', labelFr: 'Cours particuliers' },
    { value: 'other', labelEn: 'Other', labelFr: 'Autre' },
  ];

  const experiences = [
    { value: 'less1', labelEn: 'Less than 1 year', labelFr: 'Moins d\'1 an' },
    { value: '1-2', labelEn: '1-2 years', labelFr: '1-2 ans' },
    { value: '3-5', labelEn: '3-5 years', labelFr: '3-5 ans' },
    { value: '5-10', labelEn: '5-10 years', labelFr: '5-10 ans' },
    { value: '10plus', labelEn: '10+ years', labelFr: '10+ ans' },
  ];

  // Get active cities list
  const activeCities = region && regionData[region] ? regionData[region].cities : [];

  const strength = getStrengthFeedback();

  return (
    <div className="auth-page-wrapper">
      <FloatingParticles />
      {/* HEADER */}
      <header className="auth-header-bar">
        <span className="auth-header-logo" onClick={() => onNavigate('home')}>Fixam</span>
        <div className="auth-header-right">
          <span>{t.alreadyHaveAccount}</span>
          <button className="auth-header-btn" onClick={() => onNavigate('login')}>
            {t.signIn}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="auth-main-content">
        <div className="auth-card register-card" style={{ margin: '40px auto', padding: '40px' }}>
          <h1 className="auth-card-title">{t.registerTitle}</h1>
          <p className="auth-card-subtitle">{t.registerSub}</p>

          {/* STEPPER INDICATOR */}
          <div className="stepper-container">
            <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">{isFr ? 'Infos' : 'Info'}</div>
            </div>
            <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">{isFr ? 'Lieu & Métier' : 'Location & Job'}</div>
            </div>
            <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">{isFr ? 'Sécurité' : 'Security'}</div>
            </div>
          </div>

          {/* SUCCESS STATE */}
          {successBanner && (
            <div className="auth-alert-banner success">
              {successBanner}
            </div>
          )}

          {/* REGISTER FORM */}
          <form onSubmit={handleRegisterSubmit} noValidate>
            
            {/* STEP 1: ACCOUNT TYPE & PERSONAL DETAILS */}
            {currentStep === 1 && (
              <div className="form-grid-layout">
                {/* ROLE TOGGLE */}
                <div className="form-grid-full">
                  <div className="account-type-tabs" style={{ marginBottom: '12px' }}>
                    <button
                      type="button"
                      className={`account-type-tab ${accountType === 'client' ? 'active' : ''}`}
                      onClick={() => setAccountType('client')}
                    >
                      {t.clientTab}
                    </button>
                    <button
                      type="button"
                      className={`account-type-tab ${accountType === 'pro' ? 'active' : ''}`}
                      onClick={() => setAccountType('pro')}
                    >
                      {t.providerTab}
                    </button>
                  </div>
                </div>

                {/* FULL NAME */}
                <div>
                  <div className="field-group">
                    <label>{t.nameLabel}</label>
                    <div className={`input-container has-left-icon ${fullNameError ? 'error-state' : ''}`}>
                      <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        type="text"
                        placeholder={t.namePlaceholder}
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (fullNameError) setFullNameError('');
                        }}
                        required
                      />
                    </div>
                    {fullNameError && <span className="error-text-message">{fullNameError}</span>}
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <div className="field-group">
                    <label>{t.emailLabel}</label>
                    <div className={`input-container has-left-icon ${emailError ? 'error-state' : ''}`}>
                      <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="email"
                        placeholder={t.emailPlaceholder}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                      />
                    </div>
                    {emailError && <span className="error-text-message">{emailError}</span>}
                  </div>
                </div>

                {/* PHONE NUMBER */}
                <div>
                  <div className="field-group">
                    <label>{t.phoneLabel}</label>
                    <div className={`phone-row-container ${phoneError ? 'error-state' : ''}`}>
                      <div className="input-container" style={{ width: 'auto' }}>
                        <select
                          className="country-code-select"
                          value={countryCode}
                          onChange={(e) => {
                            setCountryCode(e.target.value);
                            setIsDropdownOpen(false);
                          }}
                          style={{ borderRight: 'none', borderRadius: '8px 0 0 8px' }}
                        >
                          {countries.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className={`input-container has-left-icon ${phoneError ? 'error-state' : ''}`} style={{ flex: 1 }}>
                        <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <input
                          type="tel"
                          placeholder={t.phonePlaceholder}
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (phoneError) setPhoneError('');
                          }}
                          style={{ borderRadius: '0 8px 8px 0' }}
                          required
                        />
                      </div>
                    </div>
                    
                    {networkType && (
                      <div className={`network-badge ${networkType.toLowerCase()}`} style={{ marginTop: '6px' }}>
                        {networkType}
                      </div>
                    )}
                    {phoneError && <span className="error-text-message">{phoneError}</span>}
                  </div>
                </div>

                {/* REFERRAL CODE */}
                <div>
                  <div className="field-group">
                    <label>{t.referralLabel}</label>
                    <div className="input-container has-left-icon">
                      <svg className="input-left-icon" style={{ color: '#14B8A6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0h4a2 2 0 012 2v2a2 2 0 01-2 2H2m10 0h-4a2 2 0 00-2 2v2a2 2 0 002 2h10" />
                      </svg>
                      <input
                        type="text"
                        placeholder={t.referralPlaceholder}
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                      />
                    </div>
                    <span className="error-text-message" style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>{t.referralHint}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION & SERVICE PREFERENCES */}
            {currentStep === 2 && (
              <div className="form-grid-layout">
                {/* REGION (LOCATION PART 1) */}
                <div>
                  <div className="field-group">
                    <label>{t.regionLabel}</label>
                    <div className={`input-container has-left-icon ${regionError ? 'error-state' : ''}`}>
                      <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <select
                        value={region}
                        onChange={(e) => {
                          setRegion(e.target.value);
                          if (regionError) setRegionError('');
                        }}
                        required
                      >
                        <option value="">{t.regionPlaceholder}</option>
                        {Object.keys(regionData).map((key) => (
                          <option key={key} value={key}>
                            {isFr ? regionData[key].nameFr : regionData[key].nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                    {regionError && <span className="error-text-message">{regionError}</span>}
                  </div>
                </div>

                {/* CITY / QUARTER (LOCATION PART 2) */}
                <div>
                  <div className="field-group">
                    <label>{t.cityLabel}</label>
                    <div className={`input-container has-left-icon ${cityError ? 'error-state' : ''}`}>
                      <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <select
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (cityError) setCityError('');
                        }}
                        disabled={!region}
                        required
                      >
                        <option value="">{region ? t.cityPlaceholder : t.cityChooseRegion}</option>
                        {activeCities.map((cityName) => (
                          <option key={cityName} value={cityName}>
                            {cityName}
                          </option>
                        ))}
                      </select>
                    </div>
                    {cityError && <span className="error-text-message">{cityError}</span>}
                  </div>
                </div>

                {/* PROVIDER-ONLY FIELDS */}
                {accountType === 'pro' && (
                  <>
                    {/* Category */}
                    <div>
                      <div className="field-group">
                        <label>{t.categoryLabel}</label>
                        <div className={`input-container has-left-icon ${categoryError ? 'error-state' : ''}`}>
                          <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <select
                            value={serviceCategory}
                            onChange={(e) => {
                              setServiceCategory(e.target.value);
                              if (categoryError) setCategoryError('');
                            }}
                          >
                            <option value="">{t.categoryPlaceholder}</option>
                            {categories.map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {isFr ? cat.labelFr : cat.labelEn}
                              </option>
                            ))}
                          </select>
                        </div>
                        {categoryError && <span className="error-text-message">{categoryError}</span>}
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <div className="field-group">
                        <label>{t.expLabel}</label>
                        <div className={`input-container has-left-icon ${experienceError ? 'error-state' : ''}`}>
                          <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          <select
                            value={experience}
                            onChange={(e) => {
                              setExperience(e.target.value);
                              if (experienceError) setExperienceError('');
                            }}
                          >
                            <option value="">{t.expPlaceholder}</option>
                            {experiences.map((exp) => (
                              <option key={exp.value} value={exp.value}>
                                {isFr ? exp.labelFr : exp.labelEn}
                              </option>
                            ))}
                          </select>
                        </div>
                        {experienceError && <span className="error-text-message">{experienceError}</span>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 3: SECURITY, PASSWORD & AGREEMENTS */}
            {currentStep === 3 && (
              <div className="form-grid-layout">
                {/* PASSWORD */}
                <div>
                  <div className="field-group">
                    <label>{t.passwordLabel}</label>
                    <div className={`input-container has-left-icon ${passwordError ? 'error-state' : ''}`}>
                      <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t.passwordPlaceholder}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError('');
                        }}
                        required
                      />
                      <span
                        className="input-right-icon"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </span>
                    </div>
                    {passwordError && <span className="error-text-message">{passwordError}</span>}

                    {/* Password Strength Indicator */}
                    {password.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <div className="strength-bar-container">
                          <div
                            className="strength-bar-fill"
                            style={{ width: strength.pct, backgroundColor: strength.color }}
                          ></div>
                        </div>
                        <div className="strength-label-row">
                          <span style={{ color: '#6B7280' }}>Password Strength:</span>
                          <span style={{ fontWeight: '600', color: strength.color }}>{strength.label}</span>
                        </div>
                        
                        {/* Validation Requirements Checklist */}
                        <ul className="strength-requirements-grid">
                          <li className={`strength-req-item ${hasLength ? 'met' : ''}`}>
                            <div className="strength-req-dot"></div>
                            <span>{t.reqLength}</span>
                          </li>
                          <li className={`strength-req-item ${hasNumber ? 'met' : ''}`}>
                            <div className="strength-req-dot"></div>
                            <span>{t.reqNumber}</span>
                          </li>
                          <li className={`strength-req-item ${hasUpper ? 'met' : ''}`}>
                            <div className="strength-req-dot"></div>
                            <span>{t.reqUpper}</span>
                          </li>
                          <li className={`strength-req-item ${hasSpecial ? 'met' : ''}`}>
                            <div className="strength-req-dot"></div>
                            <span>{t.reqSpecial}</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <div className="field-group">
                    <label>{t.confirmPasswordLabel}</label>
                    <div className={`input-container has-left-icon ${confirmPasswordError ? 'error-state' : ''}`}>
                      <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t.confirmPasswordPlaceholder}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (confirmPasswordError) setConfirmPasswordError('');
                        }}
                        required
                      />
                      
                      {/* Right side check / error / eye toggles */}
                      {confirmPassword.length > 0 && (
                        <span
                          className={`input-right-icon ${password === confirmPassword ? 'success-icon' : 'error-icon'}`}
                          style={{ right: '40px' }}
                        >
                          {password === confirmPassword ? (
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </span>
                      )}
                      
                      <span
                        className="input-right-icon"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </span>
                    </div>
                    {confirmPasswordError && <span className="error-text-message">{confirmPasswordError}</span>}
                  </div>
                </div>

                {/* AGREEMENTS & CHECKBOXES */}
                <div className="form-grid-full" style={{ marginTop: '8px' }}>
                  {/* CHECKBOX 1: UPDATES */}
                  <div className="checkbox-group">
                    <div className="custom-checkbox-container">
                      <input
                        type="checkbox"
                        id="sendUpdates"
                        checked={sendUpdates}
                        onChange={(e) => setSendUpdates(e.target.checked)}
                      />
                      <div className="custom-checkbox-box"></div>
                    </div>
                    <label htmlFor="sendUpdates" className="checkbox-label">
                      {t.updatesLabel}
                    </label>
                  </div>

                  {/* CHECKBOX 2: TERMS */}
                  <div className="checkbox-group">
                    <div className="custom-checkbox-container">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={agreeTerms}
                        onChange={(e) => {
                          setAgreeTerms(e.target.checked);
                          if (e.target.checked) setTermsError('');
                        }}
                      />
                      <div className="custom-checkbox-box"></div>
                    </div>
                    <label htmlFor="agreeTerms" className="checkbox-label">
                      {isFr ? (
                        <span>
                          J'accepte les{' '}
                          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}>
                            Conditions d'Utilisation
                          </a>{' '}
                          et la{' '}
                          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }}>
                            Politique de Confidentialité
                          </a>{' '}
                          de Fixam
                        </span>
                      ) : (
                        <span>
                          I agree to Fixam's{' '}
                          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}>
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }}>
                            Privacy Policy
                          </a>
                        </span>
                      )}
                    </label>
                  </div>
                  {termsError && <span className="error-text-message" style={{ marginTop: '-8px', marginBottom: '16px' }}>{termsError}</span>}
                </div>
              </div>
            )}

            {/* BUTTON NAVIGATION ACTION ROW */}
            <div className="auth-buttons-row">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn-auth-secondary"
                  onClick={handlePrevStep}
                  style={{ flex: 1 }}
                >
                  {isFr ? 'Retour' : 'Back'}
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  className="btn-auth-primary"
                  onClick={handleNextStep}
                  style={{ flex: 2 }}
                >
                  <span>{isFr ? 'Suivant' : 'Next'}</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-auth-primary"
                  disabled={isLoading || !agreeTerms}
                  style={{ flex: 2 }}
                >
                  {isLoading && <span className="auth-spinner"></span>}
                  <span>{isLoading ? t.creatingAccount : t.createAccountBtn}</span>
                </button>
              )}
            </div>
          </form>

          {/* BOTTOM TEXT */}
          <p className="auth-bottom-switch">
            {isFr ? 'Vous avez déjà un compte Fixam ?' : 'Already have a Fixam account?'}
            <button
              type="button"
              className="auth-bottom-switch-link"
              onClick={() => onNavigate('login')}
            >
              {t.signIn}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
