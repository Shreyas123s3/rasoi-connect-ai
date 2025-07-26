import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Users, Bot, TrendingUp, MapPin, Bell, Star, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import DotGrid from '@/components/DotGrid';

const Index = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Store,
      title: "Trusted Suppliers",
      description: "FSSAI verified suppliers with trust scores",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Bulk Deals",
      description: "Join other vendors to get better prices",
      color: "bg-blue-500"
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Get smart procurement advice",
      color: "bg-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Live Prices",
      description: "Track market rates in real-time",
      color: "bg-orange-500"
    }
  ];

  const stats = [
    { label: "Active Vendors", value: "2,500+" },
    { label: "Verified Suppliers", value: "850+" },
    { label: "Cities Covered", value: "25+" },
    { label: "Cost Savings", value: "30%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEBF] to-[#FDFDCR]">
      <Navbar />
      
      {/* Hero Section with Dot Grid Background */}
      <section className="pt-24 pb-16 px-4 relative">
        {/* Dot Grid Background Animation */}
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
          <DotGrid
            dotSize={10}
            gap={15}
            baseColor="#5227FF"
            activeColor="#5227FF"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black text-black mb-4 leading-tight">
              SOURCE
              <br />
              <span className="text-[#59D35D]">INGREDIENTS</span>
            </h1>
            <h2 className="text-4xl md:text-6xl font-black text-black mb-6">
              SAVE MONEY. STAY LOCAL.
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Helping Indian food vendors buy better, together. Connect with trusted suppliers, join bulk orders, and get AI-powered procurement insights.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/suppliers">
              <Button size="lg" className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold text-xl px-8 py-4 rounded-full">
                START SOURCING
              </Button>
            </Link>
            <Link to="/bulk-orders">
              <Button variant="outline" size="lg" className="border-2 border-black text-black font-bold text-xl px-8 py-4 rounded-full hover:bg-black hover:text-white">
                JOIN BULK ORDER
              </Button>
            </Link>
          </div>

          {/* Enhanced Stats with Lemon background and Wisteria accents */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-lemon backdrop-blur-sm border-2 border-wisteria hover:shadow-lg hover:shadow-wisteria/20 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-black text-wisteria mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-800">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with alternating Lemon backgrounds */}
      <section className="py-16 px-4 bg-lemon">
        <div className="container mx-auto">
          <h2 className="text-5xl font-black text-center text-wisteria mb-16">
            POWERFUL FEATURES
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white border-2 border-wisteria/30 hover:border-wisteria"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-black mb-3">{feature.title}</h3>
                  <p className="text-gray-600 font-medium">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Navigation */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            <Link to="/suppliers" className="transform transition-all hover:scale-105">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 text-lg">
                Browse Suppliers
              </Button>
            </Link>
            <Link to="/bulk-orders" className="transform transition-all hover:scale-105">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 text-lg">
                Join Bulk Orders
              </Button>
            </Link>
            <Link to="/chat" className="transform transition-all hover:scale-105">
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 text-lg">
                Ask AI Assistant
              </Button>
            </Link>
            <Link to="/market" className="transform transition-all hover:scale-105">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 text-lg">
                Check Prices
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Enhanced with Wisteria background */}
      <section className="py-16 px-4 bg-wisteria">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-12">
            TRUSTED BY VENDORS ACROSS INDIA
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-lemon rounded-lg p-8 border-2 border-white/20">
              <Shield className="h-12 w-12 text-[#59D35D] mx-auto mb-4" />
              <h3 className="text-xl font-black text-wisteria mb-3">100% Verified</h3>
              <p className="text-gray-800">All suppliers are FSSAI certified and government registered</p>
            </div>
            
            <div className="bg-lemon rounded-lg p-8 border-2 border-white/20">
              <Clock className="h-12 w-12 text-[#59D35D] mx-auto mb-4" />
              <h3 className="text-xl font-black text-wisteria mb-3">Fast Delivery</h3>
              <p className="text-gray-800">Same-day delivery available for local suppliers</p>
            </div>
            
            <div className="bg-lemon rounded-lg p-8 border-2 border-white/20">
              <Star className="h-12 w-12 text-[#59D35D] mx-auto mb-4" />
              <h3 className="text-xl font-black text-wisteria mb-3">Top Rated</h3>
              <p className="text-gray-800">4.8/5 average rating from vendor reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-black text-white mb-6">
            READY TO TRANSFORM YOUR SOURCING?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of vendors who've already reduced their costs by 30% with RasoiLink
          </p>
          
          <Link to="/suppliers">
            <Button size="lg" className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-black text-2xl px-12 py-6 rounded-full transform transition-all hover:scale-105">
              GET STARTED NOW
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
