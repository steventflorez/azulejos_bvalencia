import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Manifesto from './components/Manifesto'
import Archive from './components/Archive'
import Pricing from './components/Pricing'
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
        <>
            <Navbar />
            <main>
                <Hero />
                <Features />
                <Manifesto />
                <Archive />
                <Contact />

            </main>
            <Footer />
        </>
    )
}
