import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * POST /api/auth/owner
 * Creates an admin (Owner) account with custom JWT claims
 * Request body: { email: string, password: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create auth user with admin role
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        role: 'owner',
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Create profile with owner role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email,
          role: 'owner',
          name: 'Vikram Valecha',
          is_pt_client: false,
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
        message: 'Owner account created successfully',
        user: authData.user,
        profile: profileData,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating owner account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
