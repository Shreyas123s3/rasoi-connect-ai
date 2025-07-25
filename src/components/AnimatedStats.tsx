
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedStats: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);

  const stats = [
    { label: "Active Vendors", value: "2,500+" },
    { label: "Verified Suppliers", value: "850+" },
    { label: "Cities Covered", value: "25+" },
    { label: "Cost Savings", value: "30%" }
  ];

  useEffect(() => {
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        {
          opacity: 0,
          y: 50,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className="card bg-white/80 backdrop-blur-sm shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="card-body text-center p-6">
            <div className="text-3xl font-black text-[#59D35D] mb-2 font-space">
              {stat.value}
            </div>
            <div className="text-sm font-semibold text-gray-700 font-inter">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedStats;
