
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Store, Users, Bot, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const AnimatedFeatures = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

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
    const ctx = gsap.context(() => {
      // Stagger animation for feature cards
      gsap.set(cardsRef.current, { y: 100, opacity: 0, rotationX: 45 });

      ScrollTrigger.batch(cardsRef.current, {
        onEnter: (elements) => {
          gsap.to(elements, {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
          });
        },
        start: "top 80%",
        end: "bottom 20%"
      });

      // Hover animations
      cardsRef.current.forEach((card) => {
        const icon = card.querySelector('.feature-icon');
        
        card.addEventListener('mouseenter', () => {
          gsap.to(icon, { scale: 1.2, rotation: 360, duration: 0.5, ease: "power2.out" });
          gsap.to(card, { y: -10, duration: 0.3, ease: "power2.out" });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(icon, { scale: 1, rotation: 0, duration: 0.5, ease: "power2.out" });
          gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
        });
      });
    }, featuresRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={featuresRef} className="py-16 px-4">
      <div className="container mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-black text-center text-black mb-16"
        >
          POWERFUL FEATURES
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              ref={el => cardsRef.current[index] = el!}
              whileHover={{ scale: 1.05 }}
              className="perspective-1000"
            >
              <Card className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 h-full">
                <CardContent className="card-body p-8 text-center">
                  <div className={`feature-icon ${feature.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-black mb-3">{feature.title}</h3>
                  <p className="text-gray-600 font-medium mb-4">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link} className="transform transition-all hover:scale-105">
              <Button className={`btn btn-lg w-full ${feature.color} hover:opacity-90 text-white font-bold py-4 text-lg rounded-2xl shadow-lg`}>
                {feature.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedFeatures;
