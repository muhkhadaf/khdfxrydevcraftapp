'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  Code, 
  Smartphone, 
  Brain, 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Globe,
  Zap,
  Users,
  Award
} from 'lucide-react'

export default function HomePage() {
  useEffect(() => {
    // Initialize AOS
    const initAOS = async () => {
      try {
        const AOS = (await import('aos')).default
        AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true,
          offset: 100
        })
      } catch (error) {
        console.error('Failed to initialize AOS:', error)
      }
    }
    initAOS()
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              khdfxryd devcraft
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link
              href="/tracking"
              className="hidden sm:inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
            >
              Track Project
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div data-aos="fade-up" className="mb-6 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                Wujudkan Ide Digital Anda Bersama{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  khdfxryd devcraft
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2">
                Solusi lengkap pengembangan aplikasi web, mobile, dan sistem berbasis AI untuk kebutuhan skripsi hingga komersial
              </p>
            </div>
            
            <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-2">
              <Link
                href="#services"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Lihat Layanan Kami
                <ArrowRight className="inline-block w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
              <Link
                href="#portfolio"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300"
              >
                Lihat Portfolio
              </Link>
            </div>

            {/* Stats */}
            <div data-aos="fade-up" data-aos-delay="400" className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">50+</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Proyek Selesai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-2">100%</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Kepuasan Klien</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">24/7</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1 sm:mb-2">3+</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Tahun Pengalaman</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h3 data-aos="fade-up" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Layanan Unggulan Kami
            </h3>
            <p data-aos="fade-up" data-aos-delay="100" className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2">
              Dari konsep hingga implementasi, kami menyediakan solusi teknologi terdepan untuk berbagai kebutuhan Anda
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Website Development */}
            <div data-aos="fade-up" data-aos-delay="200" className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                <Globe className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Website Development
              </h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                Pembuatan website modern, responsif, dan SEO-friendly dengan teknologi terkini seperti React, Next.js, dan Node.js
              </p>
              <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 md:mb-6">
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Responsive Design</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>SEO Optimized</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Fast Loading</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-colors"
              >
                Konsultasi Gratis
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>

            {/* ML-Based Website */}
            <div data-aos="fade-up" data-aos-delay="300" className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                AI & Machine Learning
              </h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                Integrasi kecerdasan buatan dan machine learning untuk website yang lebih cerdas dan interaktif
              </p>
              <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 md:mb-6">
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Predictive Analytics</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Chatbot Integration</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Data Processing</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-colors"
              >
                Pelajari Lebih Lanjut
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>

            {/* Mobile App Development */}
            <div data-aos="fade-up" data-aos-delay="400" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                <Smartphone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Mobile App Development
              </h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                Pengembangan aplikasi mobile native dan cross-platform untuk iOS dan Android dengan performa optimal
              </p>
              <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 md:mb-6">
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Cross-Platform</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Native Performance</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>App Store Ready</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-colors"
              >
                Mulai Proyek
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>

            {/* Thesis Solutions */}
            <div data-aos="fade-up" data-aos-delay="500" className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Solusi Skripsi & Tugas Akhir
              </h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                Bantuan pengembangan aplikasi untuk keperluan skripsi, tugas akhir, dan penelitian akademik
              </p>
              <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 md:mb-6">
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Konsultasi Metodologi</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Dokumentasi Lengkap</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Bimbingan Teknis</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-colors"
              >
                Konsultasi Skripsi
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>

            {/* Commercial Solutions */}
            <div data-aos="fade-up" data-aos-delay="600" className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Solusi Komersial
              </h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                Pengembangan sistem enterprise dan aplikasi bisnis untuk meningkatkan efisiensi operasional perusahaan
              </p>
              <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 md:mb-6">
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Enterprise Scale</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Security First</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Maintenance Support</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-colors"
              >
                Diskusi Kebutuhan
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>

            {/* Custom Development */}
            <div data-aos="fade-up" data-aos-delay="700" className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-700 dark:to-gray-600 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Custom Development
              </h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                Solusi khusus sesuai kebutuhan spesifik Anda dengan teknologi terdepan dan pendekatan yang inovatif
              </p>
              <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 md:mb-6">
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Tailored Solutions</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Scalable Architecture</span>
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Future-Proof</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-colors"
              >
                Konsultasi Custom
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h3 data-aos="fade-up" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Mengapa Memilih khdfxryd devcraft?
            </h3>
            <p data-aos="fade-up" data-aos-delay="100" className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2">
              Komitmen kami adalah memberikan solusi teknologi terbaik dengan kualitas premium dan layanan yang memuaskan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div data-aos="fade-up" data-aos-delay="200" className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Award className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Kualitas Premium</h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-2">
                Setiap proyek dikerjakan dengan standar kualitas tinggi dan attention to detail
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="300" className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Zap className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Teknologi Terdepan</h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-2">
                Menggunakan framework dan tools terbaru untuk hasil yang optimal dan future-proof
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="400" className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Tim Berpengalaman</h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-2">
                Didukung oleh tim developer berpengalaman dengan track record yang terbukti
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="500" className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Star className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Support 24/7</h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-2">
                Layanan support dan maintenance yang responsif untuk menjaga performa aplikasi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <div data-aos="fade-up" className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-2">
              Siap Mewujudkan Proyek Digital Anda?
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 px-2">
              Konsultasikan ide Anda dengan tim ahli kami dan dapatkan solusi terbaik untuk kebutuhan teknologi Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
              <Link
                href="/contact"
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Mulai Konsultasi Gratis
              </Link>
              <Link
                href="/tracking"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300"
              >
                Track Proyek Anda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  khdfxryd devcraft
                </h4>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Mitra terpercaya untuk solusi pengembangan aplikasi web, mobile, dan sistem berbasis AI. 
                Dari konsep hingga implementasi, kami siap mewujudkan visi digital Anda.
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Layanan</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#services" className="hover:text-white transition-colors">Website Development</Link></li>
                <li><Link href="#services" className="hover:text-white transition-colors">Mobile Apps</Link></li>
                <li><Link href="#services" className="hover:text-white transition-colors">AI & Machine Learning</Link></li>
                <li><Link href="#services" className="hover:text-white transition-colors">Solusi Skripsi</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tracking" className="hover:text-white transition-colors">Track Project</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Admin Login</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 khdfxryd devcraft. All rights reserved. Crafted with ❤️ for digital innovation.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}