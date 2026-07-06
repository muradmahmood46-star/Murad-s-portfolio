import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { portfolioData } from "../data";
import { useLoading } from "../context/LoadingProvider";
import "./styles/LandingSection.css";

const LandingSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroImage, setHeroImage] = useState(portfolioData.hero.image);
  const { isLoading } = useLoading();

  useEffect(() => {
    // Only run animations after loading screen completes
    if (isLoading) return;

    // Small delay to ensure DOM is fully rendered
    const animationTimeout = setTimeout(() => {
      // Use fromTo to explicitly set start and end values
      gsap.fromTo(".hero-name", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power3.out" }
      );

      gsap.fromTo(".hero-title-ai",
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.7, ease: "power3.out" }
      );

      gsap.fromTo(".hero-title-ampersand",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(".hero-title-developer",
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.9, ease: "power3.out" }
      );

      gsap.fromTo(".hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 1.1, ease: "power3.out" }
      );

      gsap.fromTo(".hero-buttons",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 1.3, ease: "power3.out" }
      );
    }, 300);

    return () => clearTimeout(animationTimeout);
  }, [isLoading]);

  return (
    <section className="landing-section section-container is-visible" id="landing">
      <div className="landing-grid" ref={heroRef}>
        <div className="landing-copy" style={{ backdropFilter: 'none', filter: 'none' }}>
          <h1 className="hero-name" style={{ color: '#ffffff', textShadow: 'none', backdropFilter: 'none', filter: 'none' }}>{portfolioData.hero.name}</h1>
          <div className="hero-title-stack" aria-label="Professional titles" style={{ backdropFilter: 'none', filter: 'none' }}>
            <div className="hero-title-line-1" style={{ backdropFilter: 'none', filter: 'none' }}>
              <span className="hero-title-ai" style={{ color: '#7c3aed', textShadow: 'none', filter: 'none', backdropFilter: 'none' }}>AI ENGINEER</span>
              <span className="hero-title-ampersand" style={{ color: '#ffffff', textShadow: 'none', filter: 'none', backdropFilter: 'none' }}>&</span>
            </div>
            <span className="hero-title-developer" style={{ color: '#ffffff', textShadow: 'none', filter: 'none', backdropFilter: 'none' }}>FULL STACK DEVELOPER</span>
          </div>
          <p className="hero-subtitle" style={{ opacity: 0 }}>{portfolioData.hero.subtitle}</p>
          <div className="hero-buttons" style={{ opacity: 0 }}>
            <a href={portfolioData.hero.buttons.primary.link} className="button button-primary">
              {portfolioData.hero.buttons.primary.text}
            </a>
            <a href={portfolioData.hero.buttons.secondary.link} className="button button-secondary">
              {portfolioData.hero.buttons.secondary.text}
            </a>
          </div>
        </div>

        <div className="landing-image">
          <img
            src={heroImage}
            alt={portfolioData.hero.imageAlt}
            onError={() => setHeroImage("/images/placeholder.webp")}
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingSection;