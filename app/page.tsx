import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";
import ProductViewer from "@/components/ProductViewer";
import Showcase from "@/components/Showcase";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <NavBar />
      <Hero />
      <ProductViewer />
      <Showcase />
    </main>
  );
}
