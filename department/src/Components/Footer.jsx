import React from 'react';
import { Shield, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 mr-2" />
              <span className="text-xl font-bold">SafetyReport.gov</span>
            </div>
            <p className="text-gray-400">
              Official government portal for emergency and violation reporting.
              Working together for a safer community.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-gray-400">Emergency: 911</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-gray-400">Non-Emergency: 311</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-gray-400">support@safetyreport.gov</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-gray-400">City Hall, Government Ave.</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
            <p className="text-gray-400 mb-2">Emergency Services: 24/7</p>
            <p className="text-gray-400 mb-2">Administrative Office:</p>
            <p className="text-gray-400">Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p className="text-gray-400">Saturday - Sunday: Closed</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} SafetyReport.gov | All rights reserved
          </p>
          <p className="text-gray-500 text-sm mt-2">
            An official website of the United States government
          </p>
        </div>
      </div>
    </footer>
  );
}