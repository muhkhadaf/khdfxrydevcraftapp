import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

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

    // Get job history
    const { data: history, error } = await supabaseAdmin
      .from('job_history')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching job history:', error)
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil riwayat pekerjaan' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: history
    })

  } catch (error) {
    console.error('Error in job history API:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(
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
    const { status, estimated_completion_date, notes, status_note } = body

    // Validate required fields
    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status harus diisi' },
        { status: 400 }
      )
    }

    // Insert job history record
    const { data: historyData, error: historyError } = await supabaseAdmin
      .from('job_history')
      .insert({
        job_id: jobId,
        status,
        estimated_completion_date: estimated_completion_date || null,
        notes: notes || `Status diubah menjadi ${status}`,
        status_note: status_note || null,
        changed_by: user.id
      })
      .select()
      .single()

    if (historyError) {
      console.error('Error creating job history:', historyError)
      return NextResponse.json(
        { success: false, error: 'Gagal membuat riwayat pekerjaan' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: historyData
    })

  } catch (error) {
    console.error('Error in create job history API:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}