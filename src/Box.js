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
import {
  DoubleSide,
  Raycaster,
  RepeatWrapping,
  Vector2,
  Vector3,
  ArrowHelper,
} from "three";

// since this comes out of three.js, we "extend" it to be usable in jsx.
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({ OrbitControls, ArrowHelper });

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
      rotateSpeed={0.3}
      ref={controls}
      args={[camera, domElement]}
      // autoRotate={true}
    />
  );
};

const Moon = ({ canvasRef }) => {
  const { camera } = useThree();
  const [intersect, setIntersect] = useState(false);

  const moonRef = useRef();
  const raycaster = new Raycaster();
  const arrow = useRef();

  const onMoonClick = (event) => {
    const dimensions = canvasRef.current.getBoundingClientRect();
    console.log("clicked.");

    const pointer = new Vector2(0, 0);

    pointer.x = (event.clientX / dimensions.width) * 2 - 1;
    pointer.y = -(event.clientY / dimensions.height) * 2 + 1;

    console.log("raycaster: ", raycaster);
    console.log("pointer: ", pointer);
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
      if (intersects[0].face) {
        const n = new Vector3();
        n.copy(intersects[0].face.normal);
        n.transformDirection(intersects[0].object.matrixWorld);

        arrow.current.setDirection(n);
        arrow.current.position.copy(intersects[0].point);

        // arrow.current && markerRef.current.position.set(0, 0, 0);
        // markerRef.current &&
        //   markerRef.current.lookAt(intersects[0].face.normal);
        // console.log("point: ", intersects[0].point);
        // markerRef.current &&
        //   markerRef.current.position.copy(intersects[0].point);
      }
    }
  };

  const [rotating, setRotating] = useState(false);
  const displacementMap = useLoader(TextureLoader, HeightMap);
  displacementMap.wrapS = RepeatWrapping;

  displacementMap.wrapT = RepeatWrapping;
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight />
      <mesh ref={moonRef} position={[0, 0, 0]} onClick={onMoonClick}>
        <sphereGeometry args={[2, 84, 84]} />
        <meshPhongMaterial
          displacementScale={0.2}
          color="#fff5ee"
          displacementMap={displacementMap}
          aoMap={displacementMap}
          bumpMap={displacementMap}
          side={DoubleSide}
        />
        <arrowHelper
          ref={arrow}
          args={[new Vector3(), new Vector3(), 1, "red"]}
        />
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
