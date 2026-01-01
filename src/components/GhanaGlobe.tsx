import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Stars } from '@react-three/drei';
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

// Glowing point component for MDA locations
function MDAPoint({
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

  const color = useMemo(() => {
    switch (mda.type) {
      case 'headquarters': return '#FCD116'; // Gold
      case 'ministry': return '#006B3F'; // Green
      case 'agency': return '#CE1126'; // Red
      case 'commission': return '#FCD116'; // Gold
      case 'regional': return '#006B3F'; // Green
      default: return '#ffffff';
    }
  }, [mda.type]);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = isHovered ? 1.5 : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.scale.setScalar(scale);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(isHovered ? 3 : 2 + Math.sin(state.clock.elapsedTime * 2) * 0.5);
    }
  });

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Core point */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover(mda)}
        onPointerLeave={() => onHover(null)}
      >
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Label on hover */}
      {isHovered && (
        <Html
          position={[0, 0.1, 0]}
          center
          style={{
            transition: 'all 0.2s',
            opacity: 1,
            transform: 'scale(1)',
          }}
        >
          <div className="bg-surface-900/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-ghana-gold/30 shadow-xl whitespace-nowrap">
            <p className="text-white font-semibold text-sm">{mda.name}</p>
            <p className="text-ghana-gold text-xs">{mda.city}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Connection lines between headquarters and regional offices
function ConnectionLines({ radius }: { radius: number }) {
  const linesRef = useRef<THREE.Group>(null);

  const headquarters = MDA_LOCATIONS.find(m => m.type === 'headquarters')!;
  const hqPosition = latLngToVector3(headquarters.lat, headquarters.lng, radius);

  const curves = useMemo(() => {
    return MDA_LOCATIONS
      .filter(m => m.type === 'regional')
      .map(mda => {
        const endPosition = latLngToVector3(mda.lat, mda.lng, radius);

        // Create curved line
        const midPoint = new THREE.Vector3()
          .addVectors(hqPosition, endPosition)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(radius * 1.15);

        const curve = new THREE.QuadraticBezierCurve3(
          hqPosition,
          midPoint,
          endPosition
        );

        return curve;
      });
  }, [hqPosition, radius]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const material = child.material as THREE.LineBasicMaterial;
          material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={linesRef}>
      {curves.map((curve, i) => {
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial
              color="#FCD116"
              transparent
              opacity={0.4}
              linewidth={1}
            />
          </line>
        );
      })}
    </group>
  );
}

// Animated particles around the globe
function GlobeParticles({ radius }: { radius: number }) {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    const colors = new Float32Array(200 * 3);

    const ghanaColors = [
      new THREE.Color('#006B3F'),
      new THREE.Color('#FCD116'),
      new THREE.Color('#CE1126'),
    ];

    for (let i = 0; i < 200; i++) {
      // Random position on sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (1.05 + Math.random() * 0.1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const color = ghanaColors[Math.floor(Math.random() * ghanaColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [radius]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={200}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main globe component
function Globe({ hoveredMDA, setHoveredMDA }: {
  hoveredMDA: typeof MDA_LOCATIONS[0] | null;
  setHoveredMDA: (mda: typeof MDA_LOCATIONS[0] | null) => void;
}) {
  const globeRef = useRef<THREE.Group>(null);
  const radius = 1;

  // Auto-rotate globe
  useFrame((state) => {
    if (globeRef.current && !hoveredMDA) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  // Ghana highlight position
  const ghanaPosition = latLngToVector3(GHANA_CENTER.lat, GHANA_CENTER.lng, radius);

  return (
    <group ref={globeRef}>
      {/* Globe sphere */}
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.9}
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>

      {/* Globe wireframe */}
      <Sphere args={[radius * 1.001, 32, 32]}>
        <meshBasicMaterial
          color="#006B3F"
          transparent
          opacity={0.1}
          wireframe
        />
      </Sphere>

      {/* Ghana highlight glow */}
      <mesh position={ghanaPosition}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial
          color="#FCD116"
          transparent
          opacity={0.2}
        />
      </mesh>
      <mesh position={ghanaPosition}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshBasicMaterial
          color="#FCD116"
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Connection lines */}
      <ConnectionLines radius={radius} />

      {/* MDA Points */}
      {MDA_LOCATIONS.map((mda, i) => (
        <MDAPoint
          key={i}
          position={latLngToVector3(mda.lat, mda.lng, radius * 1.01)}
          mda={mda}
          onHover={setHoveredMDA}
          isHovered={hoveredMDA?.name === mda.name}
        />
      ))}

      {/* Particles */}
      <GlobeParticles radius={radius} />
    </group>
  );
}

// Main exported component
export default function GhanaGlobe() {
  const [hoveredMDA, setHoveredMDA] = useState<typeof MDA_LOCATIONS[0] | null>(null);

  return (
    <div className="relative w-full h-[500px] md:h-[600px]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ghana-green/5 to-transparent rounded-3xl" />

      {/* Stats overlay */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-surface-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 border border-white/10">
        <div className="text-ghana-gold font-bold text-lg sm:text-2xl">{MDA_LOCATIONS.length}</div>
        <div className="text-surface-300 text-xs sm:text-sm">MDAs Connected</div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10 bg-surface-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 border border-white/10 space-y-1 sm:space-y-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-ghana-gold" />
          <span className="text-surface-300 text-[10px] sm:text-xs">Headquarters</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-ghana-green" />
          <span className="text-surface-300 text-[10px] sm:text-xs">Regional Offices</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-ghana-red" />
          <span className="text-surface-300 text-[10px] sm:text-xs">Agencies</span>
        </div>
      </div>

      {/* Instruction */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-surface-400 text-[10px] sm:text-sm flex items-center gap-1 sm:gap-2">
        <span className="hidden md:inline">Drag to rotate</span>
        <span className="inline md:hidden">Touch to explore</span>
        <svg className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      </div>

      {/* Canvas */}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#006B3F" />

        <Globe hoveredMDA={hoveredMDA} setHoveredMDA={setHoveredMDA} />

        <Stars
          radius={100}
          depth={50}
          count={1000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!hoveredMDA}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
        />
      </Canvas>

      {/* Hovered MDA info panel */}
      {hoveredMDA && (
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10 bg-surface-900/95 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-ghana-gold/30 shadow-xl max-w-[200px] sm:max-w-xs animate-fade-in">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 sm:mt-1.5 flex-shrink-0 ${
              hoveredMDA.type === 'headquarters' ? 'bg-ghana-gold' :
              hoveredMDA.type === 'regional' ? 'bg-ghana-green' : 'bg-ghana-red'
            }`} />
            <div>
              <h4 className="text-white font-semibold text-xs sm:text-sm leading-tight">{hoveredMDA.name}</h4>
              <p className="text-ghana-gold text-[10px] sm:text-sm">{hoveredMDA.city}</p>
              <p className="text-surface-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1 capitalize">{hoveredMDA.type.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
