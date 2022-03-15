import {
  Physics, useBox, usePlane
} from '@react-three/cannon';
import {
  Canvas, extend, useLoader,
  useThree
} from '@react-three/fiber';
import { useControls } from 'leva';
import React, { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import './App.css';
//@ts-ignore
import boldUrl from './assets/fonts/bold.blob';

extend({ TextGeometry });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      textGeometry: any;
    }
  }
}

const Letter3D = ({ letter, position }: { letter: string, position: [number,number, number] }) => {
  const [firstRef] = useBox(() => ({
    mass: 1,
    position: position,
    args: [0, 0, 0],
  }));
  const font = useLoader(FontLoader, boldUrl);

  const config = {
    font,
    size: 1,
    height: 0.5,
  };
  return (
    <mesh ref={firstRef} castShadow>
      <textGeometry attach="geometry" args={[letter, config]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};


interface LetterWidthMap { 
  [key: string]: number
}
const LetterWidthMap: LetterWidthMap = {
  "S": 1.0,
  "L": 1.0,
  "I": 0.5,
  "M": 1.2,
  "A": 1.0,
  "N": 1.2

}

const Text3d = ({ text }: { text: string }) => {
  let currPos : number = -2.5;
  return (
    <>
      {text.split("").map((letter, index) => {
        let prevLetter = text.split("")[index-1];
        if (prevLetter) {
          currPos += ((LetterWidthMap[prevLetter]) ?? 1.0);
        }
        return <Letter3D key={`${letter}_${index}`} letter={letter} position={[currPos,8,0]}/>;

      })}
    </>
  );
};

const Ground = (props: any) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry attach="geometry" args={[20, 20]} />
      <meshStandardMaterial color={"#2c589e"} side={THREE.DoubleSide} />
    </mesh>
  );
};

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.minDistance = 3;
    controls.maxDistance = 20;
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
};

const Cube = (props: any) => {
  const [ref] = useBox(() => ({ mass: 1, ...props }));
  return (
    <mesh castShadow ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const Box = (props: any) => {
  const [ref] = useBox(() => ({ mass: 1, ...props }));

  return (
    <mesh castShadow ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color={'#00bbff'} />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas
      shadows={true}
      dpr={[1, 2]}
      camera={{ position: [-5, 5, 5], fov: 50 }}
    >
      <Scene />
    </Canvas>
  );
};

const Scene = () => {
  // const { text, light } = useControls({ text: 'SLIMMII', light: [1, 0.5, 0] });

  return (
    <>
      <ambientLight />
      <spotLight
        angle={0.25}
        penumbra={0.5}
        position={[10, 10, 5]}
        castShadow
      />

      <Suspense fallback={null}>
        <Physics>
          <Ground />
          <Text3d text={"SLIMMII"} />
        </Physics>
      </Suspense>
    </>
  );
};

export default App;
