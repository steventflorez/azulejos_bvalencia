import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Spaces from './components/Spaces'
import WhyUs from './components/WhyUs'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
    useEffect(() => {
        // Refresh ScrollTrigger after all images load
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

        // Fallback refresh after a delay
        const timeout = setTimeout(() => ScrollTrigger.refresh(), 2000)
        return () => clearTimeout(timeout)
    }, [])

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <Navbar />

            {/* Global Wrapper with margins */}
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
