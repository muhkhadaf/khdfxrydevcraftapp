'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, CheckCircle, Circle, Edit, Trash2, Calendar, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, subDays, isToday, isPast, isFuture } from 'date-fns'
import { id } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface Job {
  id: string
  tracking_id: string
  title: string
  client_name: string
  status: string
  priority: string
  estimated_completion_date?: string
}

interface Todo {
  id: string
  title: string
  description: string | null
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  job_id?: string
  job?: Job
  created_at: string
  updated_at: string
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'completed' | 'pending'>('all')
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    job_id: ''
  })

  // Fetch todos
  const fetchTodos = async (date?: Date) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      // Add date filter
      if (date) {
        params.append('date', format(date, 'yyyy-MM-dd'))
      }
      
      if (filterCompleted !== 'all') {
        params.append('completed', filterCompleted === 'completed' ? 'true' : 'false')
      }
      
      if (filterPriority !== 'all') {
        params.append('priority', filterPriority)
      }

      const response = await fetch(`/api/todos?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setTodos(result.todos)
      } else {
        toast.error('Gagal memuat daftar pekerjaan')
      }
    } catch (error) {
      console.error('Error fetching todos:', error)
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch available jobs
  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/todos/jobs')
      const data = await response.json()
      
      if (data.jobs) {
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  // Create or update todo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Judul pekerjaan harus diisi')
      return
    }

    try {
      const url = editingTodo ? `/api/todos/${editingTodo.id}` : '/api/todos'
      const method = editingTodo ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(editingTodo ? 'Pekerjaan berhasil diperbarui' : 'Pekerjaan berhasil ditambahkan')
        setFormData({ title: '', description: '', priority: 'medium', due_date: format(new Date(), 'yyyy-MM-dd'), job_id: '' })
        setShowAddForm(false)
        setEditingTodo(null)
        fetchTodos(selectedDate)
      } else {
        toast.error(result.error || 'Gagal menyimpan pekerjaan')
      }
    } catch (error) {
      console.error('Error saving todo:', error)
      toast.error('Terjadi kesalahan saat menyimpan')
    }
  }

  // Toggle todo completion
  const toggleCompletion = async (todo: Todo) => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(todo.completed ? 'Pekerjaan ditandai belum selesai' : 'Pekerjaan ditandai selesai')
        fetchTodos(selectedDate)
      } else {
        toast.error('Gagal memperbarui status pekerjaan')
      }
    } catch (error) {
      console.error('Error toggling todo:', error)
      toast.error('Terjadi kesalahan')
    }
  }

  // Delete todo
  const deleteTodo = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pekerjaan ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Pekerjaan berhasil dihapus')
        fetchTodos(selectedDate)
      } else {
        toast.error('Gagal menghapus pekerjaan')
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
      toast.error('Terjadi kesalahan saat menghapus')
    }
  }

  // Edit todo
  const startEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setFormData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      due_date: todo.due_date ? format(new Date(todo.due_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      job_id: todo.job_id || ''
    })
    setShowAddForm(true)
  }

  // Cancel edit
  const cancelEdit = () => {
    setEditingTodo(null)
    setFormData({ title: '', description: '', priority: 'medium', due_date: format(new Date(), 'yyyy-MM-dd'), job_id: '' })
    setShowAddForm(false)
  }

  // Filter todos based on search term
  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Priority colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Tinggi'
      case 'medium': return 'Sedang'
      case 'low': return 'Rendah'
      default: return priority
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTodos(selectedDate), fetchJobs()])
    }
    loadData()
  }, [selectedDate, filterCompleted, filterPriority])

  // Date navigation functions
  const goToPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1))
  }

  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1))
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const getDateStatus = (date: Date) => {
    if (isToday(date)) return 'today'
    if (isPast(date)) return 'past'
    if (isFuture(date)) return 'future'
    return 'today'
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Daftar Pekerjaan Harian
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kelola dan pantau pekerjaan harian Anda
        </p>
      </div>

      {/* Date Navigation */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousDay}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Hari Sebelumnya
          </button>
          
          <div className="text-center">
            <h2 className={`text-xl font-semibold ${
              getDateStatus(selectedDate) === 'today' ? 'text-blue-600 dark:text-blue-400' :
              getDateStatus(selectedDate) === 'past' ? 'text-gray-500 dark:text-gray-400' :
              'text-green-600 dark:text-green-400'
            }`}>
              {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: id })}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {getDateStatus(selectedDate) === 'today' && 'Hari Ini'}
              {getDateStatus(selectedDate) === 'past' && 'Hari yang Sudah Berlalu'}
              {getDateStatus(selectedDate) === 'future' && 'Hari yang Akan Datang'}
            </p>
          </div>
          
          <button
            onClick={goToNextDay}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Hari Berikutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {!isToday(selectedDate) && (
          <div className="text-center mt-4">
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Kembali ke Hari Ini
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari pekerjaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Pekerjaan
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterCompleted}
              onChange={(e) => setFilterCompleted(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Belum Selesai</option>
              <option value="completed">Selesai</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Semua Prioritas</option>
              <option value="high">Prioritas Tinggi</option>
              <option value="medium">Prioritas Sedang</option>
              <option value="low">Prioritas Rendah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingTodo ? 'Edit Pekerjaan' : 'Tambah Pekerjaan Baru'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Judul Pekerjaan *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Masukkan judul pekerjaan"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Masukkan deskripsi pekerjaan"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pekerjaan (Opsional)
              </label>
              <select
                value={formData.job_id}
                onChange={(e) => setFormData({ ...formData, job_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Pilih pekerjaan...</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.client_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prioritas
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Rendah</option>
                  <option value="medium">Sedang</option>
                  <option value="high">Tinggi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal Target
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {editingTodo ? 'Perbarui' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Memuat data...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Tidak ada pekerjaan yang sesuai dengan pencarian' : 'Belum ada pekerjaan'}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all ${
                todo.completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleCompletion(todo)}
                  className="mt-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        todo.completed 
                          ? 'line-through text-gray-500 dark:text-gray-400' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`text-sm mt-1 ${
                          todo.completed 
                            ? 'line-through text-gray-400 dark:text-gray-500' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {todo.description}
                        </p>
                      )}
                      {todo.job && (
                        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                          📋 {todo.job.title} - {todo.job.client_name}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(todo.priority)}`}>
                        {getPriorityText(todo.priority)}
                      </span>
                      <button
                        onClick={() => startEdit(todo)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {todo.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Target: {formatDate(todo.due_date)}</span>
                      </div>
                    )}
                    <span>Dibuat: {formatDate(todo.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}