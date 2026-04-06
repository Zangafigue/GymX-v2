import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { motion } from 'framer-motion';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      <Navbar />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
};

export default MainLayout;
