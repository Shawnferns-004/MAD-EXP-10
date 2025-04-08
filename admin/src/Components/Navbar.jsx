import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Siren, Bell, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useApi } from "../context/ApiContext";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [unreadReports, setUnreadReports] = useState(0);
  const [newPendingReports, setNewPendingReports] = useState(0);
  const profileRef = useRef(null);
  const bellRef = useRef(null);
  const { API_URL } = useApi();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${API_URL}/reports`);
        const allReports = response.data;
  
        const pendingReports = allReports.filter(
          (report) => report.status.toLowerCase() === "pending"
        ).length;
  
        if (pendingReports > unreadReports) {
          setNewPendingReports(pendingReports - unreadReports);
        } else {
          setNewPendingReports(0);
        }
  
        setUnreadReports(pendingReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
  
    fetchReports();
  }, [API_URL, unreadReports]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsBellOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#1c1c1e] border-b border-[#2c2c2e] z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-12 items-center">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onMenuClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full text-[#86868b] lg:hidden hover:text-white hover:bg-[#2c2c2e] transition-all duration-300"
            >
              <Menu
                size={20}
                className="transform transition-transform duration-300"
              />
            </motion.button>
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                className="relative"
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 0,
                }}
              >
                <Siren className="w-6 h-6 text-white transform group-hover:scale-110 transition-all duration-300" />
                {unreadReports > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [0, 1.2, 1],
                      backgroundColor: ["#ff2d55", "#ff375f", "#ff2d55"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 4,
                    }}
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                  />
                )}
              </motion.div>
              <motion.span
                className="hidden md:inline-block text-base font-semibold text-white"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                A!ert-X
              </motion.span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative" ref={bellRef}>
              <motion.button
                onClick={() => setIsBellOpen(!isBellOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-full hover:bg-[#2c2c2e] transition-all duration-300"
              >
                <motion.div
                  animate={
                    unreadReports > 0
                      ? {
                          rotate: [0, 15, -15, 15, -15, 0],
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                          },
                        }
                      : {}
                  }
                >
                  <Bell className="w-5 h-5 text-[#86868b] hover:text-white transition-colors duration-300" />
                </motion.div>
                {unreadReports > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [0, 1.2, 1],
                      backgroundColor: ["#ff2d55", "#ff375f", "#ff2d55"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  />
                )}
              </motion.button>

              <AnimatePresence>
                {isBellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 mt-2 bg-[#1c1c1e] rounded-2xl shadow-lg border border-[#2c2c2e]"
                    style={{
                      width: window.innerWidth < 640 ? "auto" : "320px",
                      right: window.innerWidth < 640 ? "-8px" : "0",
                    }}
                  >
                    {window.innerWidth < 640 ? (
                      // Mobile view
                      <Link
                        to="/reports"
                        className="block px-4 py-3 text-sm whitespace-nowrap"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">
                            {unreadReports > 0
                              ? `${unreadReports} pending reports`
                              : "No pending reports"}
                          </span>
                          {unreadReports > 0 && (
                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [1, 0.8, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                              }}
                              className="w-2 h-2 rounded-full bg-[#ff2d55]"
                            />
                          )}
                        </div>
                      </Link>
                    ) : (
                      // Desktop view
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold text-white">
                            Notifications
                          </h3>
                          {unreadReports > 0 && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#ff2d55] text-white"
                            >
                              {unreadReports} new
                            </motion.span>
                          )}
                        </div>

                        {unreadReports > 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-2"
                          >
                            <Link
                              to="/reports"
                              className="block p-3 rounded-xl bg-[#2c2c2e] hover:bg-[#3c3c3e] transition-colors duration-300"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white truncate">
                                    Pending Reports
                                  </p>
                                  <p className="text-xs text-[#86868b] mt-0.5 truncate">
                                    {unreadReports} reports need your attention
                                  </p>
                                </div>
                                <motion.div
                                  animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [1, 0.8, 1],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                  }}
                                  className="w-2 h-2 rounded-full bg-[#ff2d55] ml-3 flex-shrink-0"
                                />
                              </div>
                            </Link>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-6 text-center"
                          >
                            <p className="text-sm text-[#86868b]">
                              No new notifications
                            </p>
                            <p className="text-xs text-[#86868b] mt-1">
                              All caught up!
                            </p>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {newPendingReports > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 right-16 bg-[#ff2d55] text-white text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {newPendingReports} new
              </motion.div>
            )}

            <div className="relative" ref={profileRef}>
              <motion.button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-8 h-8 flex items-center justify-center rounded-full bg-[#2c2c2e] text-white text-sm font-medium transition-all duration-300"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 mt-2 w-56 bg-[#1c1c1e] rounded-2xl shadow-lg border border-[#2c2c2e] overflow-hidden"
                  >
                    <motion.button
                      onClick={logout}
                      whileHover={{
                        backgroundColor: "rgba(255, 45, 85, 0.1)",
                      }}
                      className="w-full text-left flex items-center px-4 py-3 text-sm text-[#ff2d55] transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;