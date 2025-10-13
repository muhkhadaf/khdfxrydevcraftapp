import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin
    
    const { data: bankAccount, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching bank account:', error)
      return NextResponse.json(
        { error: 'Bank account not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: bankAccount
    })
  } catch (error) {
    console.error('Error in GET /api/bank-accounts/[id]:', error)
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
    const body = await request.json()
    const { bank_name, account_number, account_holder, account_type, is_primary, notes } = body

    // Validation
    if (!bank_name || !account_number || !account_holder) {
      return NextResponse.json(
        { error: 'Bank name, account number, and account holder are required' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // If this account is set as primary, unset other primary accounts
    if (is_primary) {
      await supabase
        .from('bank_accounts')
        .update({ is_primary: false })
        .eq('is_primary', true)
        .neq('id', params.id)
    }

    const { data: bankAccount, error } = await supabase
      .from('bank_accounts')
      .update({
        bank_name: bank_name.trim(),
        account_number: account_number.trim(),
        account_holder: account_holder.trim(),
        account_type: account_type || 'checking',
        is_primary: is_primary || false,
        notes: notes?.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('is_active', true)
      .select()
      .single()

    if (error) {
      console.error('Error updating bank account:', error)
      return NextResponse.json(
        { error: 'Failed to update bank account' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: bankAccount,
      message: 'Bank account updated successfully'
    })
  } catch (error) {
    console.error('Error in PUT /api/bank-accounts/[id]:', error)
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
    const supabase = supabaseAdmin

    // Soft delete by setting is_active to false
    const { data: bankAccount, error } = await supabase
      .from('bank_accounts')
      .update({ 
        is_active: false,
        is_primary: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('is_active', true)
      .select()
      .single()

    if (error) {
      console.error('Error deleting bank account:', error)
      return NextResponse.json(
        { error: 'Failed to delete bank account' },
        { status: 500 }
      )
    }

    // If we deleted the primary account, set another account as primary
    if (bankAccount.is_primary) {
      const { data: otherAccounts } = await supabase
        .from('bank_accounts')
        .select('id')
        .eq('is_active', true)
        .limit(1)

      if (otherAccounts && otherAccounts.length > 0) {
        await supabase
          .from('bank_accounts')
          .update({ is_primary: true })
          .eq('id', otherAccounts[0].id)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bank account deleted successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/bank-accounts/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}