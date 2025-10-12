'use client'

import { Toaster } from 'react-hot-toast'
import { useTheme } from './theme-provider'

export function ToastProvider() {
  const { theme } = useTheme()

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
        style: {
          background: theme === 'dark' ? '#374151' : '#ffffff',
          color: theme === 'dark' ? '#f9fafb' : '#111827',
          border: theme === 'dark' ? '1px solid #4b5563' : '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          boxShadow: theme === 'dark' 
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },

        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#065f46' : '#ecfdf5',
            color: theme === 'dark' ? '#d1fae5' : '#065f46',
            border: theme === 'dark' ? '1px solid #059669' : '1px solid #10b981',
          },
          iconTheme: {
            primary: theme === 'dark' ? '#10b981' : '#059669',
            secondary: theme === 'dark' ? '#065f46' : '#ecfdf5',
          },
        },

        error: {
          duration: 5000,
          style: {
            background: theme === 'dark' ? '#7f1d1d' : '#fef2f2',
            color: theme === 'dark' ? '#fecaca' : '#7f1d1d',
            border: theme === 'dark' ? '1px solid #dc2626' : '1px solid #ef4444',
          },
          iconTheme: {
            primary: theme === 'dark' ? '#ef4444' : '#dc2626',
            secondary: theme === 'dark' ? '#7f1d1d' : '#fef2f2',
          },
        },

        loading: {
          duration: Infinity,
          style: {
            background: theme === 'dark' ? '#1e40af' : '#eff6ff',
            color: theme === 'dark' ? '#dbeafe' : '#1e40af',
            border: theme === 'dark' ? '1px solid #3b82f6' : '1px solid #60a5fa',
          },
          iconTheme: {
            primary: theme === 'dark' ? '#60a5fa' : '#3b82f6',
            secondary: theme === 'dark' ? '#1e40af' : '#eff6ff',
          },
        },
      }}
    />
  )
}