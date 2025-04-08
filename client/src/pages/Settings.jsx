import React, { useState } from "react";
import { 
  User, 
  Edit, 
  Key, 
  Mail, 
  Shield, 
  Bell, 
  ExternalLink,
  Globe,
  Smartphone,
  Moon,
  Sun,
  Volume2,
  Languages,
  Clock,
  AlertCircle,
  Fingerprint,
  Wifi,
  Database,
  Settings as SettingsIcon
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { user, updatePassword, verifyOtpAndResetPassword, sendPasswordResetEmail, changeUsername } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "defaultUser");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("UTC-5 (Eastern Time)");

  // Existing handlers
  const handleChangePassword = async () => {
    try {
      setLoading(true);
      await updatePassword(user.email, password, newPassword);
      alert("Password updated successfully!");
      setIsChangingPassword(false);
      setPassword("");
      setNewPassword("");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(email);
      alert("OTP sent to your email!");
      setOtpSent(true);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    handleSendOtp();
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      await verifyOtpAndResetPassword(email, otp, newPassword);
      alert("Password reset successful!");
      setIsForgotPassword(false);
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async() => {
    try {
      setLoading(true);
      await changeUsername(email, username);
      setUsername(username);
      setIsEditingUsername(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPassword("");
    setNewPassword("");
  };

  const handleCancelPasswordReset = () => {
    setIsForgotPassword(false);
    setOtpSent(false);
    setOtp("");
    setNewPassword("");
  };

  const handleCancelUsernameEdit = () => {
    setIsEditingUsername(false);
    setUsername(localStorage.getItem("username") || "defaultUser");
  };

  // New components
  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        enabled ? 'bg-[#007AFF]' : 'bg-[#86868b]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 flex items-center space-x-4">
      <div className="w-12 h-12 rounded-xl bg-[#f5f5f7] flex items-center justify-center text-[#007AFF]">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-[#86868b] font-medium">{label}</p>
        <p className="text-lg font-semibold text-[#1d1d1f]">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbfbfd] to-[#f5f5f7]">
      {/* Header */}
      <div className="w-full bg-white/80 backdrop-blur-lg py-16 px-4 sm:px-6 md:py-20 lg:px-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-[#007AFF]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] mb-4">Account Settings</h2>
          <p className="text-[#86868b] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Manage your profile, security, and preferences
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Clock} label="Account Age" value="2 years" />
          <StatCard icon={Fingerprint} label="Last Login" value="2 hours ago" />
          <StatCard icon={Wifi} label="Active Sessions" value="2 devices" />
          <StatCard icon={Database} label="Data Usage" value="1.2 GB" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-[#007AFF]" />
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">Profile Information</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1d1d1f]">Name</label>
                  <p className="text-[#86868b] p-3 bg-[#f5f5f7] rounded-lg">{user?.name}</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1d1d1f]">Email</label>
                  <p className="text-[#86868b] p-3 bg-[#f5f5f7] rounded-lg">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1d1d1f]">Username</label>
                {isEditingUsername ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 text-base bg-[#f5f5f7] rounded-lg border-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                    <div className="flex gap-3">
                      <button 
                        onClick={handleUpdateUsername} 
                        className="flex-1 px-4 py-2 bg-[#007AFF] text-white text-sm rounded-lg hover:bg-[#0066CC] transition-colors"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Username"}
                      </button>
                      <button 
                        onClick={handleCancelUsernameEdit}
                        className="px-4 py-2 bg-[#f5f5f7] text-[#007AFF] text-sm rounded-lg hover:bg-[#e5e5e7] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-[#f5f5f7] rounded-lg">
                    <p className="text-[#86868b]">{username}</p>
                    <button 
                      onClick={() => setIsEditingUsername(true)}
                      className="px-4 py-2 bg-white text-[#007AFF] text-sm rounded-lg hover:bg-[#f5f5f7] transition-colors flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <Key className="w-8 h-8 text-[#007AFF]" />
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">Security</h2>
            </div>

            <div className="space-y-6">
              {/* Password Change Section */}
              {isChangingPassword ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#1d1d1f]">Change Password</h3>
                  <div className="space-y-3">
                    <input 
                      type="password" 
                      placeholder="Current Password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full px-4 py-3 text-base bg-[#f5f5f7] rounded-lg border-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                    <input 
                      type="password" 
                      placeholder="New Password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      className="w-full px-4 py-3 text-base bg-[#f5f5f7] rounded-lg border-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                    <div className="flex gap-3">
                      <button 
                        onClick={handleChangePassword} 
                        className="flex-1 px-4 py-2 bg-[#007AFF] text-white text-sm rounded-lg hover:bg-[#0066CC] transition-colors"
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Password"}
                      </button>
                      <button 
                        onClick={handleCancelPasswordChange}
                        className="px-4 py-2 bg-[#f5f5f7] text-[#007AFF] text-sm rounded-lg hover:bg-[#e5e5e7] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-[#f5f5f7] rounded-xl">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f]">Password</h3>
                    <p className="text-sm text-[#86868b]">Last updated 2 weeks ago</p>
                  </div>
                  <button 
                    onClick={() => setIsChangingPassword(true)}
                    className="px-4 py-2 bg-white text-[#007AFF] text-sm rounded-lg hover:bg-[#f5f5f7] transition-colors flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" /> Change
                  </button>
                </div>
              )}

              {/* Password Reset Section */}
              {isForgotPassword ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#1d1d1f]">Reset Password</h3>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full px-4 py-3 text-base bg-[#f5f5f7] rounded-lg border-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                    {otpSent ? (
                      <>
                        <input 
                          type="text" 
                          placeholder="Enter OTP" 
                          value={otp} 
                          onChange={(e) => setOtp(e.target.value)} 
                          className="w-full px-4 py-3 text-base bg-[#f5f5f7] rounded-lg border-none focus:ring-2 focus:ring-[#007AFF]"
                        />
                        <input 
                          type="password" 
                          placeholder="New Password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          className="w-full px-4 py-3 text-base bg-[#f5f5f7] rounded-lg border-none focus:ring-2 focus:ring-[#007AFF]"
                        />
                        <div className="flex gap-3">
                          <button 
                            onClick={handleResetPassword} 
                            className="flex-1 px-4 py-2 bg-[#007AFF] text-white text-sm rounded-lg hover:bg-[#0066CC] transition-colors"
                            disabled={loading}
                          >
                            {loading ? "Verifying..." : "Verify & Reset"}
                          </button>
                          <button 
                            onClick={handleResendOtp} 
                            className="px-4 py-2 bg-[#f5f5f7] text-[#007AFF] text-sm rounded-lg hover:bg-[#e5e5e7] transition-colors"
                            disabled={loading}
                          >
                            {loading ? "Resending..." : "Resend OTP"}
                          </button>
                        </div>
                        <button 
                          onClick={handleCancelPasswordReset}
                          className="w-full px-4 py-2 bg-[#f5f5f7] text-[#007AFF] text-sm rounded-lg hover:bg-[#e5e5e7] transition-colors"
                        >
                          Cancel Reset
                        </button>
                      </>
                    ) : (
                      <div className="flex gap-3">
                        <button 
                          onClick={handleSendOtp} 
                          className="flex-1 px-4 py-2 bg-[#007AFF] text-white text-sm rounded-lg hover:bg-[#0066CC] transition-colors"
                          disabled={loading}
                        >
                          {loading ? "Sending..." : "Send OTP"}
                        </button>
                        <button 
                          onClick={handleCancelPasswordReset}
                          className="px-4 py-2 bg-[#f5f5f7] text-[#007AFF] text-sm rounded-lg hover:bg-[#e5e5e7] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-[#f5f5f7] rounded-xl">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f]">Forgot Password?</h3>
                    <p className="text-sm text-[#86868b]">Reset via email verification</p>
                  </div>
                  <button 
                    onClick={() => setIsForgotPassword(true)}
                    className="px-4 py-2 bg-white text-[#007AFF] text-sm rounded-lg hover:bg-[#f5f5f7] transition-colors flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" /> Reset
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <SettingsIcon className="w-8 h-8 text-[#007AFF]" />
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">Preferences</h2>
            </div>

            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#f5f5f7] rounded-xl">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-[#007AFF]" />
                  ) : (
                    <Sun className="w-5 h-5 text-[#007AFF]" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f]">Dark Mode</h3>
                    <p className="text-sm text-[#86868b]">Switch between light and dark themes</p>
                  </div>
                </div>
                <ToggleSwitch enabled={darkMode} onChange={setDarkMode} />
              </div>

              {/* Notifications Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#f5f5f7] rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#007AFF]" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f]">Notifications</h3>
                    <p className="text-sm text-[#86868b]">Receive important updates</p>
                  </div>
                </div>
                <ToggleSwitch enabled={notificationsEnabled} onChange={setNotificationsEnabled} />
              </div>

              {/* Language Selection */}
              <div className="flex items-center justify-between p-4 bg-[#f5f5f7] rounded-xl">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#007AFF]" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f]">Language</h3>
                    <p className="text-sm text-[#86868b]">Choose your preferred language</p>
                  </div>
                </div>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-4 py-2 bg-white text-[#1d1d1f] text-sm rounded-lg border-none focus:ring-2 focus:ring-[#007AFF]"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              {/* Timezone Selection */}
              <div className="flex items-center justify-between p-4 bg-[#f5f5f7] rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#007AFF]" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f]">Timezone</h3>
                    <p className="text-sm text-[#86868b]">Set your local timezone</p>
                  </div>
                </div>
                <select 
                  value={timezone} 
                  onChange={(e) => setTimezone(e.target.value)}
                  className="px-4 py-2 bg-white text-[#1d1d1f] text-sm rounded-lg border-none focus:ring-2 focus:ring-[#007AFF]"
                >
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC-4 (Atlantic Time)</option>
                  <option>UTC-8 (Pacific Time)</option>
                  <option>UTC+0 (London)</option>
                  <option>UTC+1 (Paris)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Connected Devices */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <Smartphone className="w-8 h-8 text-[#007AFF]" />
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">Connected Devices</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#f5f5f7] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-[#007AFF]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f]">iPhone 13 Pro</h3>
                    <p className="text-sm text-[#86868b]">Last active: 2 minutes ago</p>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-600 text-sm font-medium">
                  Disconnect
                </button>
              </div>

              <div className="p-4 bg-[#f5f5f7] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[#007AFF]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f]">Chrome Browser</h3>
                    <p className="text-sm text-[#86868b]">Last active: Current session</p>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-600 text-sm font-medium">
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;