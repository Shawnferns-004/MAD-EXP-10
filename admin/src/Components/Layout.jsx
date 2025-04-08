import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Users, Settings, BarChart2, Calendar, FolderOpen, MessageSquare, FileText, ChevronLeft, ChevronRight, Fingerprint, Clock as ClockFading, UserPlus } from 'lucide-react';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const sidebarLinks = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: UserPlus, label: 'Add Admin', path: '/add-admin' }, 
  { icon: Users, label: 'All Admins', path: '/admin-list' }, 
  { icon: FolderOpen, label: 'Reports', path: '/reports' },
  { icon: ClockFading, label: 'History', path: '/history' },
];

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <Navbar 
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#1c1c1e] border-b border-[#2c2c2e]" 
      />
      <div className="flex h-[calc(100vh-4rem)] mt-16">
        <aside
          className={`fixed top-[50px] bottom-0 left-0 z-40 bg-[#1c1c1e] border-r border-[#2c2c2e] transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'w-72' : 'w-20'} 
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="sticky top-0 flex items-center justify-end p-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#2c2c2e] transition-colors duration-200"
            >
              {isSidebarOpen ? 
                <ChevronLeft className="w-5 h-5 text-[#86868b]" /> : 
                <ChevronRight className="w-5 h-5 text-[#86868b]" />
              }
            </button>
          </div>
          <nav className="px-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
            {sidebarLinks.map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200
                  ${location.pathname === path 
                    ? 'bg-[#2c2c2e] text-white font-medium' 
                    : 'text-[#86868b] hover:bg-[#2c2c2e] hover:text-white'}
                  ${isSidebarOpen ? '' : 'justify-center'}`}
              >
                <Icon 
                  className={`w-5 h-5 ${location.pathname === path ? 'text-white' : ''} 
                  ${isSidebarOpen ? 'mr-3' : 'mx-auto'} transition-colors duration-200`} 
                />
                {isSidebarOpen && (
                  <span className="text-sm font-medium whitespace-nowrap tracking-wide">
                    {label}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>
        <main 
          className={`flex-1 h-full overflow-auto transition-all duration-300 bg-[#000000] text-white
            ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'} p-6`}
        >
          {children}
        </main>
      </div>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-30 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </div>
  );
};

export default Layout;  