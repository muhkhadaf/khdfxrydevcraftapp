import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
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

    const { data: todo, error } = await supabaseAdmin
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('created_by', authUser.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
      }
      console.error('Error fetching todo:', error)
      return NextResponse.json({ error: 'Failed to fetch todo' }, { status: 500 })
    }

    return NextResponse.json({ success: true, todo })
  } catch (error) {
    console.error('Error in GET /api/todos/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
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

    // Validate input only if title is provided (for full updates)
    if (body.title !== undefined && (!body.title || body.title.trim() === '')) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Only update fields that are provided
    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.description !== undefined) updateData.description = body.description || null
    if (body.completed !== undefined) updateData.completed = body.completed
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.due_date !== undefined) updateData.due_date = body.due_date || null
    if (body.job_id !== undefined) updateData.job_id = body.job_id || null

    const { data: todo, error } = await supabaseAdmin
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .eq('created_by', authUser.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, todo })
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
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

    const { error } = await supabaseAdmin
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('created_by', authUser.id)

    if (error) {
      console.error('Error deleting todo:', error)
      return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Todo deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/todos/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}