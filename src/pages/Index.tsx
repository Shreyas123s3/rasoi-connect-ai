
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import AnimatedHero from '@/components/AnimatedHero';
import AnimatedStats from '@/components/AnimatedStats';
import AnimatedFeatures from '@/components/AnimatedFeatures';
import FloatingChat from '@/components/FloatingChat';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fff9] via-[#FFFEBF] to-[#FDFDCR]">
      <EnhancedNavbar />
      <FloatingChat />
      
      {/* Hero Section */}
      <section className="pt-8">
        <AnimatedHero />
        <div className="container mx-auto px-4">
          <AnimatedStats />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <motion.h2 
            className="text-5xl font-black text-center text-black mb-16 font-space"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            POWERFUL FEATURES
          </motion.h2>
          
          <AnimatedFeatures />

          {/* Feature Navigation */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link to="/suppliers" className="transform transition-all hover:scale-105">
              <button className="btn btn-success w-full rounded-full py-4 text-lg font-bold">
                Browse Suppliers
              </button>
            </Link>
            <Link to="/bulk-orders" className="transform transition-all hover:scale-105">
              <button className="btn btn-info w-full rounded-full py-4 text-lg font-bold">
                Join Bulk Orders
              </button>
            </Link>
            <Link to="/chat" className="transform transition-all hover:scale-105">
              <button className="btn btn-secondary w-full rounded-full py-4 text-lg font-bold">
                Ask AI Assistant
              </button>
            </Link>
            <Link to="/market" className="transform transition-all hover:scale-105">
              <button className="btn btn-warning w-full rounded-full py-4 text-lg font-bold">
                Check Prices
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-[#4C9DB0]">
        <div className="container mx-auto text-center">
          <motion.h2 
            className="text-4xl font-black text-white mb-12 font-space"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            TRUSTED BY VENDORS ACROSS INDIA
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "100% Verified",
                description: "All suppliers are FSSAI certified and government registered"
              },
              {
                icon: Clock,
                title: "Fast Delivery",
                description: "Same-day delivery available for local suppliers"
              },
              {
                icon: Star,
                title: "Top Rated",
                description: "4.8/5 average rating from vendor reviews"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="card bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(89, 211, 93, 0.5)"
                }}
              >
                <div className="card-body p-8">
                  <item.icon className="h-12 w-12 text-[#59D35D] mx-auto mb-4" />
                  <h3 className="text-xl font-black text-black mb-3 font-space">{item.title}</h3>
                  <p className="text-gray-700 font-inter">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto text-center">
          <motion.h2 
            className="text-5xl font-black text-white mb-6 font-space"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            READY TO TRANSFORM YOUR SOURCING?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-inter"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of vendors who've already reduced their costs by 30% with RasoiLink
          </motion.p>
          
          <Link to="/suppliers">
            <motion.button
              className="btn btn-success btn-lg rounded-full px-12 py-6 text-2xl font-black"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(89, 211, 93, 0.8)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              GET STARTED NOW
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
