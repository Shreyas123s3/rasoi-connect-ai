
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Store, Users, Bot, TrendingUp, MapPin, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Suppliers', path: '/suppliers', icon: Store },
    { name: 'Bulk Orders', path: '/bulk-orders', icon: Users },
    { name: 'Map', path: '/map', icon: MapPin },
    { name: 'Market', path: '/market', icon: TrendingUp },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'AI Chat', path: '/chat', icon: Bot },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-[#59D35D] p-2 rounded-full group-hover:scale-110 transition-transform">
              <Store className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-black">RasoiLink</h1>
              <p className="text-xs text-gray-600 font-semibold">Smart Sourcing</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all font-bold text-sm ${
                  isActive(item.path)
                    ? 'bg-[#59D35D] text-black'
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
              <Button className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-2 rounded-full">
                Start Sourcing
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t-2 border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
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
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              <Link to="/suppliers" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3">
                  Start Sourcing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
