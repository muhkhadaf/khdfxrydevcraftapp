import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  username: string
  email: string
  password_hash: string
  full_name: string
  role: 'admin' | 'super_admin'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  tracking_id: string
  title: string
  description?: string
  client_name: string
  client_email?: string
  client_phone?: string
  status: 'pending' | 'in_progress' | 'waiting_client_confirmation' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimated_completion_date?: string
  actual_completion_date?: string
  budget?: number
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface JobHistory {
  id: string
  job_id: string
  status: string
  estimated_completion_date?: string
  notes?: string
  status_note?: string
  changed_by?: string
  created_at: string
}

// Constants
export const JOB_STATUSES = {
  pending: 'Menunggu',
  in_progress: 'Sedang Dikerjakan',
  waiting_client_confirmation: 'Menunggu Konfirmasi Klien',
  completed: 'Selesai',
  cancelled: 'Dibatalkan'
} as const

export const JOB_PRIORITIES = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
  urgent: 'Mendesak'
} as const

// Utility functions
export function getStatusColor(status: Job['status']) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
    case 'waiting_client_confirmation':
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
  }
}

export function getPriorityColor(priority: Job['priority']) {
  switch (priority) {
    case 'low':
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
  }
}