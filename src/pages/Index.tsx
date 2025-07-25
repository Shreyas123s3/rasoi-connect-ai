
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import AnimatedHero from '@/components/AnimatedHero';
import AnimatedStats from '@/components/AnimatedStats';
import AnimatedFeatures from '@/components/AnimatedFeatures';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEBF] to-[#FDFDCR] overflow-x-hidden">
      <EnhancedNavbar />
      
      {/* Hero Section */}
      <section className="pt-24">
        <AnimatedHero />
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <AnimatedStats />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 backdrop-blur-sm">
        <AnimatedFeatures />
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#4C9DB0] to-[#59D35D]">
        <div className="container mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-black text-white mb-12"
          >
            TRUSTED BY VENDORS ACROSS INDIA
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "100% Verified", description: "All suppliers are FSSAI certified and government registered" },
              { icon: Clock, title: "Fast Delivery", description: "Same-day delivery available for local suppliers" },
              { icon: Star, title: "Top Rated", description: "4.8/5 average rating from vendor reviews" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                className="perspective-1000"
              >
                <Card className="card bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/20">
                  <CardContent className="card-body p-8 text-center">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="h-12 w-12 text-[#59D35D] mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-black text-black mb-3">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-black to-gray-900">
        <div className="container mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-black text-white mb-6"
          >
            READY TO TRANSFORM YOUR SOURCING?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of vendors who've already reduced their costs by 30% with RasoiLink
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link to="/suppliers">
              <Button 
                size="lg" 
                className="btn btn-primary btn-lg rounded-full px-12 py-6 font-black text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-glow-pulse"
              >
                GET STARTED NOW
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
