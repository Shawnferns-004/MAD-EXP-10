import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Settings, Columns as ChartColumn, ClipboardList, Columns as ChartNoAxesColumn, PhoneCall, Scroll, Megaphone, ChevronLeft, ChevronRight, MessagesSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const sidebarLinks = [
  { icon: Megaphone, label: 'Incident Reporting', path: '/report' },
  { icon: ClipboardList, label: 'My Cases', path: '/my-reports' },
  { icon: ChartNoAxesColumn, label: 'Analytics & Insights', path: '/analytics' },
  { icon: PhoneCall, label: 'Emergency Helpline', path: '/helpline' },
  { icon: MessagesSquare, label: 'Community Forum', path: '/messages' },
  { icon: Scroll, label: 'About us', path: '/about-us' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F6EDFF]">
      <Navbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="fixed top-0 left-0 right-0 h-16 z-50" />
      <div className="flex h-[calc(100vh-4rem)] mt-16">
        <motion.aside
          initial={false}
          animate={{
            width: isSidebarOpen ? '16rem' : '5rem',
          }}
          className={`fixed top-[64px] bottom-0 left-0 z-40 bg-white/80 backdrop-blur-lg shadow-lg transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="sticky top-0 flex items-center justify-end p-4 bg-transparent">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#E8DEF8] transition-colors"
            >
              {isSidebarOpen ? 
                <ChevronLeft className="w-5 h-5 text-[#6750A4]" /> : 
                <ChevronRight className="w-5 h-5 text-[#6750A4]" />
              }
            </button>
          </div>
          <nav className="px-4 space-y-2 overflow-y-auto h-[calc(100%-4rem)]">
            {sidebarLinks.map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-3 rounded-2xl transition-all duration-200
                  ${location.pathname === path 
                    ? 'bg-[#E8DEF8] text-[#6750A4] font-semibold' 
                    : 'text-gray-700 hover:bg-[#F6EDFF] hover:text-[#6750A4]'}
                  ${isSidebarOpen ? '' : 'justify-center'}`}
              >
                <Icon className={`w-5 h-5 ${location.pathname === path ? 'text-[#6750A4]' : ''} ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </Link>
            ))}
          </nav>
        </motion.aside>
        <main 
          className={`flex-1 h-full overflow-auto transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
          } bg-gradient-to-br from-[#E8DEF8] via-[#F6EDFF] to-[#EAE0FC] p-6`}
        >
          <div className="relative">
            {/* Decorative circles */}
            <div className="fixed top-20 left-[20%] w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="fixed top-40 right-[20%] w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="fixed bottom-20 left-[40%] w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            
            {/* Content container */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </main>
      </div>
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </div>
  );
};

export default Layout;