'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Plus, CreditCard } from 'lucide-react'

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

interface BankAccountSelectProps {
  selectedAccount?: BankAccount | null
  onAccountSelect: (bankAccount: BankAccount | null) => void
  placeholder?: string
  className?: string
  required?: boolean
  onAddNew?: () => void
  error?: string
}

export default function BankAccountSelect({
  selectedAccount,
  onAccountSelect,
  placeholder = "Pilih rekening bank",
  className = "",
  required = false,
  onAddNew,
  error
}: BankAccountSelectProps) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null)

  useEffect(() => {
    fetchBankAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      setSelectedBank(selectedAccount)
    } else {
      setSelectedBank(null)
    }
  }, [selectedAccount])

  const fetchBankAccounts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bank-accounts')
      const result = await response.json()

      if (response.ok) {
        setBankAccounts(result.data || [])
      } else {
        console.error('Error fetching bank accounts:', result.error)
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (bank: BankAccount) => {
    setSelectedBank(bank)
    onAccountSelect(bank)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedBank(null)
    onAccountSelect(null)
    setIsOpen(false)
  }

  const formatAccountDisplay = (bank: BankAccount) => {
    return `${bank.bank_name} - ${bank.account_number} (${bank.account_holder})`
  }

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer flex items-center justify-between ${
          error 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <div className="flex items-center gap-2 flex-1">
          <CreditCard className="h-4 w-4 text-gray-400" />
          <span className={selectedBank ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
            {loading ? "Memuat..." : selectedBank ? formatAccountDisplay(selectedBank) : placeholder}
            {required && !selectedBank && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="px-3 py-2 text-gray-500 dark:text-gray-400">Memuat rekening...</div>
          ) : bankAccounts.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
              Belum ada rekening bank
              {onAddNew && (
                <button
                  onClick={() => {
                    setIsOpen(false)
                    onAddNew()
                  }}
                  className="block w-full text-left mt-2 px-2 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded text-sm"
                >
                  + Tambah rekening baru
                </button>
              )}
            </div>
          ) : (
            <>
              {selectedBank && (
                <button
                  onClick={handleClear}
                  className="w-full px-3 py-2 text-left text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600"
                >
                  Kosongkan pilihan
                </button>
              )}
              
              {bankAccounts.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleSelect(bank)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 ${
                    selectedBank?.id === bank.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{bank.bank_name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {bank.account_number} - {bank.account_holder}
                      </div>
                    </div>
                    {bank.is_primary && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Utama
                      </span>
                    )}
                  </div>
                </button>
              ))}
              
              {onAddNew && (
                <button
                  onClick={() => {
                    setIsOpen(false)
                    onAddNew()
                  }}
                  className="w-full px-3 py-2 text-left text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-t border-gray-200 dark:border-gray-600 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Tambah rekening baru
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}