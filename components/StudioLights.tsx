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
          />
          <Lightformer
            form="rect"
            intensity={10}
            position={[10, 0, 5]}
            scale={10}
          />
          <Lightformer
            form="rect"
            intensity={5}
            position={[0, 10, 0]}
            scale={10}
          />
        </group>
      </Environment>
    </group>
  );
};

export default StudioLights;
