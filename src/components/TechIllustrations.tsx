import React from 'react';

/**
 * Modern Tech Illustration for Hero Section (Matching Image 3)
 * Features a professional working at a modern tech desk with screens, charts, and clean blue accents.
 */
export function HeroTechIllustration() {
  return (
    <div className="tsi-hero-illustration-wrapper">
      <svg 
        viewBox="0 0 600 480" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="tsi-vector-svg"
      >
        {/* Soft Background Accent Shapes */}
        <path d="M420 80C510 110 560 190 540 290C520 390 440 450 340 460C240 470 180 430 140 360C100 290 90 200 140 130C190 60 330 50 420 80Z" fill="#F0FDFA" />
        <path d="M480 220C520 250 540 310 520 370C500 430 440 460 380 460L480 220Z" fill="#CCFBF1" opacity="0.6" />

        {/* Desk and Floor Line */}
        <rect x="220" y="270" width="280" height="8" rx="4" fill="#0B1B3D" stroke="#0B1B3D" strokeWidth="2" />
        <line x1="260" y1="278" x2="260" y2="440" stroke="#0B1B3D" strokeWidth="3" />
        <line x1="470" y1="278" x2="470" y2="440" stroke="#0B1B3D" strokeWidth="3" />

        {/* Desk Plant */}
        <rect x="240" y="248" width="22" height="22" rx="3" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2" />
        <path d="M245 248C240 230 248 215 251 210C254 215 262 230 257 248" fill="#14B8A6" stroke="#0B1B3D" strokeWidth="1.5" />
        <path d="M252 248C258 235 268 225 272 222C272 228 268 240 258 248" fill="#2DD4BF" stroke="#0B1B3D" strokeWidth="1.5" />

        {/* Computer Screen */}
        <rect x="280" y="140" width="130" height="95" rx="6" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2.5" />
        <rect x="290" y="152" width="45" height="35" rx="3" fill="#0B1B3D" />
        <line x1="345" y1="155" x2="395" y2="155" stroke="#99F6E4" strokeWidth="2" strokeLinecap="round" />
        <line x1="345" y1="165" x2="385" y2="165" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        <line x1="345" y1="175" x2="390" y2="175" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        
        {/* Screen Data Graph Lines */}
        <path d="M295 215L315 200L335 210L360 190L385 205L400 185" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Monitor Stand */}
        <rect x="338" y="235" width="14" height="25" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2" />
        <rect x="325" y="260" width="40" height="6" rx="2" fill="#0B1B3D" />

        {/* Wall Frame / Metric Board */}
        <rect x="420" y="110" width="70" height="50" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="435" cy="125" r="4" fill="#2DD4BF" />
        <circle cx="450" cy="125" r="4" fill="#99F6E4" />
        <circle cx="465" cy="125" r="4" fill="#CCFBF1" />
        <line x1="430" y1="140" x2="475" y2="140" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="430" y1="148" x2="460" y2="148" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />

        {/* Lamp on Desk */}
        <path d="M430 268L440 215L435 210" stroke="#0B1B3D" strokeWidth="2" fill="none" />
        <path d="M428 210L448 200L452 215L432 225Z" fill="#14B8A6" stroke="#0B1B3D" strokeWidth="1.5" />

        {/* Modern Character (Seated at Desk) */}
        {/* Legs & Pants */}
        <path d="M380 290L395 385L360 390L348 310Z" fill="#0B1B3D" />
        <path d="M395 385L430 380L432 395L390 400Z" fill="#0B1B3D" />
        <path d="M365 390L340 435L315 435L335 385Z" fill="#0B1B3D" />
        <rect x="305" y="430" width="40" height="10" rx="3" fill="#0B1B3D" />

        {/* Modern Office Chair */}
        <path d="M395 280C395 280 430 280 435 320C440 360 410 375 400 375L350 375L350 280Z" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2" />
        <line x1="390" y1="375" x2="390" y2="420" stroke="#0B1B3D" strokeWidth="3" />
        <line x1="365" y1="420" x2="415" y2="420" stroke="#0B1B3D" strokeWidth="3" />
        <circle cx="365" cy="425" r="3" fill="#0B1B3D" />
        <circle cx="415" cy="425" r="3" fill="#0B1B3D" />

        {/* Torso & Shirt */}
        <path d="M365 175C375 175 405 185 410 230C415 270 395 295 365 295L340 295L335 240L350 178Z" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2.5" />
        
        {/* Arm reaching for computer */}
        <path d="M365 190C360 215 325 240 295 245L295 235C315 230 345 210 355 190Z" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2" />
        <circle cx="292" cy="242" r="5" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="1.5" />

        {/* Head & Hair */}
        <path d="M375 130C390 130 398 142 396 158C394 172 382 178 370 176C360 174 356 164 358 150C360 136 368 130 375 130Z" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2" />
        {/* Stylish Modern Hair */}
        <path d="M368 130C380 120 400 125 400 145C400 150 395 158 395 165C390 155 385 152 380 152C375 152 370 155 368 158C366 148 362 142 368 130Z" fill="#0B1B3D" />
        
        {/* Ear & Glasses/Details */}
        <circle cx="366" cy="156" r="3" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="1.5" />
        <path d="M352 148L360 148" stroke="#0B1B3D" strokeWidth="1.5" />

        {/* Potted Floor Plant on the Left */}
        <rect x="180" y="380" width="30" height="35" rx="3" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2" />
        <path d="M195 380C190 340 170 300 160 280C175 300 195 330 195 380Z" fill="#0D9488" stroke="#0B1B3D" strokeWidth="1.5" />
        <path d="M195 380C205 330 225 290 235 270C225 295 205 340 195 380Z" fill="#2DD4BF" stroke="#0B1B3D" strokeWidth="1.5" />
        <path d="M195 380C195 320 195 270 195 250C198 280 200 330 195 380Z" fill="#99F6E4" stroke="#0B1B3D" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/**
 * Modern Tech Illustration for "The Fixam Difference" (Matching Image 2)
 * Features a professional standing in front of digital analytics/service boards.
 */
export function DifferenceTechIllustration() {
  return (
    <div className="tsi-diff-illustration-wrapper">
      <svg 
        viewBox="0 0 540 500" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="tsi-vector-svg"
      >
        {/* Soft Background Accent */}
        <rect x="50" y="40" width="440" height="420" rx="20" fill="#F8FAFC" />
        <path d="M120 30C280 10 440 40 480 180C520 320 440 450 300 470C160 490 80 410 60 300C40 190 60 50 120 30Z" fill="#F0FDFA" />

        {/* Digital Dashboard Display / Stand */}
        {/* Stand Pole and Base */}
        <rect x="285" y="180" width="12" height="260" fill="#0B1B3D" />
        <ellipse cx="291" cy="445" rx="55" ry="12" fill="#0B1B3D" />

        {/* Floating Digital Presentation Screen */}
        <g filter="drop-shadow(0px 14px 28px rgba(11, 27, 61, 0.12))">
          <rect x="150" y="45" width="290" height="240" rx="10" fill="#FFFFFF" stroke="#14B8A6" strokeWidth="4" />
        </g>

        {/* Dashboard Top Bar */}
        <line x1="150" y1="80" x2="440" y2="80" stroke="#E2E8F0" strokeWidth="2" />
        <circle cx="175" cy="62" r="5" fill="#EF4444" />
        <circle cx="195" cy="62" r="5" fill="#F59E0B" />
        <circle cx="215" cy="62" r="5" fill="#10B981" />

        {/* Dashboard Content Panels */}
        {/* Panel 1: Bar Chart */}
        <rect x="170" y="95" width="70" height="120" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
        <rect x="180" y="175" width="12" height="30" rx="2" fill="#99F6E4" />
        <rect x="200" y="150" width="12" height="55" rx="2" fill="#2DD4BF" />
        <rect x="220" y="125" width="12" height="80" rx="2" fill="#0D9488" />

        {/* Panel 2: Wave Chart */}
        <rect x="250" y="95" width="105" height="120" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
        <path d="M260 160C275 130 290 175 305 140C320 105 335 150 345 135" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="260" cy="160" r="3.5" fill="#14B8A6" />
        <circle cx="305" cy="140" r="3.5" fill="#14B8A6" />
        <circle cx="345" cy="135" r="3.5" fill="#14B8A6" />
        <line x1="260" y1="190" x2="345" y2="190" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Panel 3: Stats Summary */}
        <rect x="365" y="95" width="60" height="120" rx="6" fill="#F0FDFA" stroke="#99F6E4" strokeWidth="1.5" />
        <circle cx="395" cy="125" r="14" fill="#14B8A6" />
        <path d="M390 125L393 128L400 121" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="375" y1="155" x2="415" y2="155" stroke="#99F6E4" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="375" y1="168" x2="405" y2="168" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        <line x1="375" y1="180" x2="415" y2="180" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

        {/* Pedestal with Document Binder Storage */}
        <rect x="305" y="320" width="105" height="120" rx="4" fill="#0D9488" stroke="#0B1B3D" strokeWidth="2.5" />
        {/* Binder Box 1 */}
        <rect x="315" y="275" width="40" height="45" rx="3" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2" />
        <circle cx="335" cy="295" r="4" fill="#14B8A6" />
        <line x1="325" y1="308" x2="345" y2="308" stroke="#0B1B3D" strokeWidth="1.5" />
        {/* Binder Box 2 */}
        <rect x="360" y="260" width="40" height="60" rx="3" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2" />
        <circle cx="380" cy="290" r="4" fill="#14B8A6" />
        <line x1="370" y1="305" x2="390" y2="305" stroke="#0B1B3D" strokeWidth="1.5" />

        {/* Standing Professional (Left Column Character from Image 2) */}
        {/* Legs & Trousers */}
        <path d="M125 240L115 450L145 450L150 280Z" fill="#14B8A6" stroke="#0B1B3D" strokeWidth="2" />
        <path d="M150 280L165 450L195 450L185 240Z" fill="#0D9488" stroke="#0B1B3D" strokeWidth="2" />
        {/* Shoes */}
        <rect x="100" y="445" width="48" height="12" rx="4" fill="#0B1B3D" />
        <rect x="165" y="445" width="48" height="12" rx="4" fill="#0B1B3D" />
        {/* Belt */}
        <rect x="125" y="235" width="60" height="10" fill="#0B1B3D" />

        {/* Torso / Lab Coat / Shirt */}
        <path d="M105 105C110 100 180 100 190 120C195 130 185 240 185 240L125 240L105 130Z" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2.5" />
        {/* Coat Collar & Trim */}
        <path d="M135 105L145 150L125 150Z" fill="#14B8A6" stroke="#0B1B3D" strokeWidth="1.5" />

        {/* Right Arm (Holding Tablet / Pointer to Screen) */}
        <path d="M165 125L230 145L225 155L165 140Z" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2" />
        <circle cx="232" cy="148" r="5" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2" />
        <line x1="235" y1="145" x2="255" y2="135" stroke="#0B1B3D" strokeWidth="2.5" strokeLinecap="round" />

        {/* Left Arm (Holding Clipboard / Notes) */}
        <path d="M110 125L85 190L100 195L120 145Z" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2" />
        <rect x="75" y="180" width="30" height="40" rx="3" fill="#0B1B3D" transform="rotate(-10 75 180)" />

        {/* Head & Hair */}
        <path d="M135 65C148 65 165 75 162 95C160 108 148 112 138 110C128 108 122 98 124 85C126 72 130 65 135 65Z" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="2" />
        {/* Teal Accent */}
        <path d="M130 65C145 55 168 62 168 80C168 88 160 92 160 98C155 88 148 85 142 85C136 85 132 88 130 92C128 82 125 75 130 65Z" fill="#14B8A6" />
        
        {/* Face Profile & Glasses */}
        <circle cx="152" cy="85" r="4" fill="#FFFFFF" stroke="#0B1B3D" strokeWidth="1.5" />
        <line x1="156" y1="85" x2="162" y2="85" stroke="#0B1B3D" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/**
 * Official Fixam Brand Emblem for "What We Do" Dark Section
 */
export function WhatWeDoEmblem() {
  return (
    <div className="what-we-do-emblem-box" style={{ width: 'auto', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
      <div style={{ background: '#FFFFFF', padding: '0.9rem 1.75rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src="/assets/fixam-white-bg.png" 
          alt="Fixam Logo" 
          style={{ height: '44px', objectFit: 'contain', display: 'block' }}
        />
      </div>
      <span style={{ color: '#38BDF8', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        FIXAM
      </span>
    </div>
  );
}
