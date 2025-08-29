"use client";

import { Prefooter3 } from "@/components/layout/Prefooter3";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Download, ArrowRight, CheckCircle, Clock, Star, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Platforms() {
  const platforms = [
    {
      name: "WordPress",
      description: "Full-featured plugin with comprehensive admin dashboard and seamless theme integration",
      status: "Available",
      downloadLink: "#",
      features: [
        "One-click installation",
        "Admin dashboard",
        "Theme integration",
        "Widget customization",
        "SEO optimization",
        "Performance monitoring"
      ],
      installations: "8,500+",
      rating: 4.9,
      logo: "W"
    },
    {
      name: "PrestaShop",
      description: "Native module designed specifically for PrestaShop e-commerce platform",
      status: "Coming Soon",
      downloadLink: "#",
      features: [
        "Product recommendations",
        "Order assistance",
        "Multi-store support",
        "Customer analytics",
        "Mobile responsive",
        "Multi-language"
      ],
      installations: "Coming Q2",
      rating: null,
      logo: "P"
    },
    {
      name: "OpenCart",
      description: "Powerful extension for OpenCart stores with advanced e-commerce features",
      status: "Coming Soon",
      downloadLink: "#",
      features: [
        "Shopping cart integration",
        "Product search",
        "Order tracking",
        "Customer support",
        "Analytics dashboard",
        "Custom themes"
      ],
      installations: "Coming Q2",
      rating: null,
      logo: "O"
    },
    {
      name: "Magento",
      description: "Enterprise-grade extension for Magento 2.x with advanced customization",
      status: "Coming Soon",
      downloadLink: "#",
      features: [
        "Enterprise features",
        "Multi-website support",
        "Advanced analytics",
        "Custom integrations",
        "B2B features",
        "Performance optimization"
      ],
      installations: "Coming Q3",
      rating: null,
      logo: "M"
    },
    {
      name: "Shopify",
      description: "Native Shopify app with seamless integration and powerful e-commerce tools",
      status: "Coming Soon",
      downloadLink: "#",
      features: [
        "App store integration",
        "Theme compatibility",
        "Shopify Plus support",
        "Abandoned cart recovery",
        "Sales analytics",
        "Mobile optimization"
      ],
      installations: "Coming Q3",
      rating: null,
      logo: "S"
    }
  ];

  const integrationSteps = [
    {
      step: "1",
      title: "Download & Install",
      description: "Download the plugin and install it on your platform in just one click"
    },
    {
      step: "2",
      title: "Configure Settings",
      description: "Set up your AI chatbot with our intuitive configuration wizard"
    },
    {
      step: "3",
      title: "Train Your AI",
      description: "Upload your business data to train the AI with your specific knowledge"
    },
    {
      step: "4",
      title: "Go Live",
      description: "Activate your chatbot and start providing exceptional customer support"
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
              Universal Platform Support
            </Badge>
            
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Works with your
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                favorite platform
              </span>
            </h1>
            
            <p className="text-2xl lg:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Install Fluxa eCommerce Assistant on any major e-commerce platform or CMS. 
              Native integrations designed for optimal performance and user experience.
            </p>
            
            <div className="flex items-center justify-center gap-8 text-lg text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                11,700+ Active Installations
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                4.9 Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:-translate-y-4 hover:scale-105 bg-white/80 backdrop-blur-xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    {platform.logo}
                  </div>
                  <CardTitle className="text-3xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {platform.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-6 text-lg">
                    {platform.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-center gap-6 text-gray-600 mb-6 font-medium">
                    <div className="flex items-center gap-1">
                      <Users className="w-5 h-5 text-blue-500" />
                      {platform.installations}
                    </div>
                    {platform.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500" />
                        {platform.rating}
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {platform.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-6">
                    {platform.status === "Available" ? (
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl">
                        <Download className="w-5 h-5 mr-2" />
                        Download Now
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full py-3 text-lg border-2 rounded-xl" disabled>
                        <Clock className="w-5 h-5 mr-2" />
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-8 text-xl font-medium">
              Don't see your platform? We're always adding new integrations.
            </p>
            <Button variant="outline" size="lg" className="px-10 py-4 text-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:scale-105 rounded-xl">
              Request Platform Support
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Integration Steps */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Easy 4-step
              </span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                integration
              </span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Get your AI chatbot up and running in minutes with our streamlined setup process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrationSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-black mx-auto mb-8 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
              </div>
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
        <Prefooter3 />
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