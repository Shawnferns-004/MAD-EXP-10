import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportForm from './components/ReactForm';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyEmail from './context/VerifyEmail';
import Settings from './pages/Settings';
import Chat from './pages/CommunityChat';
import AnalyticsDashboard from './components/PyChart';
import Chatbot from './components/Chatbot';
import { AlertTriangle } from 'lucide-react';
import MyReports from './components/MyReports';
import HelplinePage from './components/Helpline';
import AboutUs from './components/About';
import { ApiProvider } from './context/ApiContext';


const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};



function App() {
  return (
    <Router>
      
      <AuthProvider>
        <ApiProvider>
        <ToastContainer className="z-55"/>
        <Chatbot/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<ReportForm />} />
                    <Route path="/report" element={<ReportForm/>} />
                    
                    <Route path="/messages" element={<Chat/>} />
                    
                    <Route path="/analytics" element={<AnalyticsDashboard />} />
                                        
                    
                    <Route path="/settings" element={<Settings/>} />

                    <Route path="/my-reports" element={<MyReports/>} />

                    <Route path="/helpline" element={<HelplinePage/>} />

                    <Route path="/about-us" element={<AboutUs/>} />
                    
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
        </ApiProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;