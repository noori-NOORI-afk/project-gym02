'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-grey flex items-center justify-center p-6">
      {/* Back to Home Button */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-forest-green hover:underline font-bold">
          ← BACK
        </Link>
      </div>

      <div className="max-w-md w-full bg-tactical-black p-10 rounded-lg border-2 border-forest-green shadow-2xl">
        <div className="flex justify-center mb-6">
          <Zap className="w-12 h-12 text-forest-green" />
        </div>
        
        <h2 className="text-4xl font-black text-white mb-2 text-center tracking-tighter">
          CLIENT <span className="text-forest-green">PORTAL</span>
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm uppercase tracking-widest">
          Enter credentials to proceed
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-forest-green mb-2 uppercase">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full p-4 bg-slate-grey text-white border border-gray-700 rounded focus:border-forest-green outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-green mb-2 uppercase">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 bg-slate-grey text-white border border-gray-700 rounded focus:border-forest-green outline-none transition"
            />
          </div>

          <button className="w-full bg-forest-green hover:bg-green-600 text-white font-black py-4 rounded transition duration-300 transform hover:scale-[1.02]">
            LOG IN
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            Body Fit Training © 2026 | Guaranteed Transformation
          </p>
        </div>
      </div>
    </div>
  )
}