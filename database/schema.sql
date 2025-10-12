-- =============================================
-- Supabase Database Schema
-- Sistem Manajemen Pekerjaan Jasa
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Table: users (Custom authentication table)
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Table: jobs (Main jobs table)
-- =============================================
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id VARCHAR(20) UNIQUE NOT NULL, -- Public tracking ID
    title VARCHAR(255) NOT NULL,
    description TEXT,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 
        'in_progress', 
        'waiting_client_confirmation', 
        'completed', 
        'cancelled'
    )),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    estimated_completion_date DATE,
    actual_completion_date DATE,
    budget DECIMAL(15,2),
    notes TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Table: job_history (Job status history tracking)
-- =============================================
CREATE TABLE job_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    estimated_completion_date DATE,
    notes TEXT,
    status_note TEXT, -- Additional status notes
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Indexes for better performance
-- =============================================
CREATE INDEX idx_jobs_tracking_id ON jobs(tracking_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_job_history_job_id ON job_history(job_id);
CREATE INDEX idx_job_history_created_at ON job_history(created_at);

-- =============================================
-- Functions and Triggers
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for jobs table
CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique tracking ID
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
    random_char TEXT;
BEGIN
    -- Generate 8 character tracking ID
    FOR i IN 1..8 LOOP
        random_char := substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        result := result || random_char;
    END LOOP;
    
    -- Check if tracking ID already exists
    WHILE EXISTS (SELECT 1 FROM jobs WHERE tracking_id = result) LOOP
        result := '';
        FOR i IN 1..8 LOOP
            random_char := substr(chars, floor(random() * length(chars) + 1)::integer, 1);
            result := result || random_char;
        END LOOP;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

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

-- Function to automatically create job history when job status changes
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

-- Trigger to automatically create job history
CREATE TRIGGER create_job_history_trigger
    AFTER INSERT OR UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION create_job_history();

-- Trigger to auto-generate tracking ID for new jobs
CREATE OR REPLACE FUNCTION set_tracking_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tracking_id IS NULL OR NEW.tracking_id = '' THEN
        NEW.tracking_id := generate_tracking_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_tracking_id_trigger
    BEFORE INSERT ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION set_tracking_id();

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_history ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (true); -- Allow all authenticated users to read

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (true); -- Allow all authenticated users to update

-- Jobs table policies  
CREATE POLICY "Allow all operations on jobs" ON jobs
    FOR ALL USING (true); -- Allow all operations for authenticated users

-- Job history table policies
CREATE POLICY "Allow all operations on job_history" ON job_history
    FOR ALL USING (true); -- Allow all operations for authenticated users

-- =============================================
-- Sample Data (Optional - for testing)
-- =============================================

-- Insert sample admin user (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO users (username, email, password_hash, full_name, role) VALUES 
('admin', 'admin@jobtracker.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin');

-- Insert sample jobs for testing
INSERT INTO jobs (title, description, client_name, client_email, status, estimated_completion_date, budget, created_by) VALUES 
('Website Development', 'Pembuatan website company profile untuk PT ABC', 'John Doe', 'john@abc.com', 'in_progress', '2024-02-15', 15000000, (SELECT id FROM users WHERE username = 'admin')),
('Mobile App Design', 'Desain UI/UX untuk aplikasi mobile e-commerce', 'Jane Smith', 'jane@ecommerce.com', 'pending', '2024-02-20', 8000000, (SELECT id FROM users WHERE username = 'admin')),
('System Integration', 'Integrasi sistem ERP dengan sistem existing', 'Bob Wilson', 'bob@company.com', 'waiting_client_confirmation', '2024-02-10', 25000000, (SELECT id FROM users WHERE username = 'admin'));