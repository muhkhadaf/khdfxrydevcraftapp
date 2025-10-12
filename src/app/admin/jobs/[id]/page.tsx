'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  User, 
  DollarSign, 
  Clock,
  FileText,
  Phone,
  Mail,
  Save,
  AlertCircle
} from 'lucide-react'
import { Job, JobHistory, JOB_STATUSES, JOB_PRIORITIES, getStatusColor, getPriorityColor } from '@/lib/supabase-client'
import toast from 'react-hot-toast'

interface JobWithHistory extends Job {
  job_history: JobHistory[]
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobWithHistory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: '',
    estimated_completion_date: '',
    status_note: ''
  })

  useEffect(() => {
    if (params.id) {
      fetchJobDetail()
    }
  }, [params.id])

  const fetchJobDetail = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/jobs/${params.id}`)
      const result = await response.json()

      if (result.success) {
        setJob(result.data)
        setUpdateData({
          status: result.data.status,
          estimated_completion_date: result.data.estimated_completion_date || '',
          status_note: ''
        })
      } else {
        toast.error('Pekerjaan tidak ditemukan')
        router.push('/admin/jobs')
      }
    } catch (error) {
      console.error('Error fetching job detail:', error)
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!updateData.status_note.trim()) {
      toast.error('Status note harus diisi')
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: updateData.status,
          estimated_completion_date: updateData.estimated_completion_date || null,
          status_note: updateData.status_note
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Status pekerjaan berhasil diperbarui')
        setShowUpdateForm(false)
        setUpdateData(prev => ({ ...prev, status_note: '' }))
        fetchJobDetail() // Refresh data
      } else {
        toast.error(result.error || 'Gagal memperbarui status')
      }
    } catch (error) {
      console.error('Error updating job:', error)
      toast.error('Terjadi kesalahan saat memperbarui status')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-400">Memuat detail pekerjaan...</span>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Pekerjaan tidak ditemukan
        </h3>
        <Link
          href="/admin/jobs"
          className="text-primary-600 hover:text-primary-700"
        >
          Kembali ke daftar pekerjaan
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Link
              href="/admin/jobs"
              className="inline-flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Kembali ke Daftar</span>
              <span className="sm:hidden">Kembali</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white break-words">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
              {JOB_STATUSES[job.status]}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(job.priority)}`}>
              {JOB_PRIORITIES[job.priority]}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              ID: {job.tracking_id}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Update Status</span>
            <span className="xs:hidden">Update</span>
          </button>
          <Link
            href={`/admin/jobs/${job.id}/edit`}
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Edit Pekerjaan</span>
            <span className="xs:hidden">Edit</span>
          </Link>
        </div>
      </div>

      {/* Update Status Form */}
      {showUpdateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Update Status Pekerjaan
          </h2>

          <form onSubmit={handleUpdateSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {Object.entries(JOB_STATUSES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimasi Tanggal Selesai
                </label>
                <input
                  type="date"
                  value={updateData.estimated_completion_date}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, estimated_completion_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catatan Status *
              </label>
              <textarea
                value={updateData.status_note}
                onChange={(e) => setUpdateData(prev => ({ ...prev, status_note: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
                placeholder="Tambahkan catatan tentang perubahan status ini..."
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Update
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowUpdateForm(false)}
                className="inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Job Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Deskripsi Pekerjaan
            </h3>
            <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {job.description}
              </p>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Riwayat Status
            </h3>
            
            {job.job_history && job.job_history.length > 0 ? (() => {
              // Filter history to only show entries with notes or status_note
              const filteredHistory = job.job_history.filter(history => 
                history.notes || history.status_note
              )
              
              return filteredHistory.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {filteredHistory.map((history, index) => (
                    <div key={history.id} className="relative">
                      {index !== filteredHistory.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-600"></div>
                      )}
                      
                      <div className="flex gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(history.status as Job['status'])}`}>
                              {JOB_STATUSES[history.status as keyof typeof JOB_STATUSES]}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-900 dark:text-white mb-1 break-words">
                            {history.notes}
                          </p>
                          
                          {history.status_note && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 break-words">
                              {history.status_note}
                            </p>
                          )}
                          
                          {history.estimated_completion_date && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Estimasi selesai: {new Date(history.estimated_completion_date).toLocaleDateString('id-ID')}
                            </p>
                          )}
                          
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(history.created_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Belum ada riwayat status dengan keterangan
                  </p>
                </div>
              )
            })() : (
              <div className="text-center py-8">
                <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Belum ada riwayat status
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Job Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Detail Pekerjaan
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)} self-start sm:self-auto`}>
                  {JOB_STATUSES[job.status]}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Prioritas:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(job.priority)} self-start sm:self-auto`}>
                  {JOB_PRIORITIES[job.priority]}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Dibuat:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(job.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              {job.estimated_completion_date && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Estimasi Selesai:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(job.estimated_completion_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              
              {job.budget && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Anggaran:</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(job.budget)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Informasi Klien
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Nama:</span>
                <span className="text-sm text-gray-900 dark:text-white break-words">{job.client_name}</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Email:</span>
                <a 
                  href={`mailto:${job.client_email}`}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 break-all"
                >
                  {job.client_email}
                </a>
              </div>
              
              {job.client_phone && (
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Telepon:</span>
                  <a 
                    href={`tel:${job.client_phone}`}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 break-all"
                  >
                    {job.client_phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}