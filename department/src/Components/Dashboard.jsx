import React, { useState } from 'react';
import {
  Bell,
  Shield,
  AlertTriangle,
  Users,
  BarChart3,
  Search,
  Filter,
  ChevronDown,
  MapPin,
  Clock,
  AlertCircle,
  Menu,
  X,
  Home,
  Settings,
  FileText,
  UserCircle,
  LogOut,
} from 'lucide-react';

// Mock data for demonstration
const emergencyReports = [
  {
    id: 1,
    type: 'Security Breach',
    location: 'Building A, Floor 3',
    timestamp: '2024-03-15 14:30',
    status: 'Critical',
    description: 'Unauthorized access detected in server room',
  },
  {
    id: 2,
    type: 'Safety Violation',
    location: 'Parking Lot B',
    timestamp: '2024-03-15 13:15',
    status: 'Resolved',
    description: 'Vehicle parked in emergency lane',
  },
  {
    id: 3,
    type: 'Emergency',
    location: 'Cafeteria',
    timestamp: '2024-03-15 12:45',
    status: 'Pending',
    description: 'Medical emergency - staff member',
  },
];


function App() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      
      

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Top Navigation */}
        

        {/* Main Content Area */}
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Emergencies</p>
                  <p className="text-2xl font-semibold">3</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 flex-shrink-0" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Reports</p>
                  <p className="text-2xl font-semibold">156</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-green-500 flex-shrink-0" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Resolution Rate</p>
                  <p className="text-2xl font-semibold">94%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
            <div className="space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Filter className="h-5 w-5 text-gray-600" />
                  <span>Filter</span>
                </button>
                <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white">
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Reports</h2>
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {emergencyReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900">{report.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                            <span className="text-sm text-gray-500">{report.location}</span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                            <span className="text-sm text-gray-500">{report.timestamp}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4">
                          <span className="text-sm text-gray-500">{report.description}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;