'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, FileText, Receipt, Download, Eye, CreditCard, Banknote, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import DocumentPDF from '@/components/documents/DocumentPDF'
import { usePDFExport } from '@/hooks/usePDFExport'
import DatabaseSetupNotice from '@/components/documents/DatabaseSetupNotice'
import BankAccountSelect from '@/components/BankAccountSelect'

interface Job {
  id: string
  tracking_id: string
  title: string
  client_name: string
  client_email: string
  client_phone: string
  client_address: string
  description: string
  budget: number
  status: string
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

interface BankAccount {
  id: string
  bank_name: string
  account_number: string
  account_holder: string
  account_type: string
  is_primary: boolean
  is_active: boolean
  notes?: string
}

interface DocumentFormData {
  job_id: string
  type: 'invoice' | 'receipt'
  payment_type: 'dp' | 'pelunasan' | 'cicilan'
  amount: number
  description: string
  due_date: string
  payment_method: 'transfer' | 'cash' | 'card'
  bank_account_id: string
  bank_name: string
  account_number: string
  account_holder: string
  notes: string
}

export default function CreateDocumentPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null)
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null)
  const [formData, setFormData] = useState<DocumentFormData>({
    job_id: '',
    type: 'invoice',
    payment_type: 'dp',
    amount: 0,
    description: '',
    due_date: '',
    payment_method: 'transfer',
    bank_account_id: '',
    bank_name: 'BCA',
    account_number: '1234567890',
    account_holder: 'khdfxryd devcraft',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewMode, setPreviewMode] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [tableExists, setTableExists] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()
  const jobIdParam = searchParams.get('job_id')
  const pdfRef = useRef<HTMLDivElement>(null)
  const { exportToPDF } = usePDFExport()

  // Fetch jobs and company settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs
        const response = await fetch('/api/jobs')
        const data = await response.json()
        
        if (response.ok) {
          setJobs(data.data || [])
          
          // Auto-select job if job_id is provided in URL
          if (jobIdParam) {
            const job = data.data?.find((j: Job) => j.id === jobIdParam)
            if (job) {
              setSelectedJob(job)
              setFormData(prev => ({
                ...prev,
                job_id: job.id,
                amount: job.budget * 0.5, // Default to 50% for DP
                description: `${formData.type === 'invoice' ? 'Invoice' : 'Receipt'} untuk proyek ${job.title}`
              }))
            }
          }
        } else {
          toast.error('Gagal memuat data proyek')
        }

        // Fetch company settings
        const companyResponse = await fetch('/api/company-settings')
        if (companyResponse.ok) {
          const companyData = await companyResponse.json()
          setCompanySettings(companyData.data)
        }

        // Check if documents table exists
        const documentsResponse = await fetch('/api/documents')
        if (documentsResponse.ok) {
          setTableExists(true)
        } else {
          const errorData = await documentsResponse.json()
          if (errorData.error && errorData.error.includes('documents')) {
            setTableExists(false)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        if (error instanceof Error && error.message.includes('documents')) {
          setTableExists(false)
        } else {
          toast.error('Terjadi kesalahan saat memuat data')
        }
      }
    }

    fetchData()
  }, [jobIdParam])

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Auto-update description when type or job changes
    if (name === 'type' || name === 'job_id') {
      const job = name === 'job_id' ? jobs.find(j => j.id === value) : selectedJob
      if (job) {
        const docType = name === 'type' ? value : formData.type
        setFormData(prev => ({
          ...prev,
          description: `${docType === 'invoice' ? 'Invoice' : 'Receipt'} untuk proyek ${job.title}`
        }))
      }
    }

    // Auto-calculate amount based on payment type
    if (name === 'payment_type' && selectedJob) {
      let amount = 0
      switch (value) {
        case 'dp':
          amount = selectedJob.budget * 0.5 // 50% for DP
          break
        case 'pelunasan':
          amount = selectedJob.budget
          break
        case 'cicilan':
          amount = selectedJob.budget * 0.25 // 25% for installment
          break
      }
      setFormData(prev => ({ ...prev, amount }))
    }
  }

  // Handle job selection
  const handleJobSelect = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId)
    if (job) {
      setSelectedJob(job)
      setFormData(prev => ({
        ...prev,
        job_id: jobId,
        amount: job.budget * 0.5,
        description: `${prev.type === 'invoice' ? 'Invoice' : 'Receipt'} untuk proyek ${job.title}`
      }))
    }
  }

  // Handle bank account selection
  const handleBankAccountSelect = (bankAccount: BankAccount | null) => {
    setSelectedBankAccount(bankAccount)
    if (bankAccount) {
      setFormData(prev => ({
        ...prev,
        bank_account_id: bankAccount.id,
        bank_name: bankAccount.bank_name,
        account_number: bankAccount.account_number,
        account_holder: bankAccount.account_holder
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        bank_account_id: '',
        bank_name: '',
        account_number: '',
        account_holder: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.job_id) {
      newErrors.job_id = 'Proyek wajib dipilih'
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Jumlah harus lebih dari 0'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi wajib diisi'
    }

    if (formData.type === 'invoice' && !formData.due_date) {
      newErrors.due_date = 'Tanggal jatuh tempo wajib diisi untuk invoice'
    }

    if (formData.payment_method === 'transfer') {
      if (!formData.bank_account_id) {
        newErrors.bank_account_id = 'Rekening bank wajib dipilih'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`${formData.type === 'invoice' ? 'Invoice' : 'Receipt'} berhasil dibuat!`)
        router.push('/admin/documents')
      } else {
        toast.error(data.error || 'Gagal membuat dokumen')
      }
    } catch (error) {
      console.error('Error creating document:', error)
      toast.error('Terjadi kesalahan saat membuat dokumen')
    } finally {
      setIsLoading(false)
    }
  }

  // Generate preview
  const generatePreview = () => {
    if (!selectedJob || !formData.amount) {
      toast.error('Pilih proyek dan isi jumlah terlebih dahulu')
      return
    }
    setPreviewMode(true)
  }

  // Download PDF
  const downloadPDF = async () => {
    if (!selectedJob || !formData.amount) {
      toast.error('Pilih proyek dan isi jumlah terlebih dahulu')
      return
    }

    if (!pdfRef.current) {
      toast.error('Dokumen tidak dapat diekspor')
      return
    }

    setIsExporting(true)

    try {
      const filename = `${formData.type}-${selectedJob.tracking_id}-${Date.now()}.pdf`
      await exportToPDF(pdfRef.current, {
        filename,
        quality: 1.0,
        format: 'a4',
        orientation: 'portrait'
      })
      toast.success('PDF berhasil diunduh!')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Gagal mengekspor PDF')
    } finally {
      setIsExporting(false)
    }
  }

  if (!tableExists) {
    return <DatabaseSetupNotice />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/documents"
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Buat Dokumen Baru
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Buat invoice atau receipt untuk proyek
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Jenis Dokumen *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.type === 'invoice' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="invoice"
                      checked={formData.type === 'invoice'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <FileText className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Invoice</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Tagihan pembayaran</div>
                    </div>
                  </label>
                  
                  <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.type === 'receipt' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="receipt"
                      checked={formData.type === 'receipt'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Receipt className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Receipt</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Bukti pembayaran</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Project Selection */}
              <div>
                <label htmlFor="job_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pilih Proyek *
                </label>
                <select
                  id="job_id"
                  name="job_id"
                  value={formData.job_id}
                  onChange={(e) => {
                    handleChange(e)
                    handleJobSelect(e.target.value)
                  }}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.job_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Pilih proyek...</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.client_name} (Rp {job.budget?.toLocaleString('id-ID')})
                    </option>
                  ))}
                </select>
                {errors.job_id && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.job_id}</p>
                )}
              </div>

              {/* Payment Type */}
              <div>
                <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipe Pembayaran *
                </label>
                <select
                  id="payment_type"
                  name="payment_type"
                  value={formData.payment_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="dp">DP (Down Payment)</option>
                  <option value="pelunasan">Pelunasan</option>
                  <option value="cicilan">Cicilan</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jumlah (Rp) *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
                )}
                {selectedJob && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Budget proyek: Rp {selectedJob.budget?.toLocaleString('id-ID')}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Deskripsi dokumen..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
              </div>

              {/* Due Date (for invoice only) */}
              {formData.type === 'invoice' && (
                <div>
                  <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tanggal Jatuh Tempo *
                  </label>
                  <input
                    type="date"
                    id="due_date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.due_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.due_date && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.due_date}</p>
                  )}
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Metode Pembayaran *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.payment_method === 'transfer' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="transfer"
                      checked={formData.payment_method === 'transfer'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Transfer Bank</span>
                  </label>
                  
                  <label className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.payment_method === 'cash' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={formData.payment_method === 'cash'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Banknote className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Tunai</span>
                  </label>
                  
                  <label className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.payment_method === 'card' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={formData.payment_method === 'card'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Wallet className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Kartu</span>
                  </label>
                </div>
              </div>

              {/* Bank Account Selection (for transfer only) */}
              {formData.payment_method === 'transfer' && (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white">Pilih Rekening Bank</h4>
                  
                  <BankAccountSelect
                    selectedAccount={selectedBankAccount}
                    onAccountSelect={handleBankAccountSelect}
                    error={errors.bank_account_id}
                  />
                  
                  {selectedBankAccount && (
                    <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Detail Rekening Terpilih:</h5>
                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p><span className="font-medium">Bank:</span> {selectedBankAccount.bank_name}</p>
                        <p><span className="font-medium">Nomor Rekening:</span> {selectedBankAccount.account_number}</p>
                        <p><span className="font-medium">Nama Pemegang:</span> {selectedBankAccount.account_holder}</p>
                        <p><span className="font-medium">Jenis:</span> {selectedBankAccount.account_type}</p>
                        {selectedBankAccount.is_primary && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Rekening Utama
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catatan Tambahan
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Catatan tambahan (opsional)..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Simpan Dokumen
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={generatePreview}
                  className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  Preview
                </button>
                
                <button
                  type="button"
                  onClick={downloadPDF}
                  disabled={isExporting || !selectedJob || !formData.amount}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  {isExporting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Mengekspor...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download PDF
                    </>
                  )}
                </button>
                
                <Link
                  href="/admin/documents"
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Batal
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar - Project Info */}
        <div className="space-y-6">
          {selectedJob && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Detail Proyek
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Judul</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedJob.title}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Klien</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedJob.client_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedJob.client_email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Rp {selectedJob.budget?.toLocaleString('id-ID')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedJob.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : selectedJob.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {selectedJob.status === 'completed' ? 'Selesai' : 
                     selectedJob.status === 'in_progress' ? 'Berlangsung' : 
                     selectedJob.status === 'pending' ? 'Menunggu' : selectedJob.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
              Tips
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>• Invoice digunakan untuk meminta pembayaran</li>
              <li>• Receipt digunakan sebagai bukti pembayaran</li>
              <li>• DP biasanya 30-50% dari total budget</li>
              <li>• Pastikan detail rekening sudah benar</li>
              <li>• Gunakan preview sebelum menyimpan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewMode && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Preview {formData.type === 'invoice' ? 'Invoice' : 'Receipt'}
                </h3>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              {/* Document Preview Content */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="max-h-[70vh] overflow-y-auto">
                  <DocumentPDF 
                    job={selectedJob} 
                    document={formData}
                    companySettings={companySettings || undefined}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setPreviewMode(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Tutup
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden PDF Component for Export */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={pdfRef}>
          {selectedJob && (
            <DocumentPDF 
              job={selectedJob} 
              document={formData}
              companySettings={companySettings || undefined}
            />
          )}
        </div>
      </div>
    </div>
  )
}