import { portfolioData } from "../data";
import { useEffect, useState, useRef } from "react";
import "./styles/NavbarSection.css";

const NavbarSection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 10) setIsVisible(true);
      else if (currentScrollY > lastScrollY.current) { setIsVisible(false); setMenuOpen(false); }
      else setIsVisible(true);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const listeners: Array<{ element: Element; handler: EventListenerOrEventListenerObject }> = [];
    document.querySelectorAll(".navbar-links a").forEach((elem) => {
      const handler = (event: Event) => {
        event.preventDefault();
        setMenuOpen(false);
        const target = (event.currentTarget as HTMLAnchorElement).getAttribute("href");
        if (target) {
          const destination = document.querySelector(target);
          if (destination) destination.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      elem.addEventListener("click", handler);
      listeners.push({ element: elem, handler });
    });
    return () => listeners.forEach(({ element, handler }) => element.removeEventListener("click", handler));
  }, [menuOpen]);

  return (
    <header className={`site-header ${isVisible ? "header-visible" : "header-hidden"}`}>
      <a className="brand" href="#landing">{portfolioData.hero.name}</a>

      {/* Desktop nav */}
      <nav className="navbar-links desktop-nav">
        <a href="#about">ABOUT</a>
        <a href="#skills">SKILLS</a>
        <a href="#services">SERVICES</a>
        <a href="#career">CAREER</a>
        <a href="#projects">PROJECTS</a>
        <a href="#contact">CONTACT</a>
      </nav>

      {/* Hamburger button — mobile only */}
      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="navbar-links mobile-nav">
          <a href="#about">ABOUT</a>
          <a href="#skills">SKILLS</a>
          <a href="#services">SERVICES</a>
          <a href="#career">CAREER</a>
          <a href="#projects">PROJECTS</a>
          <a href="#contact">CONTACT</a>
        </nav>
      )}
    </header>
  );
};

export default NavbarSection;
