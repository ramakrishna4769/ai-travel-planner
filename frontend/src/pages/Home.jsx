import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import TripPreview from "../components/TripPreview";
import PackingPreview from "../components/PackingPreview";
import CTAFooter from "../components/CTAFooter";

export default function Home() {
  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TripPreview />
      <PackingPreview />
      <CTAFooter />
    </div>
  );
}