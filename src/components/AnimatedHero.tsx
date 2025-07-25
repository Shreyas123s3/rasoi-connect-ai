
import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const AnimatedSphere = () => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 100, 200]} scale={2}>
        <MeshDistortMaterial
          color="#59D35D"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.2}
        />
      </Sphere>
    </Float>
  );
};

const AnimatedHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animations
      gsap.fromTo(titleRef.current, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
      );
      
      gsap.fromTo(subtitleRef.current, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" }
      );
      
      gsap.fromTo(buttonsRef.current, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: "power3.out" }
      );

      // Parallax scroll effect
      gsap.to(heroRef.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const dotPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2359D35D' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFEBF] via-[#FDFDCR] to-[#59D35D]/20">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("${dotPattern}")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* 3D Scene */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-60">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedSphere />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-7xl md:text-9xl font-black text-black mb-4 leading-tight">
            SOURCE
            <br />
            <span className="text-[#59D35D] animate-glow-pulse">INGREDIENTS</span>
          </h1>
          <h2 className="text-5xl md:text-7xl font-black text-black mb-6">
            SAVE MONEY. STAY LOCAL.
          </h2>
        </motion.div>
        
        <motion.p
          ref={subtitleRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto"
        >
          Helping Indian food vendors buy better, together. Connect with trusted suppliers, 
          join bulk orders, and get AI-powered procurement insights.
        </motion.p>
        
        <motion.div
          ref={buttonsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/suppliers">
            <Button 
              size="lg" 
              className="btn btn-primary btn-lg rounded-full px-8 py-4 text-xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              START SOURCING
            </Button>
          </Link>
          <Link to="/bulk-orders">
            <Button 
              variant="outline" 
              size="lg" 
              className="btn btn-outline btn-lg rounded-full px-8 py-4 text-xl font-bold border-2 hover:bg-black hover:text-white transition-all duration-300"
            >
              JOIN BULK ORDER
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedHero;
