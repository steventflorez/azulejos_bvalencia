import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Spaces from './components/Spaces'
import WhyUs from './components/WhyUs'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Seo from './components/Seo'
import { useSettings } from './hooks/useSettings'
import { toOpeningHoursSpec } from './utils/schedule'

import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'

gsap.registerPlugin(ScrollTrigger)

function HomePage() {
    const { schedule } = useSettings()
    const localBusiness = {
        '@context': 'https://schema.org',
        '@type': 'HomeAndConstructionBusiness',
        name: 'Azulejos Valencia',
        description: 'Azulejos y porcelanatos para piscinas, cocinas y baños en Valencia.',
        url: window.location.origin,
        telephone: '+34692580681',
        email: 'genesis2777@gmail.com',
        image: `${window.location.origin}/images/hero.png`,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Calle Cura Palanca 1, bajo 1',
            postalCode: '46013',
            addressLocality: 'Valencia',
            addressRegion: 'Valencia',
            addressCountry: 'ES',
        },
        openingHoursSpecification: toOpeningHoursSpec(schedule),
    }

    useEffect(() => {
        const imgs = document.querySelectorAll('img')
        let loaded = 0
        const refresh = () => {
            loaded++
            if (loaded >= imgs.length) ScrollTrigger.refresh()
        }
        imgs.forEach((img) => {
            if (img.complete) refresh()
            else img.addEventListener('load', refresh)
        })
        const timeout = setTimeout(() => ScrollTrigger.refresh(), 2000)
        return () => clearTimeout(timeout)
    }, [])

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <Seo
                path="/"
                description="Azulejos Valencia — Azulejos y porcelanatos de lujo para piscinas, cocinas y baños exclusivos. Transforma tu espacio en una obra de arte."
                image={`${window.location.origin}/images/hero.png`}
                jsonLd={localBusiness}
            />
            <Navbar />
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 bg-[var(--color-bg-surface)] shadow-2xl relative">
                <main>
                    <Hero />
                    <Spaces />
                    <WhyUs />
                    <Gallery />
                    <Contact />
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin" element={<AdminPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
