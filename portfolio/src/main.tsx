import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './reset.css'
import './index.css'
// import App from './App.tsx'

import { 
  BrowserRouter as Router,  
  Routes,
  Route
} from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import HeadSocial from './components/ui/HeadSocial'

// import './i18n/index'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <div className='container'>
        {/* Header réutilisé sur toutes les pages */}
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      
      {/* Footer réutilisé sur toutes les pages */}
      <hr />
      <Footer />
      <HeadSocial />
    </Router>
  </StrictMode>
)
