import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, Users, Settings, BarChart2, Calendar, FolderOpen,
  MessageSquare, FileText, ChevronLeft, ChevronRight,Fingerprint,ClockFading
} from 'lucide-react';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
{/* <ClockFading /> */}

const sidebarLinks = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: FolderOpen, label: 'Reports', path: '/reports' },
  { icon: ClockFading, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const {user} = useAuth()


  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      <Navbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="fixed top-0 left-0 right-0 h-16 z-50" />
      <div className="flex h-[calc(100vh-4rem)] mt-16">
        <aside
          className={`fixed top-[50px] bottom-0 left-0 z-40 bg-white shadow-lg transition-all duration-300 
            ${isSidebarOpen ? 'w-64' : 'w-20'} 
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="sticky top-0 flex items-center justify-end p-4 bg-white">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
            >
              {isSidebarOpen ? <ChevronLeft className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
            </button>
          </div>
          <nav className="px-4 space-y-2 overflow-y-auto h-[calc(100%-4rem)]">
            {sidebarLinks.map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200
                  ${location.pathname === path 
                    ? 'bg-indigo-100 text-indigo-600 font-semibold' 
                    : 'text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50 hover:text-indigo-600'}
                  ${isSidebarOpen ? '' : 'justify-center'}`}
              >
                <Icon className={`w-5 h-5 ${location.pathname === path ? 'text-indigo-600' : ''} ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {isSidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
              </Link>
            ))}
          </nav>
        </aside>
        <main className={`flex-1 h-full overflow-auto transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          {children}
        </main>
        {/* cann ot be canges */}
      </div>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
    </div>
  );
};

export default Layout;
