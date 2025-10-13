'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, FileText, Receipt, Search, Calendar, DollarSign, Filter, Eye, Download, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import DatabaseSetupNotice from '@/components/documents/DatabaseSetupNotice'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface Job {
  id: string
  tracking_id: string
  title: string
  client_name: string
  client_email: string
  client_phone: string
  status: string
  budget: number
  created_at: string
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

export default function DocumentsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')
  const [tableExists, setTableExists] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    document: Document | null
  }>({
    isOpen: false,
    document: null
  })

  // Handle download document
  const handleDownloadDocument = async (doc: Document) => {
    try {
      toast.loading('Mengunduh dokumen...', { id: 'download' })
      
      // Create a temporary link to download
      const response = await fetch(`/api/documents/${doc.id}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${doc.document_number}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Dokumen berhasil diunduh', { id: 'download' })
      } else {
        // Fallback: redirect to view page for manual download
        window.open(`/admin/documents/view/${doc.id}`, '_blank')
        toast.success('Membuka halaman dokumen', { id: 'download' })
      }
    } catch (error) {
      console.error('Error downloading document:', error)
      // Fallback: redirect to view page
      window.open(`/admin/documents/view/${doc.id}`, '_blank')
      toast.success('Membuka halaman dokumen', { id: 'download' })
    }
  }

  // Handle delete document
  const handleDeleteDocument = (doc: Document) => {
    setDeleteDialog({
      isOpen: true,
      document: doc
    })
  }

  const confirmDeleteDocument = async () => {
    if (!deleteDialog.document) return

    try {
      toast.loading('Menghapus dokumen...', { id: 'delete' })
      
      const response = await fetch(`/api/documents/${deleteDialog.document.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove document from state
        setDocuments(prev => prev.filter(d => d.id !== deleteDialog.document!.id))
        toast.success('Dokumen berhasil dihapus', { id: 'delete' })
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Gagal menghapus dokumen', { id: 'delete' })
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      toast.error('Terjadi kesalahan saat menghapus dokumen', { id: 'delete' })
    }
  }

  // Fetch jobs and documents
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch jobs
        const jobsResponse = await fetch('/api/jobs')
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json()
          setJobs(jobsData.data || [])
        }

        // Fetch documents and check if table exists
        const documentsResponse = await fetch('/api/documents')
        if (documentsResponse.ok) {
          const documentsData = await documentsResponse.json()
          setDocuments(documentsData.data || [])
          setTableExists(true)
        } else {
          // Check if it's a table not found error
          try {
            const errorData = await documentsResponse.json()
            if (errorData.error && (errorData.error.includes('relation "public.documents" does not exist') || errorData.error.includes('PGRST205'))) {
              setTableExists(false)
            } else {
              setTableExists(true) // Table exists but other error occurred
              console.error('Documents API error:', errorData)
            }
          } catch (parseError) {
            setTableExists(true) // Assume table exists if we can't parse error
            console.error('Error parsing documents response:', parseError)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Check if error is related to missing table
        if (error instanceof Error && (error.message.includes('relation "public.documents" does not exist') || error.message.includes('PGRST205'))) {
          setTableExists(false)
        } else {
          setTableExists(true) // Assume table exists for other errors
          toast.error('Gagal memuat data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.tracking_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter documents based on type
  const filteredDocuments = documents.filter(doc => {
    if (filterType && filterType !== 'all' && filterType !== '' && doc.type !== filterType) {
      return false
    }
    
    // Filter by search term if provided
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        doc.description?.toLowerCase().includes(searchLower) ||
        doc.jobs?.title?.toLowerCase().includes(searchLower) ||
        doc.jobs?.client_name?.toLowerCase().includes(searchLower) ||
        doc.document_number?.toLowerCase().includes(searchLower)
      )
    }
    
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    )
  }

  // Show database setup notice if table doesn't exist
  if (!tableExists) {
    return <DatabaseSetupNotice />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kelola Dokumen
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Buat dan kelola invoice serta receipt untuk proyek
          </p>
        </div>
        
        <Link
          href="/admin/documents/create"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Buat Dokumen
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoice</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {documents.filter(d => d.type === 'invoice').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Receipt</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {documents.filter(d => d.type === 'receipt').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Nilai</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                Rp {documents.reduce((sum, d) => sum + d.amount, 0).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari proyek..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'invoice' | 'receipt')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Semua Dokumen</option>
            <option value="invoice">Invoice</option>
            <option value="receipt">Receipt</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Proyek Tersedia
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Pilih proyek untuk membuat dokumen invoice atau receipt
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Proyek
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Klien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Tidak ada proyek ditemukan</p>
                      <p className="text-sm">
                        {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Belum ada proyek yang tersedia'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {job.tracking_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{job.client_name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{job.client_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        job.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : job.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {job.status === 'completed' ? 'Selesai' : 
                         job.status === 'in_progress' ? 'Berlangsung' : 
                         job.status === 'pending' ? 'Menunggu' : job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      Rp {job.budget?.toLocaleString('id-ID') || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/documents/create?job_id=${job.id}`}
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <Plus className="w-4 h-4" />
                        Buat Dokumen
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Documents */}
      {documents.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Dokumen Terbaru
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Dokumen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Klien
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tipe Pembayaran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {doc.type === 'invoice' ? (
                          <FileText className="w-5 h-5 text-blue-500 mr-3" />
                        ) : (
                          <Receipt className="w-5 h-5 text-green-500 mr-3" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {doc.description}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              doc.type === 'invoice' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' 
                                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            }`}>
                              {doc.type === 'invoice' ? 'Invoice' : 'Receipt'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              #{doc.document_number}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {doc.jobs.client_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                        {doc.payment_type === 'dp' ? 'DP' : 
                         doc.payment_type === 'pelunasan' ? 'Pelunasan' : 'Cicilan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      Rp {doc.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(doc.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/documents/view/${doc.id}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                          Lihat
                        </Link>
                        <button
                          onClick={() => handleDownloadDocument(doc)}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Menampilkan {filteredJobs.length} dari {jobs.length} proyek
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, document: null })}
        onConfirm={confirmDeleteDocument}
        title="Hapus Dokumen"
        message={`Apakah Anda yakin ingin menghapus dokumen ${deleteDialog.document?.document_number}? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}