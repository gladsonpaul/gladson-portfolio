import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Work from './components/Work'
import BuildProcess from './components/BuildProcess'
import AISection from './components/AISection'
import TechStack from './components/TechStack'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Work />
        <BuildProcess />
        <AISection />
        <TechStack />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
