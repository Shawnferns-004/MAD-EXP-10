import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, AlertCircle, Shield, Heart, Users, Clock, ChevronRight } from "lucide-react";

const helplines = [
  {
    category: "Law Enforcement & Crime",
    icon: <Shield className="w-8 h-8" />,
    bgImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80",
    contacts: [
      { name: "Police", phone: "100", email: "contact@police.gov.in" },
      { name: "Cyber Crime Helpline", phone: "1930", email: "cybercrime@nic.in" },
      { name: "Anti-Narcotics Helpline", phone: "1800-11-0030", email: "narcoticsindia@cbn.nic.in" },
      { name: "Crime Against Women (NCW)", phone: "1091", email: "complaintcell-ncw@nic.in" },
      { name: "Child Helpline", phone: "1098", email: "dial1098@childlineindia.org.in" },
    ],
  },
  {
    category: "Medical & Health",
    icon: <Heart className="w-8 h-8" />,
    bgImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80",
    contacts: [
      { name: "Ambulance", phone: "102 / 108", email: "ambulancehelpline@nic.in" },
      { name: "Blood Bank", phone: "104", email: "bloodbank@nic.in" },
      { name: "Mental Health Helpline", phone: "1800-599-0019", email: "mentalhealth@nic.in" },
      { name: "Suicide Prevention", phone: "1860-266-2345", email: "info@vandrevalafoundation.com" },
    ],
  },
  {
    category: "Animal Welfare",
    icon: <Users className="w-8 h-8" />,
    bgImage: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80",
    contacts: [
      { name: "Animal Helpline (PETA India)", phone: "+91 9820122602", email: "info@petaindia.org" },
      { name: "Wildlife Crime Control Bureau", phone: "1800-11-9334", email: "wccb-wl@nic.in" },
      { name: "Blue Cross of India", phone: "+91 44 22354959", email: "info@bluecrossofindia.org" },
    ],
  },
  {
    category: "Disaster & Emergency",
    icon: <AlertCircle className="w-8 h-8" />,
    bgImage: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80",
    contacts: [
      { name: "Fire Brigade", phone: "101", email: "firehelpline@nic.in" },
      { name: "Disaster Management", phone: "1078", email: "disastermanagement@nic.in" },
      { name: "Earthquake / Flood Relief", phone: "1070", email: "ndma@nic.in" },
    ],
  },
];

const HelplinePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Emergency Button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.a
          href="tel:112"
          className="flex items-center gap-2 bg-[#ff2d55] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#ff1a45] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Phone className="w-5 h-5" />
          <span className="font-medium">Emergency: 112</span>
        </motion.a>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Status Bar */}
        <motion.div 
          className="bg-white/70 backdrop-blur-xl border border-black/5 rounded-2xl px-6 py-4 mb-12 shadow-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#06c]" />
              <span className="text-[#1d1d1f] font-medium">All emergency services are operational</span>
            </div>
            <span className="text-[#86868b]">24/7 Support</span>
          </div>
        </motion.div>

        {/* Main Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {helplines.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-black/5 shadow-sm">
                <div 
                  className="h-48 relative overflow-hidden"
                  style={{
                    backgroundImage: `url('${section.bgImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl">
                        <div className="text-white">{section.icon}</div>
                      </div>
                      <h2 className="text-2xl font-semibold text-white">{section.category}</h2>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {section.contacts.map((contact, idx) => (
                    <motion.div
                      key={idx}
                      className="p-4 hover:bg-gray-50/50 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="font-medium text-[#1d1d1f]">{contact.name}</div>
                          <div className="flex items-center gap-6 text-sm">
                            <a
                              href={`tel:${contact.phone}`}
                              className="flex items-center gap-2 text-[#06c] hover:text-[#007aff] transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                              <span>{contact.phone}</span>
                            </a>
                            <a
                              href={`mailto:${contact.email}`}
                              className="flex items-center gap-2 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                            >
                              <Mail className="w-4 h-4" />
                              <span>{contact.email}</span>
                            </a>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#86868b]" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HelplinePage;