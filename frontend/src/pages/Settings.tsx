import { useState } from 'react';
import { ArrowLeft, User, Bell, Palette, Globe, Moon, Sun, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: 'en',
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </Link>
          <div>
            <h1 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-stone-800">Settings</h1>
            <p className="text-stone-500 text-sm">Manage your preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#9CCC65]/15 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-[#5a8a2a]" />
              </div>
              <h2 className="font-bold text-lg text-stone-800">Profile Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Display Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#9CCC65]/30 focus:border-[#9CCC65]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#9CCC65]/30 focus:border-[#9CCC65]"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="font-bold text-lg text-stone-800">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <div>
                  <p className="font-medium text-stone-700">Push Notifications</p>
                  <p className="text-sm text-stone-500">Receive notifications on your device</p>
                </div>
                <button
                  onClick={() => handleToggle('notifications')}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-[#9CCC65]' : 'bg-stone-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-stone-700">Email Alerts</p>
                  <p className="text-sm text-stone-500">Receive email for important updates</p>
                </div>
                <button
                  onClick={() => handleToggle('emailAlerts')}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.emailAlerts ? 'bg-[#9CCC65]' : 'bg-stone-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.emailAlerts ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="font-bold text-lg text-stone-800">Appearance</h2>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {settings.darkMode ? <Moon className="w-5 h-5 text-stone-600" /> : <Sun className="w-5 h-5 text-stone-600" />}
                <div>
                  <p className="font-medium text-stone-700">Dark Mode</p>
                  <p className="text-sm text-stone-500">Switch between light and dark theme</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('darkMode')}
                className={`w-12 h-6 rounded-full transition-colors ${settings.darkMode ? 'bg-[#9CCC65]' : 'bg-stone-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="font-bold text-lg text-stone-800">Language</h2>
            </div>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#9CCC65]/30 focus:border-[#9CCC65]"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          {/* Save Button */}
          <button className="w-full py-4 bg-gradient-to-r from-[#8D6E63] to-[#6E554D] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
