import React from 'react';
import { Page } from '../App';
import './AssistantModal.css';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  isFr?: boolean;
}

export default function AssistantModal({ isOpen, onClose, onNavigate, isFr = false }: AssistantModalProps) {
  if (!isOpen) return null;

  return (
    <div className="assistant-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="assistant-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="assistant-modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Modal Title */}
        <h2 className="assistant-modal-title">
          {isFr ? 'Comment pouvons-nous vous aider aujourd\'hui ?' : 'How can we help you today?'}
        </h2>

        {/* 2 Choice Cards (Clean typography, no icons/emojis) */}
        <div className="assistant-modal-cards-grid">
          {/* Card 1: For Clients / Consumers */}
          <div 
            className="assistant-choice-card"
            onClick={() => {
              onClose();
              onNavigate('services');
            }}
          >
            <h3 className="assistant-card-heading">
              {isFr 
                ? 'J\'ai besoin d\'un service et souhaite embaucher un artisan vérifié' 
                : 'I need a service or want to hire a verified professional'}
            </h3>
            <p className="assistant-card-desc">
              {isFr
                ? 'Publiez une tâche gratuitement ou parcourez les plombiers, électriciens, déménageurs et techniciens près de chez vous. Réalisez vos travaux rapidement et sans frais de réservation.'
                : 'Post a task for free or browse verified plumbers, electricians, cleaners, and technicians near you. Let\'s resolve your service needs quickly and efficiently.'}
            </p>
            <span className="assistant-card-link">
              {isFr ? 'Explorer les services & Publier →' : 'Explore Services & Post a Task →'}
            </span>
          </div>

          {/* Card 2: For Providers / Business */}
          <div 
            className="assistant-choice-card"
            onClick={() => {
              onClose();
              onNavigate('register');
            }}
          >
            <h3 className="assistant-card-heading">
              {isFr
                ? 'Je suis un artisan ou prestataire et je recherche des missions'
                : 'I\'m a skilled service provider looking for jobs & client leads'}
            </h3>
            <p className="assistant-card-desc">
              {isFr
                ? 'Inscrivez-vous gratuitement, créez votre profil certifié et accédez à des offres de travail directes de clients au Cameroun avec 0% de commission.'
                : 'Join Fixam for free, create your verified profile, and access direct job leads from clients across Cameroon with zero commission fees.'}
            </p>
            <span className="assistant-card-link">
              {isFr ? 'Devenir Prestataire / Connexion →' : 'Join as Provider / Portal Login →'}
            </span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="assistant-modal-bottom">
          <button 
            className="assistant-modal-btn-primary"
            onClick={() => {
              onClose();
              onNavigate('services');
            }}
          >
            {isFr ? 'Découvrir les solutions Fixam' : 'Explore Fixam\'s Solutions'}
          </button>
        </div>
      </div>
    </div>
  );
}
