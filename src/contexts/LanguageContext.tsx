'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'id' | 'en'

interface Translations {
  // Header
  home: string
  services: string
  about: string
  contact: string
  
  // Hero Section
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  startProject: string
  learnMore: string
  
  // Services Section
  servicesTitle: string
  servicesSubtitle: string
  webDev: string
  webDevDesc: string
  mobileDev: string
  mobileDevDesc: string
  aiMl: string
  aiMlDesc: string
  thesis: string
  thesisDesc: string
  
  // Features Section
  featuresTitle: string
  featuresSubtitle: string
  qualityCode: string
  qualityCodeDesc: string
  fastDelivery: string
  fastDeliveryDesc: string
  support247: string
  support247Desc: string
  secureReliable: string
  secureReliableDesc: string
  
  // Stats Section
  statsTitle: string
  projectsCompleted: string
  happyClients: string
  yearsExperience: string
  teamMembers: string
  
  // Testimonials Section
  testimonialsTitle: string
  testimonialsSubtitle: string
  
  // Contact Section
  contactTitle: string
  contactSubtitle: string
  contactInfo: string
  contactDescription: string
  phoneWhatsapp: string
  phoneDesc: string
  email: string
  emailDesc: string
  location: string
  locationDesc: string
  followUs: string
  sendMessage: string
  fullName: string
  fullNamePlaceholder: string
  emailPlaceholder: string
  whatsappNumber: string
  whatsappPlaceholder: string
  serviceType: string
  serviceTypePlaceholder: string
  serviceWeb: string
  serviceMobile: string
  serviceAI: string
  serviceThesis: string
  serviceOther: string
  message: string
  messagePlaceholder: string
  sendBtn: string
  
  // Footer
  footerDescription: string
  quickLinks: string
  ourServices: string
  followUsFooter: string
  allRightsReserved: string
  
  // WhatsApp Widget
  whatsappTooltip: string
  whatsappWelcome: string
  whatsappJustNow: string
  quickOptions: string
  freeConsultation: string
  requestQuote: string
  startProjectBtn: string
  startChat: string
  whatsappQuickOptions: string
  whatsappStartChat: string
  whatsappOnlineStatus: string

  // Landing Page Content
  viewServices: string
  viewPortfolio: string
  clientSatisfaction: string
  websiteDevelopment: string
  websiteDescription: string
  responsiveDesign: string
  seoOptimized: string
  fastLoading: string
  aiMachineLearning: string
  aiDescription: string
  predictiveAnalytics: string
  chatbotIntegration: string
  dataProcessing: string
  mobileAppDevelopment: string
  mobileDescription: string
  crossPlatform: string
  nativePerformance: string
  appStoreReady: string
  thesisSolutions: string
  thesisDescription: string
  methodologyConsultation: string
  completeDocumentation: string
  technicalGuidance: string
  thesisConsultation: string
  commercialSolutions: string
  commercialDescription: string
  enterpriseScale: string
  securityFirst: string
  maintenanceSupport: string
  discussRequirements: string
  customDevelopment: string
  customDescription: string
  tailoredSolutions: string
  scalableArchitecture: string
  futureProof: string
  customConsultation: string
  whyChooseTitle: string
  whyChooseSubtitle: string
  premiumQuality: string
  premiumQualityDesc: string
  cuttingEdgeTech: string
  cuttingEdgeTechDesc: string
  experiencedTeam: string
  experiencedTeamDesc: string
  ctaTitle: string
  ctaSubtitle: string
  startFreeConsultation: string
  ctaDescription: string
  contactInfoDesc: string
  available247: string
  responseIn24h: string
  locationAddress: string
  servingIndonesia: string
  enterFullName: string
  selectService: string
  other: string
  mobileApps: string
  portfolio: string
  trackProject: string
}

const translations: Record<Language, Translations> = {
  id: {
    // Header
    home: 'Beranda',
    services: 'Layanan',
    about: 'Tentang',
    contact: 'Kontak',
    
    // Hero Section
    heroTitle: 'Solusi Digital Terdepan untuk Bisnis Anda',
    heroSubtitle: 'Transformasi Digital yang Menguntungkan',
    heroDescription: 'Kami menghadirkan solusi teknologi terdepan untuk mengoptimalkan bisnis Anda. Dari pengembangan website hingga aplikasi mobile dan AI, tim ahli kami siap mewujudkan visi digital Anda.',
    startProject: 'Mulai Proyek',
    learnMore: 'Pelajari Lebih Lanjut',
    
    // Services Section
    servicesTitle: 'Layanan Kami',
    servicesSubtitle: 'Solusi Teknologi Komprehensif untuk Kebutuhan Digital Anda',
    webDev: 'Website Development',
    webDevDesc: 'Pengembangan website modern, responsif, dan SEO-friendly dengan teknologi terkini untuk meningkatkan presence online bisnis Anda.',
    mobileDev: 'Mobile App Development',
    mobileDevDesc: 'Aplikasi mobile native dan cross-platform yang user-friendly dengan performa optimal untuk iOS dan Android.',
    aiMl: 'AI & Machine Learning',
    aiMlDesc: 'Implementasi kecerdasan buatan dan machine learning untuk otomatisasi proses bisnis dan analisis data yang mendalam.',
    thesis: 'Solusi Skripsi',
    thesisDesc: 'Bantuan pengembangan sistem dan aplikasi untuk keperluan skripsi dengan bimbingan teknis yang komprehensif.',
    
    // Features Section
    featuresTitle: 'Mengapa Memilih Kami?',
    featuresSubtitle: 'Keunggulan yang Membuat Kami Berbeda',
    qualityCode: 'Kode Berkualitas Tinggi',
    qualityCodeDesc: 'Standar coding terbaik dengan dokumentasi lengkap dan maintainable code.',
    fastDelivery: 'Pengiriman Cepat',
    fastDeliveryDesc: 'Timeline yang efisien dengan kualitas terjamin sesuai deadline yang disepakati.',
    support247: 'Support 24/7',
    support247Desc: 'Tim support yang siap membantu Anda kapan saja dengan respon yang cepat.',
    secureReliable: 'Aman & Terpercaya',
    secureReliableDesc: 'Keamanan data terjamin dengan sistem backup dan security terdepan.',
    
    // Stats Section
    statsTitle: 'Pencapaian Kami',
    projectsCompleted: 'Proyek Selesai',
    happyClients: 'Klien Puas',
    yearsExperience: 'Tahun Pengalaman',
    teamMembers: 'Anggota Tim',
    
    // Testimonials Section
    testimonialsTitle: 'Apa Kata Klien Kami',
    testimonialsSubtitle: 'Kepuasan klien adalah prioritas utama kami',
    
    // Contact Section
    contactTitle: 'Hubungi Kami',
    contactSubtitle: 'Siap memulai proyek Anda? Tim ahli kami siap membantu mewujudkan ide digital Anda menjadi kenyataan.',
    contactInfo: 'Informasi Kontak',
    contactDescription: 'Kami siap melayani Anda 24/7. Jangan ragu untuk menghubungi kami melalui berbagai channel yang tersedia.',
    phoneWhatsapp: 'Telepon & WhatsApp',
    phoneDesc: 'Tersedia 24/7 untuk konsultasi',
    email: 'Email',
    emailDesc: 'Respon dalam 24 jam',
    location: 'Lokasi',
    locationDesc: 'Melayani seluruh Indonesia',
    followUs: 'Ikuti Kami',
    sendMessage: 'Kirim Pesan',
    fullName: 'Nama Lengkap',
    fullNamePlaceholder: 'Masukkan nama lengkap',
    emailPlaceholder: 'nama@email.com',
    whatsappNumber: 'Nomor WhatsApp',
    whatsappPlaceholder: '+62 851-5526-0322',
    serviceType: 'Jenis Layanan',
    serviceTypePlaceholder: 'Pilih layanan yang dibutuhkan',
    serviceWeb: 'Website Development',
    serviceMobile: 'Mobile App Development',
    serviceAI: 'AI & Machine Learning',
    serviceThesis: 'Solusi Skripsi',
    serviceOther: 'Lainnya',
    message: 'Pesan',
    messagePlaceholder: 'Ceritakan detail proyek Anda...',
    sendBtn: 'Kirim Pesan',
    
    // Footer
    footerDescription: 'KhadevraX adalah partner terpercaya untuk solusi teknologi digital. Kami berkomitmen memberikan layanan terbaik untuk mengembangkan bisnis Anda.',
    quickLinks: 'Tautan Cepat',
    ourServices: 'Layanan Kami',
    followUsFooter: 'Ikuti Kami',
    allRightsReserved: 'Semua hak dilindungi.',
    
    // WhatsApp Widget
    whatsappTooltip: 'Chat dengan kami di WhatsApp',
    whatsappWelcome: 'Halo! 👋 Selamat datang di KhadevraX. Ada yang bisa kami bantu hari ini?',
    whatsappJustNow: 'Baru saja',
    quickOptions: 'Pilihan Cepat:',
    freeConsultation: 'Konsultasi Gratis',
    requestQuote: 'Request Quote',
    startProjectBtn: 'Mulai Proyek',
    startChat: 'Mulai Chat',
    whatsappQuickOptions: 'Pilihan Cepat:',
    whatsappStartChat: 'Mulai Chat',
    whatsappOnlineStatus: 'Online - Siap membantu Anda',

    // Landing Page Content
    viewServices: 'Lihat Layanan',
    viewPortfolio: 'Lihat Portfolio',
    clientSatisfaction: 'Kepuasan Klien',
    websiteDevelopment: 'Website Development',
    websiteDescription: 'Membangun website modern, responsif, dan SEO-friendly yang memberikan pengalaman pengguna terbaik.',
    responsiveDesign: 'Responsive Design',
    seoOptimized: 'SEO Optimized',
    fastLoading: 'Fast Loading',
    aiMachineLearning: 'AI & Machine Learning',
    aiDescription: 'Implementasi solusi AI dan machine learning untuk otomatisasi dan analisis data yang cerdas.',
    predictiveAnalytics: 'Predictive Analytics',
    chatbotIntegration: 'Chatbot Integration',
    dataProcessing: 'Data Processing',
    mobileAppDevelopment: 'Mobile App Development',
    mobileDescription: 'Pengembangan aplikasi mobile native dan cross-platform dengan performa optimal.',
    crossPlatform: 'Cross-Platform',
    nativePerformance: 'Native Performance',
    appStoreReady: 'App Store Ready',
    thesisSolutions: 'Solusi Skripsi & Tugas Akhir',
    thesisDescription: 'Bantuan komprehensif untuk pengembangan sistem dan aplikasi dalam skripsi atau tugas akhir Anda.',
    methodologyConsultation: 'Konsultasi Metodologi',
    completeDocumentation: 'Dokumentasi Lengkap',
    technicalGuidance: 'Bimbingan Teknis',
    thesisConsultation: 'Konsultasi Skripsi',
    commercialSolutions: 'Solusi Komersial',
    commercialDescription: 'Sistem enterprise yang scalable dan secure untuk kebutuhan bisnis skala besar.',
    enterpriseScale: 'Enterprise Scale',
    securityFirst: 'Security First',
    maintenanceSupport: 'Maintenance Support',
    discussRequirements: 'Diskusi Kebutuhan',
    customDevelopment: 'Custom Development',
    customDescription: 'Pengembangan solusi khusus yang disesuaikan dengan kebutuhan spesifik Anda.',
    tailoredSolutions: 'Tailored Solutions',
    scalableArchitecture: 'Scalable Architecture',
    futureProof: 'Future-Proof',
    customConsultation: 'Konsultasi Custom',
    whyChooseTitle: 'Mengapa Memilih KhadevraX?',
    whyChooseSubtitle: 'Kami berkomitmen memberikan solusi teknologi terbaik dengan standar kualitas internasional',
    premiumQuality: 'Kualitas Premium',
    premiumQualityDesc: 'Setiap proyek dikerjakan dengan standar kualitas tinggi dan testing menyeluruh',
    cuttingEdgeTech: 'Teknologi Terdepan',
    cuttingEdgeTechDesc: 'Menggunakan framework dan tools terbaru untuk hasil yang optimal',
    experiencedTeam: 'Tim Berpengalaman',
    experiencedTeamDesc: 'Didukung oleh developer berpengalaman dengan track record yang terbukti',
    ctaTitle: 'Siap Mewujudkan Proyek Digital Anda?',
    ctaSubtitle: 'Mari diskusikan kebutuhan Anda dan temukan solusi terbaik bersama tim expert kami',
    startFreeConsultation: 'Mulai Konsultasi Gratis',
     ctaDescription: 'Siap membantu mewujudkan visi digital Anda. Hubungi kami untuk konsultasi gratis!',
     contactInfoDesc: 'Tim kami siap membantu Anda 24/7',
    available247: 'Tersedia 24/7 untuk konsultasi',
    responseIn24h: 'Respon dalam 24 jam',
    locationAddress: 'Jakarta, Indonesia',
    servingIndonesia: 'Melayani seluruh Indonesia',
    enterFullName: 'Masukkan nama lengkap',
    selectService: 'Pilih layanan yang dibutuhkan',
    other: 'Lainnya',
     mobileApps: 'Mobile Apps',
     portfolio: 'Portfolio',
     trackProject: 'Track Proyek Anda'
  },
  en: {
    // Header
    home: 'Home',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'Leading Digital Solutions for Your Business',
    heroSubtitle: 'Profitable Digital Transformation',
    heroDescription: 'We deliver cutting-edge technology solutions to optimize your business. From website development to mobile apps and AI, our expert team is ready to realize your digital vision.',
    startProject: 'Start Project',
    learnMore: 'Learn More',
    
    // Services Section
    servicesTitle: 'Our Services',
    servicesSubtitle: 'Comprehensive Technology Solutions for Your Digital Needs',
    webDev: 'Website Development',
    webDevDesc: 'Modern, responsive, and SEO-friendly website development with latest technologies to enhance your business online presence.',
    mobileDev: 'Mobile App Development',
    mobileDevDesc: 'User-friendly native and cross-platform mobile applications with optimal performance for iOS and Android.',
    aiMl: 'AI & Machine Learning',
    aiMlDesc: 'Implementation of artificial intelligence and machine learning for business process automation and in-depth data analysis.',
    thesis: 'Thesis Solutions',
    thesisDesc: 'System and application development assistance for thesis purposes with comprehensive technical guidance.',
    
    // Features Section
    featuresTitle: 'Why Choose Us?',
    featuresSubtitle: 'Excellence That Makes Us Different',
    qualityCode: 'High-Quality Code',
    qualityCodeDesc: 'Best coding standards with complete documentation and maintainable code.',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'Efficient timeline with guaranteed quality according to agreed deadlines.',
    support247: '24/7 Support',
    support247Desc: 'Support team ready to help you anytime with quick response.',
    secureReliable: 'Secure & Reliable',
    secureReliableDesc: 'Guaranteed data security with advanced backup and security systems.',
    
    // Stats Section
    statsTitle: 'Our Achievements',
    projectsCompleted: 'Projects Completed',
    happyClients: 'Happy Clients',
    yearsExperience: 'Years Experience',
    teamMembers: 'Team Members',
    
    // Testimonials Section
    testimonialsTitle: 'What Our Clients Say',
    testimonialsSubtitle: 'Client satisfaction is our top priority',
    
    // Contact Section
    contactTitle: 'Contact Us',
    contactSubtitle: 'Ready to start your project? Our expert team is ready to help turn your digital ideas into reality.',
    contactInfo: 'Contact Information',
    contactDescription: 'We are ready to serve you 24/7. Feel free to contact us through various available channels.',
    phoneWhatsapp: 'Phone & WhatsApp',
    phoneDesc: 'Available 24/7 for consultation',
    email: 'Email',
    emailDesc: 'Response within 24 hours',
    location: 'Location',
    locationDesc: 'Serving all of Indonesia',
    followUs: 'Follow Us',
    sendMessage: 'Send Message',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    emailPlaceholder: 'name@email.com',
    whatsappNumber: 'WhatsApp Number',
    whatsappPlaceholder: '+62 851-5526-0322',
    serviceType: 'Service Type',
    serviceTypePlaceholder: 'Select required service',
    serviceWeb: 'Website Development',
    serviceMobile: 'Mobile App Development',
    serviceAI: 'AI & Machine Learning',
    serviceThesis: 'Thesis Solutions',
    serviceOther: 'Others',
    message: 'Message',
    messagePlaceholder: 'Tell us about your project details...',
    sendBtn: 'Send Message',
    
    // Footer
    footerDescription: 'KhadevraX is a trusted partner for digital technology solutions. We are committed to providing the best services to develop your business.',
    quickLinks: 'Quick Links',
    ourServices: 'Our Services',
    followUsFooter: 'Follow Us',
    allRightsReserved: 'All rights reserved.',
    
    // WhatsApp Widget
    whatsappTooltip: 'Chat with us on WhatsApp',
    whatsappWelcome: 'Hello! 👋 Welcome to KhadevraX. How can we help you today?',
    whatsappJustNow: 'Just now',
    quickOptions: 'Quick Options:',
    freeConsultation: 'Free Consultation',
    requestQuote: 'Request Quote',
    startProjectBtn: 'Start Project',
    startChat: 'Start Chat',
    whatsappQuickOptions: 'Quick Options:',
    whatsappStartChat: 'Start Chat',
    whatsappOnlineStatus: 'Online - Ready to help you',

    // Landing Page Content
    viewServices: 'View Services',
    viewPortfolio: 'View Portfolio',
    clientSatisfaction: 'Client Satisfaction',
    websiteDevelopment: 'Website Development',
    websiteDescription: 'Building modern, responsive, and SEO-friendly websites that provide the best user experience.',
    responsiveDesign: 'Responsive Design',
    seoOptimized: 'SEO Optimized',
    fastLoading: 'Fast Loading',
    aiMachineLearning: 'AI & Machine Learning',
    aiDescription: 'Implementation of AI and machine learning solutions for intelligent automation and data analysis.',
    predictiveAnalytics: 'Predictive Analytics',
    chatbotIntegration: 'Chatbot Integration',
    dataProcessing: 'Data Processing',
    mobileAppDevelopment: 'Mobile App Development',
    mobileDescription: 'Development of native and cross-platform mobile applications with optimal performance.',
    crossPlatform: 'Cross-Platform',
    nativePerformance: 'Native Performance',
    appStoreReady: 'App Store Ready',
    thesisSolutions: 'Thesis & Final Project Solutions',
    thesisDescription: 'Comprehensive assistance for system and application development in your thesis or final project.',
    methodologyConsultation: 'Methodology Consultation',
    completeDocumentation: 'Complete Documentation',
    technicalGuidance: 'Technical Guidance',
    thesisConsultation: 'Thesis Consultation',
    commercialSolutions: 'Commercial Solutions',
    commercialDescription: 'Scalable and secure enterprise systems for large-scale business needs.',
    enterpriseScale: 'Enterprise Scale',
    securityFirst: 'Security First',
    maintenanceSupport: 'Maintenance Support',
    discussRequirements: 'Discuss Requirements',
    customDevelopment: 'Custom Development',
    customDescription: 'Development of custom solutions tailored to your specific needs.',
    tailoredSolutions: 'Tailored Solutions',
    scalableArchitecture: 'Scalable Architecture',
    futureProof: 'Future-Proof',
    customConsultation: 'Custom Consultation',
    whyChooseTitle: 'Why Choose KhadevraX?',
    whyChooseSubtitle: 'We are committed to providing the best technology solutions with international quality standards',
    premiumQuality: 'Premium Quality',
    premiumQualityDesc: 'Every project is executed with high quality standards and comprehensive testing',
    cuttingEdgeTech: 'Cutting-Edge Technology',
    cuttingEdgeTechDesc: 'Using the latest frameworks and tools for optimal results',
    experiencedTeam: 'Experienced Team',
    experiencedTeamDesc: 'Supported by experienced developers with proven track records',
    ctaTitle: 'Ready to Realize Your Digital Project?',
    ctaSubtitle: 'Let\'s discuss your needs and find the best solution with our expert team',
    startFreeConsultation: 'Start Free Consultation',
     ctaDescription: 'Ready to help realize your digital vision. Contact us for a free consultation!',
     contactInfoDesc: 'Our team is ready to help you 24/7',
    available247: 'Available 24/7 for consultation',
    responseIn24h: 'Response within 24 hours',
    locationAddress: 'Jakarta, Indonesia',
    servingIndonesia: 'Serving all of Indonesia',
    enterFullName: 'Enter full name',
    selectService: 'Select required service',
    other: 'Other',
     mobileApps: 'Mobile Apps',
     portfolio: 'Portfolio',
     trackProject: 'Track Your Project'
  }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('id')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'id' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('language', language)
  }, [language])

  const value = {
    language,
    setLanguage,
    t: translations[language]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}