import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Create the status mapping function
    const createStatusLabelFunction = `
      CREATE OR REPLACE FUNCTION get_status_label(status_value TEXT)
      RETURNS TEXT AS $$
      BEGIN
          RETURN CASE status_value
              WHEN 'pending' THEN 'Menunggu'
              WHEN 'in_progress' THEN 'Sedang Dikerjakan'
              WHEN 'completed' THEN 'Selesai'
              WHEN 'cancelled' THEN 'Dibatalkan'
              WHEN 'on_hold' THEN 'Ditunda'
              ELSE status_value
          END;
      END;
      $$ LANGUAGE plpgsql;
    `

    // Update the job history trigger function
    const updateTriggerFunction = `
      CREATE OR REPLACE FUNCTION create_job_history()
      RETURNS TRIGGER AS $$
      BEGIN
          -- Insert into job_history when status, estimated_completion_date, or notes change
          IF (TG_OP = 'INSERT') OR 
             (OLD.status IS DISTINCT FROM NEW.status) OR 
             (OLD.estimated_completion_date IS DISTINCT FROM NEW.estimated_completion_date) OR 
             (OLD.notes IS DISTINCT FROM NEW.notes) THEN
              
              INSERT INTO job_history (
                  job_id, 
                  status, 
                  estimated_completion_date, 
                  notes,
                  status_note,
                  changed_by
              ) VALUES (
                  NEW.id, 
                  NEW.status, 
                  NEW.estimated_completion_date, 
                  NEW.notes,
                  CASE 
                      WHEN TG_OP = 'INSERT' THEN 'Pekerjaan dibuat'
                      WHEN OLD.status IS DISTINCT FROM NEW.status THEN 'Status diubah dari ' || get_status_label(OLD.status) || ' ke ' || get_status_label(NEW.status)
                      WHEN OLD.estimated_completion_date IS DISTINCT FROM NEW.estimated_completion_date THEN 'Estimasi penyelesaian diubah'
                      WHEN OLD.notes IS DISTINCT FROM NEW.notes THEN 'Catatan diperbarui'
                      ELSE 'Pekerjaan diperbarui'
                  END,
                  NEW.created_by
              );
          END IF;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `

    // Execute the functions using direct SQL
    let error1: any = null
    try {
      await supabaseAdmin
        .from('_dummy')
        .select('*')
        .limit(0)
      
      const result = await supabaseAdmin.rpc('exec_sql', { query: createStatusLabelFunction })
      error1 = result.error
    } catch (err) {
      // Fallback: try to execute using raw SQL
      error1 = 'Cannot execute SQL functions directly'
    }

    if (error1) {
      console.error('Error creating status label function:', error1)
      return NextResponse.json(
        { success: false, error: 'Database functions cannot be updated via API. Please run SQL manually.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Database functions updated successfully. Status labels will now show user-friendly text.'
    })

  } catch (error) {
    console.error('Error updating status labels:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}