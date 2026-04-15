'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase' 
import { Zap, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false) 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isSignUp) {
      // Create new account in Supabase
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      })
      if (error) alert(`Sign Up Error: ${error.message}`)
      else alert('Account created! Check your email to verify.')
    } else {
      // Log in existing user
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(`Login Error: ${error.message}`)
      else alert('Logged in! Welcome to the gym.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-grey flex items-center justify-center p-6">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-forest-green hover:text-white font-bold flex items-center">
          <ChevronLeft size={20} /> BACK TO HOME
        </Link>
      </div>

      <div className="max-w-md w-full bg-tactical-black p-10 rounded border-2 border-forest-green shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-6 text-center tracking-tighter italic">
          {isSignUp ? 'MEMBER ENROLLMENT' : 'CLIENT LOGIN'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" 
            placeholder="EMAIL ADDRESS" 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-slate-grey text-white border border-gray-700 rounded focus:border-forest-green outline-none" 
            required 
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-slate-grey text-white border border-gray-700 rounded focus:border-forest-green outline-none" 
            required 
          />
          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-forest-green hover:bg-green-600 py-4 font-black text-white rounded transition disabled:opacity-50"
          >
            {loading ? 'SYNCHRONIZING...' : isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500 font-bold uppercase tracking-widest">
          {isSignUp ? 'Already have access?' : 'New prospect?'} 
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)} 
            className="ml-2 text-forest-green hover:underline"
          >
            {isSignUp ? 'LOG IN' : 'JOIN NOW'}
          </button>
        </p>
      </div>
    </div>
  )
}