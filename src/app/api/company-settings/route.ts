import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Retrieve company settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .single()

    if (error) {
      // If no company settings exist, return default values
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          data: {
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
          },
          message: 'Default company settings returned'
        })
      }
      
      console.error('Error fetching company settings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch company settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      message: 'Company settings retrieved successfully'
    })
  } catch (error) {
    console.error('Error in company settings GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create or update company settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      company_name,
      company_description,
      email,
      phone,
      address,
      website,
      bank_name,
      account_number,
      account_holder,
      logo_url,
      tax_number,
      business_license
    } = body

    // Validate required fields
    if (!company_name || !email || !phone || !bank_name || !account_number || !account_holder) {
      return NextResponse.json(
        { error: 'Missing required fields: company_name, email, phone, bank_name, account_number, account_holder' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if company settings already exist
    const { data: existingData } = await supabase
      .from('company_settings')
      .select('id')
      .single()

    let result
    if (existingData) {
      // Update existing settings
      result = await supabase
        .from('company_settings')
        .update({
          company_name,
          company_description,
          email,
          phone,
          address,
          website,
          bank_name,
          account_number,
          account_holder,
          logo_url,
          tax_number,
          business_license,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id)
        .select()
        .single()
    } else {
      // Create new settings
      result = await supabase
        .from('company_settings')
        .insert({
          company_name,
          company_description,
          email,
          phone,
          address,
          website,
          bank_name,
          account_number,
          account_holder,
          logo_url,
          tax_number,
          business_license
        })
        .select()
        .single()
    }

    if (result.error) {
      console.error('Error saving company settings:', result.error)
      return NextResponse.json(
        { error: 'Failed to save company settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: result.data,
      message: existingData ? 'Company settings updated successfully' : 'Company settings created successfully'
    })
  } catch (error) {
    console.error('Error in company settings POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update company settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      company_name,
      company_description,
      email,
      phone,
      address,
      website,
      bank_name,
      account_number,
      account_holder,
      logo_url,
      tax_number,
      business_license
    } = body

    // Get existing settings
    const { data: existingData, error: fetchError } = await supabase
      .from('company_settings')
      .select('*')
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing company settings:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch existing company settings' },
        { status: 500 }
      )
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Only update fields that are provided
    if (company_name !== undefined) updateData.company_name = company_name
    if (company_description !== undefined) updateData.company_description = company_description
    if (email !== undefined) {
      // Validate email format if provided
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }
      updateData.email = email
    }
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (website !== undefined) updateData.website = website
    if (bank_name !== undefined) updateData.bank_name = bank_name
    if (account_number !== undefined) updateData.account_number = account_number
    if (account_holder !== undefined) updateData.account_holder = account_holder
    if (logo_url !== undefined) updateData.logo_url = logo_url
    if (tax_number !== undefined) updateData.tax_number = tax_number
    if (business_license !== undefined) updateData.business_license = business_license

    let result
    if (existingData) {
      // Update existing settings
      result = await supabase
        .from('company_settings')
        .update(updateData)
        .eq('id', existingData.id)
        .select()
        .single()
    } else {
      // Create new settings with provided data and defaults
      const defaultSettings = {
        company_name: 'khdfxryd devcraft',
        company_description: 'Professional Development Services',
        email: 'contact@khdfxryd.com',
        phone: '+62 123 456 7890',
        bank_name: 'BCA',
        account_number: '4731903691',
        account_holder: 'MUHAMMAD KHADAFI RIYADI'
      }

      result = await supabase
        .from('company_settings')
        .insert({ ...defaultSettings, ...updateData })
        .select()
        .single()
    }

    if (result.error) {
      console.error('Error updating company settings:', result.error)
      return NextResponse.json(
        { error: 'Failed to update company settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: result.data,
      message: 'Company settings updated successfully'
    })
  } catch (error) {
    console.error('Error in company settings PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}