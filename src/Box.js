import React, { Suspense, useRef, useState } from "react";
import {
  Canvas,
  useLoader,
  useFrame,
  useThree,
  extend,
} from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import HeightMap from "./images/LALT_GGT_MAP.jpg";
import { DoubleSide, Raycaster, RepeatWrapping, Path, Vector2 } from "three";

// since this comes out of three.js, we "extend" it to be usable in jsx.
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({ OrbitControls });
const pointUp = Math.PI / 2;

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    gl: { domElement },
  } = useThree();
  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame((state) => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      autoRotate={true}
    />
  );
};

const Moon = ({ canvasRef }) => {
  const { camera } = useThree();

  const moonRef = useRef();
  const markerRef = useRef();
  const raycaster = new Raycaster();

  const onMoonClick = (event) => {
    const dimensions = canvasRef.current.getBoundingClientRect();
    console.log("clicked.");
    // click(!clicked);
    const pointer = new Vector2(0, 0);
    // I think the intercept issue is happening here. potentially, the pointer location is based on the entire window
    // while the raycaster assumes it will be relative to our little canvas.
    pointer.x = (event.clientX / dimensions.width) * 2 - 1;
    pointer.y = -(event.clientY / dimensions.height) * 2 + 1;

    console.log("raycaster: ", raycaster);
    console.log("pointer: ", pointer);
    // if we pass in `camera.position` instead of `camera`, we get the intersect, but we also get a camera error.
    // if we pass in the whole camera, we get no error, but also no intersect.
    raycaster.setFromCamera(pointer, camera);
    console.log("camera: ", camera);

    // See if the ray from the camera into the world hits one of our meshes
    console.log("moon ref: ", moonRef.current);
    const intersects = raycaster.intersectObject(moonRef.current, true);
    console.log("intersects: ", intersects);

    // Toggle rotation bool for meshes that we clicked
    if (intersects.length > 0) {
      console.log("YOU TOUCHED THE MOON.");
      console.log("intersect: ", intersects[0]);
      setIntersect(intersects[0]);
      markerRef.current && markerRef.current.position.set(0, 0, 0);
      markerRef.current && markerRef.current.lookAt(intersects[0].face.normal);
      console.log("point: ", intersects[0].point);
      markerRef.current && markerRef.current.position.copy(intersects[0].point);
    }
  };

  useFrame(({ clock, mouse }) => {
    if (rotating) {
      moonRef.current.rotation.y += 0.001;
      moonRef.current.updateMatrix();
    }
  });

  const [rotating, setRotating] = useState(false);
  const [intersect, setIntersect] = useState(false);
  const displacementMap = useLoader(TextureLoader, HeightMap);
  displacementMap.wrapS = RepeatWrapping;

  displacementMap.wrapT = RepeatWrapping;
  return (
    <>
      {/* <hemisphereLight />; */}
      <ambientLight intensity={0.2} />
      <directionalLight />
      <mesh ref={moonRef} position={[0, 0, 0]} onClick={onMoonClick}>
        <sphereGeometry args={[2, 84, 84]} />
        <meshPhongMaterial
          // displacementMap={displacementMap}
          displacementScale={0.0}
          color="#fff5ee"
          displacementMap={displacementMap}
          aoMap={displacementMap}
          bumpMap={displacementMap}
          side={DoubleSide}
        />
        <mesh ref={markerRef} position={[-2.5, 1, 1]}>
          <coneGeometry
            args={[0.2, 0.2, 5, 5]}
            // translate={[0, 5, 0]}
            rotateX={pointUp}
          />
          <meshPhongMaterial color="red" />
        </mesh>
      </mesh>
    </>
  );
};

export const Frame = () => {
  const canvas = useRef();
  return (
    <Canvas ref={canvas}>
      <CameraControls />
      <Suspense fallback={null}>
        <Moon canvasRef={canvas} />
      </Suspense>
    </Canvas>
  );
};
