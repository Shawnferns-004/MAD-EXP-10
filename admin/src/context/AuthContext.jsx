import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios"
import { useApi } from './ApiContext';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);''
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const {API_URL} = useApi()

  useEffect(() => {
    let isMounted = true;
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("admin");

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          if (isMounted) setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("admin");
      }
      if (isMounted) setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async(email, password) => {
    try {
        const response = await axios.post(`${API_URL}/admin/admin-login`, {
          email,
          password,
        });
  
        if (response.data.admin && response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("admin", JSON.stringify(response.data.admin));
          setUser(response.data.admin);
        } else {
          throw new Error("Invalid response: missing user or token");
        }
      } catch (error) {
        console.error("Login Error:", error);
        throw error;
      }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);