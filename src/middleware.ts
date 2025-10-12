import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = ['/admin', '/dashboard']
const authRoutes = ['/login']

// Simple token validation for Edge Runtime
function isValidToken(token: string): boolean {
  try {
    // Basic JWT structure check
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.log('❌ Invalid JWT structure')
      return false
    }

    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]))
    const now = Math.floor(Date.now() / 1000)
    
    console.log('🔍 Token payload:', {
      exp: payload.exp,
      now: now,
      expired: payload.exp < now
    })

    if (payload.exp < now) {
      console.log('❌ Token expired')
      return false
    }

    console.log('✅ Token is valid and not expired')
    return true
  } catch (error) {
    console.error('❌ Token validation error:', error)
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  console.log('🛡️ Middleware called for path:', pathname)
  console.log('Token present:', !!token)
  if (token) {
    console.log('Token value (first 20 chars):', token.substring(0, 20) + '...')
  }

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  console.log('Is protected route:', isProtectedRoute)
  console.log('Is auth route:', isAuthRoute)

  // If accessing protected route
  if (isProtectedRoute) {
    console.log('🔒 Accessing protected route')
    // No token, redirect to login
    if (!token) {
      console.log('❌ No token found, redirecting to login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify token
    console.log('🔍 Verifying token')
    const isValid = isValidToken(token)
    if (!isValid) {
      console.log('❌ Invalid token, redirecting to login')
      // Invalid token, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      
      // Clear invalid token
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      })
      
      return response
    }

    console.log('✅ Token valid, allowing access to protected route')
    // User is authenticated, allow access
    return NextResponse.next()
  }

  // If accessing auth route while logged in
  if (isAuthRoute && token) {
    console.log('🔄 Accessing auth route with token, checking validity')
    const isValid = isValidToken(token)
    if (isValid) {
      console.log('✅ Already logged in, redirecting to dashboard')
      // Already logged in, redirect to dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else {
      console.log('❌ Invalid token on auth route')
    }
  }

  console.log('🌐 Allowing access to public route')
  // Allow access to public routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}