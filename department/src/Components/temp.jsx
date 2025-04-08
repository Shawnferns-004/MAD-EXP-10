import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Siren, User, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [unreadReports, setUnreadReports] = useState(0);
  const [messages, setMessages] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const profileRef = useRef(null);
  const bellRef = useRef(null);
  const navigate = useNavigate();
  const wsRef = useRef(null);

  // Request Notification Permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Fetch Admin Data
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user?.email) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/admin/${user.email}`);
        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchAdminData();
  }, [user]);

  // WebSocket Connection for Live Reports
  useEffect(() => {
    if (!adminData) return;

    wsRef.current = new WebSocket("ws://localhost:3000"); // Use ws:// for WebSocket

    wsRef.current.onopen = () => console.log("WebSocket connected");

    wsRef.current.onmessage = (event) => {
      // console.log("WebSocket Message Received:", event.data);
      try {
        const allReports = JSON.parse(event.data);
    
        const filteredReports = adminData?.department
          ? allReports.filter(report =>
              adminData.department.some(dept =>
                dept.toLowerCase().trim() === report.department.toLowerCase().trim()
              )
            )
          : allReports;
    
        // Sort by timestamp to get the latest report
        filteredReports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
        // Get only the latest report
        const latestReport = filteredReports.length > 0 ? [filteredReports[0]] : [];
    
        const pendingReports = latestReport.filter(report => report.status.toLowerCase() === 'pending').length;
        setUnreadReports(pendingReports);
        setMessages(latestReport);
    
        // Send a browser notification for the latest report
        if (Notification.permission === "granted" && latestReport.length > 0) {
          const report = latestReport[0];
          new Notification("Report Alert 🚨", {
            body: `📍 Location: ${report.locationName}\n🏢 Department: ${report.department}\n⚠️ Status: ${report.status}`,
            icon: "/vite.svg",
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.error("WebSocket data error:", error);
      }
    };
    

    wsRef.current.onerror = (error) => console.error("WebSocket error:", error);
    wsRef.current.onclose = () => console.log("WebSocket disconnected");

  }, [adminData]);

  // Handle Click Outside to Close Dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          {/* Left: Menu Button & Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onMenuClick}
              className="p-1.5 sm:p-2 rounded-full text-gray-400 lg:hidden hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
            >
              <Menu size={22} className="transform hover:rotate-180 transition-transform duration-500" />
            </button>
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Siren className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 transform group-hover:rotate-12 transition-all duration-500" />
                {unreadReports > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"
                  />
                )}
              </div>
              <span className="hidden md:inline-block text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 transition-all duration-500">
                A!ert-X
              </span>
            </Link>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {/* Bell Icon for Reports */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setIsBellOpen(!isBellOpen)}
                className="relative p-1.5 sm:p-2 rounded-full hover:bg-indigo-50 transition-colors duration-300"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                {unreadReports > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {isBellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2"
                  >
                    <h4 className="text-gray-700 text-sm font-semibold">Notifications</h4>
                    {messages.length === 0 ? (
                      <p className="text-gray-500 text-xs">No new reports.</p>
                    ) : (
                      messages.slice(0, 5).map((msg, index) => (
                        <div key={index} className="text-gray-600 text-xs border-b py-1">
                          {msg.department}: {msg.locationName}
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-indigo-200 transition-all duration-300"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
