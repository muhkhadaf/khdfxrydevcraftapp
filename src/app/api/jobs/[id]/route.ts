import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import { JOB_STATUSES } from '@/lib/supabase-client'
import { cookies } from 'next/headers'

// GET /api/jobs/[id] - Get single job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const jobId = params.id

    // Get job by ID with history
    const { data: job, error } = await supabaseAdmin
      .from('jobs')
      .select(`
        *,
        job_history (
          id,
          status,
          estimated_completion_date,
          notes,
          status_note,
          created_at,
          changed_by
        )
      `)
      .eq('id', jobId)
      .single()

    if (error) {
      console.error('Error fetching job:', error)
      return NextResponse.json(
        { success: false, error: 'Pekerjaan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Sort job history by created_at descending
    if (job.job_history) {
      job.job_history.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }

    return NextResponse.json({
      success: true,
      data: job
    })

  } catch (error) {
    console.error('Error in job detail API:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// PUT /api/jobs/[id] - Update job
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const jobId = params.id
    const body = await request.json()

    // Check if this is a status update (has status_note) or full job update
    const isStatusUpdate = 'status_note' in body

    if (isStatusUpdate) {
      // Handle status update with history
      const { status, estimated_completion_date, status_note } = body

      if (!status_note?.trim()) {
        return NextResponse.json(
          { success: false, error: 'Status note harus diisi' },
          { status: 400 }
        )
      }

      // Get current job data
      const { data: currentJob, error: fetchError } = await supabaseAdmin
        .from('jobs')
        .select('status, estimated_completion_date')
        .eq('id', jobId)
        .single()

      if (fetchError) {
        return NextResponse.json(
          { success: false, error: 'Pekerjaan tidak ditemukan' },
          { status: 404 }
        )
      }

      // Update job
      const { data: job, error: updateError } = await supabaseAdmin
        .from('jobs')
        .update({
          status,
          estimated_completion_date: estimated_completion_date || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating job:', updateError)
        return NextResponse.json(
          { success: false, error: 'Gagal memperbarui pekerjaan' },
          { status: 500 }
        )
      }

      // Create history record with user-friendly status labels
      const oldStatusLabel = JOB_STATUSES[currentJob.status as keyof typeof JOB_STATUSES] || currentJob.status
      const newStatusLabel = JOB_STATUSES[status as keyof typeof JOB_STATUSES] || status
      
      let historyNote = ''
      if (currentJob.status !== status) {
        historyNote = `Status diubah dari ${oldStatusLabel} ke ${newStatusLabel}`
      } else if (currentJob.estimated_completion_date !== (estimated_completion_date || null)) {
        historyNote = 'Estimasi penyelesaian diubah'
      } else {
        historyNote = 'Pekerjaan diperbarui'
      }

      const { error: historyError } = await supabaseAdmin
        .from('job_history')
        .insert({
          job_id: jobId,
          status,
          estimated_completion_date: estimated_completion_date || null,
          notes: historyNote,
          status_note,
          changed_by: user.id
        })

      if (historyError) {
        console.error('Error creating job history:', historyError)
        // Don't fail the request if history creation fails
      }

      return NextResponse.json({
        success: true,
        data: job
      })

    } else {
      // Handle full job update
      const {
        title,
        description,
        client_name,
        client_email,
        client_phone,
        status,
        priority,
        estimated_completion_date,
        budget
      } = body

      const { data: job, error } = await supabaseAdmin
        .from('jobs')
        .update({
          title,
          description,
          client_name,
          client_email,
          client_phone,
          status,
          priority,
          estimated_completion_date: estimated_completion_date || null,
          budget: budget || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .select()
        .single()

      if (error) {
        console.error('Error updating job:', error)
        return NextResponse.json(
          { success: false, error: 'Gagal memperbarui pekerjaan' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: job
      })
    }

  } catch (error) {
    console.error('Error in update job API:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// DELETE /api/jobs/[id] - Delete job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { error } = await supabaseAdmin
      .from('jobs')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Delete job error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete job' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    })
  } catch (error) {
    console.error('Delete job API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}