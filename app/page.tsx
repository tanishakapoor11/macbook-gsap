import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";
import ProductViewer from "@/components/ProductViewer";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <NavBar />
      <Hero />
      <ProductViewer />
    </main>
  );
}
