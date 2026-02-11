"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// Type definition for the ref we will expose to the parent
export interface AvatarRef {
    speak: (text: string) => void;
    setEmotion: (emotion: string) => void;
}

// -------------------------------------------------------------------------
// 🤖 CYBERNETIC AI AVATAR (Procedural - No External Files Required)
// -------------------------------------------------------------------------
const Model = forwardRef<THREE.Group, { emotion: string; isSpeaking: boolean }>((props, ref) => {
    const group = useRef<THREE.Group>(null);

    // Internal refs for parts
    const headRef = useRef<THREE.Group>(null);
    const mouthRef = useRef<THREE.Mesh>(null);
    const leftEyeRef = useRef<THREE.Mesh>(null);
    const rightEyeRef = useRef<THREE.Mesh>(null);
    const bodyRef = useRef<THREE.Mesh>(null);

    // Color State
    const eyeColor = useRef(new THREE.Color("#00ffff"));

    // Handle Emotion Changes (Eye Color & Head Tilt)
    const targetRotation = useRef({ x: 0, y: 0 });

    useEffect(() => {
        switch (props.emotion) {
            case "happy":
                eyeColor.current.set("#00ff88"); // Green-ish
                targetRotation.current = { x: -0.1, y: 0.1 };
                break;
            case "sad":
                eyeColor.current.set("#0022ff"); // Deep Blue
                targetRotation.current = { x: 0.2, y: -0.1 };
                break;
            case "angry":
                eyeColor.current.set("#ff0000"); // Red
                targetRotation.current = { x: 0.1, y: 0 };
                break;
            case "fear":
                eyeColor.current.set("#aa00ff"); // Purple
                targetRotation.current = { x: -0.05, y: 0 };
                break;
            default: // neutral
                eyeColor.current.set("#00ffff"); // Cyan
                targetRotation.current = { x: 0, y: 0 };
        }
    }, [props.emotion]);

    // Animation Loop
    useFrame((state, delta) => {
        if (!group.current || !headRef.current) return;

        // 1. Idle Floating
        const t = state.clock.getElapsedTime();
        // Center vertically (0.0) and zoom out with camera instead
        group.current.position.y = 0.0 + Math.sin(t * 1.5) * 0.05;

        // 2. Smooth Head Look
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotation.current.x, delta * 3);
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotation.current.y, delta * 3);

        // 3. Eye Pulse
        if (leftEyeRef.current && rightEyeRef.current) {
            // Lerp color
            if (leftEyeRef.current.material instanceof THREE.MeshStandardMaterial) {
                leftEyeRef.current.material.emissive.lerp(eyeColor.current, delta * 5);
                leftEyeRef.current.material.color.lerp(eyeColor.current, delta * 5);
            }
            if (rightEyeRef.current.material instanceof THREE.MeshStandardMaterial) {
                rightEyeRef.current.material.emissive.lerp(eyeColor.current, delta * 5);
                rightEyeRef.current.material.color.lerp(eyeColor.current, delta * 5);
            }
        }

        // 4. Data-Driven Lip Sync (Scale Mouth)
        if (mouthRef.current) {
            let targetScaleY = 0.2; // Closed

            if (props.isSpeaking) {
                const open = Math.sin(t * 25) * 0.5 + 0.5; // Fast oscillation
                targetScaleY = 0.2 + (open * 0.8);
            }

            mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, targetScaleY, delta * 15);
        }
    });

    return (
        <group ref={group} dispose={null}>
            {/* HEAD GROUP (Centered at 0,0,0 for easier camera targeting) */}
            <group ref={headRef} position={[-1.5, 0.5, 0]}>
                {/* Main Head Shape (Glassy) */}
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[0.65, 64, 64]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        roughness={0.2}
                        metalness={0.2}
                        transmission={0.4}
                        thickness={1.5}
                        clearcoat={0.8}
                        ior={1.5}
                    />
                </mesh>

                {/* Inner Brain / Core (Glowing) */}
                <mesh scale={0.55}>
                    <icosahedronGeometry args={[0.8, 2]} />
                    <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.15} />
                </mesh>

                {/* Left Eye */}
                <mesh ref={leftEyeRef} position={[-0.22, 0.1, 0.58]}>
                    <sphereGeometry args={[0.10, 32, 32]} />
                    <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} toneMapped={false} />
                </mesh>

                {/* Right Eye */}
                <mesh ref={rightEyeRef} position={[0.22, 0.1, 0.58]}>
                    <sphereGeometry args={[0.10, 32, 32]} />
                    <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} toneMapped={false} />
                </mesh>

                {/* Mouth (Bar) */}
                <mesh ref={mouthRef} position={[0, -0.28, 0.6]} rotation={[0, 0, 1.57]}>
                    <capsuleGeometry args={[0.04, 0.2, 4, 8]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
            </group>

            {/* BODY GROUP (Lower down) */}
            <group position={[-1.5, -1.3, 0]}>
                <mesh ref={bodyRef}>
                    <capsuleGeometry args={[0.35, 1.5, 4, 16]} />
                    <meshPhysicalMaterial color="#e0e0e0" roughness={0.2} metalness={0.8} />
                </mesh>

                {/* Glowing Core in Chest */}
                <mesh position={[0, 0.4, 0.3]}>
                    <circleGeometry args={[0.12, 32]} />
                    <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
                </mesh>
            </group>

        </group>
    );
});

Model.displayName = "AvatarModel";

interface AvatarSceneProps {
    emotion: string;
    isSpeaking: boolean;
}

export default function AvatarScene({ emotion, isSpeaking }: AvatarSceneProps) {
    return (
        <div className="w-full h-full min-h-[500px]">
            {/* Professional Studio Lighting & Camera Setup */}
            <Canvas shadows camera={{ position: [0, 0, 8], fov: 35 }}>
                <color attach="background" args={['#050505']} />

                {/* Ambient base */}
                <ambientLight intensity={0.3} />

                {/* Key Light (Warm) */}
                <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow color="#ffeedd" />

                {/* Fill Light (Cool) */}
                <pointLight position={[-5, 0, 5]} intensity={1} color="#6d6aff" />

                {/* Rim Light for separation */}
                <spotLight position={[0, 5, -5]} intensity={3} color="#00ffff" distance={10} />

                <Environment preset="night" blur={0.8} />

                <Model emotion={emotion} isSpeaking={isSpeaking} />

                <ContactShadows opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
            </Canvas>
        </div>
    );
}
