
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Store, Users, Bot, TrendingUp, MapPin, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

const EnhancedNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Suppliers', path: '/suppliers', icon: Store },
    { name: 'Bulk Orders', path: '/bulk-orders', icon: Users },
    { name: 'Map', path: '/map', icon: MapPin },
    { name: 'Market', path: '/market', icon: TrendingUp },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'AI Chat', path: '/chat', icon: Bot },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-lg py-2' 
          : 'bg-white/95 backdrop-blur-md py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="bg-[#59D35D] p-2 rounded-full"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Store className="h-8 w-8 text-black" />
            </motion.div>
            <div>
              <h1 className={`font-black text-black font-space transition-all duration-300 ${
                isScrolled ? 'text-xl' : 'text-2xl'
              }`}>
                RasoiLink
              </h1>
              <p className="text-xs text-gray-600 font-semibold font-inter">Smart Sourcing</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all font-bold text-sm font-inter ${
                  isActive(item.path)
                    ? 'bg-[#59D35D] text-black shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link to="/suppliers">
              <motion.button
                className="btn btn-primary rounded-full px-6 py-2 font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Sourcing
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden btn btn-ghost btn-circle"
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-bold font-inter ${
                    isActive(item.path)
                      ? 'bg-[#59D35D] text-black'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <Link to="/suppliers" onClick={() => setIsOpen(false)}>
                  <button className="btn btn-primary w-full rounded-full py-3 font-bold">
                    Start Sourcing
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default EnhancedNavbar;
