// Re-export types from supabase lib
export type { User, Job, JobHistory } from '@/lib/supabase'

// Import types for use in interfaces
import type { Job, JobHistory } from '@/lib/supabase'

// Additional types for forms and API responses
export interface LoginCredentials {
  username: string
  password: string
}

export interface CreateJobData {
  title: string
  description?: string
  client_name: string
  client_email?: string
  client_phone?: string
  priority: Job['priority']
  estimated_completion_date?: string
  budget?: number
  notes?: string
}

export interface UpdateJobData extends Partial<CreateJobData> {
  status?: Job['status']
  actual_completion_date?: string
}

export interface JobWithHistory extends Job {
  history: JobHistory[]
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  status?: Job['status']
  priority?: Job['priority']
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined
}

// Dashboard stats
export interface DashboardStats {
  totalJobs: number
  pendingJobs: number
  inProgressJobs: number
  completedJobs: number
  recentJobs: Job[]
}