import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('documents')
      .select(`
        *,
        jobs (
          id,
          tracking_id,
          title,
          client_name,
          client_email,
          client_phone,
          budget,
          status,
          created_at
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching document:', error)
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data,
      message: 'Document retrieved successfully'
    })
  } catch (error) {
    console.error('Error in document GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    const {
      type,
      payment_type,
      amount,
      description,
      due_date,
      payment_method,
      bank_name,
      account_number,
      account_holder,
      notes,
      status
    } = body

    // Validate type if provided
    if (type && !['invoice', 'receipt'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      )
    }

    // Validate payment_type if provided
    if (payment_type && !['dp', 'pelunasan', 'cicilan'].includes(payment_type)) {
      return NextResponse.json(
        { error: 'Invalid payment type' },
        { status: 400 }
      )
    }

    // Validate payment_method if provided
    if (payment_method && !['transfer', 'cash', 'card'].includes(payment_method)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Only update fields that are provided
    if (type !== undefined) updateData.type = type
    if (payment_type !== undefined) updateData.payment_type = payment_type
    if (amount !== undefined) updateData.amount = amount
    if (description !== undefined) updateData.description = description
    if (due_date !== undefined) updateData.due_date = due_date
    if (payment_method !== undefined) updateData.payment_method = payment_method
    if (bank_name !== undefined) updateData.bank_name = bank_name
    if (account_number !== undefined) updateData.account_number = account_number
    if (account_holder !== undefined) updateData.account_holder = account_holder
    if (notes !== undefined) updateData.notes = notes
    if (status !== undefined) updateData.status = status

    const { data, error } = await supabaseAdmin
      .from('documents')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        jobs (
          id,
          tracking_id,
          title,
          client_name,
          client_email,
          client_phone,
          budget,
          status,
          created_at
        )
      `)
      .single()

    if (error) {
      console.error('Error updating document:', error)
      return NextResponse.json(
        { error: 'Failed to update document' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      message: 'Document updated successfully'
    })
  } catch (error) {
    console.error('Error in document PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting document:', error)
      return NextResponse.json(
        { error: 'Failed to delete document' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Document deleted successfully'
    })
  } catch (error) {
    console.error('Error in document DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}