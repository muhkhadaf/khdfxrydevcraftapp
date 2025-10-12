import { createUser } from '../src/lib/auth'

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Create admin user
    console.log('👤 Creating admin user...')
    const adminUser = await createUser({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      full_name: 'Administrator',
      role: 'admin'
    })

    if (adminUser) {
      console.log('✅ Admin user created successfully')
      console.log('📧 Email: admin@example.com')
      console.log('🔑 Password: admin123')
    } else {
      console.log('❌ Failed to create admin user')
    }

    console.log('🎉 Database seeding completed!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()