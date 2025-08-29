"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Download, Users, Database, Upload, Badge as Widget, ShoppingCart, Globe, Settings, Zap, Shield, BarChart, Brain, Lock, Smartphone, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Features() {
  const features = [
    {
      icon: <Settings className="w-8 h-8" />,
      title: "WordPress Integration",
      description: "Seamless one-click installation and configuration with your WordPress site. Zero coding required.",
      benefits: [
        "One-click plugin installation",
        "Automatic theme integration",
        "Custom widget positioning",
        "Admin dashboard controls"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Advanced User Management",
      description: "Sophisticated user tracking and session management for personalized chat experiences.",
      benefits: [
        "User session persistence",
        "Conversation history",
        "Personalized responses",
        "User behavior analytics"
      ]
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Sensay API Proxy",
      description: "Secure API integration with built-in rate limiting and caching for optimal performance.",
      benefits: [
        "Built-in rate limiting",
        "Response caching",
        "API key security",
        "99.9% uptime guarantee"
      ]
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Training Data Upload",
      description: "Easy bulk upload of your business data to train the AI with your specific knowledge base.",
      benefits: [
        "Bulk data import",
        "Multiple file formats",
        "Auto-processing",
        "Knowledge base management"
      ]
    },
    {
      icon: <Widget className="w-8 h-8" />,
      title: "Minimal Chat Widget",
      description: "Lightweight, customizable chat interface that seamlessly blends with your site's design.",
      benefits: [
        "Fully customizable design",
        "Mobile responsive",
        "Lightweight code",
        "Multiple positioning options"
      ]
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "WooCommerce Integration",
      description: "Enhanced e-commerce features with product recommendations and order assistance.",
      benefits: [
        "Product recommendations",
        "Order status tracking",
        "Cart abandonment recovery",
        "Sales analytics"
      ]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Language Support",
      description: "Communicate with customers in 50+ languages with automatic translation capabilities.",
      benefits: [
        "50+ supported languages",
        "Automatic detection",
        "Real-time translation",
        "Cultural adaptation"
      ]
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Learning Engine",
      description: "Advanced machine learning that improves responses based on customer interactions.",
      benefits: [
        "Continuous learning",
        "Response optimization",
        "Context understanding",
        "Sentiment analysis"
      ]
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with data encryption and compliance with international standards.",
      benefits: [
        "End-to-end encryption",
        "GDPR compliant",
        "SOC 2 certified",
        "Regular security audits"
      ]
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Comprehensive insights into customer interactions, satisfaction, and conversion metrics.",
      benefits: [
        "Real-time dashboards",
        "Conversion tracking",
        "Customer satisfaction scores",
        "Performance metrics"
      ]
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Optimized",
      description: "Perfect mobile experience with touch-friendly interface and responsive design.",
      benefits: [
        "Touch-optimized interface",
        "Responsive design",
        "Fast loading times",
        "Offline message queue"
      ]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Optimized for speed with CDN delivery and intelligent caching mechanisms.",
      benefits: [
        "Global CDN delivery",
        "Intelligent caching",
        "Sub-second responses",
        "Minimal resource usage"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
  
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <Badge variant="secondary" className="mb-8 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 px-6 py-3 text-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Zap className="w-5 h-5 mr-2" />
              Powerful Features Revolution
            </Badge>
            
            <h1 className="text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Everything you need to
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                dominate with AI
              </span>
            </h1>
            
            <p className="text-2xl lg:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Discover the comprehensive feature set that makes Fluxa eCommerce Assistant the most powerful 
              AI eCommerce solution for your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-2xl">
                <Download className="w-6 h-6 mr-3" />
                Start Free Trial
              </Button>
              <Link href="/platforms">
                <Button variant="outline" size="lg" className="px-12 py-6 text-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:scale-105 rounded-2xl">
                  View Platforms
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:-translate-y-4 hover:scale-105 bg-white/80 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
            Ready to get
            <span className="block text-yellow-300">started?</span>
          </h2>
          <p className="text-2xl opacity-90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Experience all these powerful features with our 14-day free trial. 
            No credit card required, cancel anytime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-2xl font-bold">
              <Download className="w-6 h-6 mr-3" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-6 text-xl transition-all duration-300 hover:scale-105 rounded-2xl font-bold">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Fluxa eCommerce Assistant
                </span>
              </Link>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                The most advanced AI eCommerce assistant plugin for WordPress and e-commerce platforms.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-8 text-xl text-white">Product</h4>
              <ul className="space-y-4 text-gray-300">
                <li><Link href="/features" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Features</Link></li>
                <li><Link href="/platforms" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Platforms</Link></li>
                <li><Link href="/roadmap" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Roadmap</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-8 text-xl text-white">Support</h4>
              <ul className="space-y-4 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Contact Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-8 text-xl text-white">Company</h4>
              <ul className="space-y-4 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-10 text-center relative z-10">
            <p className="text-gray-400 text-lg">
              © 2025 Fluxa eCommerce Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}