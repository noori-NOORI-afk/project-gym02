import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * POST /api/auth/client
 * Creates a client (Member) account from a lead phone number
 * Request body: { phone: string, email: string, password: string, name: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { phone, email, password, name, is_pt_client } = await request.json()

    // Validate input
    if (!phone || !email || !password || !name) {
      return NextResponse.json(
        { error: 'Phone, email, password, and name are required' },
        { status: 400 }
      )
    }

    // Verify phone exists in leads table
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('phone', phone)
      .single()

    if (leadError || !leadData) {
      return NextResponse.json(
        { error: 'Phone number not found in leads. Please submit from the landing page first.' },
        { status: 400 }
      )
    }

    // Create auth user with client role
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        role: 'client',
        phone,
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Create profile with client role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          role: 'client',
          is_pt_client: is_pt_client || false,
        },
      ])
      .select()

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        message: 'Client account created successfully',
        user: authData.user,
        profile: profileData,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating client account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
