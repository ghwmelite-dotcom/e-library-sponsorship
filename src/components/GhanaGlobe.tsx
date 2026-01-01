import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Stars, Float, Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Ghana's approximate center coordinates
const GHANA_CENTER = {
  lat: 7.9465,
  lng: -1.0232,
};

// MDA locations across Ghana (approximate coordinates)
const MDA_LOCATIONS = [
  { name: 'Office of the Head of Civil Service', city: 'Accra', lat: 5.5560, lng: -0.1969, type: 'headquarters' },
  { name: 'Ministry of Finance', city: 'Accra', lat: 5.5503, lng: -0.2074, type: 'ministry' },
  { name: 'Ministry of Education', city: 'Accra', lat: 5.5614, lng: -0.1879, type: 'ministry' },
  { name: 'Ministry of Health', city: 'Accra', lat: 5.5580, lng: -0.2010, type: 'ministry' },
  { name: 'Ghana Revenue Authority', city: 'Accra', lat: 5.5490, lng: -0.2150, type: 'agency' },
  { name: 'Electoral Commission', city: 'Accra', lat: 5.5670, lng: -0.1820, type: 'commission' },
  { name: 'Northern Regional Admin', city: 'Tamale', lat: 9.4034, lng: -0.8424, type: 'regional' },
  { name: 'Ashanti Regional Admin', city: 'Kumasi', lat: 6.6885, lng: -1.6244, type: 'regional' },
  { name: 'Western Regional Admin', city: 'Sekondi-Takoradi', lat: 4.9340, lng: -1.7137, type: 'regional' },
  { name: 'Eastern Regional Admin', city: 'Koforidua', lat: 6.0940, lng: -0.2610, type: 'regional' },
  { name: 'Central Regional Admin', city: 'Cape Coast', lat: 5.1315, lng: -1.2795, type: 'regional' },
  { name: 'Volta Regional Admin', city: 'Ho', lat: 6.6000, lng: 0.4700, type: 'regional' },
  { name: 'Upper East Regional Admin', city: 'Bolgatanga', lat: 10.7856, lng: -0.8514, type: 'regional' },
  { name: 'Upper West Regional Admin', city: 'Wa', lat: 10.0601, lng: -2.5099, type: 'regional' },
  { name: 'Bono Regional Admin', city: 'Sunyani', lat: 7.3349, lng: -2.3123, type: 'regional' },
  { name: 'Savannah Regional Admin', city: 'Damongo', lat: 9.0833, lng: -1.8167, type: 'regional' },
];

// Convert lat/lng to 3D sphere coordinates
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// ===== ATMOSPHERIC GLOW EFFECT =====
function AtmosphericGlow({ radius }: { radius: number }) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Inner atmosphere */}
      <Sphere ref={glowRef} args={[radius * 1.05, 64, 64]}>
        <meshBasicMaterial
          color="#006B3F"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>
      {/* Outer atmosphere glow */}
      <Sphere args={[radius * 1.12, 64, 64]}>
        <meshBasicMaterial
          color="#FCD116"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </Sphere>
      {/* Ethereal outer ring */}
      <Sphere args={[radius * 1.2, 32, 32]}>
        <meshBasicMaterial
          color="#006B3F"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

// ===== PULSING BEACON AT HEADQUARTERS =====
function HeadquartersBeacon({ position, radius }: { position: THREE.Vector3; radius: number }) {
  const beaconRef = useRef<THREE.Group>(null);
  const pulseRings = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Animate pulse rings
    pulseRings.current.forEach((ring, i) => {
      if (ring) {
        const phase = (time * 0.8 + i * 0.5) % 2;
        const scale = 1 + phase * 2;
        ring.scale.setScalar(scale);
        ring.material.opacity = Math.max(0, 0.6 - phase * 0.3);
      }
    });
  });

  return (
    <group position={position} ref={beaconRef}>
      {/* Central bright core */}
      <mesh>
        <sphereGeometry args={[0.03, 32, 32]} />
        <meshBasicMaterial color="#FCD116" />
      </mesh>

      {/* Glowing aura */}
      <mesh>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshBasicMaterial color="#FCD116" transparent opacity={0.5} />
      </mesh>

      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) pulseRings.current[i] = el; }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.03, 0.04, 32]} />
          <meshBasicMaterial color="#FCD116" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Vertical beam */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.002, 0.01, 0.3, 8]} />
        <meshBasicMaterial color="#FCD116" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// ===== ANIMATED DATA PARTICLES FLOWING ALONG CONNECTIONS =====
function DataFlowParticle({
  curve,
  speed,
  delay,
  color
}: {
  curve: THREE.QuadraticBezierCurve3;
  speed: number;
  delay: number;
  color: string;
}) {
  const particleRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const t = ((time * speed + delay) % 1);

    if (particleRef.current) {
      const position = curve.getPoint(t);
      particleRef.current.position.copy(position);

      // Pulsing size
      const scale = 0.008 + Math.sin(time * 10) * 0.002;
      particleRef.current.scale.setScalar(scale * 50);
    }
  });

  return (
    <mesh ref={particleRef}>
      <sphereGeometry args={[0.008, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

// ===== ENHANCED CONNECTION LINES WITH DATA FLOW =====
function EnhancedConnectionLines({ radius }: { radius: number }) {
  const linesRef = useRef<THREE.Group>(null);
  const headquarters = MDA_LOCATIONS.find(m => m.type === 'headquarters')!;
  const hqPosition = latLngToVector3(headquarters.lat, headquarters.lng, radius);

  const curves = useMemo(() => {
    return MDA_LOCATIONS
      .filter(m => m.type === 'regional')
      .map(mda => {
        const endPosition = latLngToVector3(mda.lat, mda.lng, radius);
        const midPoint = new THREE.Vector3()
          .addVectors(hqPosition, endPosition)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(radius * 1.2);

        return new THREE.QuadraticBezierCurve3(hqPosition, midPoint, endPosition);
      });
  }, [hqPosition, radius]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const material = child.material as THREE.LineBasicMaterial;
          material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 1.5 + i * 0.3) * 0.15;
        }
      });
    }
  });

  return (
    <group>
      {/* Base connection lines */}
      <group ref={linesRef}>
        {curves.map((curve, i) => {
          const points = curve.getPoints(80);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          return (
            <line key={`line-${i}`} geometry={geometry}>
              <lineBasicMaterial color="#FCD116" transparent opacity={0.25} linewidth={1} />
            </line>
          );
        })}
      </group>

      {/* Glowing line overlay */}
      <group>
        {curves.map((curve, i) => {
          const points = curve.getPoints(80);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          return (
            <line key={`glow-${i}`} geometry={geometry}>
              <lineBasicMaterial color="#006B3F" transparent opacity={0.1} linewidth={2} />
            </line>
          );
        })}
      </group>

      {/* Data flow particles */}
      {curves.map((curve, i) => (
        <group key={`particles-${i}`}>
          <DataFlowParticle curve={curve} speed={0.3} delay={i * 0.1} color="#FCD116" />
          <DataFlowParticle curve={curve} speed={0.3} delay={i * 0.1 + 0.5} color="#006B3F" />
        </group>
      ))}
    </group>
  );
}

// ===== ORBITAL RINGS =====
function OrbitalRings({ radius }: { radius: number }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.1;
      ring1Ref.current.rotation.x = Math.PI / 3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.08;
      ring2Ref.current.rotation.x = Math.PI / 2.5;
      ring2Ref.current.rotation.y = time * 0.05;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 0.06;
      ring3Ref.current.rotation.x = Math.PI / 4;
    }
  });

  return (
    <group>
      {/* Main orbital ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[radius * 1.4, 0.003, 16, 100]} />
        <meshBasicMaterial color="#FCD116" transparent opacity={0.3} />
      </mesh>

      {/* Secondary ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[radius * 1.55, 0.002, 16, 100]} />
        <meshBasicMaterial color="#006B3F" transparent opacity={0.2} />
      </mesh>

      {/* Third decorative ring */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[radius * 1.7, 0.001, 16, 100]} />
        <meshBasicMaterial color="#CE1126" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ===== FLOATING ORBIT SATELLITES =====
function OrbitingSatellite({
  radius,
  speed,
  offset,
  tilt,
  color
}: {
  radius: number;
  speed: number;
  offset: number;
  tilt: number;
  color: string;
}) {
  const satelliteRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (satelliteRef.current) {
      const angle = time * speed + offset;
      satelliteRef.current.position.x = Math.cos(angle) * radius;
      satelliteRef.current.position.z = Math.sin(angle) * radius;
      satelliteRef.current.position.y = Math.sin(angle * 0.5) * tilt;
      satelliteRef.current.rotation.y = angle;
    }
  });

  return (
    <group ref={satelliteRef}>
      <mesh>
        <octahedronGeometry args={[0.02, 0]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.035, 0]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// ===== HOLOGRAPHIC GRID OVERLAY =====
function HolographicGrid({ radius }: { radius: number }) {
  const gridRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <Sphere ref={gridRef} args={[radius * 1.002, 48, 48]}>
      <meshBasicMaterial
        color="#00ff88"
        transparent
        opacity={0.03}
        wireframe
      />
    </Sphere>
  );
}

// ===== ENHANCED MDA POINT =====
function EnhancedMDAPoint({
  position,
  mda,
  onHover,
  isHovered,
}: {
  position: THREE.Vector3;
  mda: typeof MDA_LOCATIONS[0];
  onHover: (mda: typeof MDA_LOCATIONS[0] | null) => void;
  isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    switch (mda.type) {
      case 'headquarters': return '#FCD116';
      case 'ministry': return '#006B3F';
      case 'agency': return '#CE1126';
      case 'commission': return '#FCD116';
      case 'regional': return '#006B3F';
      default: return '#ffffff';
    }
  }, [mda.type]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (meshRef.current) {
      const baseScale = mda.type === 'headquarters' ? 1.5 : 1;
      const pulse = isHovered ? 1.8 : baseScale + Math.sin(time * 3 + position.x * 10) * 0.2;
      meshRef.current.scale.setScalar(pulse);
    }

    if (glowRef.current) {
      const glowScale = isHovered ? 4 : 2.5 + Math.sin(time * 2 + position.x * 10) * 0.5;
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.material.opacity = isHovered ? 0.5 : 0.25 + Math.sin(time * 3) * 0.1;
    }

    if (ringRef.current && isHovered) {
      ringRef.current.rotation.z = time * 2;
    }
  });

  return (
    <group position={position}>
      {/* Outer ethereal glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>

      {/* Core point */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover(mda)}
        onPointerLeave={() => onHover(null)}
      >
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Inner bright core */}
      <mesh>
        <sphereGeometry args={[0.006, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Hover ring effect */}
      {isHovered && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.035, 0.045, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Label on hover */}
      {isHovered && (
        <Html
          position={[0, 0.12, 0]}
          center
          style={{
            transition: 'all 0.2s',
            opacity: 1,
            transform: 'scale(1)',
          }}
        >
          <div className="bg-surface-900/95 backdrop-blur-md px-4 py-3 rounded-xl border border-ghana-gold/50 shadow-2xl shadow-ghana-gold/20 whitespace-nowrap">
            <p className="text-white font-bold text-sm">{mda.name}</p>
            <p className="text-ghana-gold text-xs mt-1">{mda.city}</p>
            <div className="flex items-center gap-1 mt-2">
              <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: color }} />
              <span className="text-surface-400 text-xs capitalize">{mda.type}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ===== ENHANCED GLOBE PARTICLES =====
function EnhancedParticles({ radius }: { radius: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const innerParticlesRef = useRef<THREE.Points>(null);

  const [particles, innerParticles] = useMemo(() => {
    // Outer particles
    const positions = new Float32Array(400 * 3);
    const colors = new Float32Array(400 * 3);
    const sizes = new Float32Array(400);

    const ghanaColors = [
      new THREE.Color('#006B3F'),
      new THREE.Color('#FCD116'),
      new THREE.Color('#CE1126'),
    ];

    for (let i = 0; i < 400; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (1.08 + Math.random() * 0.15);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const color = ghanaColors[Math.floor(Math.random() * ghanaColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 0.015 + 0.005;
    }

    // Inner sparkle particles
    const innerPositions = new Float32Array(200 * 3);
    const innerColors = new Float32Array(200 * 3);

    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (1.02 + Math.random() * 0.03);

      innerPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      innerPositions[i * 3 + 1] = r * Math.cos(phi);
      innerPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Mostly white/gold for inner sparkles
      const isGold = Math.random() > 0.5;
      const color = isGold ? new THREE.Color('#FCD116') : new THREE.Color('#ffffff');
      innerColors[i * 3] = color.r;
      innerColors[i * 3 + 1] = color.g;
      innerColors[i * 3 + 2] = color.b;
    }

    return [
      { positions, colors, sizes },
      { positions: innerPositions, colors: innerColors }
    ];
  }, [radius]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.03;
      particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
    }
    if (innerParticlesRef.current) {
      innerParticlesRef.current.rotation.y = -time * 0.02;
    }
  });

  return (
    <group>
      {/* Outer particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={400} array={particles.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={400} array={particles.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.012} vertexColors transparent opacity={0.7} sizeAttenuation />
      </points>

      {/* Inner sparkle particles */}
      <points ref={innerParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={200} array={innerParticles.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={200} array={innerParticles.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.008} vertexColors transparent opacity={0.9} sizeAttenuation />
      </points>
    </group>
  );
}

// ===== MAIN GLOBE COMPONENT =====
function Globe({ hoveredMDA, setHoveredMDA }: {
  hoveredMDA: typeof MDA_LOCATIONS[0] | null;
  setHoveredMDA: (mda: typeof MDA_LOCATIONS[0] | null) => void;
}) {
  const globeRef = useRef<THREE.Group>(null);
  const radius = 1;
  const headquarters = MDA_LOCATIONS.find(m => m.type === 'headquarters')!;
  const hqPosition = latLngToVector3(headquarters.lat, headquarters.lng, radius * 1.01);
  const ghanaPosition = latLngToVector3(GHANA_CENTER.lat, GHANA_CENTER.lng, radius);

  useFrame((state) => {
    if (globeRef.current && !hoveredMDA) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Atmospheric glow */}
      <AtmosphericGlow radius={radius} />

      {/* Main globe sphere */}
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial
          color="#0d1117"
          transparent
          opacity={0.95}
          roughness={0.6}
          metalness={0.4}
        />
      </Sphere>

      {/* Holographic grid overlay */}
      <HolographicGrid radius={radius} />

      {/* Globe wireframe - primary */}
      <Sphere args={[radius * 1.001, 48, 48]}>
        <meshBasicMaterial color="#006B3F" transparent opacity={0.08} wireframe />
      </Sphere>

      {/* Secondary wireframe for depth */}
      <Sphere args={[radius * 1.003, 24, 24]}>
        <meshBasicMaterial color="#FCD116" transparent opacity={0.03} wireframe />
      </Sphere>

      {/* Ghana highlight glow - layered effect */}
      <mesh position={ghanaPosition}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshBasicMaterial color="#FCD116" transparent opacity={0.1} />
      </mesh>
      <mesh position={ghanaPosition}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color="#FCD116" transparent opacity={0.2} />
      </mesh>
      <mesh position={ghanaPosition}>
        <sphereGeometry args={[0.06, 32, 32]} />
        <meshBasicMaterial color="#FCD116" transparent opacity={0.4} />
      </mesh>

      {/* Headquarters beacon */}
      <HeadquartersBeacon position={hqPosition} radius={radius} />

      {/* Enhanced connection lines with data flow */}
      <EnhancedConnectionLines radius={radius} />

      {/* MDA Points */}
      {MDA_LOCATIONS.filter(m => m.type !== 'headquarters').map((mda, i) => (
        <EnhancedMDAPoint
          key={i}
          position={latLngToVector3(mda.lat, mda.lng, radius * 1.01)}
          mda={mda}
          onHover={setHoveredMDA}
          isHovered={hoveredMDA?.name === mda.name}
        />
      ))}

      {/* Enhanced particles */}
      <EnhancedParticles radius={radius} />

      {/* Orbital rings */}
      <OrbitalRings radius={radius} />

      {/* Orbiting satellites */}
      <OrbitingSatellite radius={1.5} speed={0.3} offset={0} tilt={0.2} color="#FCD116" />
      <OrbitingSatellite radius={1.65} speed={-0.2} offset={Math.PI} tilt={0.15} color="#006B3F" />
      <OrbitingSatellite radius={1.45} speed={0.25} offset={Math.PI / 2} tilt={0.1} color="#CE1126" />
    </group>
  );
}

// ===== ANIMATED STATS COUNTER =====
function AnimatedStats() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => (prev + 1) % 1000);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return null; // Stats shown in HTML overlay
}

// ===== MAIN EXPORTED COMPONENT =====
export default function GhanaGlobe() {
  const [hoveredMDA, setHoveredMDA] = useState<typeof MDA_LOCATIONS[0] | null>(null);
  const [activeConnections, setActiveConnections] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnections(prev => (prev + Math.floor(Math.random() * 5)) % 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[650px] lg:h-[700px]">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ghana-green/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ghana-gold/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Stats overlay - enhanced */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
        <div className="bg-surface-900/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-ghana-gold/30 shadow-xl shadow-black/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-ghana-green animate-pulse" />
            <span className="text-surface-400 text-[10px] sm:text-xs uppercase tracking-wider">Live Network</span>
          </div>
          <div className="text-ghana-gold font-bold text-2xl sm:text-4xl">{MDA_LOCATIONS.length}</div>
          <div className="text-surface-300 text-xs sm:text-sm">MDAs Connected</div>
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="text-ghana-green text-xs sm:text-sm font-medium">
              {activeConnections}+ Active Connections
            </div>
          </div>
        </div>
      </div>

      {/* Legend - enhanced */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10">
        <div className="bg-surface-900/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 shadow-xl shadow-black/50">
          <div className="text-surface-400 text-[10px] sm:text-xs uppercase tracking-wider mb-2">Node Types</div>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-ghana-gold shadow-lg shadow-ghana-gold/50" />
              <span className="text-surface-300 text-[10px] sm:text-xs">Headquarters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-ghana-green shadow-lg shadow-ghana-green/50" />
              <span className="text-surface-300 text-[10px] sm:text-xs">Regional Offices</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-ghana-red shadow-lg shadow-ghana-red/50" />
              <span className="text-surface-300 text-[10px] sm:text-xs">Agencies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction - enhanced */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <div className="bg-surface-900/80 backdrop-blur-md rounded-lg sm:rounded-xl px-3 py-2 border border-white/10 flex items-center gap-2">
          <span className="text-surface-300 text-[10px] sm:text-xs hidden md:inline">Drag to explore</span>
          <span className="text-surface-300 text-[10px] sm:text-xs md:hidden">Touch to explore</span>
          <div className="w-5 h-5 rounded-full border border-ghana-gold/50 flex items-center justify-center">
            <svg className="w-3 h-3 text-ghana-gold animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        {/* Enhanced lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#006B3F" />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#FCD116" />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={0.8}
          intensity={1}
          color="#FCD116"
        />

        <Globe hoveredMDA={hoveredMDA} setHoveredMDA={setHoveredMDA} />

        {/* Enhanced stars */}
        <Stars
          radius={100}
          depth={50}
          count={3000}
          factor={4}
          saturation={0.3}
          fade
          speed={0.5}
        />

        {/* Sparkles around the scene */}
        <Sparkles
          count={100}
          scale={5}
          size={2}
          speed={0.3}
          color="#FCD116"
          opacity={0.3}
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!hoveredMDA}
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>

      {/* Hovered MDA info panel - enhanced */}
      {hoveredMDA && (
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10 animate-fade-in">
          <div className="bg-surface-900/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-ghana-gold/40 shadow-2xl shadow-ghana-gold/10 max-w-[220px] sm:max-w-xs">
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 shadow-lg ${
                hoveredMDA.type === 'headquarters' ? 'bg-ghana-gold shadow-ghana-gold/50' :
                hoveredMDA.type === 'regional' ? 'bg-ghana-green shadow-ghana-green/50' : 'bg-ghana-red shadow-ghana-red/50'
              }`} />
              <div>
                <h4 className="text-white font-bold text-sm sm:text-base leading-tight">{hoveredMDA.name}</h4>
                <p className="text-ghana-gold text-xs sm:text-sm mt-1">{hoveredMDA.city}, Ghana</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                  <span className="text-surface-400 text-[10px] sm:text-xs capitalize">{hoveredMDA.type.replace('_', ' ')}</span>
                  <span className="text-ghana-green text-[10px] sm:text-xs">• Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
