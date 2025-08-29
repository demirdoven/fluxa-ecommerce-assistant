import React from 'react'
import { Button } from '@/components/ui/button'
import { Download, Sparkles } from 'lucide-react'

export const Prefooter = () => {
  return (
    <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
            Ready to transform
            <span className="block text-yellow-300">
              your business?
            </span>
          </h2>
          <p className="text-2xl opacity-90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join thousands of successful businesses using Fluxa eCommerce Assistant to provide exceptional customer experiences, 
            increase sales, and reduce support costs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-8">
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-2xl font-bold">
              <Download className="w-6 h-6 mr-3" />
              Start Free Trial
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-gray-900 hover:bg-white hover:text-gray-900 px-12 py-6 text-xl transition-all duration-300 hover:scale-105 rounded-2xl font-bold">
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-lg opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
  )
}
