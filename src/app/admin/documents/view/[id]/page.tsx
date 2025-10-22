'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, Eye, FileText, Receipt, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import DocumentPDF from '@/components/documents/DocumentPDF'
import { usePDFExport } from '@/hooks/usePDFExport'

interface Job {
  id: string
  tracking_id: string
  title: string
  client_name: string
  client_email: string
  client_phone: string
  client_address: string
  status: string
  budget: number
  created_at: string
}

interface CompanySettings {
  id?: string
  company_name: string
  company_description: string
  email: string
  phone: string
  address: string
  website: string
  bank_name: string
  account_number: string
  account_holder: string
  logo_url: string
  tax_number: string
  business_license: string
  created_at?: string
  updated_at?: string
}

interface Document {
  id: string
  job_id: string
  document_number: string
  type: 'invoice' | 'receipt'
  payment_type: 'dp' | 'pelunasan' | 'cicilan'
  amount: number
  description: string
  due_date: string | null
  payment_method: 'transfer' | 'cash' | 'card'
  bank_name: string | null
  account_number: string | null
  account_holder: string | null
  notes: string | null
  status: string
  created_at: string
  updated_at: string
  jobs: Job
}

export default function ViewDocumentPage() {
  const params = useParams()
  const router = useRouter()
  const [document, setDocument] = useState<Document | null>(null)
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const pdfRef = useRef<HTMLDivElement>(null)
  const { exportToPDF, exportToPNG } = usePDFExport()

  const documentId = params.id as string

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch document
        const documentResponse = await fetch(`/api/documents/${documentId}`)
        if (documentResponse.ok) {
          const documentData = await documentResponse.json()
          setDocument(documentData.data)
        } else {
          toast.error('Dokumen tidak ditemukan')
          router.push('/admin/documents')
          return
        }

        // Fetch company settings
        const companyResponse = await fetch('/api/company-settings')
        if (companyResponse.ok) {
          const companyData = await companyResponse.json()
          setCompanySettings(companyData.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Gagal memuat data')
        router.push('/admin/documents')
      } finally {
        setLoading(false)
      }
    }

    if (documentId) {
      fetchData()
    }
  }, [documentId, router])

  const handleDownloadPDF = async () => {
    if (!document || !pdfRef.current) return

    try {
      setIsExporting(true)
      await exportToPDF(pdfRef.current, {
        filename: `${document.document_number}.pdf`,
        quality: 1.0,
        format: 'a4',
        orientation: 'portrait'
      })
      toast.success('PDF berhasil diunduh!')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Gagal mengunduh PDF')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadPNG = async () => {
    if (!document || !pdfRef.current) return

    try {
      setIsExporting(true)
      await exportToPNG(pdfRef.current, {
        filename: `${document.document_number}.png`,
        quality: 1.0
      })
      toast.success('PNG berhasil diunduh!')
    } catch (error) {
      console.error('Error exporting PNG:', error)
      toast.error('Gagal mengunduh PNG')
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat dokumen...</p>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Dokumen tidak ditemukan
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Dokumen yang Anda cari tidak dapat ditemukan atau telah dihapus.
        </p>
        <button
          onClick={() => router.push('/admin/documents')}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dokumen
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/documents')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              {document.type === 'invoice' ? (
                <FileText className="w-5 h-5 text-blue-500" />
              ) : (
                <Receipt className="w-5 h-5 text-green-500" />
              )}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {document.type === 'invoice' ? 'Invoice' : 'Receipt'} #{document.document_number}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {document.jobs.title} - {document.jobs.client_name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Mengunduh...' : 'Download PDF'}
          </button>
          <button
            onClick={handleDownloadPNG}
            disabled={isExporting}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Image className="w-4 h-4" />
            {isExporting ? 'Mengunduh...' : 'Download PNG'}
          </button>
        </div>
      </div>

      {/* Document Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nomor Dokumen
            </label>
            <p className="text-gray-900 dark:text-white font-mono">
              {document.document_number}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipe Pembayaran
            </label>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
              {document.payment_type === 'dp' ? 'DP' : 
               document.payment_type === 'pelunasan' ? 'Pelunasan' : 'Cicilan'}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jumlah
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Rp {document.amount.toLocaleString('id-ID')}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tanggal Dibuat
            </label>
            <p className="text-gray-900 dark:text-white">
              {new Date(document.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Document Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Pratinjau Dokumen
          </h3>
        </div>
        
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <DocumentPDF
              ref={pdfRef}
              job={document.jobs}
              document={{
                type: document.type,
                payment_type: document.payment_type,
                amount: document.amount,
                description: document.description,
                due_date: document.due_date || undefined,
                payment_method: document.payment_method,
                bank_name: document.bank_name || undefined,
                account_number: document.account_number || undefined,
                account_holder: document.account_holder || undefined,
                notes: document.notes || undefined
              }}
              companySettings={companySettings || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}