import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      await login(email, password)
       navigate('/');
    }catch(e){
      console.log(e)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <ShieldAlert  className="mx-auto h-16 w-16 text-apple-blue-500" />
          <h2 className="mt-6 text-3xl font-semibold text-apple-gray-500">
            Welcome to AlertX
          </h2>
          <p className="mt-2 text-apple-gray-400">
            Sign in to access your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-apple-gray-400 mb-2">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-apple-gray-400 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 rounded-xl text-white bg-apple-blue-500 hover:bg-apple-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-apple-blue-500 shadow-lg shadow-apple-blue-500/20 active:scale-[0.99] transition-all duration-200"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}