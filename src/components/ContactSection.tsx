import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioData } from "../data";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/ContactSection.css";

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.to(".contact-header", { opacity: 1, y: 0, duration: 1 });
      tl.to(".contact-divider", { width: 120, duration: 0.8 }, "-=0.6");
      tl.to(".contact-card", { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }, "-=0.5");
      tl.to(".contact-footer", { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="contact-section section-container"
      id="contact"
      ref={sectionRef}
    >
      {/* floating orbs */}
      <div className="contact-orb contact-orb-1" />
      <div className="contact-orb contact-orb-2" />

      {/* header */}
      <div className="contact-header">
        <span className="contact-label">{portfolioData.contact.title}</span>
        <h2 className="contact-title">Let's Connect</h2>
        <div className="contact-divider" />
      </div>

      {/* cards */}
      <div className="contact-grid">
        {/* Email */}
        <div className="contact-card">
          <div className="contact-card-glow" />
          <div className="contact-card-icon">✉️</div>
          <h3>Email</h3>
          <a
            href={`mailto:${portfolioData.contact.email}`}
            className="contact-link"
          >
            {portfolioData.contact.email}
          </a>
        </div>

        {/* Phone */}
        <div className="contact-card">
          <div className="contact-card-glow" />
          <div className="contact-card-icon">📞</div>
          <h3>Phone</h3>
          <a
            href={`tel:${portfolioData.contact.phone}`}
            className="contact-link"
          >
            {portfolioData.contact.phone}
          </a>
        </div>

        {/* Social */}
        <div className="contact-card">
          <div className="contact-card-glow" />
          <div className="contact-card-icon">🔗</div>
          <h3>Social</h3>
          <div className="contact-socials">
            <a
              href={portfolioData.contact.social.github}
              target="_blank"
              rel="noreferrer"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href={portfolioData.contact.social.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              Linkedin <MdArrowOutward />
            </a>
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="contact-footer">
        <p className="footer-text-combined">
          {portfolioData.contact.footer.text}
          <MdCopyright style={{ fontSize: "11px", verticalAlign: "middle" }} />
          {portfolioData.contact.footer.year}
        </p>
      </footer>
    </section>
  );
};

export default ContactSection;
