import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Ring, Torus } from '@react-three/drei'
import * as THREE from 'three'

/** Paleta de señal de marca REDSAM */
const SIGNAL_COLORS = ['#00c0c0', '#7a3f9f', '#e4246c', '#f0900c']

/** Esfera principal central con distorsión fluida */
function CoreSphere() {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.12
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.1
    }
  })
  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <Sphere ref={meshRef} args={[1.1, 64, 64]}>
        <MeshDistortMaterial
          color="#00c0c0"
          emissive="#004a4a"
          emissiveIntensity={0.4}
          attach="material"
          distort={0.38}
          speed={2.2}
          roughness={0.15}
          metalness={0.4}
          wireframe={false}
          transparent
          opacity={0.92}
          envMapIntensity={1.2}
        />
      </Sphere>
    </Float>
  )
}

/** Anillo orbital exterior */
function OrbitalRing({ color, radius, thickness, tiltX, tiltZ, speed }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed
    }
  })
  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <Torus ref={ref} args={[radius, thickness, 3, 80]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.55}
          roughness={0.1}
          metalness={0.9}
        />
      </Torus>
    </group>
  )
}

/** Nodos flotantes (esferas pequeñas orbitando) */
function FloatingNodes() {
  const nodes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2
        const radius = 2.2 + Math.random() * 1.6
        const colorIndex = i % SIGNAL_COLORS.length
        return {
          id: i,
          angle,
          radius,
          height: (Math.random() - 0.5) * 2.4,
          size: 0.04 + Math.random() * 0.08,
          color: SIGNAL_COLORS[colorIndex],
          speed: 0.18 + Math.random() * 0.22,
          phase: Math.random() * Math.PI * 2,
        }
      }),
    [],
  )

  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const node = nodes[i]
        if (!node) return
        const t = state.clock.elapsedTime * node.speed + node.phase
        child.position.x = Math.cos(t) * node.radius
        child.position.z = Math.sin(t) * node.radius
        child.position.y = node.height + Math.sin(t * 0.7) * 0.3
        const pulse = 0.85 + Math.sin(t * 2.5) * 0.15
        child.scale.setScalar(pulse)
      })
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node) => (
        <mesh key={node.id}>
          <sphereGeometry args={[node.size, 16, 16]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={1.4}
            roughness={0.0}
            metalness={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Partículas de campo energético */
function EnergyField() {
  const count = 280
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3.2 + Math.random() * 2.4
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.cos(phi)
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return pos
  }, [])

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3)
    const palette = SIGNAL_COLORS.map((c) => new THREE.Color(c))
    for (let i = 0; i < count; i++) {
      const c = palette[i % palette.length]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return col
  }, [])

  const particlesRef = useRef()
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.04
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.025) * 0.12
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/** Escena 3D completa del Hero */
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 52 }}
      style={{ background: 'transparent' }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 1.8]}
    >
      {/* Iluminación cinematográfica */}
      <ambientLight intensity={0.25} />
      <pointLight position={[-4, 3, 4]} intensity={2.8} color="#00c0c0" />
      <pointLight position={[4, -2, 3]} intensity={2.2} color="#e4246c" />
      <pointLight position={[0, 5, -3]} intensity={1.8} color="#7a3f9f" />
      <spotLight
        position={[0, 8, 2]}
        intensity={3.5}
        color="#f0900c"
        angle={0.45}
        penumbra={0.9}
        decay={2}
      />

      {/* Objetos 3D */}
      <CoreSphere />
      <OrbitalRing color="#00c0c0" radius={1.8} thickness={0.018} tiltX={Math.PI / 3} tiltZ={0.3} speed={0.55} />
      <OrbitalRing color="#e4246c" radius={2.3} thickness={0.013} tiltX={-Math.PI / 5} tiltZ={0.7} speed={-0.38} />
      <OrbitalRing color="#7a3f9f" radius={2.8} thickness={0.01} tiltX={Math.PI / 8} tiltZ={-0.4} speed={0.22} />
      <FloatingNodes />
      <EnergyField />
    </Canvas>
  )
}
