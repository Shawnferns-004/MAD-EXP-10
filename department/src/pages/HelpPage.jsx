
import React from 'react';
import { HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <HelpCircle className="w-8 h-8 text-blue-500 mr-3" />
          <h1 className="text-2xl font-bold">Help & Support</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Phone className="w-6 h-6 text-blue-500 mr-2" />
              Emergency Contacts
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="font-medium mr-2">Emergency:</span>
                <span className="text-red-600">911</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Non-Emergency:</span>
                <span>311</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Helpline:</span>
                <span>1-800-HELP-NOW</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Mail className="w-6 h-6 text-blue-500 mr-2" />
              Email Support
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="font-medium mr-2">General:</span>
                <span>support@safetyreport.gov</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Technical:</span>
                <span>tech@safetyreport.gov</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MessageCircle className="w-6 h-6 text-blue-500 mr-2" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "How do I report an emergency?",
                answer: "Click on 'Emergency Reports' in the sidebar and fill out the emergency reporting form. For immediate assistance, always call 911."
              },
              {
                question: "What types of violations can I report?",
                answer: "You can report public safety, environmental, building code, health code, and other violations through our violation reporting system."
              },
              {
                question: "How can I track my report?",
                answer: "Visit the 'Report History' section to view the status and details of all your submitted reports."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}