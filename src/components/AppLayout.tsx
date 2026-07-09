import { useEffect } from "react";
import AboutSection from "./AboutSection";
import CareerSection from "./CareerSection";
import ContactSection from "./ContactSection";
import LandingSection from "./LandingSection";
import NavbarSection from "./NavbarSection";
import Projects from "./Projects";
import Services from "./Services";
import Skills from "./Skills";
import TechStack from "./TechStack";
import "./styles/AppLayout.css";

const AppLayout = () => {
  // Always start at top on every page load/refresh
  useEffect(() => {
    if (typeof window !== "undefined") {
      history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(".page-content > section"));

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0 }
    );

    sections.forEach((section) => {
      // Don't add reveal-section to Projects or TechStack to avoid conflicts
      if (
        !section.classList.contains("projects-section") &&
        !section.classList.contains("techstack-section")
      ) {
        section.classList.add("reveal-section");
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-shell">
      <NavbarSection />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className="page-content">
            <LandingSection key={Date.now()} />
            <AboutSection />
            <Skills />
            <TechStack />
            <Services />
            <CareerSection />
            <Projects />
            <ContactSection />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
