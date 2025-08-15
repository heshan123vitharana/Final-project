import { useState, useEffect } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import About from './components/About'
import Features from './components/Features'
import NewArrivals from './components/NewArrivals'
import CollectionCenters from './components/CollectionCenters'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const handleNavigation = (page) => {
    setCurrentPage(page)
    
    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(page)
      if (element) {
        const headerHeight = 80
        const elementPosition = element.offsetTop - headerHeight
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'collection-centers', 'contact']
      const headerHeight = 80
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= headerHeight && rect.bottom > headerHeight) {
            setCurrentPage(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={handleNavigation} currentPage={currentPage} />
      
      <main>
        <section id="home">
          <HeroSection />
        </section>
        
        <section id="about" className="py-16">
          <About />
        </section>
        
        <Features />
        
        <NewArrivals />
        
        <section id="collection-centers" className="py-16">
          <CollectionCenters />
        </section>
        
        <section id="contact" className="py-16">
          <Contact />
        </section>
      </main>
      
      <Footer />
      
      {/* Quick Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <button
          onClick={scrollToTop}
          className="bg-paddy-green text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
        
        <button
          onClick={() => handleNavigation('contact')}
          className="bg-rice-gold text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-all duration-300 hover:scale-110"
          aria-label="Contact us"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
        
        <a
          href="tel:+94112345678"
          className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-110"
          aria-label="Emergency contact"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default App
