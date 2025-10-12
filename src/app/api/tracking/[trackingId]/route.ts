import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

// Function to censor client name for privacy
function censorClientName(name: string): string {
  if (!name || name.length <= 2) return name
  
  // Show first character and last character, censor the middle
  if (name.length <= 4) {
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
  }
  
  // For longer names, show first 2 and last 1 characters
  return name.substring(0, 2) + '*'.repeat(name.length - 3) + name[name.length - 1]
}

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    const { trackingId } = params

    if (!trackingId) {
      return NextResponse.json({
        success: false,
        error: 'ID tracking diperlukan'
      }, { status: 400 })
    }

    // Get job data with history
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select(`
        id,
        tracking_id,
        title,
        description,
        client_name,
        status,
        priority,
        estimated_completion_date,
        budget,
        created_at,
        updated_at,
        job_history (
          id,
          status,
          estimated_completion_date,
          notes,
          status_note,
          created_at
        )
      `)
      .eq('tracking_id', trackingId.toUpperCase())
      .single()

    if (jobError || !job) {
      return NextResponse.json({
        success: false,
        error: 'Pekerjaan dengan ID tracking tersebut tidak ditemukan'
      }, { status: 404 })
    }

    // Sort history by created_at descending
    if (job.job_history) {
      job.job_history.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }

    // Censor sensitive information for public tracking
    const publicJob = {
      ...job,
      client_name: censorClientName(job.client_name),
      budget: undefined // Remove budget information from public view
    }

    return NextResponse.json({
      success: true,
      data: publicJob
    })

  } catch (error) {
    console.error('Error fetching job by tracking ID:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server'
    }, { status: 500 })
  }
}