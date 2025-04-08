import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, AlertTriangle, MapPin, BarChart3, Building2, Calendar, ChevronRight } from 'lucide-react';
import { motion } from "framer-motion";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserId(parsedUser.id);
      console.log("User ID:", parsedUser.id);
    } else {
      console.error("User not found in local storage");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
  
    const fetchReports = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/report/${userId}`);
        console.log("Fetched Reports:", response.data);
  
        const fetchedReports = response.data.fetchReport || [];
        const sortedReports = fetchedReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        setReports(sortedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
  
    fetchReports();
  }, [userId]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-[#6750A4]">
            My Reports
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Track and manage your submitted reports with our intuitive dashboard
          </p>
        </div>
        
        {reports.length === 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 text-center shadow-lg border border-[#E8DEF8]"
          >
            <div className="max-w-md mx-auto">
              <AlertTriangle className="w-10 h-10 text-[#6750A4] mx-auto mb-3" />
              <p className="text-gray-700 text-lg font-semibold mb-2">No reports found</p>
              <p className="text-gray-500 text-sm">Your submitted reports will appear here with detailed insights and status updates</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reports.map((report, index) => (
              <motion.div 
                key={report._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#E8DEF8]"
              >
                {report.imageUrl && (
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={report.imageUrl} 
                      alt="Report" 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <h3 className="font-semibold text-base text-white mb-1">{report.type}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        report.status === "Pending" ? "bg-[#FEF0C7] text-[#B54708]" :
                        report.status === "Ongoing" ? "bg-[#E8DEF8] text-[#6750A4]" :
                        report.status === "Resolved" ? "bg-[#D1FADF] text-[#027A48]" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-3">
                  {!report.imageUrl && (
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-base text-[#6750A4]">{report.type}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        report.status === "Pending" ? "bg-[#FEF0C7] text-[#B54708]" :
                        report.status === "Ongoing" ? "bg-[#E8DEF8] text-[#6750A4]" :
                        report.status === "Resolved" ? "bg-[#D1FADF] text-[#027A48]" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#F6EDFF] rounded-xl p-2">
                        <div className="flex items-center text-gray-700">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-[#6750A4]" />
                          <span>
                            <span className="block text-gray-500 text-xs">Severity</span>
                            <span className="font-semibold text-xs">{report.severity || "Not specified"}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-[#F6EDFF] rounded-xl p-2">
                        <div className="flex items-center text-gray-700">
                          <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-[#6750A4]" />
                          <span>
                            <span className="block text-gray-500 text-xs">Priority</span>
                            <span className="font-semibold text-xs">{report.priority || "Not specified"}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 bg-[#F6EDFF] rounded-xl p-2">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#6750A4]" />
                        <span>
                          <span className="text-gray-500 text-xs block">Location</span>
                          <span className="font-semibold text-xs">{report.locationName || "Not provided"}</span>
                        </span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <Building2 className="w-3.5 h-3.5 mr-1.5 text-[#6750A4]" />
                        <span>
                          <span className="text-gray-500 text-xs block">Department</span>
                          <span className="font-semibold text-xs">{report.department || "Not specified"}</span>
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#F6EDFF] rounded-xl p-2">
                      <p className="text-gray-700 text-xs line-clamp-2">
                        {report.description || "No description available"}
                      </p>
                    </div>

                    <div className="border-t border-[#E8DEF8] pt-2 flex justify-between items-center text-[10px] text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-[#6750A4]" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-[#6750A4]" />
                        {new Date(report.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;