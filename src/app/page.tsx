import Navbar from "@/components/global/navbar";
import CTA from "@/components/LandingPage/CTA";
import FAQs from "@/components/LandingPage/FAQs";
import Features from "@/components/LandingPage/Features";
import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import HowItWorks from "@/components/LandingPage/HowItWorks";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <FAQs />
      <CTA />
      <Footer />
    </main>
  );
}