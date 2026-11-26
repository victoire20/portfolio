import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './reset.css'
import './index.css'

import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './auth/AuthProvider'
import './i18n/index'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>
)
