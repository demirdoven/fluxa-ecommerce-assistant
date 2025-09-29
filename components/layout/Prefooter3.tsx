import React from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export const Prefooter3 = () => {
  return (
    <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
            Ready to get
            <span className="block text-yellow-300">started?</span>
          </h2>
          <p className="text-2xl opacity-90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Choose your platform and start transforming your customer experience today. 
            14-day free trial, no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-2xl font-bold">
              <Download className="w-6 h-6 mr-3" />
              Start Free Trial
            </Button>
      
          </div>
        </div>
  )
}
