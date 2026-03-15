import Navbar       from "../Components/Navbar";
import Hero          from "../Components/Hero";
import StatsBar      from "../Components/StatsBar";
import ProjectsSection from "../Components/ProjectsSection";
import HowItWorks    from "../Components/HowItWorks";
import FeaturesSection from "../Components/FeaturesSection";
import CTASection    from "../Components/CTASection";
import Footer        from "../Components/Footer";

/**
 * LandingPage — assembles all sections in order.
 * To reorder sections just move the lines below.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <Hero />
      <StatsBar />
      <ProjectsSection />
      <HowItWorks />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}