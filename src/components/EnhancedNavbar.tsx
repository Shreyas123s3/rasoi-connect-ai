
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Store, Users, Bot, TrendingUp, MapPin, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const EnhancedNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
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
    const ctx = gsap.context(() => {
      // Navbar scroll effect
      ScrollTrigger.create({
        start: "top -80",
        end: 99999,
        onUpdate: (self) => {
          if (self.direction === -1) {
            setScrolled(false);
          } else {
            setScrolled(true);
          }
        }
      });

      // Navbar shrink animation
      gsap.to(navRef.current, {
        height: scrolled ? "60px" : "80px",
        duration: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "body",
          start: "top -80",
          end: "top -81",
          toggleActions: "play none none reverse"
        }
      });
    }, navRef);

    return () => ctx.revert();
  }, [scrolled]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b-2 border-gray-100' 
          : 'bg-white/90 backdrop-blur-sm border-b-2 border-gray-200'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-[#59D35D] p-2 rounded-full"
            >
              <Store className="h-8 w-8 text-black" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black text-black">RasoiLink</h1>
              <p className="text-xs text-gray-600 font-semibold">Smart Sourcing</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all font-bold text-sm ${
                    isActive(item.path)
                      ? 'bg-[#59D35D] text-black shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link to="/suppliers">
              <Button className="btn btn-primary rounded-full px-6 py-2 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Start Sourcing
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
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
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t-2 border-gray-200 shadow-xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-bold ${
                      isActive(item.path)
                        ? 'bg-[#59D35D] text-black'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <Link to="/suppliers" onClick={() => setIsOpen(false)}>
                  <Button className="btn btn-primary w-full py-3 font-bold rounded-lg">
                    Start Sourcing
                  </Button>
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
