import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch(e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1c1e] px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#0A84FF]/10 mb-4">
            <UserCog className="h-8 w-8 text-[#0A84FF]" aria-hidden="true" />
          </div>
          <h2 className="mt-2 text-3xl font-semibold text-white tracking-tight">
            Welcome back Admin
          </h2>
          <p className="mt-2 text-sm text-[#98989d]">
            Log in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-[#98989d]">
                Email address
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#98989d]" aria-hidden="true" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-[#2c2c2e] border border-[#2c2c2e] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#98989d]">
                Password
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#98989d]" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-[#2c2c2e] border border-[#2c2c2e] rounded-lg text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 rounded-lg text-white bg-[#0A84FF] hover:bg-[#0A70D9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A84FF] transition-all duration-200 font-medium text-sm"
            >
              Sign in
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}