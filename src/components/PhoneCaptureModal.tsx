'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // Add this to navigate
import { X, Phone } from 'lucide-react'

export default function PhoneCaptureModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    // Simulating the "Send OTP" behavior for the UI
    setTimeout(() => {
      setIsSending(false)
      onClose() // Close the modal
      router.push('/auth/login') // Send them to the login page to finish
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-tactical-black border-2 border-forest-green p-8 rounded-lg max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <Phone className="w-12 h-12 text-forest-green mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white">READY TO START?</h3>
          <p className="text-gray-400 text-sm mt-2 font-bold uppercase tracking-widest">Enter phone to receive access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="tel"
            placeholder="+91 00000-00000"
            className="w-full p-4 bg-slate-grey text-white border border-gray-700 rounded focus:border-forest-green outline-none"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-forest-green hover:bg-green-600 py-4 font-black text-white rounded transition"
          >
            {isSending ? 'SENDING ACCESS CODE...' : 'GET STARTED'}
          </button>
        </form>
      </div>
    </div>
  )
}