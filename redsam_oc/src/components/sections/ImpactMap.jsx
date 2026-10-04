import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { impactMap } from '../../data/content'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import NeuralSignalConstellation from '../ui/NeuralSignalConstellation'

function AnimatedMetric({ value, colorClass }) {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValue = useRef(value)

  useEffect(() => {
    let startTimestamp = null
    const startVal = prevValue.current
    const diff = value - startVal
    const duration = 600

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3) // cubic ease-out
      setDisplayValue(Math.round(startVal + diff * easeProgress))
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        prevValue.current = value
      }
    }

    requestAnimationFrame(step)
  }, [value])

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.4, y: -4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`font-display text-4xl font-extrabold ${colorClass} tracking-tight leading-none inline-block`}
    >
      {displayValue}
    </motion.span>
  )
}

// Trazado de alta fidelidad (Fase 1) - Polígonos SVG que encajan perfectamente
// y emulan la topografía real de la región San Martín.
const MAP_PATHS = {
  'rioja': 'M 80,40 L 100,30 L 120,20 L 130,25 L 140,40 L 135,60 L 145,80 L 130,100 L 140,120 L 130,140 L 100,135 L 80,110 L 70,80 Z',
  'moyobamba': 'M 140,40 L 160,25 L 180,30 L 200,45 L 210,60 L 195,80 L 185,100 L 175,115 L 155,125 L 140,120 L 130,100 L 145,80 L 135,60 Z',
  'lamas': 'M 210,60 L 230,70 L 245,90 L 235,110 L 250,130 L 245,150 L 225,160 L 205,155 L 190,145 L 175,115 L 185,100 L 195,80 Z',
  'san-martin': 'M 245,90 L 270,100 L 290,115 L 310,125 L 325,145 L 315,165 L 305,185 L 285,195 L 265,185 L 255,165 L 245,150 L 250,130 L 235,110 Z',
  'el-dorado': 'M 190,145 L 205,155 L 225,160 L 215,180 L 200,200 L 185,195 L 170,180 L 175,160 Z',
  'picota': 'M 265,185 L 285,195 L 305,215 L 295,240 L 280,260 L 260,270 L 240,255 L 230,230 L 245,210 L 255,190 Z',
  'huallaga': 'M 200,200 L 215,180 L 225,160 L 245,150 L 255,165 L 265,185 L 255,190 L 245,210 L 230,230 L 210,250 L 195,235 L 185,215 Z',
  'bellavista': 'M 240,255 L 260,270 L 280,260 L 295,240 L 305,215 L 315,225 L 330,245 L 320,270 L 310,295 L 290,315 L 275,300 L 260,310 L 245,290 L 230,275 L 225,260 Z',
  'mariscal-caceres': 'M 130,140 L 155,125 L 175,115 L 190,145 L 175,160 L 170,180 L 185,195 L 200,200 L 185,215 L 195,235 L 210,250 L 230,230 L 240,255 L 225,260 L 230,275 L 245,290 L 260,310 L 275,300 L 290,315 L 270,340 L 250,365 L 230,380 L 210,360 L 190,345 L 170,360 L 150,335 L 135,310 L 120,290 L 115,260 L 105,235 L 90,210 L 110,180 L 120,160 Z',
  'tocache': 'M 230,380 L 250,365 L 270,340 L 290,315 L 305,335 L 315,360 L 305,390 L 290,410 L 270,430 L 250,450 L 235,470 L 215,455 L 225,435 L 215,410 Z'
}

// Centroides exactos para los labels y anillos concéntricos
const MAP_CENTROIDS = {
  'rioja': { x: 105, y: 75 },
  'moyobamba': { x: 170, y: 75 },
  'lamas': { x: 215, y: 115 },
  'san-martin': { x: 280, y: 145 },
  'el-dorado': { x: 195, y: 175 },
  'picota': { x: 265, y: 225 },
  'huallaga': { x: 225, y: 205 },
  'bellavista': { x: 275, y: 270 },
  'mariscal-caceres': { x: 180, y: 275 },
  'tocache': { x: 265, y: 400 }
}

const MAX_VOLUNTEERS = Math.max(...impactMap.provinces.map(p => p.volunteers))
const MAX_PROJECTS = Math.max(...impactMap.provinces.map(p => p.projects))

/**
 * ImpactMap — Mapa interactivo territorial (Versión V2 Rediseñada).
 * Renderiza la silueta completa de la región San Martín segmentada por provincias.
 */
function ImpactMap() {
  const [activeProvince, setActiveProvince] = useState(
    impactMap.provinces.find(p => p.highlight) || impactMap.provinces[0]
  )
  const [hoveredProvince, setHoveredProvince] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const mapContainerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!mapContainerRef.current) return
    const rect = mapContainerRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <section id="impacto" className="bg-page py-16 lg:py-20 overflow-hidden relative">

      {/* ── Fondo: grilla cartográfica ── */}
      <div aria-hidden="true" className="carto-grid pointer-events-none absolute inset-0 opacity-[0.035]" />

      {/* ── Blobs de luz ambiental ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Cian — esquina superior izquierda */}
        <div
          className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #00c0c0 0%, transparent 65%)' }}
        />
        {/* Violeta — zona central-derecha */}
        <div
          className="absolute right-[-10%] top-[25%] h-[420px] w-[420px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #7a3f9f 0%, transparent 65%)' }}
        />
        {/* Magenta — esquina inferior derecha */}
        <div
          className="absolute bottom-[-80px] right-[15%] h-[320px] w-[320px] rounded-full opacity-10 blur-[90px]"
          style={{ background: 'radial-gradient(circle, #e4246c 0%, transparent 65%)' }}
        />
        {/* Ámbar — borde inferior izquierdo */}
        <div
          className="absolute bottom-[5%] left-[5%] h-[200px] w-[200px] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #f0900c 0%, transparent 65%)' }}
        />
      </div>

      {/* ── Red topográfica viva de fondo: Neural Signal Constellation ── */}
      <NeuralSignalConstellation className="z-0 opacity-80" />

      {/* ── Data-chips flotantes (estadísticas reales en el fondo) ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {/* Chip 1 — voluntarios totales */}
        <div
          className="absolute left-[6%] top-[18%] rounded-xl border px-3 py-2 backdrop-blur-sm float-slow"
          style={{ borderColor: 'rgba(0,192,192,0.2)', background: 'rgba(0,192,192,0.04)', animationDelay: '0s' }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent-cyan opacity-60">Voluntarios</p>
          <p className="font-display text-base font-bold text-accent-cyan opacity-70">1,250+</p>
        </div>

        {/* Chip 2 — provincias */}
        <div
          className="absolute right-[4%] top-[22%] rounded-xl border px-3 py-2 backdrop-blur-sm float-slow"
          style={{ borderColor: 'rgba(122,63,159,0.2)', background: 'rgba(122,63,159,0.05)', animationDelay: '1.4s' }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] opacity-60" style={{ color: '#7a3f9f' }}>Provincias</p>
          <p className="font-display text-base font-bold opacity-70" style={{ color: '#7a3f9f' }}>10 activas</p>
        </div>

        {/* Chip 3 — proyectos */}
        <div
          className="absolute left-[3%] bottom-[28%] rounded-xl border px-3 py-2 backdrop-blur-sm float-slow"
          style={{ borderColor: 'rgba(240,144,12,0.2)', background: 'rgba(240,144,12,0.04)', animationDelay: '0.7s' }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent-amber opacity-60">Proyectos</p>
          <p className="font-display text-base font-bold text-accent-amber opacity-70">180+</p>
        </div>

        {/* Chip 4 — año */}
        <div
          className="absolute right-[5%] bottom-[32%] rounded-xl border px-3 py-2 backdrop-blur-sm float-slow"
          style={{ borderColor: 'rgba(228,36,108,0.18)', background: 'rgba(228,36,108,0.04)', animationDelay: '2.1s' }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent-magenta opacity-60">Desde</p>
          <p className="font-display text-base font-bold text-accent-magenta opacity-70">2020</p>
        </div>
      </div>

      {/* ── Línea divisora superior con gradiente de señal ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #00c0c0 30%, #7a3f9f 60%, transparent 100%)',
          opacity: 0.35
        }}
      />
      {/* ── Línea divisora inferior con gradiente de señal ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #7a3f9f 30%, #e4246c 60%, transparent 100%)',
          opacity: 0.25
        }}
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 relative z-10">

        <Reveal>
          <SectionHeading
            kicker={impactMap.kicker}
            title={impactMap.title}
            sub={impactMap.sub}
            tone="day"
          />
        </Reveal>

        <div className="mt-12 flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">
          
          {/* Área del Mapa SVG Avanzado */}
          <Reveal delay={1} className="w-full lg:w-7/12">
            <div 
              ref={mapContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredProvince(null)}
              className="relative w-full max-w-[540px] mx-auto group cursor-crosshair"
            >
              
              <svg 
                viewBox="40 0 320 500" 
                className="w-full h-auto drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}
              >
                <defs>
                  {/* Textura sutil para las provincias (Fase 3) */}
                  <pattern id="jungle-texture" width="4" height="4" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.6" fill="var(--color-signal-cyan)" opacity="0.1"/>
                  </pattern>
                  
                  {/* Gradiente de relleno amazónico */}
                  <linearGradient id="amazon-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--surface-raised)" />
                    <stop offset="100%" stopColor="var(--surface-soft)" />
                  </linearGradient>

                  {/* Sombra de glow activa */}
                  <filter id="active-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Líneas Topográficas de Fondo */}
                <g className="opacity-10 transition-opacity duration-700 group-hover:opacity-25">
                  <ellipse cx="190" cy="250" rx="140" ry="220" fill="none" stroke="var(--color-signal-cyan)" strokeWidth="0.5" strokeDasharray="4 4" />
                  <ellipse cx="190" cy="250" rx="100" ry="160" fill="none" stroke="var(--color-signal-cyan)" strokeWidth="0.5" strokeDasharray="4 4" />
                  <ellipse cx="190" cy="250" rx="60" ry="100" fill="none" stroke="var(--color-signal-cyan)" strokeWidth="0.5" strokeDasharray="4 4" />
                </g>

                {/* Render de Provincias */}
                {impactMap.provinces.map((province, i) => {
                  const isActive = activeProvince.id === province.id
                  const isHovered = hoveredProvince?.id === province.id
                  const points = MAP_PATHS[province.id]
                  if (!points) return null

                  // Longitud de path para asegurar dibujo completo (especialmente en Mariscal Cáceres)
                  const pathLength = 3000

                  return (
                    <g key={`province-group-${province.id}`}>
                      {/* Path Principal de la provincia */}
                      <path
                        d={points}
                        className="province-path cursor-pointer outline-none transition-all duration-300"
                        style={{ 
                          '--path-length': pathLength, 
                          '--i': i,
                          '--target-opacity': isActive ? 0.4 : isHovered ? 0.3 : 0.8,
                          fill: isActive 
                            ? 'var(--color-signal-cyan)' 
                            : isHovered 
                              ? 'rgba(0, 192, 192, 0.25)' 
                              : 'url(#amazon-gradient)',
                          stroke: isActive 
                            ? 'var(--color-signal-cyan)' 
                            : isHovered 
                              ? '#00c0c0' 
                              : 'rgba(0, 192, 192, 0.35)',
                          strokeWidth: isActive ? "2.5" : isHovered ? "1.8" : "1",
                          strokeLinejoin: "round"
                        }}
                        filter={isActive || isHovered ? "url(#active-glow)" : undefined}
                        onMouseEnter={() => {
                          setHoveredProvince(province)
                          setActiveProvince(province)
                        }}
                        onMouseLeave={() => setHoveredProvince(null)}
                        onClick={() => setActiveProvince(province)}
                        onFocus={() => setActiveProvince(province)}
                        tabIndex={0}
                        aria-label={`Ver provincia de ${province.name}`}
                      />

                      {/* Textura superpuesta solo si está inactiva */}
                      {!isActive && (
                        <path
                          d={points}
                          fill="url(#jungle-texture)"
                          className="pointer-events-none province-path"
                          style={{ 
                            '--path-length': pathLength, 
                            '--i': i,
                            '--target-opacity': 1 
                          }}
                        />
                      )}
                    </g>
                  )
                })}

                {/* Río Animado Central (Huallaga y afluentes) - Fase 2 */}
                <path
                  className="signal-dash pointer-events-none"
                  d="M 230,380 C 240,300 230,250 265,185 C 275,160 250,120 270,100"
                  stroke="var(--color-signal-cyan)"
                  strokeWidth="1.5"
                  strokeDasharray="6 8"
                  fill="none"
                  opacity="0.4"
                />

                {/* Rayo de Señal Interactivo / Beam Line (Conexión dinámica con nodo central) */}
                {activeProvince.id !== 'san-martin' && MAP_CENTROIDS[activeProvince.id] && (
                  <g className="pointer-events-none">
                    {/* Haz de luz de fondo */}
                    <line
                      x1={MAP_CENTROIDS['san-martin'].x}
                      y1={MAP_CENTROIDS['san-martin'].y}
                      x2={MAP_CENTROIDS[activeProvince.id].x}
                      y2={MAP_CENTROIDS[activeProvince.id].y}
                      stroke="var(--color-signal-cyan)"
                      strokeWidth="2.5"
                      strokeOpacity="0.25"
                      filter="url(#active-glow)"
                    />
                    {/* Línea de pulso con energía animada */}
                    <line
                      x1={MAP_CENTROIDS['san-martin'].x}
                      y1={MAP_CENTROIDS['san-martin'].y}
                      x2={MAP_CENTROIDS[activeProvince.id].x}
                      y2={MAP_CENTROIDS[activeProvince.id].y}
                      stroke="url(#line-cv)"
                      strokeWidth="1.8"
                      strokeDasharray="4 6"
                      className="signal-dash"
                    />
                  </g>
                )}

                {/* Nodos Activos y Labels Integrados - Fase 4 */}
                {impactMap.provinces.map((province) => {
                  const isActive = activeProvince.id === province.id
                  const centroid = MAP_CENTROIDS[province.id]
                  if (!centroid) return null

                  return (
                    <g 
                      key={`label-${province.id}`} 
                      className={`transition-all duration-500 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`}
                      transform={`translate(${centroid.x}, ${centroid.y})`}
                    >
                      {/* Anillos Pulsantes Concéntricos */}
                      <circle cx="0" cy="0" r="4" fill="var(--surface)" stroke="var(--color-signal-cyan)" strokeWidth="2" />
                      
                      {/* CSS Rings */}
                      <circle cx="0" cy="0" r="12" fill="none" stroke="var(--color-signal-cyan)" className="node-pulse" strokeWidth="0.5" />
                      
                      {/* Etiqueta SVG integrada */}
                      <rect 
                        x="12" y="-9" 
                        width={province.name.length * 6 + 10} 
                        height="18" 
                        rx="4" 
                        fill="var(--surface)" 
                        stroke="var(--line)" 
                        strokeWidth="1"
                        className="drop-shadow-lg"
                      />
                      <text 
                        x="17" y="3" 
                        fontSize="8" 
                        fontFamily="var(--font-mono)" 
                        fontWeight="bold" 
                        fill="var(--text-strong)"
                        letterSpacing="1"
                        className="uppercase"
                      >
                        {province.name}
                      </text>
                    </g>
                  )
                })}

                {/* Puntos Inactivos */}
                {impactMap.provinces.map((province) => {
                  const isActive = activeProvince.id === province.id
                  const centroid = MAP_CENTROIDS[province.id]
                  if (!centroid || isActive) return null

                  return (
                    <circle 
                      key={`dot-${province.id}`}
                      cx={centroid.x} 
                      cy={centroid.y} 
                      r="2.5" 
                      fill="var(--text-muted)" 
                      opacity="0.5"
                      className="pointer-events-none transition-opacity duration-300 group-hover:opacity-100"
                    />
                  )
                })}
              </svg>

              {/* Minimapa de Contexto (Perú) - Fase 4 */}
              <div className="absolute top-4 right-4 opacity-30 hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block">
                <svg viewBox="0 0 100 140" width="50" height="70" className="drop-shadow-md">
                  {/* Silueta simplificada de Perú */}
                  <path 
                    d="M 30,10 L 40,20 L 35,40 L 20,45 L 10,60 L 20,80 L 40,110 L 50,130 L 60,130 L 80,100 L 90,80 L 85,50 L 95,30 L 70,10 Z" 
                    fill="var(--surface-raised)" 
                    stroke="var(--line)" 
                    strokeWidth="1" 
                  />
                  {/* San Martín resaltado */}
                  <circle cx="42" cy="38" r="4" fill="var(--color-signal-cyan)" className="animate-pulse" />
                </svg>
              </div>

              {/* Tooltip Magnético Flotante Reactivo */}
              <AnimatePresence>
                {hoveredProvince && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      x: mousePos.x + 14, 
                      y: mousePos.y - 45 
                    }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    className="pointer-events-none absolute left-0 top-0 z-30 hidden sm:flex items-center gap-2.5 rounded-xl border border-line bg-surface-soft/90 px-3.5 py-2 shadow-2xl backdrop-blur-md"
                  >
                    <span className="h-2 w-2 rounded-full bg-signal-cyan shadow-[0_0_8px_var(--color-signal-cyan)]" />
                    <div>
                      <p className="font-display text-xs font-bold text-fg-strong leading-none">
                        {hoveredProvince.name}
                      </p>
                      <p className="font-mono text-[9px] text-fg-muted uppercase tracking-wider mt-1">
                        {hoveredProvince.volunteers} vol. · {hoveredProvince.projects} proy.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </Reveal>

          {/* Panel de Información Lateral - Modernizado */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center">
            <Reveal delay={2}>
              <div className="p-8 sm:p-10 rounded-3xl bg-surface-raised border border-fg-line shadow-2xl relative overflow-hidden group hover:border-accent transition-colors duration-500">
                {/* Resplandor dinámico de fondo */}
                <div 
                  className="absolute -right-20 -top-20 w-56 h-56 rounded-full opacity-10 blur-[60px] transition-all duration-700 group-hover:opacity-20 group-hover:scale-110"
                  style={{ backgroundColor: 'var(--color-signal-cyan)' }}
                />
                
                <h3 className="font-display text-3xl md:text-4xl font-bold text-fg-strong mb-1">
                  {activeProvince.name}
                </h3>
                <p className="text-sm font-mono tracking-widest uppercase text-fg-muted mb-8">
                  Provincia
                </p>
                
                <div className="space-y-10">
                  
                  {/* Módulo Voluntarios */}
                  <div className="transform transition-all duration-300">
                    <div className="flex justify-between items-end mb-3">
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan shadow-[0_0_8px_var(--color-signal-cyan)]"></span>
                        Voluntarios
                      </p>
                      <AnimatedMetric value={activeProvince.volunteers} colorClass="text-accent-cyan" />
                    </div>
                    {/* Barra de progreso animada */}
                    <div className="relative h-1.5 w-full rounded-full bg-surface overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-signal-cyan transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${(activeProvince.volunteers / MAX_VOLUNTEERS) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Módulo Proyectos */}
                  <div className="transform transition-all duration-300 delay-75">
                    <div className="flex justify-between items-end mb-3">
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-signal-amber shadow-[0_0_8px_var(--color-signal-amber)]"></span>
                        Proyectos
                      </p>
                      <AnimatedMetric value={activeProvince.projects} colorClass="text-accent-amber" />
                    </div>
                    {/* Barra de progreso animada */}
                    <div className="relative h-1.5 w-full rounded-full bg-surface overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-signal-amber transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${(activeProvince.projects / MAX_PROJECTS) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ImpactMap
