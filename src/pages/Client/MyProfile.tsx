import './MyProfile.css';
import { useState } from 'react';
import { Icon, images } from '../../App';

interface MyProfileProps {
  setActiveTab: (tab: string) => void;
}

export default function MyProfile({ setActiveTab }: MyProfileProps) {
  const [profileActiveSubTab, setProfileActiveSubTab] = useState('Overview');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in w-full">
      {/* Profile Header */}
      <div className="mb-8 relative bg-transparent">
        <div className="flex flex-col md:flex-row items-center md:items-end text-center md:text-left gap-6 relative">
          <div className="relative flex-shrink-0">
            <img src={images.proJeff} alt="Nounga" className="w-28 h-28 rounded-full shadow-md object-cover bg-gray-100" />
            <button className="absolute bottom-0 right-0 bg-[#14B8A6] text-white p-1.5 rounded-full shadow-sm hover:bg-[#0F9788] transition" aria-label="Change Avatar" onClick={() => alert('Change avatar flow coming soon!')}>
              <Icon name="user" />
            </button>
          </div>
          <div className="flex-1 pb-1 w-full">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">Nounga</h2>
              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                <Icon name="shield" /> Verified
              </span>
            </div>
            
            {/* Displaying contact info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-sm text-gray-500 mt-4 w-full">
              <p className="flex items-center gap-1.5"><Icon name="message" /> nounga@gmail.com</p>
              <p className="flex items-center gap-1.5"><Icon name="bell" /> +237 6 98 76 54 32</p>
              <p className="flex items-center gap-1.5"><Icon name="location" /> Your Area</p>
            </div>
          </div>
          <div className="pb-1 mt-4 md:mt-0">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition flex items-center gap-2" onClick={() => alert('Edit Profile modal coming soon!')}>
              <Icon name="wrench" /> Edit Profile
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
          <div className="text-center md:text-left">
            <span className="block text-xs text-gray-400 mb-1">Member Since</span>
            <strong className="flex items-center justify-center md:justify-start gap-2 text-gray-800 text-sm"><Icon name="calendar" /> May 15, 2024</strong>
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
        {['Overview', 'Bookings', 'Reviews', 'Payments', 'Saved Providers', 'Preferences', 'Settings'].map((subTab) => (
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-2 space-y-8">
            
            <section className="bg-transparent border-0 rounded-none p-0 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">About Me</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                I'm a local business owner. I use Fixam to find reliable and verified professionals for all my home and office needs. Quality service and trust are my top priorities.
              </p>
            </section>

            <section className="bg-transparent border-0 rounded-none p-0">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex flex-col py-2 border-b border-gray-100">
                  <span className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Icon name="user" /> Full Name</span>
                  <strong className="text-sm font-semibold text-gray-800">Nounga</strong>
                </div>
                <div className="flex flex-col py-2 border-b border-gray-100">
                  <span className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Icon name="message" /> Email Address</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-semibold text-gray-800">nounga@gmail.com</strong>
                    <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold"><Icon name="check" /> Verified</span>
                  </div>
                </div>
                <div className="flex flex-col py-2 border-b border-gray-100">
                  <span className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Icon name="bell" /> Phone Number</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-semibold text-gray-800">+237 6 98 76 54 32</strong>
                    <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold"><Icon name="check" /> Verified</span>
                  </div>
                </div>
                <div className="flex flex-col py-2 border-b border-gray-100">
                  <span className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Icon name="location" /> Location</span>
                  <strong className="text-sm font-semibold text-gray-800">London, UK</strong>
                </div>
                <div className="flex flex-col py-2 border-b border-gray-100">
                  <span className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Icon name="calendar" /> Date of Birth</span>
                  <strong className="text-sm font-semibold text-gray-800">01/01/1990</strong>
                </div>
                <div className="flex flex-col py-2 border-b border-gray-100">
                  <span className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Icon name="briefcase" /> Occupation</span>
                  <strong className="text-sm font-semibold text-gray-800">Business Owner</strong>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            <div className="bg-transparent border-0 rounded-none p-0">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Icon name="message" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-gray-800">Email</span>
                      <span className="block text-xs text-gray-500">Verified</span>
                    </div>
                  </div>
                  <Icon name="check" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Icon name="bell" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-gray-800">Phone</span>
                      <span className="block text-xs text-gray-500">Verified</span>
                    </div>
                  </div>
                  <Icon name="check" />
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                      <Icon name="shield" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-gray-800">ID Document</span>
                      <span className="block text-xs text-gray-500">Not Verified</span>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-[#14B8A6] hover:text-[#0F9788]">Verify</button>
                </div>
              </div>
            </div>

            <section className="mb-6">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Account Summary</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Icon name="calendar" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">12</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Total Bookings</p>
                </div>
                
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon name="briefcase" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">4</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Active Bookings</p>
                </div>
                
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                      <Icon name="check" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">8</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Completed Jobs</p>
                </div>
                
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-yellow-50 text-[#F59E0B] flex items-center justify-center">
                      <Icon name="star" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">18</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Saved Providers</p>
                </div>
              </div>
            </section>

            <section className="bg-transparent border-0 rounded-none p-0">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <button className="text-xs font-semibold text-[#14B8A6] hover:text-[#0F9788]" onClick={() => setActiveTab('Notifications')}>View All</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <Icon name="calendar" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">You booked Plumber Pro</h4>
                    <p className="text-xs text-gray-500">Booking confirmed</p>
                    <span className="block text-[10px] text-gray-400 mt-1">2 min ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <Icon name="check" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">John Doe accepted your request</h4>
                    <p className="text-xs text-gray-500">Electrical Installation</p>
                    <span className="block text-[10px] text-gray-400 mt-1">15 min ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <Icon name="wallet" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Payment with coins completed</h4>
                    <p className="text-xs text-gray-500">3 coins used</p>
                    <span className="block text-[10px] text-gray-400 mt-1">1 hour ago</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {profileActiveSubTab !== 'Overview' && (
        <div className="bg-transparent border-0 rounded-none p-0 text-center py-12">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{profileActiveSubTab}</h3>
          <p className="text-sm text-gray-500">This section is currently under construction.</p>
        </div>
      )}
    </div>
  );
}
