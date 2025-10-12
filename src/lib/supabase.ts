import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Re-export types and utilities from client file
export type { User, Job, JobHistory } from './supabase-client'
export { JOB_STATUSES, JOB_PRIORITIES, getStatusColor, getPriorityColor } from './supabase-client'