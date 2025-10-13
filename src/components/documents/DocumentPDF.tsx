'use client'

import React, { forwardRef } from 'react'

interface Job {
  id: string
  tracking_id: string
  title: string
  client_name: string
  client_email: string
  client_phone: string
  client_address: string
  budget: number
  status: string
}

interface DocumentData {
  id?: string
  document_number?: string
  type: 'invoice' | 'receipt'
  payment_type: 'dp' | 'pelunasan' | 'cicilan'
  amount: number
  description: string
  due_date?: string
  payment_method: 'transfer' | 'cash' | 'card'
  bank_name?: string
  account_number?: string
  account_holder?: string
  notes?: string
  created_at?: string
}

interface CompanySettings {
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

interface DocumentPDFProps {
  job: Job
  document: DocumentData
  companySettings?: CompanySettings
}

export const DocumentPDF = forwardRef<HTMLDivElement, DocumentPDFProps>(
  ({ job, document, companySettings }, ref) => {
    // Default company settings if not provided
    const defaultCompanySettings: CompanySettings = {
      company_name: 'khdfxryd devcraft',
      company_description: 'Professional Development Services',
      email: 'contact@khdfxryd.com',
      phone: '+62 123 456 7890',
      address: '',
      website: '',
      bank_name: 'BCA',
      account_number: '4731903691',
      account_holder: 'MUHAMMAD KHADAFI RIYADI',
      logo_url: '',
      tax_number: '',
      business_license: ''
    }

    const company = companySettings || defaultCompanySettings
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getPaymentTypeLabel = (type: string) => {
      switch (type) {
        case 'dp':
          return 'Down Payment (DP)'
        case 'pelunasan':
          return 'Pelunasan'
        case 'cicilan':
          return 'Cicilan'
        default:
          return type
      }
    }

    const getPaymentMethodLabel = (method: string) => {
      switch (method) {
        case 'transfer':
          return 'Transfer Bank'
        case 'cash':
          return 'Tunai'
        case 'card':
          return 'Kartu Kredit/Debit'
        default:
          return method
      }
    }

    return (
      <div 
        ref={ref} 
        className="bg-white text-black p-8 max-w-4xl mx-auto"
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#000',
          minHeight: '297mm', // A4 height
          width: '210mm', // A4 width
          margin: '0 auto',
          padding: '20mm',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '40px',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '20px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              margin: '0 0 8px 0',
              color: '#1f2937'
            }}>
              {company.company_name}
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280', 
              margin: '0 0 4px 0' 
            }}>
              {company.company_description}
            </p>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: '0 0 4px 0' 
            }}>
              Email: {company.email} | Phone: {company.phone}
            </p>
            {company.address && (
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                margin: '0' 
              }}>
                {company.address}
              </p>
            )}
            {company.website && (
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                margin: '0' 
              }}>
                Website: {company.website}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: '0 0 8px 0',
              color: document.type === 'invoice' ? '#dc2626' : '#059669'
            }}>
              {document.type === 'invoice' ? 'INVOICE' : 'RECEIPT'}
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: '0 0 4px 0' 
            }}>
              No: {document.document_number || `${job.tracking_id}-${document.type.toUpperCase()}`}
            </p>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: '0' 
            }}>
              Date: {document.created_at ? formatDate(document.created_at) : formatDate(new Date().toISOString())}
            </p>
          </div>
        </div>

        {/* Client Information */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            margin: '0 0 12px 0',
            color: '#1f2937'
          }}>
            {document.type === 'invoice' ? 'Bill To:' : 'Received From:'}
          </h3>
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              margin: '0 0 4px 0',
              color: '#1f2937'
            }}>
              {job.client_name}
            </p>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: '0 0 2px 0' 
            }}>
              {job.client_email}
            </p>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: '0 0 2px 0' 
            }}>
              {job.client_phone}
            </p>
            {job.client_address && (
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                margin: '0' 
              }}>
                {job.client_address}
              </p>
            )}
          </div>
        </div>

        {/* Document Details */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: '0 0 4px 0' 
            }}>
              Project:
            </p>
            <p style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              margin: '0',
              color: '#1f2937'
            }}>
              {job.title}
            </p>
          </div>
          {document.type === 'invoice' && document.due_date && (
            <div>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                margin: '0 0 4px 0' 
              }}>
                Due Date:
              </p>
              <p style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                margin: '0',
                color: '#dc2626'
              }}>
                {formatDate(document.due_date)}
              </p>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: '30px' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            border: '1px solid #e5e7eb'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  Description
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  Type
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ 
                  padding: '16px 12px', 
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  {document.description}
                </td>
                <td style={{ 
                  padding: '16px 12px', 
                  textAlign: 'center', 
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  {getPaymentTypeLabel(document.payment_type)}
                </td>
                <td style={{ 
                  padding: '16px 12px', 
                  textAlign: 'right', 
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  {formatCurrency(document.amount)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <td colSpan={2} style={{ 
                  padding: '16px 12px', 
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  Total
                </td>
                <td style={{ 
                  padding: '16px 12px', 
                  textAlign: 'right', 
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  {formatCurrency(document.amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Information */}
        {document.payment_method === 'transfer' && (document.bank_name || company.bank_name) && (
          <div style={{ 
            marginBottom: '30px',
            backgroundColor: '#eff6ff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #bfdbfe'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              margin: '0 0 16px 0',
              color: '#1e40af'
            }}>
              Payment Information
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px'
            }}>
              <div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  margin: '0 0 4px 0' 
                }}>
                  Payment Method:
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  margin: '0',
                  color: '#1f2937'
                }}>
                  {getPaymentMethodLabel(document.payment_method)}
                </p>
              </div>
              <div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  margin: '0 0 4px 0' 
                }}>
                  Bank:
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  margin: '0',
                  color: '#1f2937'
                }}>
                  {document.bank_name || company.bank_name}
                </p>
              </div>
              <div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  margin: '0 0 4px 0' 
                }}>
                  Account Number:
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  margin: '0',
                  color: '#1f2937'
                }}>
                  {document.account_number || company.account_number}
                </p>
              </div>
              <div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  margin: '0 0 4px 0' 
                }}>
                  Account Holder:
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  margin: '0',
                  color: '#1f2937'
                }}>
                  {document.account_holder || company.account_holder}
                </p>
              </div>
            </div>
            
            {document.type === 'invoice' && (
              <div style={{ 
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#fef3c7',
                borderRadius: '6px',
                border: '1px solid #fbbf24'
              }}>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#92400e', 
                  margin: '0',
                  fontWeight: 'bold'
                }}>
                  Please transfer the exact amount to the account above and send the payment confirmation to our email.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {document.notes && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              margin: '0 0 12px 0',
              color: '#1f2937'
            }}>
              Notes
            </h3>
            <div style={{ 
              backgroundColor: '#f9fafb', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ 
                fontSize: '14px', 
                color: '#374151', 
                margin: '0',
                whiteSpace: 'pre-wrap'
              }}>
                {document.notes}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          marginTop: 'auto',
          paddingTop: '30px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            margin: '0 0 8px 0' 
          }}>
            Thank you for your business!
          </p>
          <p style={{ 
            fontSize: '12px', 
            color: '#9ca3af', 
            margin: '0' 
          }}>
            This document was generated automatically by khdfxryd devcraft system.
          </p>
        </div>
      </div>
    )
  }
)

DocumentPDF.displayName = 'DocumentPDF'

export default DocumentPDF