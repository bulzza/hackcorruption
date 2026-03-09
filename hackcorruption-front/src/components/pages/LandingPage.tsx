import "../../styles/landing.css";
import Hero from "../landing/Hero";
import Mission from "../landing/Mission";
import Features from "../landing/Features";
import PartnersMarquee from "../landing/PartnersMarquee";
import Newsletter from "../landing/Newsletter";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <main>
        <Hero />
        <Mission />
        <Features />
      </main>
      <PartnersMarquee />
      <Newsletter />
    </div>
  );
}
