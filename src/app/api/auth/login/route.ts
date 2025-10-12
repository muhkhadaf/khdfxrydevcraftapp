import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Login API called')
    const { username, password } = await request.json()
    console.log('Login attempt for username:', username)

    // Validate input
    if (!username || !password) {
      console.log('❌ Validation failed: missing username or password')
      return NextResponse.json(
        { success: false, error: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }

    // Attempt login
    console.log('🔍 Attempting login with loginUser function')
    const result = await loginUser(username, password)
    console.log('Login result:', result)

    if (!result.success) {
      console.log('❌ Login failed:', result.error)
      return NextResponse.json(result, { status: 401 })
    }

    console.log('✅ Login successful, setting cookie')
    // Set HTTP-only cookie with JWT token
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Login berhasil'
    })

    response.cookies.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    console.log('🍪 Cookie set, returning success response')
    return response
  } catch (error) {
    console.error('💥 Login API error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}