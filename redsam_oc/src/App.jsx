import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/layout/ScrollProgress'
import WhatsAppButton from './components/layout/WhatsAppButton'
import DynamicMeshBackground from './components/ui/DynamicMeshBackground'
import Home from './pages/Home'
import LibroReclamaciones from './pages/LibroReclamaciones'

function App() {
  return (
    <>
      <DynamicMeshBackground />
      <ScrollProgress />
      <Navbar />
      <WhatsAppButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/libro-de-reclamaciones" element={<LibroReclamaciones />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App