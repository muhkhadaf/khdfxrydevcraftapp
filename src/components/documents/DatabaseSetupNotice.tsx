'use client'

import { useState } from 'react'
import { AlertTriangle, Copy, CheckCircle, ExternalLink } from 'lucide-react'

export default function DatabaseSetupNotice() {
  const [copied, setCopied] = useState(false)

  const sqlScript = `-- Create documents table for invoices and receipts
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
  FOR DELETE USING (true);`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Database Setup Required
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              Tabel <code className="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded text-sm">documents</code> belum ada di database. 
              Silakan jalankan script SQL berikut di Supabase dashboard untuk membuat tabel yang diperlukan.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Langkah-langkah Setup:
        </h4>
        
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-6">
          <li>Buka Supabase Dashboard</li>
          <li>Navigasi ke <strong>SQL Editor</strong></li>
          <li>Buat query baru</li>
          <li>Copy dan paste script SQL di bawah ini</li>
          <li>Jalankan script dengan menekan tombol <strong>Run</strong></li>
          <li>Refresh halaman ini setelah script berhasil dijalankan</li>
        </ol>

        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white">
              SQL Script:
            </h5>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy SQL</span>
                </>
              )}
            </button>
          </div>
          
          <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm overflow-x-auto">
            <code className="text-gray-800 dark:text-gray-200">
              {sqlScript}
            </code>
          </pre>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Refresh Halaman
          </button>
          
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Buka Supabase Dashboard</span>
          </a>
        </div>
      </div>
    </div>
  )
}