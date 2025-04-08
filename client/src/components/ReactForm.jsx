import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AlertTriangle, Camera, Upload, X, MapPin, FileText, Send, RefreshCw } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const defaultLocation = { lat: 37.7749, lng: -122.4194 };

const ReportForm = () => {
  const {user} = useAuth();
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [stream, setStream] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const locationUpdateTimeoutRef = useRef(null);
  const [userId, setUserId] = useState("");
  const {API_URL} = useApi();

  const userData = localStorage.getItem("user");

  useEffect(() => {
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user.id;
      setUserId(userId);
      console.log("User ID:", userId);
    } else {
      console.error("User not found in local storage");
    }
  }, []);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if(videoLoaded){
      startCamera();
    }
  }, [videoLoaded]);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  }

  const [report, setReport] = useState({
    description: "",
    location: defaultLocation,
    locationName: "",
    image: null,
    userId: userId,
  });

  useEffect(() => {
    if (user) {
      setReport(prev => ({ ...prev, userId: userId }));
    }
  }, [user]);

  const updateLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      
      const locationName = response.data.display_name;

      setReport(prev => ({
        ...prev,
        location: { lat: latitude, lng: longitude },
        locationName: locationName
      }));
    } catch (error) {
      setReport(prev => ({
        ...prev,
        location: { lat: latitude, lng: longitude },
        locationName: `Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
      }));
    }
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      await updateLocationName(latitude, longitude);
    } catch (error) {
      toast.error("Could not get your location. Please check your permissions.");
      console.error("Error getting location:", error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        if (locationUpdateTimeoutRef.current) {
          clearTimeout(locationUpdateTimeoutRef.current);
        }

        setReport(prev => ({
          ...prev,
          location: { lat: latitude, lng: longitude }
        }));

        locationUpdateTimeoutRef.current = setTimeout(() => {
          updateLocationName(latitude, longitude);
        }, 2000);
      },
      (error) => {
        console.error("Error watching location:", error);
        toast.error("Location tracking error. Please check your permissions.");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      if (locationUpdateTimeoutRef.current) {
        clearTimeout(locationUpdateTimeoutRef.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!report.image) {
      toast.error("Please upload or capture an image before submitting");
      return;
    }

    try {
      const data = new FormData();
      data.append("description", report.description);
      data.append("location", JSON.stringify(report.location));
      data.append("locationName", report.locationName);
      data.append("userId", userId);

      if (report.image) {
        data.append("image", report.image);
      }

      await axios.post(`${API_URL}/report`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReport({
        description: "",
        location: defaultLocation,
        locationName: "",
        image: null,
        userId: ""
      });
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Report submitted successfully!");
      
      getCurrentLocation();
    } catch (error) {
      toast.error("Error submitting report");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReport(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setStream(mediaStream);
      setShowCamera(true);
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Could not access camera. Please check your permissions.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !stream) {
      toast.error("Camera not initialized.");
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "captured-photo.jpg", { 
          type: "image/jpeg",
          lastModified: Date.now()
        });
        
        setReport(prev => ({ ...prev, image: file }));
        setPreview(URL.createObjectURL(blob));
        stopCamera();
      } else {
        toast.error("Failed to capture image.");
      }
    }, "image/jpeg", 0.95);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setShowCamera(false);
  };

  const removeImage = () => {
    setReport(prev => ({ ...prev, image: null }));
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if(showCamera){
      setTimeout(startCamera, 100);
    }
  }, [showCamera]);

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-[1200px] mx-auto py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center justify-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <AlertTriangle className="w-16 h-16 text-[#6750A4]" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#6750A4]">Emergency Report</h1>
          </div>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl text-center">
            Submit an emergency report with location and visual evidence
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Left Column - Visual Evidence */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg border border-[#E8DEF8]">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#6750A4] mb-6 sm:mb-8">Visual Evidence</h2>
              
              {showCamera ? (
                <div className="relative rounded-2xl overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                    onLoadedMetadata={handleVideoLoaded}
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                    <button
                      onClick={capturePhoto}
                      className="bg-[#6750A4] text-white px-6 sm:px-8 py-3 rounded-full text-lg sm:text-xl font-medium hover:bg-[#7B61B9] transition-colors shadow-lg"
                    >
                      Capture
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-500 text-white px-6 sm:px-8 py-3 rounded-full text-lg sm:text-xl font-medium hover:bg-gray-600 transition-colors shadow-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : preview ? (
                <div className="relative rounded-2xl overflow-hidden bg-black">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-4 right-4 bg-red-500/80 p-3 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <label className="flex flex-col items-center justify-center h-40 sm:h-48 md:h-56 rounded-2xl bg-[#F6EDFF] p-6 sm:p-8 hover:bg-[#E8DEF8] transition-colors cursor-pointer border border-[#E8DEF8] shadow-sm hover:shadow-md">
                    <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-[#6750A4] mb-4" />
                    <span className="text-lg sm:text-xl text-gray-600 text-center">Upload Photo</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                  <button
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center h-40 sm:h-48 md:h-56 rounded-2xl bg-[#F6EDFF] p-6 sm:p-8 hover:bg-[#E8DEF8] transition-colors border border-[#E8DEF8] shadow-sm hover:shadow-md"
                  >
                    <Camera className="h-10 w-10 sm:h-12 sm:w-12 text-[#6750A4] mb-4" />
                    <span className="text-lg sm:text-xl text-gray-600 text-center">Use Camera</span>
                  </button>
                </div>
              )}
            </div>

            {/* Location Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg border border-[#E8DEF8]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <MapPin className="h-8 w-8 text-[#6750A4]" />
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#6750A4]">Location</h2>
                </div>
                <button
                  onClick={getCurrentLocation}
                  className="flex items-center justify-center gap-2 text-[#6750A4] hover:text-[#7B61B9] transition-colors bg-[#F6EDFF] px-6 py-3 rounded-full text-lg sm:text-xl border border-[#E8DEF8] hover:bg-[#E8DEF8] shadow-sm hover:shadow-md"
                >
                  <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Update</span>
                </button>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 break-words">
                {isLoadingLocation ? (
                  <span className="animate-pulse">Detecting your location...</span>
                ) : (
                  report.locationName || "Location not available"
                )}
              </p>
            </div>
          </motion.div>

          {/* Right Column - Emergency Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg border border-[#E8DEF8]">
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <FileText className="h-8 w-8 text-[#6750A4]" />
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#6750A4]">Emergency Details</h2>
              </div>
              <textarea
                value={report.description}
                onChange={(e) => setReport({ ...prev, description: e.target.value })}
                placeholder="Describe the emergency situation in detail..."
                className="w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-2xl border border-[#E8DEF8] bg-[#F6EDFF] p-6 text-lg sm:text-xl text-gray-800 placeholder-gray-400 focus:border-[#6750A4] focus:ring focus:ring-[#E8DEF8] transition-colors resize-none shadow-sm"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full bg-[#6750A4] text-white py-5 sm:py-6 rounded-2xl text-lg sm:text-xl font-medium hover:bg-[#7B61B9] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              <Send className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Submit Report</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;