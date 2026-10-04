import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Aplica el tema guardado antes del primer render (evita parpadeo).
const savedTheme = localStorage.getItem('redsam-theme')
if (savedTheme === 'black' || savedTheme === 'light') {
  document.documentElement.dataset.theme = savedTheme
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
