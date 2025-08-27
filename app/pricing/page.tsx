"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Download, CheckCircle, X, Zap, Crown, Building, ArrowRight, Star, Users, Shield } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for small websites and blogs",
      icon: <Zap className="w-6 h-6" />,
      color: "from-green-500 to-emerald-600",
      features: [
        "Up to 100 conversations/month",
        "Basic AI responses",
        "WordPress integration",
        "Email support",
        "Basic analytics",
        "Standard widget themes"
      ],
      limitations: [
        "Limited customization",
        "Basic training data",
        "Community support only"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "Ideal for growing businesses and e-commerce",
      icon: <Crown className="w-6 h-6" />,
      color: "from-blue-500 to-purple-600",
      features: [
        "Up to 2,000 conversations/month",
        "Advanced AI responses",
        "All platform integrations",
        "Priority email support",
        "Advanced analytics dashboard",
        "Custom widget themes",
        "Multi-language support",
        "WooCommerce integration",
        "Training data upload",
        "API access"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For large businesses with advanced needs",
      icon: <Building className="w-6 h-6" />,
      color: "from-purple-500 to-pink-600",
      features: [
        "Unlimited conversations",
        "Premium AI responses",
        "All platform integrations",
        "24/7 phone & email support",
        "Advanced analytics & reporting",
        "White-label solution",
        "Multi-language support",
        "All e-commerce integrations",
        "Custom AI training",
        "Full API access",
        "SSO integration",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated."
    },
    {
      question: "What happens if I exceed my conversation limit?",
      answer: "We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional conversations as needed."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked."
    },
    {
      question: "Is there a setup fee?",
      answer: "No, there are no setup fees or hidden costs. You only pay the monthly subscription fee."
    },
    {
      question: "Can I use my own AI model?",
      answer: "Enterprise customers can integrate their own AI models or use our advanced training features to customize responses."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide email support for all plans, priority support for Professional, and 24/7 phone support for Enterprise customers."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Fluxa eCommerce Assistant
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Features</Link>
              <Link href="/platforms" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Platforms</Link>
              <Link href="/roadmap" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Roadmap</Link>
              <Link href="/pricing" className="text-blue-600 font-bold hover:scale-105 transition-all duration-300">Pricing</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-300">Sign In</Button>
              <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Download className="w-4 h-4 mr-2" />
                Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <Badge variant="secondary" className="mb-8 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 px-6 py-3 text-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Star className="w-5 h-5 mr-2" />
              Transparent Pricing
            </Badge>
            
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Choose the perfect
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                plan for your business
              </span>
            </h1>
            
            <p className="text-2xl lg:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Start free and scale as you grow. All plans include our core AI features 
              with no hidden fees or setup costs.
            </p>
            
            <div className="flex items-center justify-center gap-8 text-lg text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                30-day money-back guarantee
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                No setup fees
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-white/80 backdrop-blur-xl ${plan.popular ? 'ring-2 ring-blue-500 hover:-translate-y-4 hover:scale-105' : 'hover:-translate-y-2 hover:scale-105'}`}>
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-lg font-bold shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-10">
                  <div className={`w-20 h-20 bg-gradient-to-r ${plan.color} rounded-3xl flex items-center justify-center text-white mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    {plan.icon}
                  </div>
                  
                  <CardTitle className="text-3xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                    {plan.price !== "Free" && (
                      <span className="text-gray-600 ml-2 text-xl">/{plan.period}</span>
                    )}
                  </div>
                  
                  <CardDescription className="text-gray-600 leading-relaxed text-lg">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3 group-hover:text-gray-900 transition-colors duration-300">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <div key={limitationIndex} className="flex items-center gap-3 opacity-50">
                        <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-8">
                    <Button 
                      className={`w-full py-4 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                          : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white'
                      }`}
                    >
                      {plan.cta}
                      {plan.name !== "Enterprise" && <ArrowRight className="w-6 h-6 ml-2" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8">
                <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  Frequently asked
                </span>
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  questions
                </span>
              </h2>
              <p className="text-2xl text-gray-600">
                Everything you need to know about our pricing and plans.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <p className="text-gray-600 mb-6 text-xl font-medium">
                Still have questions?
              </p>
              <Button variant="outline" size="lg" className="px-10 py-4 text-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:scale-105 rounded-xl">
                Contact Support
                <ArrowRight className="w-5 h-5 ml-2" />
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
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
            Ready to get
            <span className="block text-yellow-300">started?</span>
          </h2>
          <p className="text-2xl opacity-90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join thousands of businesses already using Fluxa eCommerce Assistant to provide exceptional customer experiences. 
            Start your free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-8">
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-2xl font-bold">
              <Download className="w-6 h-6 mr-3" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-6 text-xl transition-all duration-300 hover:scale-105 rounded-2xl font-bold">
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-lg opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
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