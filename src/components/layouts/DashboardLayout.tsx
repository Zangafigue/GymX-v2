import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout = () => {
  const { user, role } = useAuth();
  
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gym-black text-white">
      {/* Sidebar - Fixed on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow min-h-screen flex flex-col w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white border-opacity-5 flex items-center justify-between px-4 md:px-8 lg:px-10 sticky top-0 bg-gym-black bg-opacity-80 backdrop-blur-md z-20">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tight font-oswald italic">
                {role === 'admin' ? 'Admin Portal' : 'Member Portal'}
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-gym-slate px-4 py-2 rounded-full border border-white border-opacity-5">
            <div className="w-8 h-8 bg-gym-red rounded-full flex items-center justify-center font-bold text-sm">
                {user.email?.[0].toUpperCase()}
            </div>
            <div className="hidden sm:block text-xs font-bold tracking-widest text-gray-300">
                {user.email}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 md:p-8 lg:p-10 flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
