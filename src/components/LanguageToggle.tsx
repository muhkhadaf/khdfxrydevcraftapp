'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setLanguage('id')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
          language === 'id'
            ? 'bg-blue-500 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
        }`}
      >
        🇮🇩 ID
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
          language === 'en'
            ? 'bg-blue-500 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
        }`}
      >
        🇺🇸 EN
      </button>
    </div>
  )
}