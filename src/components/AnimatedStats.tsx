
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent } from '@/components/ui/card';

gsap.registerPlugin(ScrollTrigger);

const AnimatedStats = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const stats = [
    { label: "Active Vendors", value: "2,500+", color: "text-[#59D35D]" },
    { label: "Verified Suppliers", value: "850+", color: "text-blue-600" },
    { label: "Cities Covered", value: "25+", color: "text-purple-600" },
    { label: "Cost Savings", value: "30%", color: "text-orange-600" }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate cards on scroll
      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(card,
          { 
            y: 50, 
            opacity: 0,
            scale: 0.8,
            rotationY: 45
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 0.8,
            delay: index * 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Animate numbers
        const numberElement = card.querySelector('.stat-number');
        if (numberElement) {
          gsap.from(numberElement, {
            textContent: "0",
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
            }
          });
        }
      });
    }, statsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          ref={el => cardsRef.current[index] = el!}
          whileHover={{ scale: 1.05, rotateY: 10 }}
          className="perspective-1000"
        >
          <Card className="card bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100">
            <CardContent className="card-body p-6 text-center">
              <div className={`stat-number text-4xl font-black mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedStats;
