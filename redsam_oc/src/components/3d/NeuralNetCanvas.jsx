import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** 
 * NeuralNetCanvas — red neuronal interactiva con partículas 3D 
 * para usar como fondo de secciones (About, Pillars, etc.)
 */
function NeuralNet({ nodeCount = 60 }) {
  const pointsRef = useRef()
  const linesRef = useRef()

  const { positions, linePositions, colors } = useMemo(() => {
    // Nodos
    const pos = new Float32Array(nodeCount * 3)
    const col = new Float32Array(nodeCount * 3)
    const SIGNAL = ['#00c0c0', '#7a3f9f', '#e4246c', '#f0900c'].map((c) => new THREE.Color(c))
    for (let i = 0; i < nodeCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
      const c = SIGNAL[i % SIGNAL.length]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    // Conexiones entre nodos cercanos
    const linePairs = []
    const DIST_THRESHOLD = 2.6
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = pos[i * 3] - pos[j * 3]
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < DIST_THRESHOLD) {
          linePairs.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2],
          )
        }
      }
    }

    return {
      positions: pos,
      linePositions: new Float32Array(linePairs),
      colors: col,
    }
  }, [nodeCount])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.06
      pointsRef.current.rotation.x = Math.sin(t * 0.04) * 0.08
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.06
      linesRef.current.rotation.x = Math.sin(t * 0.04) * 0.08
    }
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00c0c0"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </>
  )
}

export default function NeuralNetCanvas({ className = '' }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: 'default',
      }}
      dpr={[1, 1.5]}
      className={className}
    >
      <ambientLight intensity={0.4} />
      <NeuralNet nodeCount={55} />
    </Canvas>
  )
}
