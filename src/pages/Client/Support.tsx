import React, { useState } from 'react';
import { Icon } from '../../App';
import { api } from '../../services/api';

interface SupportProps {
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
}

export default function Support({ setActiveTab, setActiveChatUser }: SupportProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState('bug');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactChat = () => {
    // Navigate to messages and set the active user to a Support bot/admin
    setActiveChatUser('Fixam Support');
    setActiveTab('Messages');
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await api.post('/users/feedback', {
        type: feedbackType,
        message: feedbackText
      });
      alert('Thank you! Your feedback has been submitted successfully.');
      setShowFeedbackModal(false);
      setFeedbackText('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in w-full">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Support Center</h2>
        <p className="text-gray-500">How can we help you today? Choose an option below to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact Support Chat */}
        <div 
          onClick={handleContactChat}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center md:items-start text-center md:text-left"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-4">
            <Icon name="chat" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Contact Support Team</h3>
          <p className="text-sm text-gray-500">
            Open a live chat with our support team to resolve your issues quickly.
          </p>
        </div>

        {/* Leave Feedback */}
        <div 
          onClick={() => setShowFeedbackModal(true)}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center md:items-start text-center md:text-left"
        >
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl mb-4">
            <Icon name="star" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Leave Feedback</h3>
          <p className="text-sm text-gray-500">
            Share your thoughts, report a bug, or suggest a new feature.
          </p>
        </div>

        {/* Contact info (Email & Phone) */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm md:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Direct Contact Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#14B8A6] text-white flex items-center justify-center text-lg">
                <Icon name="message" />
              </div>
              <div>
                <span className="block text-sm text-gray-500 font-medium">Email Us</span>
                <a href="mailto:fixam8899@gmail.com" className="block text-base font-bold text-gray-900 hover:text-[#14B8A6]">
                  fixam8899@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg">
                <Icon name="bell" />
              </div>
              <div>
                <span className="block text-sm text-gray-500 font-medium">Phone & WhatsApp</span>
                <a href="https://wa.me/237682803006" target="_blank" rel="noopener noreferrer" className="block text-base font-bold text-gray-900 hover:text-green-600">
                  +237 682803006
                </a>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Submit Feedback</h3>
              <button 
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={submitFeedback} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Feedback Type</label>
                <select 
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#14B8A6]"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                >
                  <option value="bug">Report a Bug</option>
                  <option value="suggestion">Suggestion / Feature Request</option>
                  <option value="complaint">File a Complaint</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#14B8A6] resize-none"
                  rows={4}
                  placeholder="Tell us what's on your mind..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#14B8A6] text-white font-bold rounded-lg hover:bg-[#0F9788] transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
