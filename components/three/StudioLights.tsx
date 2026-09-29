import { Environment, Lightformer } from "@react-three/drei";
import React from "react";

const StudioLights = () => {
  return (
    <group name="lights">
      <Environment resolution={256}>
        <group>
          <Lightformer
            form="rect"
            intensity={10}
            position={[-10, 5, -5]}
            scale={10}
            rotation-y={Math.PI / 2}
          />
          <Lightformer
            form="rect"
            intensity={10}
            position={[10, 0, 1]}
            scale={10}
          />
          {/* top softbox: gives the dark finish a visible sheen on the deck and lid */}
          <Lightformer
            form="rect"
            intensity={4}
            position={[0, 10, 0]}
            rotation-x={Math.PI / 2}
            scale={[20, 8, 1]}
          />
          {/* soft front fill so the front edge and palm rest don't fall to black */}
          <Lightformer
            form="rect"
            intensity={1.5}
            position={[0, 2, 10]}
            scale={[12, 4, 1]}
          />
          {/* back rim light separates the silhouette from the black page */}
          <Lightformer
            form="ring"
            intensity={3}
            position={[0, 3, -10]}
            scale={8}
          />
        </group>
      </Environment>
      <spotLight 
        position={[-2, 10, 5]}
        angle={0.15}
        decay={0}
        intensity={Math.PI * 0.2}
      />
      <spotLight 
        position={[0, -25, 10]}
        angle={0.15}
        decay={0}
        intensity={Math.PI * 0.2}
      />
      <spotLight 
        position={[0, 15, 5]}
        angle={0.15}
        decay={0.1}
        intensity={Math.PI * 1}
      />
    </group>
  );
};

export default StudioLights;
