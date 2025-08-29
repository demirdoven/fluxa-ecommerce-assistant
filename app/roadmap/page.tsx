"use client";

import { Prefooter2 } from "@/components/layout/Prefooter2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Download, Mic, MessageSquare, BarChart, TrendingUp, Zap, ArrowRight, Calendar, CheckCircle, Clock, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function Roadmap() {
  const roadmapItems = [
    {
      quarter: "Q1 2025",
      status: "In Progress",
      items: [
        {
          icon: <Mic className="w-6 h-6" />,
          title: "Voice Chat Integration",
          description: "Enable voice conversations for hands-free customer support with natural speech recognition and synthesis",
          progress: 75,
          features: [
            "Natural speech recognition",
            "Multi-language voice support",
            "Voice-to-text transcription",
            "Customizable voice personas"
          ]
        },
        {
          icon: <MessageSquare className="w-6 h-6" />,
          title: "WhatsApp Integration",
          description: "Extend your chatbot to WhatsApp Business API for seamless customer communication",
          progress: 60,
          features: [
            "WhatsApp Business API",
            "Rich media messages",
            "Template messages",
            "Broadcast capabilities"
          ]
        }
      ]
    },
    {
      quarter: "Q2 2025",
      status: "Planned",
      items: [
        {
          icon: <BarChart className="w-6 h-6" />,
          title: "Advanced Analytics Dashboard",
          description: "Comprehensive insights into customer interactions, satisfaction metrics, and performance analytics",
          progress: 0,
          features: [
            "Real-time conversation analytics",
            "Customer satisfaction tracking",
            "Performance benchmarking",
            "Custom report generation"
          ]
        },
        {
          icon: <MessageSquare className="w-6 h-6" />,
          title: "Telegram Integration",
          description: "Native Telegram bot integration for reaching customers on their preferred messaging platform",
          progress: 0,
          features: [
            "Telegram Bot API",
            "Inline keyboards",
            "File sharing support",
            "Group chat management"
          ]
        }
      ]
    },
    {
      quarter: "Q3 2025",
      status: "Planned",
      items: [
        {
          icon: <TrendingUp className="w-6 h-6" />,
          title: "AI Cross-sell Engine",
          description: "Intelligent product recommendations and cross-selling suggestions to boost revenue",
          progress: 0,
          features: [
            "Smart product recommendations",
            "Behavioral analysis",
            "Dynamic pricing integration",
            "A/B testing for suggestions"
          ]
        },
        {
          icon: <Lightbulb className="w-6 h-6" />,
          title: "Advanced AI Training",
          description: "Enhanced machine learning capabilities with custom model training and fine-tuning",
          progress: 0,
          features: [
            "Custom model training",
            "Industry-specific templates",
            "Advanced NLP processing",
            "Sentiment analysis improvements"
          ]
        }
      ]
    },
    {
      quarter: "Q4 2025",
      status: "Research",
      items: [
        {
          icon: <MessageCircle className="w-6 h-6" />,
          title: "Omnichannel Integration",
          description: "Unified customer experience across all communication channels with centralized management",
          progress: 0,
          features: [
            "Unified inbox",
            "Cross-channel conversation history",
            "Channel-specific optimizations",
            "Seamless handoffs"
          ]
        },
        {
          icon: <Zap className="w-6 h-6" />,
          title: "Enterprise Features",
          description: "Advanced enterprise capabilities including SSO, advanced security, and custom integrations",
          progress: 0,
          features: [
            "Single Sign-On (SSO)",
            "Advanced role management",
            "Custom API integrations",
            "Enterprise security compliance"
          ]
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Planned":
        return "bg-yellow-100 text-yellow-700";
      case "Research":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress":
        return <Zap className="w-4 h-4" />;
      case "Planned":
        return <Calendar className="w-4 h-4" />;
      case "Research":
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

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
              <Calendar className="w-5 h-5 mr-2" />
              Innovation Roadmap
            </Badge>
            
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                The future of
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                AI customer support
              </span>
            </h1>
            
            <p className="text-2xl lg:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Discover what's coming next for Fluxa eCommerce Assistant. We're constantly innovating to bring you 
              the most advanced AI eCommerce features and integrations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-2xl">
                <Download className="w-6 h-6 mr-3" />
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="px-12 py-6 text-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:scale-105 rounded-2xl">
                Request Feature
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {roadmapItems.map((quarter, quarterIndex) => (
              <div key={quarterIndex} className="relative">
                {/* Quarter Header */}
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">{quarter.quarter}</h2>
                  <Badge className={`${getStatusColor(quarter.status)} px-4 py-2 text-lg font-bold shadow-lg`}>
                    {getStatusIcon(quarter.status)}
                    <span className="ml-2">{quarter.status}</span>
                  </Badge>
                </div>
                
                {/* Items Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {quarter.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:-translate-y-2 hover:scale-105 bg-white/80 backdrop-blur-xl">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                            {item.icon}
                          </div>
                          {item.progress > 0 && (
                            <div className="text-right">
                              <div className="text-sm text-gray-500 mb-2 font-medium">Progress</div>
                              <div className="text-2xl font-black text-blue-600">{item.progress}%</div>
                            </div>
                          )}
                        </div>
                        
                        <CardTitle className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 leading-relaxed text-lg">
                          {item.description}
                        </CardDescription>
                        
                        {item.progress > 0 && (
                          <div className="mt-6">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <h4 className="font-bold text-gray-900 mb-4 text-lg">Key Features:</h4>
                          {item.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                              <span className="font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Request Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Have a feature
              </span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                request?
              </span>
            </h2>
            <p className="text-2xl text-gray-600 mb-12 leading-relaxed">
              We're always listening to our community. Share your ideas and help shape the future of Fluxa eCommerce Assistant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-2xl">
                Submit Feature Request
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button variant="outline" size="lg" className="px-12 py-6 text-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:scale-105 rounded-2xl">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <Prefooter2 />
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