import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Globe, 
  Shield, 
  Moon, 
  Sun, 
  Laptop, 
  Save, 
  Camera, 
  Trash2,
  Check
} from 'lucide-react';

// Mock user data
const mockUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  createdAt: '2023-01-15T10:30:00Z',
};

export default function Settings() {
  // User settings state
  const [user, setUser] = useState(mockUser);
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);

  // Preferences state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('mi');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [tripReminders, setTripReminders] = useState(true);
  const [collaborationUpdates, setCollaborationUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications' | 'privacy'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleProfileSave = () => {
    // In a real app, this would call an API to update the user profile
    setUser({ ...user, name, email });
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  const handleAvatarUpload = () => {
    // In a real app, this would open a file picker and upload the selected image
    alert('This would open a file picker in a real app');
  };
  
  return (
    <>
      <Head>
        <title>Settings | WanderPlan Studio</title>
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="mr-4 text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                      activeTab === 'profile'
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <User className={`h-5 w-5 mr-3 ${activeTab === 'profile' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                      activeTab === 'preferences'
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Globe className={`h-5 w-5 mr-3 ${activeTab === 'preferences' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span>Preferences</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                      activeTab === 'notifications'
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Bell className={`h-5 w-5 mr-3 ${activeTab === 'notifications' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span>Notifications</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                      activeTab === 'privacy'
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Shield className={`h-5 w-5 mr-3 ${activeTab === 'privacy' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span>Privacy & Security</span>
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow">
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your personal information
                      </p>
                    </div>
                    
                    <div className="px-6 py-6">
                      {saveSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Check className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm">Profile updated successfully</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center mb-8">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 mb-4 sm:mb-0 sm:mr-6">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <User className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={handleAvatarUpload}>
                            <Camera className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        
                        <div>
                          <button
                            onClick={handleAvatarUpload}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Change Photo
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={handleProfileSave}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Preferences */}
                {activeTab === 'preferences' && (
                  <div>
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Preferences</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Customize your app experience
                      </p>
                    </div>
                    
                    <div className="px-6 py-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                          </label>
                          <div className="flex space-x-4">
                            <button
                              onClick={() => setTheme('light')}
                              className={`px-4 py-2 rounded-md flex items-center ${
                                theme === 'light'
                                  ? 'bg-blue-100 text-blue-700 border border-blue-500'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <Sun className="h-4 w-4 mr-2" />
                              Light
                            </button>
                            <button
                              onClick={() => setTheme('dark')}
                              className={`px-4 py-2 rounded-md flex items-center ${
                                theme === 'dark'
                                  ? 'bg-blue-100 text-blue-700 border border-blue-500'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <Moon className="h-4 w-4 mr-2" />
                              Dark
                            </button>
                            <button
                              onClick={() => setTheme('system')}
                              className={`px-4 py-2 rounded-md flex items-center ${
                                theme === 'system'
                                  ? 'bg-blue-100 text-blue-700 border border-blue-500'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <Laptop className="h-4 w-4 mr-2" />
                              System
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                            Language
                          </label>
                          <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="ja">日本語</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                            Currency
                          </label>
                          <select
                            id="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="JPY">JPY (¥)</option>
                            <option value="CAD">CAD ($)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Distance Unit
                          </label>
                          <div className="flex space-x-4">
                            <button
                              onClick={() => setDistanceUnit('km')}
                              className={`px-4 py-2 rounded-md ${
                                distanceUnit === 'km'
                                  ? 'bg-blue-100 text-blue-700 border border-blue-500'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              Kilometers (km)
                            </button>
                            <button
                              onClick={() => setDistanceUnit('mi')}
                              className={`px-4 py-2 rounded-md ${
                                distanceUnit === 'mi'
                                  ? 'bg-blue-100 text-blue-700 border border-blue-500'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              Miles (mi)
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setSaveSuccess(true);
                              setTimeout(() => setSaveSuccess(false), 3000);
                            }}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Preferences
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Notifications */}
                {activeTab === 'notifications' && (
                  <div>
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage how we contact you
                      </p>
                    </div>
                    
                    <div className="px-6 py-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                            <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={emailNotifications}
                              onChange={() => setEmailNotifications(!emailNotifications)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Trip Reminders</h3>
                            <p className="text-sm text-gray-500">Get notified before your trips</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={tripReminders}
                              onChange={() => setTripReminders(!tripReminders)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Collaboration Updates</h3>
                            <p className="text-sm text-gray-500">Get notified when someone shares a trip with you</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={collaborationUpdates}
                              onChange={() => setCollaborationUpdates(!collaborationUpdates)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
                            <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={marketingEmails}
                              onChange={() => setMarketingEmails(!marketingEmails)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setSaveSuccess(true);
                              setTimeout(() => setSaveSuccess(false), 3000);
                            }}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Notification Settings
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Privacy & Security */}
                {activeTab === 'privacy' && (
                  <div>
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Privacy & Security</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage your account security and data privacy
                      </p>
                    </div>
                    
                    <div className="px-6 py-6">
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-4">Password</h3>
                          <button
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Change Password
                          </button>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                          <button
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Enable Two-Factor Authentication
                          </button>
                          <p className="mt-2 text-xs text-gray-500">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-4">Data Privacy</h3>
                          <button
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Download My Data
                          </button>
                          <p className="mt-2 text-xs text-gray-500">
                            Get a copy of all your data stored in our system
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-red-600 mb-4">Delete Account</h3>
                          <button
                            className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete My Account
                          </button>
                          <p className="mt-2 text-xs text-gray-500">
                            This will permanently delete your account and all associated data
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 