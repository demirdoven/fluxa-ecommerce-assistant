"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { name: 'Features', path: '/features' },
    { name: 'Platforms', path: '/platforms' },
    { name: 'Roadmap', path: '/roadmap' },
    { name: 'Pricing', path: '/pricing' },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
                
                 {/* Mobile menu button - Only shows on mobile */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-700 hover:text-blue-600 focus:outline-none p-2 -mr-2"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                        <X className="w-6 h-6" />
                        ) : (
                        <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
                
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
                    </div>
                    <span className="md:text-2xl text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                        Fluxa eCommerce Assistant
                    </span>
                </Link>
                
                <div className="hidden md:flex items-center gap-8">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`${isActive(item.path) ? 'text-blue-600 font-bold' : 'text-gray-700'} hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-300">Sign In</Button>
                    <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <Download className="w-4 h-4 mr-2" />
                        Free Trial
                    </Button>
                </div>

                

            </div>
            {/* Mobile Menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
                <div className="pt-4 pb-2 space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive(item.path) 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                    <div className="pt-2 mt-2 border-t border-gray-200">
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Sign In
                    </Button>
                    <Button 
                        className="w-full justify-start px-3 py-2 mt-2 text-base font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Free Trial
                    </Button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  )
 
}
