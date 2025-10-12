import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from './supabase'
import type { User } from './supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthUser {
  id: string
  username: string
  email: string
  full_name: string
  role: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  token?: string
  error?: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  console.log('🔑 Generating token for user:', user.username)
  console.log('JWT_SECRET available for generation:', !!JWT_SECRET)
  console.log('JWT_SECRET length for generation:', JWT_SECRET.length)
  
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  
  console.log('✅ Token generated:', token.substring(0, 20) + '...')
  return token
}

// Verify JWT token
export function verifyToken(token: string): AuthUser | null {
  try {
    console.log('🔐 Verifying token:', token.substring(0, 20) + '...')
    console.log('JWT_SECRET available:', !!JWT_SECRET)
    console.log('JWT_SECRET length:', JWT_SECRET.length)
    
    const decoded = jwt.verify(token, JWT_SECRET) as any
    console.log('✅ Token decoded successfully:', {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role
    })
    
    return {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      full_name: decoded.full_name || '',
      role: decoded.role
    }
  } catch (error) {
    console.error('❌ Token verification failed:', error)
    console.error('Error message:', (error as Error).message)
    return null
  }
}

// Login user
export async function loginUser(username: string, password: string): Promise<AuthResponse> {
  try {
    // Get user from database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single()

    if (error || !user) {
      return {
        success: false,
        error: 'Username atau password salah'
      }
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Username atau password salah'
      }
    }

    // Create auth user object
    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    }

    // Generate token
    const token = generateToken(authUser)

    return {
      success: true,
      user: authUser,
      token
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat login'
    }
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

// Create new user (for seeding)
export async function createUser(userData: {
  username: string
  email: string
  password: string
  full_name: string
  role?: 'admin' | 'super_admin'
}): Promise<AuthResponse> {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .or(`username.eq.${userData.username},email.eq.${userData.email}`)
      .single()

    if (existingUser) {
      return {
        success: false,
        error: 'Username atau email sudah digunakan'
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    // Insert user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        username: userData.username,
        email: userData.email,
        password_hash: hashedPassword,
        full_name: userData.full_name,
        role: userData.role || 'admin'
      })
      .select()
      .single()

    if (error || !user) {
      return {
        success: false,
        error: 'Gagal membuat user'
      }
    }

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    }

    return {
      success: true,
      user: authUser
    }
  } catch (error) {
    console.error('Create user error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat membuat user'
    }
  }
}

// Update user password
export async function updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await hashPassword(newPassword)
    
    const { error } = await supabaseAdmin
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('id', userId)

    return !error
  } catch (error) {
    console.error('Update password error:', error)
    return false
  }
}