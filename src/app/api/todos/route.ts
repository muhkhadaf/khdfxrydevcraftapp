import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const completed = searchParams.get('completed')
    const priority = searchParams.get('priority')
    const date = searchParams.get('date')
    const job_id = searchParams.get('job_id')

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

    let query = supabaseAdmin
      .from('todos')
      .select(`
        *,
        job:job_id (
          id,
          tracking_id,
          title,
          client_name,
          status,
          priority
        )
      `)
      .eq('created_by', authUser.id)
      .order('created_at', { ascending: true })

    // Apply filters
    if (completed !== null) {
      query = query.eq('completed', completed === 'true')
    }

    if (priority) {
      query = query.eq('priority', priority)
    }

    if (job_id) {
      query = query.eq('job_id', job_id)
    }

    if (date) {
      query = query.eq('due_date', date)
    }

    const { data: todos, error } = await query

    if (error) {
      console.error('Error fetching todos:', error)
      return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 })
    }

    return NextResponse.json({ success: true, todos })
  } catch (error) {
    console.error('Error in GET /api/todos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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

    // Validate required fields
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const todoData = {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      priority: body.priority || 'medium',
      due_date: body.due_date || null,
      job_id: body.job_id || null,
      created_by: authUser.id
    }

    const { data: todo, error } = await supabaseAdmin
      .from('todos')
      .insert([todoData])
      .select()
      .single()

    if (error) {
      console.error('Error creating todo:', error)
      return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
    }

    return NextResponse.json({ success: true, todo }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/todos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}