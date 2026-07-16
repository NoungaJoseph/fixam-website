import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CareerPathways.css';

interface Course {
  id: string;
  title: string;
  category: 'provider' | 'client';
  description: string;
  duration: string;
  difficulty: string;
  instructor: string;
  instructorRole: string;
  skillsGained: string[];
  briefVideoTitle: string;
  briefVideoDuration: string;
  briefText: string;
  taskInstructions: string;
  taskQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  modelVideoTitle: string;
  modelVideoDuration: string;
  modelText: string;
  dangerAlert?: string;
}

const MOCK_COURSES: Course[] = [
  {
    id: 'plumbing-pro',
    title: 'Professional Faucet Repair & Customer Ethics',
    category: 'provider',
    description: 'Learn the step-by-step professional method for repairing faucet leaks while maintaining premium client relations and cleanliness standards.',
    duration: '45 mins',
    difficulty: 'Intermediate',
    instructor: 'Jean-Pierre Nguene',
    instructorRole: 'Master Plumber & Instructor',
    skillsGained: ['Leak Diagnosis', 'Component Replacement', 'Professional Communication', 'Worksite Cleanup'],
    briefVideoTitle: 'Faucet Repair Briefing - Jean-Pierre',
    briefVideoDuration: '3:15',
    briefText: 'Welcome to your simulation! I\'m Jean-Pierre, a master plumber with 15+ years of experience. Today, you are representing Fixam at a client\'s house in Douala. The client reported a kitchen sink leak that has soaked their lower cabinet. Your goal is to inspect the setup, select the correct tools, fix the faucet cartridge or joint leak safely, and leave the workspace cleaner than it was.',
    taskInstructions: 'A client has a dripping single-handle mixer tap. Before opening any valves, choose the correct diagnostics and action sequence below to complete this task.',
    taskQuestions: [
      {
        question: 'What is the absolute first action you must take before starting any plumbing disassembly?',
        options: [
          'Unscrew the faucet handle directly',
          'Shut off the water supply using the angle stop valves under the sink',
          'Apply Teflon tape to the spout',
          'Place a bucket to collect the leakage'
        ],
        correctIndex: 1,
        explanation: 'Always shut off the local water supply first. Disassembling a plumbing fixture under line pressure will cause immediate flooding.'
      },
      {
        question: 'The water is shut off, but the faucet is still dripping from under the handle. Which component is most likely worn out and needs replacement?',
        options: [
          'The aerator at the tip of the spout',
          'The decorative cover dome',
          'The internal ceramic disc cartridge',
          'The hot water flexible supply line'
        ],
        correctIndex: 2,
        explanation: 'In single-handle mixer taps, dripping from the handle area usually indicates that the internal ceramic disc cartridge is cracked or its seals are worn out.'
      },
      {
        question: 'Which of these behaviors is required to maintain the Fixam Professional Standard before leaving the client\'s house?',
        options: [
          'Leave the wet floor as it is since it was already leaking',
          'Dry the cabinet floor, wipe down the faucet, double-check for leaks under pressure, and politely ask the client to inspect the result',
          'Tell the client they need to buy a completely new sink',
          'Pack your tools and leave immediately without testing'
        ],
        correctIndex: 1,
        explanation: 'Fixam professionals always clean up the worksite, test their work under pressure to ensure no new leaks occur, and walk the client through the repair.'
      }
    ],
    modelVideoTitle: 'Faucet Repair Model Walkthrough - Jean-Pierre',
    modelVideoDuration: '5:40',
    modelText: 'Excellent work completing the simulation! In this video walkthrough, I show you how to swap out a worn-out mixer cartridge, how to safely clean the seat before insertion to prevent grit from causing leaks, and how to verify pressure. Always remember: customer trust is built on quality, transparency, and a clean workspace.'
  },
  {
    id: 'plumbing-diy',
    title: 'Household Water Leak Diagnosis',
    category: 'client',
    description: 'Learn how to safely locate water leaks under your sink, identify simple fixes you can do yourself, and know when you must hire a professional.',
    duration: '25 mins',
    difficulty: 'Beginner',
    instructor: 'Sarah Kamga',
    instructorRole: 'Home Maintenance Specialist',
    skillsGained: ['Leak Detection', 'Shut-Off Valve Operation', 'Safety Assessment', 'DIY vs Pro Criteria'],
    briefVideoTitle: 'Under-Sink Leak Briefing - Sarah',
    briefVideoDuration: '2:40',
    briefText: 'Hello! I\'m Sarah, and I help homeowners manage basic troubleshooting. Finding a puddle under your kitchen sink can be stressful. In this simulation, you will learn how to dry the area, trace the source of the water, and determine if it is a simple loose connection or if you need to hire a certified plumber to avoid major property damage.',
    taskInstructions: 'You open your kitchen cabinet and find a small puddle. Walk through the diagnostics steps below to identify the issue.',
    dangerAlert: 'Safety Warning: If the leak is spraying high-pressure water, or if water is coming into contact with electrical outlets or garbage disposal wiring, DO NOT attempt a DIY repair. Immediately turn off the main valve and hire a certified plumber on Fixam!',
    taskQuestions: [
      {
        question: 'You dry the pipes with a towel. You notice water slowly bead around the threaded slip-joint nut on the plastic P-trap pipe when water runs down the drain. What should you try first?',
        options: [
          'Wrap duct tape around the pipe',
          'Gently hand-tighten the slip-joint nut (or use slip-joint pliers slightly)',
          'Call an emergency plumber immediately to break the wall',
          'Pour chemical drain cleaner down the sink'
        ],
        correctIndex: 1,
        explanation: 'Drain slip-joints rely on rubber washers compressed by a nut. Hand-tightening a loose nut often cures slow drain leaks immediately without tools.'
      },
      {
        question: 'If you notice water dripping directly from the metal pipe coming out of the wall *before* the shut-off valve, can you fix this yourself?',
        options: [
          'Yes, by wrapping it with tape or sealant',
          'No, this is a pressurized line before the isolation valve. Trying to unscrew this without main building shut-off will cause high-pressure flooding. Hire a professional.',
          'Yes, by turning the faucet handle tighter',
          'Yes, by replacing the sink basin'
        ],
        correctIndex: 1,
        explanation: 'Leaks on pressurized supply lines before the shut-off valve require main system isolation and professional plumbing tools. Attempting this DIY poses high flood risks.'
      }
    ],
    modelVideoTitle: 'DIY Leak Assessment Walkthrough - Sarah',
    modelVideoDuration: '4:15',
    modelText: 'Great job! Identifying the P-trap joint as the culprit is a common homeowner win. In this walkthrough, I show you how to inspect plastic washers for cracks and how to tighten them without cracking the plastic threads. For any metal pipe leaks, we always highlight the importance of hiring a professional via Fixam to protect your home insurance and ensure safety.'
  }
];

export default function CareerPathways({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'provider' | 'client'>('provider');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4>(1);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const filteredCourses = MOCK_COURSES.filter(c => c.category === activeTab);

  const startSimulation = (course: Course) => {
    setSelectedCourse(course);
    setCurrentStage(1);
    setVideoPlaying(false);
    setAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setStudentName('');
  };

  const exitSimulation = () => {
    setSelectedCourse(null);
  };

  const handleAnswerSelect = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const submitQuiz = () => {
    if (!selectedCourse) return;
    let correctCount = 0;
    selectedCourse.taskQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    setQuizScore(correctCount);
    setQuizSubmitted(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="career-pathways-container">
      {/* Background patterns */}
      <div className="pathways-bg-gradient" />
      <div className="pathways-grid-overlay" />

      {!selectedCourse ? (
        <div className="pathways-explore-mode">
          {/* Header */}
          <div className="pathways-header">
            <h1 className="pathways-title">Fixam Career Pathways</h1>
            <p className="pathways-subtitle">
              Interactive, staged job simulations designed to build real-world skills. 
              Earn your <strong>Fixam Certificate of Honor</strong> and boost your profile credibility.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="pathways-tabs-wrapper">
            <div className="pathways-tabs">
              <button 
                className={`pathways-tab-btn ${activeTab === 'provider' ? 'active' : ''}`}
                onClick={() => setActiveTab('provider')}
              >
                🛠️ Professional Pathways (For Providers)
              </button>
              <button 
                className={`pathways-tab-btn ${activeTab === 'client' ? 'active' : ''}`}
                onClick={() => setActiveTab('client')}
              >
                🏠 DIY & Diagnostic Pathways (For Clients)
              </button>
            </div>
          </div>

          {/* Course list */}
          <div className="pathways-grid">
            {filteredCourses.map(course => (
              <div key={course.id} className="pathway-card">
                <div className="pathway-card-header">
                  <span className="difficulty-badge">{course.difficulty}</span>
                  <span className="duration-badge">⏱️ {course.duration}</span>
                </div>
                <h3 className="pathway-card-title">{course.title}</h3>
                <p className="pathway-card-description">{course.description}</p>
                
                <div className="instructor-row">
                  <div className="instructor-avatar">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <div className="instructor-name">{course.instructor}</div>
                    <div className="instructor-role">{course.instructorRole}</div>
                  </div>
                </div>

                <div className="skills-gained-list">
                  {course.skillsGained.map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                  ))}
                </div>

                <button 
                  className="start-simulation-btn"
                  onClick={() => startSimulation(course)}
                >
                  Start Simulation Experience →
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pathway-simulation-workspace">
          {/* Top workspace navigation */}
          <div className="workspace-header">
            <button className="workspace-exit-btn" onClick={exitSimulation}>
              ← Exit Simulation
            </button>
            <h2 className="workspace-title">{selectedCourse.title}</h2>
            <div className="workspace-meta">
              Instructor: <strong>{selectedCourse.instructor}</strong>
            </div>
          </div>

          {/* Stage Progress Tracker */}
          <div className="stage-tracker">
            {[
              { num: 1, label: 'Briefing' },
              { num: 2, label: 'Work Task' },
              { num: 3, label: 'Model Answer' },
              { num: 4, label: 'Certificate' }
            ].map(stage => (
              <button 
                key={stage.num}
                className={`stage-step ${currentStage === stage.num ? 'active' : ''} ${currentStage > stage.num ? 'completed' : ''}`}
                disabled={stage.num > currentStage && !quizSubmitted}
                onClick={() => setCurrentStage(stage.num as any)}
              >
                <div className="stage-num-badge">
                  {currentStage > stage.num ? '✓' : stage.num}
                </div>
                <div className="stage-step-label">{stage.label}</div>
              </button>
            ))}
          </div>

          {/* Workspace content based on currentStage */}
          <div className="workspace-content-card">
            
            {/* STAGE 1: Briefing Video & Instructions */}
            {currentStage === 1 && (
              <div className="workspace-stage-pane">
                <div className="stage-left">
                  <span className="stage-tag">STAGE 1: MENTOR BRIEFING</span>
                  <h3>Project Overview</h3>
                  <p className="stage-description-text">{selectedCourse.briefText}</p>
                  
                  <div className="brief-deliverables">
                    <h4>Your Deliverables:</h4>
                    <ul>
                      <li>Review the symptoms reported by the customer.</li>
                      <li>Operate safety procedures.</li>
                      <li>Select the correct tools and diagnosis in Stage 2.</li>
                    </ul>
                  </div>

                  <button 
                    className="stage-action-btn"
                    onClick={() => setCurrentStage(2)}
                  >
                    Go to Stage 2: Practical Task
                  </button>
                </div>
                <div className="stage-right">
                  <div className="mock-video-player">
                    <div className="video-viewport">
                      <div className="instructor-overlay-icon">
                        {selectedCourse.instructor.charAt(0)}
                      </div>
                      {!videoPlaying ? (
                        <div className="video-play-overlay">
                          <button className="play-icon-btn" onClick={() => setVideoPlaying(true)}>▶</button>
                          <span className="video-title-label">{selectedCourse.briefVideoTitle} ({selectedCourse.briefVideoDuration})</span>
                        </div>
                      ) : (
                        <div className="video-playing-mock">
                          <div className="pulse-indicator" />
                          <span className="playing-text">Streaming Briefing Video...</span>
                          <button className="stop-video-btn" onClick={() => setVideoPlaying(false)}>⏸ Pause</button>
                        </div>
                      )}
                    </div>
                    <div className="video-controls-bar">
                      <div className="progress-bar-mock"><div className="progress-filled-mock" style={{ width: videoPlaying ? '40%' : '0%' }} /></div>
                      <span className="time-label">{videoPlaying ? '01:15' : '00:00'} / {selectedCourse.briefVideoDuration}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: Practical Work Task */}
            {currentStage === 2 && (
              <div className="workspace-stage-pane full-width">
                <div className="stage-instructions-block">
                  <span className="stage-tag">STAGE 2: PRACTICAL WORK SIMULATION</span>
                  <h3>Task Scenario</h3>
                  <p className="stage-description-text">{selectedCourse.taskInstructions}</p>
                  
                  {selectedCourse.dangerAlert && (
                    <div className="diy-danger-alert">
                      <div className="alert-icon">⚠️</div>
                      <div className="alert-content">
                        <strong>CRITICAL SAFETY ALERT</strong>
                        <p>{selectedCourse.dangerAlert}</p>
                        {selectedCourse.category === 'client' && (
                          <button 
                            className="emergency-pro-hire-btn" 
                            onClick={() => onNavigate('services')}
                          >
                            🚨 Emergency: Hire a Certified Pro Now
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="quiz-questions-list">
                  {selectedCourse.taskQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="quiz-card">
                      <h4 className="quiz-question-title">Question {qIdx + 1}: {q.question}</h4>
                      <div className="quiz-options-grid">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[qIdx] === oIdx;
                          const showCorrect = quizSubmitted && oIdx === q.correctIndex;
                          const showIncorrect = quizSubmitted && isSelected && oIdx !== q.correctIndex;
                          
                          let optClass = "quiz-option-card";
                          if (isSelected) optClass += " selected";
                          if (showCorrect) optClass += " correct";
                          if (showIncorrect) optClass += " incorrect";

                          return (
                            <button
                              key={oIdx}
                              className={optClass}
                              disabled={quizSubmitted}
                              onClick={() => handleAnswerSelect(qIdx, oIdx)}
                            >
                              <span className="option-bullet">
                                {showCorrect ? '✓' : showIncorrect ? '✗' : String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="option-text">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                      
                      {quizSubmitted && (
                        <div className="quiz-explanation-block">
                          <strong>{answers[qIdx] === q.correctIndex ? '✓ Correct!' : '✗ Incorrect'}</strong>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="quiz-action-footer">
                  {!quizSubmitted ? (
                    <button 
                      className="submit-quiz-btn"
                      disabled={Object.keys(answers).length < selectedCourse.taskQuestions.length}
                      onClick={submitQuiz}
                    >
                      Verify Answers & Submit Task
                    </button>
                  ) : (
                    <div className="quiz-results-banner">
                      <div className="score-summary">
                        You scored <strong>{quizScore} / {selectedCourse.taskQuestions.length}</strong>
                      </div>
                      <button 
                        className="stage-action-btn"
                        onClick={() => setCurrentStage(3)}
                      >
                        Proceed to Stage 3: Professional Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STAGE 3: Video Model Review */}
            {currentStage === 3 && (
              <div className="workspace-stage-pane">
                <div className="stage-left">
                  <span className="stage-tag">STAGE 3: PROFESSIONAL MODEL REVIEW</span>
                  <h3>How the Pro Solved It</h3>
                  <p className="stage-description-text">{selectedCourse.modelText}</p>
                  
                  <div className="pro-tips-block">
                    <h4>Pro Tips:</h4>
                    <ul>
                      <li>Double check washer seal orientation.</li>
                      <li>Never over-torque plastic drain joints.</li>
                      <li>Maintain eye contact and friendly body language when discussing rates with clients.</li>
                    </ul>
                  </div>

                  <button 
                    className="stage-action-btn"
                    onClick={() => setCurrentStage(4)}
                  >
                    Proceed to Stage 4: Get Certificate
                  </button>
                </div>
                <div className="stage-right">
                  <div className="mock-video-player">
                    <div className="video-viewport model-view">
                      <div className="instructor-overlay-icon">
                        {selectedCourse.instructor.charAt(0)}
                      </div>
                      {!videoPlaying ? (
                        <div className="video-play-overlay">
                          <button className="play-icon-btn model-play" onClick={() => setVideoPlaying(true)}>▶</button>
                          <span className="video-title-label">{selectedCourse.modelVideoTitle} ({selectedCourse.modelVideoDuration})</span>
                        </div>
                      ) : (
                        <div className="video-playing-mock">
                          <div className="pulse-indicator green" />
                          <span className="playing-text">Streaming Model Answer...</span>
                          <button className="stop-video-btn" onClick={() => setVideoPlaying(false)}>⏸ Pause</button>
                        </div>
                      )}
                    </div>
                    <div className="video-controls-bar">
                      <div className="progress-bar-mock"><div className="progress-filled-mock green" style={{ width: videoPlaying ? '55%' : '0%' }} /></div>
                      <span className="time-label">{videoPlaying ? '03:10' : '00:00'} / {selectedCourse.modelVideoDuration}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 4: Certificate of Honor */}
            {currentStage === 4 && (
              <div className="workspace-stage-pane full-width center-align">
                <span className="stage-tag">STAGE 4: EARN YOUR CREDENTIALS</span>
                <h3>Congratulations! You have completed the pathway.</h3>
                <p className="claim-desc">Enter your full name below to claim and print your official Fixam Certificate of Honor.</p>
                
                <div className="certificate-input-group">
                  <input 
                    type="text" 
                    placeholder="Enter your full name" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="cert-name-input"
                  />
                  <button 
                    className="generate-cert-btn"
                    disabled={!studentName.trim()}
                    onClick={() => setShowCertificateModal(true)}
                  >
                    View Certificate of Honor ✨
                  </button>
                </div>

                {selectedCourse.category === 'provider' && (
                  <div className="provider-badge-info-box">
                    <div className="info-badge-icon">🎖️</div>
                    <div className="info-badge-details">
                      <strong>Automatic Profile Highlights Enabled</strong>
                      <p>Completing this Career Pathway grants you a special "Certified Partner" badge on your Fixam Provider Profile, increasing your visibility to potential clients by 10%.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* CERTIFICATE MODAL */}
      {showCertificateModal && selectedCourse && (
        <div className="certificate-modal-overlay">
          <div className="certificate-modal-content">
            <button className="close-modal-btn" onClick={() => setShowCertificateModal(false)}>✕ Close</button>
            
            {/* Printable Certificate Template */}
            <div id="printable-certificate-area" className="certificate-print-wrapper">
              <div className="certificate-border-outer">
                <div className="certificate-border-inner">
                  
                  {/* Decorative corner flourishes */}
                  <div className="flourish top-left"></div>
                  <div className="flourish top-right"></div>
                  <div className="flourish bottom-left"></div>
                  <div className="flourish bottom-right"></div>

                  <div className="certificate-header">
                    <span className="cert-brand-logo">FIXAM</span>
                    <span className="cert-sub-brand">CAREER PATHWAYS</span>
                  </div>

                  <h1 className="certificate-title">Certificate of Honor</h1>
                  <p className="cert-awarded-text">This is proudly presented to</p>
                  
                  <div className="cert-student-name">
                    {studentName}
                  </div>
                  
                  <div className="cert-divider-line" />

                  <p className="cert-description">
                    For successfully completing the virtual simulation and practical testing requirements for the course
                  </p>
                  
                  <h3 className="cert-course-title">
                    {selectedCourse.title}
                  </h3>

                  <p className="cert-verification-text">
                    Verifying mastery of key field skills: <strong>{selectedCourse.skillsGained.join(', ')}</strong>.
                  </p>

                  <div className="certificate-footer">
                    <div className="signature-block">
                      <span className="signature-line">Fixam Pathways Team</span>
                      <span className="signature-title">Official Administrator</span>
                    </div>

                    <div className="gold-seal-wrapper">
                      <div className="gold-seal">
                        <div className="seal-inner">
                          <span className="seal-text">FIXAM</span>
                          <span className="seal-star">★ APPROVED ★</span>
                        </div>
                      </div>
                    </div>

                    <div className="signature-block">
                      <span className="signature-line">{selectedCourse.instructor}</span>
                      <span className="signature-title">Course Instructor</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="modal-actions-bar">
              <button className="print-action-btn" onClick={handlePrint}>
                🖨️ Print / Save as PDF
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
