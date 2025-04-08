import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { History, CheckCircle, Clock, AlertCircle, AlertTriangle as TriangleAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import socket from '../utils/socket';
import { toast } from 'react-toastify';
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
  const [reports, setReports] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { API_URL } = useApi();
  const { user } = useAuth();

  const showNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/logo192.png" });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body, icon: "/logo192.png" });
        }
      });
    }
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    fetchReports();
  
    socket.on("notification", (data) => {
      if (data && data.body) {
        toast.info(`New Report`);
        showNotification(data.title, data.body);
        fetchReports();
      } else {
        console.error("Invalid notification data received:", data);
      }
    });
  
    return () => {
      socket.off("notification");
    };
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports`);
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const updateStatus = async (reportId, newStatus) => {
    if (!reportId) {
      console.error("Error: reportId is undefined");
      return;
    }
    console.log("Updating Report ID:", reportId);
  
    setIsUpdating(true);
    try {
      await axios.put(`${API_URL}/report/${reportId}`, {
        status: newStatus
      });
      fetchReports();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getFilteredReports = () => {
    return reports
      .filter(report => report.status !== "Resolved")
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
            <TriangleAlert className="w-10 h-10 text-[#0A84FF]" />
            <h1 className="text-3xl font-semibold text-white">
              Incident Reports
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
                          <select
                            value={report.status}
                            onChange={(e) => updateStatus(report._id, e.target.value)}
                            disabled={isUpdating}
                            className={`form-select rounded-full border ${
                              statusColors[report.status]
                            } py-1 px-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A84FF] transition-colors duration-200`}
                          >
                            {['Pending', 'Ongoing', 'Resolved'].map((status) => (
                              <option key={status} value={status} className="bg-[#1c1c1e]">
                                {status}
                              </option>
                            ))}
                          </select>
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
                      No reports available
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