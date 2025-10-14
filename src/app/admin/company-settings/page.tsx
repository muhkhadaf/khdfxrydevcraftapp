'use client'

import { useState, useEffect } from 'react'
import { Building2, Mail, Phone, MapPin, Globe, CreditCard, Save, RefreshCw, AlertCircle, CheckCircle, Plus, Edit, Trash2, Star } from 'lucide-react'

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
}

interface BankAccount {
  id?: string
  bank_name: string
  account_number: string
  account_holder: string
  account_type: string
  is_primary: boolean
  is_active: boolean
  notes?: string
  created_at?: string
  updated_at?: string
}

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>({
    company_name: '',
    company_description: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    bank_name: '',
    account_number: '',
    account_holder: '',
    logo_url: '',
    tax_number: '',
    business_license: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Bank accounts state
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [showBankForm, setShowBankForm] = useState(false)
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null)
  const [bankForm, setBankForm] = useState<Partial<BankAccount>>({
    bank_name: '',
    account_number: '',
    account_holder: '',
    account_type: 'checking',
    is_primary: false,
    notes: ''
  })

  useEffect(() => {
    fetchCompanySettings()
    fetchBankAccounts()
  }, [])

  const fetchCompanySettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/company-settings')
      const result = await response.json()

      if (response.ok) {
        setSettings(result.data)
      } else {
        console.error('Error fetching company settings:', result.error)
        setMessage({ type: 'error', text: 'Gagal memuat data perusahaan' })
      }
    } catch (error) {
      console.error('Error fetching company settings:', error)
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat memuat data' })
    } finally {
      setLoading(false)
    }
  }

  const fetchBankAccounts = async () => {
    try {
      const response = await fetch('/api/bank-accounts')
      const result = await response.json()

      if (response.ok) {
        setBankAccounts(result.data || [])
      } else {
        console.error('Error fetching bank accounts:', result.error)
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)

      // Validate required fields
      if (!settings.company_name || !settings.email || !settings.phone || 
          !settings.bank_name || !settings.account_number || !settings.account_holder) {
        setMessage({ type: 'error', text: 'Harap lengkapi semua field yang wajib diisi' })
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(settings.email)) {
        setMessage({ type: 'error', text: 'Format email tidak valid' })
        return
      }

      const response = await fetch('/api/company-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      const result = await response.json()

      if (response.ok) {
        setSettings(result.data)
        setMessage({ type: 'success', text: 'Data perusahaan berhasil disimpan' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menyimpan data perusahaan' })
      }
    } catch (error) {
      console.error('Error saving company settings:', error)
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan data' })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    fetchCompanySettings()
    setMessage(null)
  }

  // Bank account functions
  const handleBankFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setBankForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleAddBank = () => {
    setBankForm({
      bank_name: '',
      account_number: '',
      account_holder: '',
      account_type: 'checking',
      is_primary: bankAccounts.length === 0, // First account is primary by default
      notes: ''
    })
    setEditingBank(null)
    setShowBankForm(true)
  }

  const handleEditBank = (bank: BankAccount) => {
    setBankForm(bank)
    setEditingBank(bank)
    setShowBankForm(true)
  }

  const handleSaveBank = async () => {
    try {
      if (!bankForm.bank_name || !bankForm.account_number || !bankForm.account_holder) {
        setMessage({ type: 'error', text: 'Harap lengkapi semua field rekening bank' })
        return
      }

      const method = editingBank ? 'PUT' : 'POST'
      const url = editingBank ? `/api/bank-accounts/${editingBank.id}` : '/api/bank-accounts'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bankForm),
      })

      const result = await response.json()

      if (response.ok) {
        await fetchBankAccounts()
        setShowBankForm(false)
        setEditingBank(null)
        setMessage({ 
          type: 'success', 
          text: editingBank ? 'Rekening bank berhasil diperbarui' : 'Rekening bank berhasil ditambahkan' 
        })
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menyimpan rekening bank' })
      }
    } catch (error) {
      console.error('Error saving bank account:', error)
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan rekening bank' })
    }
  }

  const handleDeleteBank = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus rekening bank ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/bank-accounts/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (response.ok) {
        await fetchBankAccounts()
        setMessage({ type: 'success', text: 'Rekening bank berhasil dihapus' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menghapus rekening bank' })
      }
    } catch (error) {
      console.error('Error deleting bank account:', error)
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menghapus rekening bank' })
    }
  }

  const handleSetPrimaryBank = async (id: string) => {
    try {
      const response = await fetch(`/api/bank-accounts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_primary: true }),
      })

      const result = await response.json()

      if (response.ok) {
        await fetchBankAccounts()
        setMessage({ type: 'success', text: 'Rekening utama berhasil diubah' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal mengubah rekening utama' })
      }
    } catch (error) {
      console.error('Error setting primary bank:', error)
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat mengubah rekening utama' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Memuat data perusahaan...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Pengaturan Perusahaan
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola informasi master perusahaan yang akan digunakan dalam dokumen
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
              : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="p-6 space-y-6">
            {/* Company Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informasi Perusahaan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Perusahaan *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={settings.company_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deskripsi Perusahaan
                  </label>
                  <input
                    type="text"
                    name="company_description"
                    value={settings.company_description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Professional Development Services"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Alamat
                  </label>
                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Alamat lengkap perusahaan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={settings.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="https://khdfxryd.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL Logo
                  </label>
                  <input
                    type="url"
                    name="logo_url"
                    value={settings.logo_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Informasi Kontak
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="contact@khdfxryd.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="+62 123 456 7890"
                  />
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informasi Bank
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Bank *
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={settings.bank_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="BCA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nomor Rekening *
                  </label>
                  <input
                    type="text"
                    name="account_number"
                    value={settings.account_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="4731903691"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Pemegang Rekening *
                  </label>
                  <input
                    type="text"
                    name="account_holder"
                    value={settings.account_holder}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="MUHAMMAD KHADAFI RIYADI"
                  />
                </div>
              </div>
            </div>

            {/* Bank Accounts Management */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Manajemen Rekening Bank
                </h2>
                <button
                  onClick={handleAddBank}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Rekening
                </button>
              </div>

              {/* Bank Accounts List */}
              <div className="space-y-3">
                {bankAccounts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Belum ada rekening bank yang ditambahkan
                  </div>
                ) : (
                  bankAccounts.map((bank) => (
                    <div
                      key={bank.id}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {bank.bank_name}
                            </h3>
                            {bank.is_primary && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                <Star className="h-3 w-3" />
                                Utama
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <div>Nomor Rekening: {bank.account_number}</div>
                            <div>Pemegang: {bank.account_holder}</div>
                            <div>Jenis: {bank.account_type === 'checking' ? 'Giro' : bank.account_type === 'savings' ? 'Tabungan' : bank.account_type}</div>
                            {bank.notes && <div>Catatan: {bank.notes}</div>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!bank.is_primary && (
                            <button
                              onClick={() => handleSetPrimaryBank(bank.id!)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-md"
                              title="Jadikan rekening utama"
                            >
                              <Star className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditBank(bank)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                            title="Edit rekening"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBank(bank.id!)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                            title="Hapus rekening"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bank Form Modal */}
              {showBankForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {editingBank ? 'Edit Rekening Bank' : 'Tambah Rekening Bank'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nama Bank *
                        </label>
                        <input
                          type="text"
                          name="bank_name"
                          value={bankForm.bank_name || ''}
                          onChange={handleBankFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="BCA, Mandiri, BNI, dll"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nomor Rekening *
                        </label>
                        <input
                          type="text"
                          name="account_number"
                          value={bankForm.account_number || ''}
                          onChange={handleBankFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="1234567890"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nama Pemegang *
                        </label>
                        <input
                          type="text"
                          name="account_holder"
                          value={bankForm.account_holder || ''}
                          onChange={handleBankFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Nama pemegang rekening"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Jenis Rekening
                        </label>
                        <select
                          name="account_type"
                          value={bankForm.account_type || 'checking'}
                          onChange={handleBankFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="checking">Giro</option>
                          <option value="savings">Tabungan</option>
                          <option value="current">Rekening Koran</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="is_primary"
                            checked={bankForm.is_primary || false}
                            onChange={handleBankFormChange}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Jadikan rekening utama
                          </span>
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Catatan
                        </label>
                        <textarea
                          name="notes"
                          value={bankForm.notes || ''}
                          onChange={handleBankFormChange}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Catatan tambahan (opsional)"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => setShowBankForm(false)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveBank}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {editingBank ? 'Update' : 'Simpan'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Informasi Legal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    NPWP
                  </label>
                  <input
                    type="text"
                    name="tax_number"
                    value={settings.tax_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="XX.XXX.XXX.X-XXX.XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nomor Izin Usaha
                  </label>
                  <input
                    type="text"
                    name="business_license"
                    value={settings.business_license}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Nomor izin usaha"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex justify-end gap-3">
            <button
              onClick={handleReset}
              disabled={saving}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4 inline mr-2" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}