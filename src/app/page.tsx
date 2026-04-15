'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Zap } from 'lucide-react'
import PhoneCaptureModal from '@/components/PhoneCaptureModal'

export default function Home() {
  const [showModal, setShowModal] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-tactical-black to-slate-grey">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:p-8">
        <div className="text-2xl font-bold text-forest-green">
          BODY FIT TRAINING
        </div>
        <div className="space-x-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-gray-200 hover:text-forest-green transition"
          >
            Login
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="btn-tactical"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="mb-6 inline-block">
            <Zap className="w-16 h-16 text-forest-green animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Transform with
            <span className="block text-forest-green">CERTAINTY</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Led by <span className="font-semibold text-forest-green">Vikram Valecha</span>,
            with 20+ years of competitive fitness experience. We don&apos;t just offer gym access.
            We deliver <span className="font-bold">guaranteed transformation</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => setShowModal(true)}
              className="btn-tactical text-lg"
            >
              <Phone className="inline mr-2 w-5 h-5" />
              Start Your Journey
            </button>
            <Link
              href="#about"
              className="px-6 py-3 rounded font-semibold border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white transition"
            >
              Learn More
            </Link>
          </div>

          {/* Membership Tiers */}
          <div className="mt-20 grid md:grid-cols-3 gap-6">
            {[
              { duration: '1 Month', price: '₹1,200', features: ['Full Gym Access', 'Basic Support'] },
              { duration: '3 Months', price: '₹3,400', features: ['Full Gym Access', 'PT Sessions', 'Progress Tracking'] },
              { duration: '6 Months', price: '₹7,000', features: ['Full Gym Access', 'PT Sessions', 'Nutrition Plan', 'Priority Support'] },
            ].map((tier, idx) => (
              <div
                key={idx}
                className="p-6 rounded border-2 border-forest-green bg-slate-grey hover:bg-opacity-80 transition"
              >
                <h3 className="text-lg font-bold text-forest-green mb-2">
                  {tier.duration}
                </h3>
                <div className="text-3xl font-black text-white mb-4">
                  {tier.price}
                </div>
                <ul className="text-sm space-y-2 text-gray-300">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className="text-forest-green mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phone Capture Modal */}
      <PhoneCaptureModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </main>
  )
}
