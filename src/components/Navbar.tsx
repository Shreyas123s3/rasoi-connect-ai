
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Bell, 
  MessageCircle, 
  Map, 
  User,
  LogIn 
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Market', href: '/market', icon: TrendingUp },
    { name: 'Suppliers', href: '/suppliers', icon: Users },
    { name: 'Bulk Orders', href: '/bulk-orders', icon: ShoppingCart },
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Map', href: '/map', icon: Map },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (location.pathname === '/auth') {
    return null;
  }

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b-2 border-wisteria/30 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black text-black">
              <span className="text-[#59D35D]">FOOD</span>MARKET
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center space-x-1 transition-colors ${
                    isActive(item.href)
                      ? 'bg-[#59D35D] text-black'
                      : 'text-black hover:bg-wisteria/20 hover:text-wisteria'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {!user && (
              <Link
                to="/auth"
                className="px-3 py-2 rounded-lg text-sm font-bold flex items-center space-x-1 transition-colors text-black hover:bg-wisteria/20 hover:text-wisteria"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center">
            <div className="grid grid-cols-4 gap-1 p-2 bg-white/80 rounded-lg">
              {navigation.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`p-2 rounded-md flex flex-col items-center text-xs transition-colors ${
                      isActive(item.href)
                        ? 'bg-[#59D35D] text-black'
                        : 'text-black hover:bg-wisteria/20'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
