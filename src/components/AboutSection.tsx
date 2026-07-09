import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioData } from "../data";
import "./styles/AboutSection.css";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [profileImage, setProfileImage] = useState(portfolioData.about.profileImage);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.fromTo(".about-title",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0);
      tl.fromTo(".about-underline",
        { width: 0 },
        { width: "100%", duration: 0.7, ease: "power3.out" }, 0.2);
      tl.fromTo(".about-subtitle",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.35);
      tl.fromTo(".about-image-container",
        { opacity: 0, scale: 0.85, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.1);

      const words = section.querySelectorAll(".about-description .word");
      if (words.length > 0) {
        gsap.set(words, { opacity: 0, y: 14 });
        tl.to(words, {
          opacity: 1, y: 0, duration: 0.4,
          stagger: { each: 0.03, ease: "none" },
          ease: "power2.out",
        }, 0.4);
      }

      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll(".stat-item");
        gsap.set(statItems, { opacity: 0, y: 20 });
        tl.to(statItems, {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out",
        }, "-=0.3");
      }

      const eduCards = section.querySelectorAll(".education-card");
      const eduImages = section.querySelectorAll(".institution-image");
      gsap.set(eduCards, { opacity: 0, y: 40 });
      gsap.set(eduImages, { opacity: 0, scale: 0.7 });
      tl.to(eduCards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" }, "-=0.2");
      tl.to(eduImages, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: "back.out(1.4)" }, "-=0.5");
    }, section);

    return () => ctx.revert();
  }, []);

  // Stats data
  const stats = [
    { number: "2+", label: "Years Completed" },
    { number: "15+", label: "Projects Completed" },
    { number: "20+", label: "Technology Master" }
  ];

  // Purple highlight for exact phrases: "AI Engineer" and "Full Stack Developer"
  const descriptionText = portfolioData.about.description;

  const buildWords = (text: string) => {
    // Mark character ranges that belong to purple phrases
    const purplePhrases = ["AI Engineer", "Full Stack Developer"];
    const purpleRanges: { start: number; end: number }[] = [];
    purplePhrases.forEach((phrase) => {
      let pos = 0;
      while (pos < text.length) {
        const idx = text.toLowerCase().indexOf(phrase.toLowerCase(), pos);
        if (idx === -1) break;
        purpleRanges.push({ start: idx, end: idx + phrase.length });
        pos = idx + phrase.length;
      }
    });

    // Split into tokens preserving spaces
    const tokens: { text: string; purple: boolean }[] = [];
    let i = 0;
    while (i < text.length) {
      const range = purpleRanges.find((r) => r.start === i);
      if (range) {
        tokens.push({ text: text.slice(range.start, range.end), purple: true });
        i = range.end;
      } else {
        // collect until next purple range or end
        const nextPurple = purpleRanges.find((r) => r.start > i);
        const end = nextPurple ? nextPurple.start : text.length;
        tokens.push({ text: text.slice(i, end), purple: false });
        i = end;
      }
    }

    // Now split each token into words
    let wordIndex = 0;
    return tokens.flatMap((token) =>
      token.text.split(" ").filter(Boolean).map((w) => (
        <span
          key={wordIndex++}
          className="word"
          style={{
            color: token.purple ? "#a855f7" : "#e2e8f0",
            fontWeight: token.purple ? 700 : undefined,
          }}
        >
          {w}{" "}
        </span>
      ))
    );
  };

  const words = buildWords(descriptionText);

  return (
    <section className="about-section section-container" id="about" ref={sectionRef}>
      <div className="about-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="about-content">
        <div className="section-header">
          <h2 className="about-title">ABOUT ME</h2>
          <div className="about-underline"></div>
          <p className="about-subtitle">Meet The Engineer</p>
        </div>

        <div className="about-main-grid">
          <div className="about-image-container">
            <div className="image-wrapper">
              <div className="profile-image">
                <img 
                  src={profileImage} 
                  alt="Murad Mahmood" 
                  onError={() => setProfileImage("/images/placeholder.webp")}
                />
              </div>
              <div className="image-glow"></div>
            </div>
          </div>

          <div className="about-description">
            <p>{words}</p>
          </div>
        </div>

        <div className="stats-container" ref={statsRef}>
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="education-section">
          <h3 className="subsection-title">Education</h3>
          <div className="education-cards">
            {portfolioData.about.education.map((item, index) => (
              <div key={index} className="education-card">
                <div className="institution-image">
                  <img 
                    src={item.image} 
                    alt={item.institution}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/placeholder.webp";
                    }}
                  />
                </div>
                <div className="card-content">
                  <h4>{item.degree}</h4>
                  <p>{item.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;