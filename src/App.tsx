import { useLocation, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HeadSocial from './components/ui/HeadSocial'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import AdminIndex from './pages/admin/Index'
import AdminProjects from './pages/admin/Projects'
import NewProject from './pages/admin/NewProject'
import ProjectTypes from './pages/admin/ProjectTypes'
import Targets from './pages/admin/Targets'
import Skills from './pages/admin/Skills'
import FunFacts from './pages/admin/FunFacts'
import Login from './pages/admin/Login'
import AuthCallback from './pages/admin/AuthCallback'
import NotFound from './pages/NotFound'
import AdminNotFound from './pages/admin/NotFound'
import RequireAdminAuth from './components/admin/RequireAdminAuth'
import AdminAuthRedirect from './components/admin/AdminAuthRedirect'

export default function App() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <>
      <AdminAuthRedirect />
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/auth/callback" element={<AuthCallback />} />
        <Route path="/admin" element={<RequireAdminAuth />}>
          <Route index element={<AdminIndex />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/new" element={<NewProject />} />
          <Route path="project-types" element={<ProjectTypes />} />
          <Route path="targets" element={<Targets />} />
          <Route path="skills" element={<Skills />} />
          <Route path="fun-facts" element={<FunFacts />} />
          <Route path="*" element={<AdminNotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
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
