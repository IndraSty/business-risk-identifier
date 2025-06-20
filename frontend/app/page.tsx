import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";
import Demo from "@/components/Demo";
import Footer from "@/components/Footer";
import { RiskAnalysisProvider } from "@/context/RiskAnalysisContext";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <RiskAnalysisProvider>
        <Navbar />
        <Hero />
        <Features />
        <About />
        <Demo />
        <Footer />
      </RiskAnalysisProvider>
    </main>
  );
}
