import { useLocation, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HeadSocial from './components/ui/HeadSocial'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import AdminIndex from './pages/admin/Index'
import Login from './pages/admin/Login'

export default function App() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminIndex />} />
        <Route path="/admin/login" element={<Login />} />
      </Routes>
      {!isAdminRoute && (
        <>
          <hr />
          <Footer />
          <HeadSocial />
        </>
      )}
    </>
  )
}
