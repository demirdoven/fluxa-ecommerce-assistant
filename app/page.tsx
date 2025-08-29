"use client";

import { Prefooter } from "@/components/layout/Prefooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Download, Users, Database, Upload, Badge as Widget, ShoppingCart, Globe, Zap, Shield, Star, ArrowRight, Play, CheckCircle, TrendingUp, Clock, Headphones, Sparkles, Bot, Rocket, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const stats = [
    { number: "10,000+", label: "Active Installations", icon: <Users className="w-5 h-5" /> },
    { number: "99.9%", label: "Uptime Guarantee", icon: <Shield className="w-5 h-5" /> },
    { number: "24/7", label: "Customer Support", icon: <Headphones className="w-5 h-5" /> },
    { number: "50+", label: "Languages Supported", icon: <Globe className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "E-commerce Manager",
      company: "TechStore Pro",
      content: "Fluxa eCommerce Assistant increased our customer satisfaction by 40% and reduced support tickets by 60%. It's a game-changer!",
      avatar: "SJ",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      company: "Digital Solutions Inc",
      content: "The AI responses are incredibly accurate and the setup was seamless. Our conversion rate improved significantly.",
      avatar: "MC",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Store Owner",
      company: "Fashion Forward",
      content: "Best investment we made this year. The multilingual support helped us expand to international markets.",
      avatar: "ER",
      rating: 5
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Increase Sales",
      description: "Convert more visitors into customers with intelligent product recommendations",
      gradient: "from-emerald-400 to-teal-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save Time",
      description: "Automate 80% of customer inquiries and focus on growing your business",
      gradient: "from-blue-400 to-indigo-600"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Never miss a customer inquiry with round-the-clock AI assistance",
      gradient: "from-purple-400 to-pink-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Communicate with customers worldwide in their native language",
      gradient: "from-orange-400 to-red-600"
    }
  ];

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI-Powered Responses",
      description: "Advanced natural language processing for human-like conversations"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Easy Integration",
      description: "One-click installation on all major e-commerce platforms"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Smart Learning",
      description: "Continuously improves responses based on customer interactions"
    }
  ];

  return (
    <div className="space-y-0">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="secondary" className="mb-8 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 px-6 py-3 text-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Sparkles className="w-5 h-5 mr-2" />
              AI-Powered eCommerce Revolution
            </Badge>
            
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                Customer Experience
              </span>
            </h1>
            
            <p className="text-2xl lg:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Boost sales by <span className="font-bold text-emerald-600">40%</span>, reduce support costs by <span className="font-bold text-blue-600">60%</span>, and delight customers with our intelligent AI eCommerce assistant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-2xl">
                <Download className="w-6 h-6 mr-3" />
                Start Free Trial
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="px-12 py-6 text-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:scale-105 rounded-2xl">
                <Play className="w-6 h-6 mr-3" />
                Watch Demo
              </Button>
            </div>
            
            {/* Animated Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <Card className="border-0 bg-white/60 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:bg-white/80">
                    <CardContent className="py-8 px-4 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-4xl lg:text-5xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {stat.number}
                      </div>
                      <div className="text-gray-600 font-medium">{stat.label}</div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-purple-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-6 py-2 text-lg border-blue-200 text-blue-700">
              <Rocket className="w-5 h-5 mr-2" />
              Why Choose Fluxa?
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8">
              Supercharge Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Business Growth
              </span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Join thousands of successful businesses that have transformed their customer support with our AI-powered solution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group">
                <Card className="h-full border-0 bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <CardContent className="p-8 text-center h-full flex flex-col">
                    <div className="flex justify-center mb-6">
                      <div className={`w-20 h-20 bg-gradient-to-r ${benefit.gradient} rounded-3xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        {benefit.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed flex-grow">{benefit.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-indigo-600/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-8 border-blue-300 text-blue-200 px-6 py-2 text-lg">
                <Zap className="w-5 h-5 mr-2" />
                Powerful Features
              </Badge>
              <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
                Everything you need to
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  dominate your market
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                From seamless platform integration to advanced AI training, our comprehensive feature set 
                ensures your chatbot delivers exceptional customer experiences that convert.
              </p>
              
              <div className="space-y-6 mb-10">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                        {feature.title}
                      </h4>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/features">
                <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl">
                  Explore All Features
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
              <Card className="relative border-0 bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex gap-2">
                      <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                      <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                      <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-500 ml-4 font-medium">Fluxa Chat Widget</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-gray-100 to-blue-50 rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
                      <div className="text-sm text-gray-600 mb-2 font-medium">Customer</div>
                      <div className="text-gray-900 font-medium">Hi, I need help with my order status</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 ml-8 transform hover:scale-105 transition-transform duration-300 shadow-lg">
                      <div className="text-sm text-blue-100 mb-2 font-medium">Fluxa AI</div>
                      <div>I&apos;d be happy to help you check your order status! Could you please provide your order number?</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-gray-100 to-blue-50 rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
                      <div className="text-sm text-gray-600 mb-2 font-medium">Customer</div>
                      <div className="text-gray-900 font-medium">It&apos;s #12345</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 ml-8 transform hover:scale-105 transition-transform duration-300 shadow-lg">
                      <div className="text-sm text-blue-100 mb-2 font-medium">Fluxa AI</div>
                      <div>Great! Your order #12345 was shipped yesterday and should arrive by tomorrow. Here&apos;s your tracking link: track.example.com/12345</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-6 py-2 text-lg border-purple-200 text-purple-700">
              <Star className="w-5 h-5 mr-2" />
              Customer Success Stories
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8">
              Loved by businesses
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                worldwide
              </span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              See how companies like yours are transforming their customer experience with Fluxa eCommerce Assistant.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${i * 100}ms`}} />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg font-medium">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 font-medium">{testimonial.role}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-800/30 to-purple-800/30"></div>
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <Prefooter />
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Fluxa eCommerce Assistant
                </span>
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                The most advanced AI eCommerce assistant plugin for WordPress and e-commerce platforms. 
                Trusted by thousands of businesses worldwide.
              </p>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-gray-300 font-medium">Enterprise Security</span>
              </div>
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
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">System Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-8 text-xl text-white">Company</h4>
              <ul className="space-y-4 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Partners</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-lg">
              © 2025 Fluxa eCommerce Assistant. All rights reserved.
            </p>
            <div className="flex items-center gap-8 mt-6 md:mt-0 text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
