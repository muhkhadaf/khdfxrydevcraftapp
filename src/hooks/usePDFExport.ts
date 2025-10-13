'use client'

import { useCallback } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface PDFExportOptions {
  filename?: string
  quality?: number
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
}

export const usePDFExport = () => {
  const exportToPDF = useCallback(async (
    element: HTMLElement,
    options: PDFExportOptions = {}
  ) => {
    const {
      filename = 'document.pdf',
      quality = 1.0,
      format = 'a4',
      orientation = 'portrait'
    } = options

    try {
      // Show loading state
      const originalCursor = document.body.style.cursor
      document.body.style.cursor = 'wait'

      // Configure canvas options for high quality
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      })

      // Calculate PDF dimensions
      const imgWidth = format === 'a4' ? 210 : 216 // mm
      const imgHeight = format === 'a4' ? 297 : 279 // mm
      
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      
      // Calculate scaling to fit content on one page
      const ratio = Math.min(imgWidth / (canvasWidth * 0.264583), imgHeight / (canvasHeight * 0.264583))
      const scaledWidth = canvasWidth * 0.264583 * ratio
      const scaledHeight = canvasHeight * 0.264583 * ratio

      // Create PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format
      })

      // Center the content on the page
      const x = (imgWidth - scaledWidth) / 2
      const y = (imgHeight - scaledHeight) / 2

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png', quality)
      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight)

      // Save PDF
      pdf.save(filename)

      // Restore cursor
      document.body.style.cursor = originalCursor

      return true
    } catch (error) {
      console.error('Error generating PDF:', error)
      document.body.style.cursor = 'default'
      throw new Error('Failed to generate PDF')
    }
  }, [])

  const exportElementToPDF = useCallback(async (
    elementId: string,
    options: PDFExportOptions = {}
  ) => {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`)
    }

    return exportToPDF(element, options)
  }, [exportToPDF])

  return {
    exportToPDF,
    exportElementToPDF
  }
}

export default usePDFExport