import React, {
  Suspense,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import HeightMap from "./images/LALT_GGT_MAP.jpg";
import otherHeightMap from "./images/heightmapper512x512.png";
import { DoubleSide, Raycaster, RepeatWrapping, Path } from "three";

import { Billboard, Plane, Text } from "@react-three/drei";

const Moon = ({ canvasDimensions }) => {
  const { viewport } = useThree();
  const [cursorPoints, setCursorPoints] = useState();
  const [moonLocation, setMoonLocation] = useState([0, 0, 0]);
  const [signLocation, setSignLocation] = useState([-5, 1, 1]);
  const moonRef = useRef();
  const signRef = useRef();
  const lineRef = useRef();
  // const raycaster = new Raycaster();
  // const useEffect = (( ) => {

  // }, []);
  // const onPointerMove = ( event ) => {

  //     pointer.x = ( event.clientX / canvasDimensions.width ) * 2 - 1;
  //     pointer.y = - ( event.clientY / canvasDimensions.height ) * 2 + 1;
  //     raycaster.setFromCamera( pointer, camera );

  //     // See if the ray from the camera into the world hits one of our meshes
  //     const intersects = raycaster.intersectObject( mesh );

  //     // Toggle rotation bool for meshes that we clicked
  //     if ( intersects.length > 0 ) {

  //         helper.position.set( 0, 0, 0 );
  //         helper.lookAt( intersects[ 0 ].face.normal );

  //         helper.position.copy( intersects[ 0 ].point );

  //     }

  // }

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
      <mesh
        ref={moonRef}
        onClick={() => {
          click(!clicked);
        }}
      >
        <icosahedronBufferGeometry args={[2, 84, 84]} />
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

      <Billboard
        ref={signRef}
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
