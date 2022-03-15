import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Canvas,
  ReactThreeFiber,
  useFrame,
  useLoader,
  useThree,
} from '@react-three/fiber';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
//@ts-ignore
import boldUrl from './assets/fonts/bold.blob';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


extend({ TextGeometry });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      textGeometry: any;
    }
  }
}

const Text3d = () => {
  const ref = useRef<THREE.Mesh>();


  const font = useLoader(FontLoader, boldUrl);
  useFrame((state, delta) => {
    if (ref.current) {
      // console.log(Math.cos(state.clock.elapsedTime));
      ref.current.rotation.y = Math.cos(state.clock.elapsedTime) * Math.PI / 4;
     
    }
    
  });
  const config = {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1,
      }
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <textGeometry attach="geometry" args={['Slimmii', config]} onUpdate={(geometry: any) => {  
    geometry.center()
    }}/>
      <meshPhongMaterial shininess={100} color={'#00bbff'} />
    </mesh>
  );
  
};

const Box = () => {
  const ref = useRef<THREE.Mesh>();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]} scale={1}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'hotpink'} />
    </mesh>
  );
};

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);

      controls.minDistance = 3;
      controls.maxDistance = 20;
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};

function App() {
  return (
    <Canvas>
      <CameraController/>
      <ambientLight />
      <pointLight position={[5, 5, 5]} />
      <Suspense fallback={null}>
        <Text3d />
      </Suspense>
    </Canvas>
  );
}

export default App;
