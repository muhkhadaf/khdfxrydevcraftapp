# Sistem Manajemen Pekerjaan Jasa

Aplikasi web modern untuk mengelola pekerjaan jasa dengan fitur tracking publik yang memungkinkan klien melacak status pekerjaan mereka secara real-time.

## 🚀 Fitur Utama

### Admin Dashboard
- **Manajemen Pekerjaan**: CRUD lengkap untuk pekerjaan (Create, Read, Update, Delete)
- **Tracking Status**: Sistem pelacakan status pekerjaan dengan riwayat lengkap
- **Dashboard Analytics**: Statistik pekerjaan dan overview
- **Manajemen Klien**: Informasi klien terintegrasi dengan pekerjaan

### Public Tracking
- **Tracking Tanpa Login**: Klien dapat melacak pekerjaan menggunakan ID tracking
- **Real-time Updates**: Status pekerjaan diperbarui secara real-time
- **Riwayat Lengkap**: Melihat semua perubahan status dan catatan

### UI/UX Modern
- **Dark/Light Mode**: Tema yang dapat disesuaikan
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Toast Notifications**: Notifikasi yang informatif dan elegan
- **Modal Components**: Komponen modal yang dapat digunakan kembali

## 🛠️ Teknologi

- **Framework**: Next.js 14 dengan App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Authentication**: Custom JWT dengan bcrypt
- **UI Components**: Custom components dengan Lucide React icons
- **Notifications**: React Hot Toast
- **TypeScript**: Full type safety

## 📦 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd khdfxrydapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Isi variabel environment di `.env.local`:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   
   # Database URL (optional, for direct connections)
   DATABASE_URL=your_database_url
   ```

4. **Setup database**
   
   Jalankan script SQL di Supabase:
   ```bash
   # Copy isi file database/schema.sql ke Supabase SQL Editor
   ```

5. **Seed initial data**
   ```bash
   npm run seed
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:3000`

## 🗄️ Database Schema

### Users Table
- `id`: UUID primary key
- `username`: Unique username
- `email`: Email address
- `password_hash`: Hashed password
- `full_name`: Full name
- `role`: User role (admin/user)

### Jobs Table
- `id`: UUID primary key
- `tracking_id`: Unique tracking identifier
- `title`: Job title
- `description`: Job description
- `client_name`: Client name
- `client_email`: Client email (optional)
- `client_phone`: Client phone (optional)
- `status`: Job status (pending/in_progress/completed/on_hold/cancelled)
- `priority`: Job priority (low/medium/high/urgent)
- `estimated_completion_date`: Estimated completion date
- `budget`: Job budget
- `created_by`: User who created the job

### Job History Table
- `id`: UUID primary key
- `job_id`: Reference to jobs table
- `status`: Status at this point in time
- `estimated_completion_date`: Updated completion date
- `notes`: Internal notes
- `status_note`: Public status note
- `changed_by`: User who made the change

## 🔐 Authentication

Sistem menggunakan autentikasi custom dengan JWT:

### Default Admin Credentials
- **Username**: `admin`
- **Email**: `admin@example.com`
- **Password**: `admin123`

### Login Process
1. User memasukkan username/email dan password
2. Server memverifikasi kredensial dengan database
3. Jika valid, server membuat JWT token
4. Token disimpan dalam HTTP-only cookie
5. Middleware memverifikasi token untuk rute yang dilindungi

## 📱 Penggunaan

### Admin Dashboard
1. Login dengan kredensial admin
2. Akses dashboard di `/admin/dashboard`
3. Kelola pekerjaan melalui menu "Kelola Pekerjaan"
4. Buat pekerjaan baru dengan tombol "Tambah Pekerjaan"
5. Update status pekerjaan di halaman detail

### Public Tracking
1. Buka halaman `/tracking`
2. Masukkan ID tracking (contoh: JOB001)
3. Lihat status dan riwayat pekerjaan

## 🎨 Customization

### Theme
Aplikasi mendukung dark/light mode yang dapat diubah melalui toggle di header.

### Colors
Warna utama dapat disesuaikan di `tailwind.config.ts`:
```javascript
colors: {
  primary: {
    50: '#eff6ff',
    // ... other shades
    950: '#1e3a8a',
  }
}
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Jobs Management
- `GET /api/jobs` - Get all jobs (with pagination and filters)
- `POST /api/jobs` - Create new job
- `GET /api/jobs/[id]` - Get job by ID
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job

### Job History
- `GET /api/jobs/[id]/history` - Get job history
- `POST /api/jobs/[id]/history` - Add job history entry

### Public Tracking
- `GET /api/tracking/[trackingId]` - Get job by tracking ID (no auth required)

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository di Vercel
3. Set environment variables
4. Deploy

### Manual Deployment
1. Build aplikasi: `npm run build`
2. Start production server: `npm start`

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── admin/          # Admin dashboard pages
│   ├── api/            # API routes
│   ├── login/          # Login page
│   └── tracking/       # Public tracking page
├── components/         # Reusable components
│   ├── providers/      # Context providers
│   └── ui/            # UI components
├── lib/               # Utility libraries
├── types/             # TypeScript type definitions
└── middleware.ts      # Next.js middleware
```

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with initial data

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Jika mengalami masalah atau memiliki pertanyaan:

1. Check dokumentasi di atas
2. Lihat issues di GitHub repository
3. Buat issue baru jika diperlukan

---

**Dibuat dengan ❤️ menggunakan Next.js dan Supabase**