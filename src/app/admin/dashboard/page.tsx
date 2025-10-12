'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  TrendingUp,
  Calendar,
  Users,
  ArrowRight,
  User,
  DollarSign
} from 'lucide-react'
import { Job, JOB_STATUSES, getStatusColor } from '@/lib/supabase-client'

interface DashboardStats {
  totalJobs: number
  pendingJobs: number
  inProgressJobs: number
  completedJobs: number
  recentJobs: Job[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    pendingJobs: 0,
    inProgressJobs: 0,
    completedJobs: 0,
    recentJobs: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch all jobs for statistics
      const response = await fetch('/api/jobs?limit=100')
      const result = await response.json()

      if (result.success) {
        const jobs = result.data as Job[]
        
        const dashboardStats: DashboardStats = {
          totalJobs: jobs.length,
          pendingJobs: jobs.filter(job => job.status === 'pending').length,
          inProgressJobs: jobs.filter(job => job.status === 'in_progress').length,
          completedJobs: jobs.filter(job => job.status === 'completed').length,
          recentJobs: jobs.slice(0, 5) // Get 5 most recent jobs
        }

        setStats(dashboardStats)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Pekerjaan',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Menunggu',
      value: stats.pendingJobs,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'Sedang Dikerjakan',
      value: stats.inProgressJobs,
      icon: AlertCircle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Selesai',
      value: stats.completedJobs,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-400">Memuat dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Selamat datang di sistem manajemen pekerjaan jasa
          </p>
        </div>
        
        <Link
          href="/admin/jobs/create"
          className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Tambah Pekerjaan</span>
          <span className="xs:hidden">Tambah</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                    {stat.title}
                  </p>
                  <p className={`text-xl sm:text-3xl font-bold ${stat.textColor} mt-1 sm:mt-2`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2`}>
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Jobs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Pekerjaan Terbaru
            </h2>
            <Link
              href="/admin/jobs"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm sm:text-base"
            >
              Lihat Semua
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {stats.recentJobs.length > 0 ? (
            stats.recentJobs.map((job) => (
              <div key={job.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                        {job.title}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)} self-start sm:self-auto`}>
                        {JOB_STATUSES[job.status]}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">{job.client_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>
                          {new Date(job.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {job.budget && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="truncate">
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                              notation: 'compact'
                            }).format(job.budget)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      className="inline-flex items-center gap-1 sm:gap-2 text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium"
                    >
                      <span className="hidden sm:inline">Lihat Detail</span>
                      <span className="sm:hidden">Detail</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 sm:p-12 text-center">
              <Briefcase className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                Belum ada pekerjaan
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                Mulai dengan menambahkan pekerjaan pertama Anda
              </p>
              <Link
                href="/admin/jobs/create"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Pekerjaan
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}