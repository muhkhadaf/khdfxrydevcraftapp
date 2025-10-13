import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      success: false,
      error: 'Please create the documents table manually in Supabase dashboard',
      instructions: [
        '1. Go to your Supabase dashboard',
        '2. Navigate to SQL Editor',
        '3. Run the SQL from create_documents_table.sql file',
        '4. Or copy the SQL from the response below'
      ],
      sql: `
-- Create documents table for invoices and receipts
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  document_number VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('invoice', 'receipt')),
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('dp', 'pelunasan', 'cicilan')),
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  due_date DATE,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('transfer', 'cash', 'card')),
  bank_name VARCHAR(100),
  account_number VARCHAR(50),
  account_holder VARCHAR(100),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_job_id ON documents(job_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_document_number ON documents(document_number);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_documents_updated_at ON documents;
CREATE TRIGGER trigger_update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();

-- Add RLS (Row Level Security) policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all documents" ON documents;
DROP POLICY IF EXISTS "Users can insert documents" ON documents;
DROP POLICY IF EXISTS "Users can update documents" ON documents;
DROP POLICY IF EXISTS "Users can delete documents" ON documents;

-- Policy for authenticated users to view all documents
CREATE POLICY "Users can view all documents" ON documents
  FOR SELECT USING (true);

-- Policy for authenticated users to insert documents
CREATE POLICY "Users can insert documents" ON documents
  FOR INSERT WITH CHECK (true);

-- Policy for authenticated users to update documents
CREATE POLICY "Users can update documents" ON documents
  FOR UPDATE USING (true);

-- Policy for authenticated users to delete documents
CREATE POLICY "Users can delete documents" ON documents
  FOR DELETE USING (true);
      `
    })

  } catch (error) {
    console.error('Error in migration endpoint:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}