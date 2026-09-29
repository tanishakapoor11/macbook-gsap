import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import NavBar from "@/components/NavBar";
import Performance from "@/components/Performance";
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
      <Performance />
      <Features />
      <Highlights />
      <Footer />
    </main>
  );
}
