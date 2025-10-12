'use client'

import { useState } from 'react'
import { Search, Package, Calendar, User, DollarSign, Clock, CheckCircle, AlertCircle, XCircle, Code } from 'lucide-react'
import { Job, getStatusColor, getPriorityColor, JOB_STATUSES, JOB_PRIORITIES } from '@/lib/supabase-client'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface JobHistory {
  id: string
  status: string
  estimated_completion_date: string | null
  notes: string | null
  status_note: string | null
  created_at: string
}

interface JobWithHistory extends Job {
  job_history: JobHistory[]
}

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [job, setJob] = useState<JobWithHistory | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trackingId.trim()) {
      setError('Mohon masukkan ID tracking')
      return
    }

    setIsLoading(true)
    setError('')
    setJob(null)

    try {
      const response = await fetch(`/api/tracking/${trackingId.trim()}`)
      const result = await response.json()

      if (result.success) {
        setJob(result.data)
      } else {
        setError(result.error || 'Pekerjaan tidak ditemukan')
      }
    } catch (error) {
      console.error('Error tracking job:', error)
      setError('Terjadi kesalahan saat mencari pekerjaan')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'on_hold':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                khdfxryd devcraft
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Lacak Status Pekerjaan Anda
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Masukkan ID tracking untuk melihat status terkini pekerjaan Anda
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  placeholder="Masukkan ID Tracking (contoh: JOB001)"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                {isLoading ? 'Mencari...' : 'Cari'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm sm:text-base">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Job Details */}
        {job && (
          <div className="space-y-4 sm:space-y-6">
            {/* Job Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                      ID: {job.tracking_id}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      Dibuat: {formatDate(job.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(job.status)}`}>
                    {getStatusIcon(job.status)}
                    <span className="hidden sm:inline">{JOB_STATUSES[job.status as keyof typeof JOB_STATUSES]}</span>
                    <span className="sm:hidden">{JOB_STATUSES[job.status as keyof typeof JOB_STATUSES].split(' ')[0]}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPriorityColor(job.priority)}`}>
                    <span className="hidden sm:inline">{JOB_PRIORITIES[job.priority as keyof typeof JOB_PRIORITIES]}</span>
                    <span className="sm:hidden">{JOB_PRIORITIES[job.priority as keyof typeof JOB_PRIORITIES].split(' ')[0]}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Deskripsi</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                    {job.description}
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 block">Klien</span>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{job.client_name}</p>
                    </div>
                  </div>

                  {job.estimated_completion_date && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 block">Estimasi Selesai</span>
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                          {new Date(job.estimated_completion_date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {job.budget && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 block">Budget</span>
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                          {formatCurrency(job.budget)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job History */}
            {job.job_history && job.job_history.length > 0 && (() => {
              // Filter history to only show entries with notes or status_note
              const filteredHistory = job.job_history.filter(history => 
                history.notes || history.status_note
              )
              
              return filteredHistory.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    Riwayat Status
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {filteredHistory.map((history, index) => (
                    <div key={history.id} className="flex gap-3 sm:gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${getStatusColor(history.status as Job['status'])}`}>
                          {getStatusIcon(history.status as Job['status'])}
                        </div>
                        {index < filteredHistory.length - 1 && (
                          <div className="w-0.5 h-6 sm:h-8 bg-gray-200 dark:bg-gray-600 mt-2"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 pb-3 sm:pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(history.status as Job['status'])} w-fit`}>
                            {JOB_STATUSES[history.status as keyof typeof JOB_STATUSES]}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(history.created_at)}
                          </span>
                        </div>
                        
                        {history.status_note && (
                          <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm sm:text-base">
                            {history.status_note}
                          </p>
                        )}
                        
                        {history.notes && (
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Catatan: {history.notes}
                          </p>
                        )}
                        
                        {history.estimated_completion_date && (
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Estimasi selesai: {new Date(history.estimated_completion_date).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </main>
    </div>
  )
}