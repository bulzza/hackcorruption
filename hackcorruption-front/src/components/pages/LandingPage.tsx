import "../../styles/landing.css";
import Hero from "../landing/Hero";
import Mission from "../landing/Mission";
import Features from "../landing/Features";
import Expertise from "../landing/Expertise";
import PartnersMarquee from "../landing/PartnersMarquee";


export default function LandingPage() {
  return (
    <div className="landing-page">
      <main>
        <Hero />
        <Mission />
        <Features />
        <Expertise />
      </main>
      <PartnersMarquee />
      
    </div>
  );
}
