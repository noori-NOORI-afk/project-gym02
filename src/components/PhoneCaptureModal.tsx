'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PhoneCaptureModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PhoneCaptureModal({ isOpen, onClose }: PhoneCaptureModalProps) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone || phone.length < 10) {
      setMessage('Please enter a valid phone number')
      return
    }

    setLoading(true)
    try {
      // Store lead in Supabase
      const { error } = await supabase
        .from('leads')
        .insert([{ phone, timestamp: new Date().toISOString() }])

      if (error) throw error

      setMessage('✓ Submission successful! Redirecting to login...')
      setTimeout(() => {
        window.location.href = '/auth/login'
      }, 2000)
    } catch (error) {
      setMessage('Error submitting. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-grey rounded-lg max-w-md w-full p-8 relative border-2 border-forest-green">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-black text-forest-green mb-6">
          Start Your Transformation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit number"
              maxLength={10}
              className="w-full px-4 py-3 bg-tactical-black text-white rounded border-2 border-forest-green focus:outline-none focus:border-white transition"
            />
          </div>

          {message && (
            <div className={`text-sm mt-2 ${
              message.includes('✓') ? 'text-green-400' : 'text-red-400'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-tactical mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Continue to OTP Login'}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            We&apos;ll send you an OTP to verify your phone number.
          </p>
        </form>
      </div>
    </div>
  )
}
