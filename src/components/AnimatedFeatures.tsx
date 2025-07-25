
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Store, Users, Bot, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const AnimatedFeatures: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Store,
      title: "Trusted Suppliers",
      description: "FSSAI verified suppliers with trust scores",
      color: "bg-green-500",
      link: "/suppliers"
    },
    {
      icon: Users,
      title: "Bulk Deals",
      description: "Join other vendors to get better prices",
      color: "bg-blue-500",
      link: "/bulk-orders"
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Get smart procurement advice",
      color: "bg-purple-500",
      link: "/chat"
    },
    {
      icon: TrendingUp,
      title: "Live Prices",
      description: "Track market rates in real-time",
      color: "bg-orange-500",
      link: "/market"
    }
  ];

  useEffect(() => {
    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current.children,
        {
          opacity: 0,
          y: 100,
          rotationY: 45
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          whileHover={{ 
            scale: 1.05, 
            rotateY: 5,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
          }}
          className="card bg-white shadow-lg border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        >
          <div className="card-body p-8 text-center">
            <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-black mb-3 font-space">
              {feature.title}
            </h3>
            <p className="text-gray-600 font-medium font-inter mb-4">
              {feature.description}
            </p>
            <Link to={feature.link}>
              <button className="btn btn-outline btn-sm rounded-full hover:btn-success transition-all duration-300">
                Explore
              </button>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedFeatures;
