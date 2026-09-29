import type { ThreeElements } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import MacbookModel from "./MacbookModel";

const URL = "/models/macbook-14-transformed.glb";

export default function MacbookModel14(props: ThreeElements["group"]) {
  return <MacbookModel url={URL} {...props} />;
}

useGLTF.preload(URL);
