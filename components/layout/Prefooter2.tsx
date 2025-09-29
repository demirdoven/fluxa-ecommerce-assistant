import React from 'react'
import { Button } from "@/components/ui/button";
import { Eye, Sparkles } from "lucide-react";

export const Prefooter2 = () => {
  return (
    <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
            Don't wait for
            <span className="block text-yellow-300">the future</span>
          </h2>
          <p className="text-2xl opacity-90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Start transforming your customer experience today with our current feature set. 
            New features are automatically included in your subscription.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-8">
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-2xl font-bold">
              <Eye className="w-6 h-6 mr-3" />
              See Demo
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-6 text-xl transition-all duration-300 hover:scale-105 rounded-2xl font-bold">
              Schedule Demo
            </Button>
          </div>
        </div>
  )
}
