import { useState } from "react";
import axios from "axios";
import { useApi } from "../context/ApiContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  UserPlus2, 
  Building, 
  Mail, 
  User, 
  KeyRound,
  Siren,
  Flame,
  Droplets,
  Car,
  Mountain,
  Shield,
  Wine,
  X
} from "lucide-react";

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    department: [],
    type: [],
    password: ""
  });

  const { API_URL } = useApi();
  const departments = ["City Mantenance", "Emergency Service", "Fire Department", "Diaster Management", "Traffic Police", "Police"];
  const types = ["Fire", "Flood", "Accident", "Earthquake", "Theft", "Drink and Drive"];

  const getTypeIcon = (type) => {
    switch(type) {
      case "Fire": return <Flame size={18} className="text-[#ff2d55]" />;
      case "Flood": return <Droplets size={18} className="text-blue-500" />;
      case "Accident": return <Car size={18} className="text-yellow-500" />;
      case "Earthquake": return <Mountain size={18} className="text-orange-500" />;
      case "Theft": return <Shield size={18} className="text-purple-500" />;
      case "Drink and Drive": return <Wine size={18} className="text-red-500" />;
      default: return <Shield size={18} className="text-gray-500" />;
    }
  };

  const toggleSelection = (array, value) => {
    if (array.includes(value)) {
      return array.filter(item => item !== value);
    }
    return [...array, value];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const toastId = toast.loading('Adding admin...', {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    
    try {
      const response = await axios.post(`${API_URL}/admin/register`, formData);
      toast.update(toastId, {
        render: "Admin added successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        theme: "dark",
      });
      setFormData({
        email: "",
        name: "",
        department: [],
        type: [],
        password: ""
      });
    } catch (error) {
      toast.update(toastId, {
        render: error.response?.data?.message || "An error occurred",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        theme: "dark",
      });
      console.error("Error Adding Admin: ", error);
    }
  };

  return (
    <div className="h-screen bg-black p-4 overflow-hidden">
      <ToastContainer position="top-right" theme="dark" />
      
      <div className="h-full max-w-6xl mx-auto">
        <div className="h-full bg-[#1c1c1e] rounded-2xl shadow-lg border border-[#2c2c2e] flex flex-col">
          <div className="p-6">
            <div className="flex items-center justify-center gap-3">
              <UserPlus2 size={28} className="text-white" />
              <h2 className="text-2xl font-semibold text-white">
                Add Administrator
              </h2>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 gap-4">
            <div className="grid grid-cols-3 gap-4 h-full">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#86868b] mb-1.5">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#86868b] transition-colors group-focus-within:text-white" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#2c2c2e] border border-[#3c3c3e] 
                               text-white placeholder-[#86868b]
                               focus:bg-[#3c3c3e] focus:border-[#86868b] 
                               transition-all duration-200 outline-none text-sm"
                      placeholder="admin@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#86868b] mb-1.5">Name</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#86868b] transition-colors group-focus-within:text-white" size={18} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#2c2c2e] border border-[#3c3c3e] 
                               text-white placeholder-[#86868b]
                               focus:bg-[#3c3c3e] focus:border-[#86868b] 
                               transition-all duration-200 outline-none text-sm"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#86868b] mb-1.5">Password</label>
                  <div className="relative group">
                    <KeyRound className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#86868b] transition-colors group-focus-within:text-white" size={18} />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#2c2c2e] border border-[#3c3c3e] 
                               text-white placeholder-[#86868b]
                               focus:bg-[#3c3c3e] focus:border-[#86868b] 
                               transition-all duration-200 outline-none text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Middle Column - Departments */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#86868b] mb-2">Selected Departments</label>
                  <div className="flex flex-wrap gap-2 min-h-[60px]">
                    {formData.department.map((dept) => (
                      <span 
                        key={dept}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#2c2c2e] text-sm text-white"
                      >
                        <Building size={16} className="text-[#86868b]" />
                        {dept}
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            department: prev.department.filter(d => d !== dept)
                          }))}
                          className="ml-1 text-[#86868b] hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#86868b] mb-2">Departments</label>
                  <div className="grid grid-cols-1 gap-2">
                    {departments.map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          department: toggleSelection(prev.department, dept)
                        }))}
                        className={`
                          px-3 py-2 rounded-xl text-sm font-medium
                          flex items-center gap-2
                          transition-all duration-200
                          ${formData.department.includes(dept)
                            ? 'bg-[#3c3c3e] text-white'
                            : 'bg-[#2c2c2e] text-[#86868b] hover:bg-[#3c3c3e] hover:text-white'}
                        `}
                      >
                        <Building size={16} />
                        <span className="truncate">{dept}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Types */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#86868b] mb-2">Selected Types</label>
                  <div className="flex flex-wrap gap-2 min-h-[60px]">
                    {formData.type.map((type) => (
                      <span 
                        key={type}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#2c2c2e] text-sm text-white"
                      >
                        {getTypeIcon(type)}
                        {type}
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            type: prev.type.filter(t => t !== type)
                          }))}
                          className="ml-1 text-[#86868b] hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#86868b] mb-2">Admin Types</label>
                  <div className="grid grid-cols-1 gap-2">
                    {types.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          type: toggleSelection(prev.type, type)
                        }))}
                        className={`
                          px-3 py-2 rounded-xl text-sm font-medium
                          flex items-center gap-2
                          transition-all duration-200
                          ${formData.type.includes(type)
                            ? 'bg-[#3c3c3e] text-white'
                            : 'bg-[#2c2c2e] text-[#86868b] hover:bg-[#3c3c3e] hover:text-white'}
                        `}
                      >
                        {getTypeIcon(type)}
                        <span className="truncate">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="
                w-full bg-[#ff2d55] text-white
                py-3 px-6 rounded-xl font-medium
                transition-all duration-200
                hover:bg-[#ff375f]
                active:scale-[0.98]
                flex items-center justify-center gap-2
                mt-auto
              "
            >
              <Siren size={18} />
              <span>Add Administrator</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;