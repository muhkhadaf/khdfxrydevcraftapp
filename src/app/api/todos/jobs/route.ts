import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

// GET /api/todos/jobs - Get available jobs for todo selection
export async function GET(request: NextRequest) {
  try {
    // Get and verify token
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const authUser = verifyToken(token)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''

    // Build query for active jobs
    let query = supabaseAdmin
      .from('jobs')
      .select('id, tracking_id, title, client_name, status, priority, estimated_completion_date')
      .order('created_at', { ascending: false })

    // Filter by status if provided, default to active jobs
    if (status) {
      query = query.eq('status', status)
    } else {
      // Only show active jobs (not completed or cancelled)
      query = query.in('status', ['pending', 'in_progress', 'waiting_client_confirmation'])
    }

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,client_name.ilike.%${search}%,tracking_id.ilike.%${search}%`)
    }

    const { data: jobs, error } = await query

    if (error) {
      console.error('Error fetching jobs for todos:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error in GET /api/todos/jobs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}