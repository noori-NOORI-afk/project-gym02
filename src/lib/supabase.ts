import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          phone: string
          timestamp: string
        }
        Insert: {
          phone: string
          timestamp?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          age?: number
          role: 'owner' | 'client'
          is_pt_client: boolean
          created_at: string
        }
      }
      memberships: {
        Row: {
          id: string
          user_id: string
          package_type: '1month' | '3months' | '6months'
          start_date: string
          expiry_date: string
          payment_status: 'pending' | 'completed' | 'failed'
          created_at: string
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          weight?: number
          body_fat?: number
          photo_url?: string
          date: string
          created_at: string
        }
      }
    }
  }
}
