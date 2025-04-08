import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnalyticsDashboard from './Components/Recharts';
import HistoryPage from './pages/HistoryPage';
import Reports from './pages/Reports';
import {  ApiProvider } from './context/ApiContext';
import AddAdmin from './Components/AddAdmin';
import AdminPage from './Components/AdminList';

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
      <AuthProvider>
        <ApiProvider>
        <ToastContainer/>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<AnalyticsDashboard />} />
                    <Route path="/dashboard" element={<AnalyticsDashboard />} />
                    
                    <Route path="/reports" element={<Reports/>} />
                    
                    <Route path="/history" element={<HistoryPage />} />
                    
                    <Route path="/add-admin" element={<AddAdmin/>} />
                    <Route path="/admin-list" element={<AdminPage/>} />
                    
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
        </ApiProvider>
      </AuthProvider>
  );
}

export default App;