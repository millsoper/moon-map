import React, { Suspense, useRef, useState } from "react";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import HeightMap from "./images/LALT_GGT_MAP.jpg";
import { DoubleSide, Raycaster, RepeatWrapping, Path, Vector2 } from "three";

import { Billboard, Text } from "@react-three/drei";

const pointUp = Math.PI / 2;

const Moon = ({ canvasDimensions }) => {
  const { camera } = useThree();

  const moonRef = useRef();
  const markerRef = useRef();
  const raycaster = new Raycaster();
  // const useEffect = (( ) => {

  // }, []);

  // useEffect(() => { yourRaycaster.intersectObject(ref.current) }, []);
  const onMoonClick = (event) => {
    console.log("clicked.");
    click(!clicked);
    const pointer = new Vector2(0, 0);
    pointer.x = (event.clientX / canvasDimensions.width) * 2 - 1;
    pointer.y = -(event.clientY / canvasDimensions.height) * 2 + 1;
    // you still need to make sure you got the raycaster right, and get the camera.
    console.log("raycaster: ", raycaster);
    console.log("pointer: ", pointer);
    raycaster.setFromCamera(pointer, camera.position);
    console.log("camera: ", camera);

    // See if the ray from the camera into the world hits one of our meshes
    console.log("moon ref: ", moonRef.current);
    const intersects = raycaster.intersectObject(moonRef.current, true);
    console.log("intersects: ", intersects);

    // Toggle rotation bool for meshes that we clicked
    if (intersects.length > 0) {
      console.log("YOU TOUCHED THE MOON.");
      markerRef.current && markerRef.current.position.set(0, 0, 0);
      markerRef.current && markerRef.current.lookAt(intersects[0].face.normal);

      markerRef.current && markerRef.current.position.copy(intersects[0].point);
    }
  };

  // const setLinePoints = useMemo(({ moon, sign }) => {
  //   const points = [moon, sign];
  // }, []);

  useFrame(({ clock, mouse }) => {
    if (clicked) {
      moonRef.current.rotation.y += 0.001;
    }
    // console.log(moonRef.current && moonRef.current.position);
    // okay we can log out the moon position and the cursor position.
    // moon is xyz, cursor is xy
    // const x = (mouse.x * viewport.width) / 2;
    // setMoonLocation(moonRef.current.position);
    // setSignLocation(signLocation.current.position);
    // // const y = (mouse.y * viewport.height) / 2;
    // console.log("sign: ", signRef.current.position);
    // console.log("moon: ", moonRef.current.position);
    // const points = [signRef.current.position, moonRef.currentPosition];
  });
  const [clicked, click] = useState(false);
  const displacementMap = useLoader(TextureLoader, HeightMap);
  displacementMap.wrapS = RepeatWrapping;

  displacementMap.wrapT = RepeatWrapping;
  return (
    <>
      {/* <hemisphereLight />; */}
      <ambientLight intensity={0.2} />
      <directionalLight />
      <mesh ref={moonRef} onClick={onMoonClick}>
        <sphereGeometry args={[2, 84, 84]} />
        <meshPhongMaterial
          // displacementMap={displacementMap}
          displacementScale={0.3}
          color="white"
          displacementMap={displacementMap}
          aoMap={displacementMap}
          bumpMap={displacementMap}
          side={DoubleSide}
        />
      </mesh>
      <mesh ref={markerRef} position={[-2.5, 1, 1]}>
        <coneGeometry
          args={[0.2, 0.1, 3]}
          translate={[0, 5, 0]}
          rotateX={pointUp}
        />
        <meshNormalMaterial color="red" />
      </mesh>
      <Billboard
        position={[-5, 1, 1]}
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false} // Lock the rotation on the z axis (default=false)
      >
        <Text fontSize={0.25} color="black">
          I'm a billboard
        </Text>
      </Billboard>
    </>
  );
};

export const Board = ({ position, label, description }) => {
  return (
    <Billboard
      position={[-5, 1, 1]}
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false} // Lock the rotation on the z axis (default=false)
    >
      <Text fontSize={0.25}>I'm a billboard</Text>
    </Billboard>
  );
};

export const Frame = () => {
  const defaults = { width: "400", height: "400" };
  return (
    <div
      className="canvaswrapper"
      style={{ width: defaults.width, height: defaults.height }}
    >
      <Canvas>
        <Suspense fallback={null}>
          <Moon canvasDimensions={defaults} />
        </Suspense>
      </Canvas>
    </div>
  );
};
