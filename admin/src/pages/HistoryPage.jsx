import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { History, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';

const statusIcons = {
  'Pending': <Clock className="w-4 h-4 text-[#FF9F0A]" />,
  'Ongoing': <AlertCircle className="w-4 h-4 text-[#0A84FF]" />,
  'Resolved': <CheckCircle className="w-4 h-4 text-[#30D158]" />
};

const statusColors = {
  'Pending': 'bg-[#FF9F0A]/10 text-[#FF9F0A] border-[#FF9F0A]/20',
  'Ongoing': 'bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/20',
  'Resolved': 'bg-[#30D158]/10 text-[#30D158] border-[#30D158]/20'
};



export default function HistoryPage() {
  const { API_URL } = useApi();
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports`);
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const getFilteredReports = () => {
    return reports
      .filter(report => report.status === "Resolved")
      .filter(report =>
        report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(report.createdAt).toLocaleDateString().includes(searchTerm)
      );
  };

  const filteredReports = getFilteredReports().sort((a, b) => {
    const severityOrder = { 'Critical': 1, 'High': 2, 'Medium': 3, 'Low': 4 };
    return (severityOrder[a.severity] || 5) - (severityOrder[b.severity] || 5);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#1c1c1e]/80 backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden border border-[#2c2c2e]">
        <div className="p-8">
          <div className="flex items-center space-x-4">
            <History className="w-10 h-10 text-[#0A84FF]" />
            <h1 className="text-3xl font-semibold text-white">
              Incident Reports History
            </h1>
          </div>
          <div className="mt-6 relative">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 bg-[#2c2c2e] border-0 rounded-2xl focus:ring-2 focus:ring-[#0A84FF] focus:outline-none placeholder-[#98989d] text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-[#2c2c2e]">
              <thead>
                <tr className="bg-[#2c2c2e]/50">
                  <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-[#98989d] uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-[#98989d] uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-[#98989d] uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-[#98989d] uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-[#98989d] uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-[#98989d] uppercase tracking-wider">
                    Severity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2c2c2e]">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr key={report._id} className="hover:bg-[#2c2c2e]/30 transition-colors duration-200">
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          report.type === 'Fire' ? 'bg-[#FF453A]/10 text-[#FF453A]' : 'bg-[#0A84FF]/10 text-[#0A84FF]'
                        }`}>
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[report.status]
                          }`}>
                            {report.status}
                          </span>
                          <span className="ml-2">
                            {statusIcons[report.status]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-[#98989d]">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-[#98989d]">
                        {report.locationName}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-[#98989d]">
                        {report.priority}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-[#98989d]">
                        {report.severity}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-base text-[#98989d]">
                      No resolved reports available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}