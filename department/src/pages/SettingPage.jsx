import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Settings, 
  User, 
  Shield, 
  Building2,
  UserCog,
  Globe,
  Phone,
  Mail,
  BadgeCheck,
  Building,
  Users,
  Activity,
  Clock,
  Cloud,
  Database,
  Lock,
  Bell,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';

export default function SettingsPage() {
  const { API_URL } = useApi()
  const { user } = useAuth();
  const [userData, setUserData] = useState({ 
    name: '', 
    email: '', 
    departments: [], 
    _id: '', 
    types: [] 
  });

  useEffect(() => {
    if (user) {
      axios.get(`${API_URL}/admin/${user.email}`)
        .then(response => setUserData(response.data))
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [user]);

  const Badge = ({ text }) => (
    <span className="px-4 py-1.5 bg-[#f5f5f7] text-gray-800 rounded-full text-sm font-medium tracking-wide backdrop-blur-sm">
      {text}
    </span>
  );

  const StatCard = ({ icon: Icon, label, value, color = "text-gray-900", bgColor = "bg-white" }) => (
    <div className={`${bgColor} rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-md`}>
      <div className="flex items-center space-x-4">
        <div className={`w-14 h-14 rounded-2xl bg-[#f5f5f7] flex items-center justify-center ${color}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium tracking-wide">{label}</p>
          <p className={`text-2xl font-semibold mt-1 ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbfbfd] to-[#f5f5f7]">
      {/* Header */}


      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome back, {userData.name?.split(' ')[0]}</h1>
          <p className="text-lg text-gray-500">Manage your account settings and system preferences</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-sm mb-12 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-semibold mb-8 flex items-center">
                <User className="w-6 h-6 mr-3 text-gray-700" />
                Profile Information
              </h2>
              <div className="space-y-8">
                <div>
                  <label className="text-sm text-gray-500 block mb-2">Full Name</label>
                  <p className="text-xl font-medium">{userData.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-2">Email Address</label>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <p className="text-xl font-medium">{userData.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-2">Employee ID</label>
                  <p className="text-xl font-medium font-mono">{userData._id}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-8 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-gray-700" />
                Roles & Permissions
              </h2>
              <div className="space-y-8">
                <div>
                  <label className="text-sm text-gray-500 block mb-4">Departments</label>
                  <div className="flex flex-wrap gap-3">
                    {userData.department?.map((dept, index) => (
                      <Badge key={index} text={dept} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-4">Role Types</label>
                  <div className="flex flex-wrap gap-3">
                    {userData.type?.map((type, index) => (
                      <Badge key={index} text={type} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard 
            icon={Activity} 
            label="Active Users" 
            value="1,234" 
            color="text-blue-600"
            bgColor="bg-white/80"
          />
          <StatCard 
            icon={Clock} 
            label="System Uptime" 
            value="99.9%" 
            color="text-green-600"
            bgColor="bg-white/80"
          />
          <StatCard 
            icon={Zap} 
            label="System Load" 
            value="0.75" 
            color="text-amber-600"
            bgColor="bg-white/80"
          />
          <StatCard 
            icon={Database} 
            label="Database Size" 
            value="2.3 GB" 
            color="text-purple-600"
            bgColor="bg-white/80"
          />
        </div>

        {/* Security & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Security Status</h2>
                <p className="text-sm text-gray-500 mt-1">System security overview</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-600">Two-Factor Authentication</span>
                <span className="text-green-600 font-medium px-3 py-1 bg-green-50 rounded-full">Enabled</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-600">Last Login</span>
                <span className="text-gray-900 font-medium">Today, 9:42 AM</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-600">Password Updated</span>
                <span className="text-gray-900 font-medium">2 weeks ago</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-gray-600">Security Level</span>
                <span className="text-green-600 font-medium px-3 py-1 bg-green-50 rounded-full">High</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">System Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Current system status</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-600">Total Pages</span>
                <span className="text-gray-900 font-medium">56</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-600">Last Backup</span>
                <span className="text-gray-900 font-medium">Today, 3:00 AM</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-600">Server Location</span>
                <span className="text-gray-900 font-medium">US East</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-gray-600">Next Maintenance</span>
                <span className="text-blue-600 font-medium px-3 py-1 bg-blue-50 rounded-full">In 5 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}