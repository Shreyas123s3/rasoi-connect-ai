
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const AnimatedHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out"
        }
      );
    }

    // Typewriter effect
    if (typewriterRef.current) {
      const text = "SAVE MONEY. STAY LOCAL.";
      const element = typewriterRef.current;
      element.innerHTML = "";
      
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 100);
    }
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2359D35D\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      <div ref={heroRef} className="relative container mx-auto text-center pt-24 pb-16 px-4">
        <motion.h1 
          className="text-6xl md:text-8xl font-black font-space text-black mb-4 leading-tight"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          SOURCE
          <br />
          <span className="text-[#59D35D] relative">
            INGREDIENTS
            <div className="absolute -inset-1 bg-[#59D35D] opacity-20 blur-sm rounded-2xl animate-pulse"></div>
          </span>
        </motion.h1>
        
        <div 
          ref={typewriterRef}
          className="text-4xl md:text-6xl font-black font-space text-black mb-6 overflow-hidden border-r-2 border-[#59D35D] animate-typewriter"
        ></div>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-inter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Helping Indian food vendors buy better, together. Connect with trusted suppliers, join bulk orders, and get AI-powered procurement insights.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button className="btn btn-success btn-lg rounded-full px-8 py-4 text-xl font-bold hover:animate-glow transition-all duration-300 transform hover:scale-105">
            START SOURCING
          </button>
          <button className="btn btn-outline btn-lg rounded-full px-8 py-4 text-xl font-bold hover:bg-black hover:text-white transition-all duration-300">
            JOIN BULK ORDER
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedHero;
