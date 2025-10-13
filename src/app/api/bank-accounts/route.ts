import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = supabaseAdmin
    
    const { data: bankAccounts, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('is_active', true)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching bank accounts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bank accounts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: bankAccounts || []
    })
  } catch (error) {
    console.error('Error in GET /api/bank-accounts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    }

    const { data: bankAccount, error } = await supabase
      .from('bank_accounts')
      .insert({
        bank_name: bank_name.trim(),
        account_number: account_number.trim(),
        account_holder: account_holder.trim(),
        account_type: account_type || 'checking',
        is_primary: is_primary || false,
        is_active: true,
        notes: notes?.trim() || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating bank account:', error)
      return NextResponse.json(
        { error: 'Failed to create bank account' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: bankAccount,
      message: 'Bank account created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/bank-accounts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}