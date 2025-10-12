-- Update database functions to use user-friendly status labels

-- Function to map status to user-friendly labels
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

-- Update the job history trigger function to use user-friendly labels
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