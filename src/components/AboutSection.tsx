import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { portfolioData } from "../data";
import "./styles/AboutSection.css";

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [profileImage, setProfileImage] = useState(portfolioData.about.profileImage);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timeout = setTimeout(() => {
              const runAnimation = () => {
                const tl = gsap.timeline();

                // 1. Reset everything to initial hidden state (only happens once on intersection)
                tl.set([
                  ".about-title",
                  ".about-underline",
                  ".about-subtitle",
                  ".about-image-container",
                  ".about-description .word",
                  ".stat-item",
                  ".education-card",
                  ".institution-image"
                ], { opacity: 0, y: 20, scale: 0.95 });

                // 2. Title animations
                tl.to(".about-title", { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }, 0);
                tl.to(".about-underline", { width: "100%", duration: 0.8, ease: "power3.out" }, 0.3);
                tl.to(".about-subtitle", { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }, 0.6);

                // 3. Profile image animation
                tl.to(".about-image-container", { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.7)" }, 0.3);

                // 4. Word-by-word text reveal
                const words = document.querySelectorAll(".about-description .word");
                if (words.length > 0) {
                  tl.to(words, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.15,
                    ease: "power2.out"
                  }, 1);
                }

                // 5. Stats counter animation
                if (statsRef.current) {
                  const stats = statsRef.current.querySelectorAll(".stat-item");
                  tl.to(stats, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out"
                  }, 1.3);

                  const statNumbers = statsRef.current.querySelectorAll(".stat-number");
                  statNumbers.forEach((stat) => {
                    const text = stat.textContent || "";
                    const match = text.match(/(\d+)/);
                    if (match) {
                      const target = match[1];
                      const suffix = text.replace(match[1], "");
                      
                      // Set to 0 initially
                      stat.textContent = "0" + suffix;
                      
                      // Jump directly to target after a short delay to make it feel like a snap
                      gsap.delayedCall(0.5, () => {
                        stat.textContent = target + suffix;
                      });
                    }
                  });
                }

                // 6. Education cards animation
                tl.to(".education-card", {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  duration: 0.8,
                  stagger: 0.2,
                  ease: "power3.out"
                }, 1.6);

                // 7. Institution images animation
                tl.to(".institution-image", {
                  opacity: 1,
                  scale: 1,
                  duration: 0.6,
                  stagger: 0.15,
                  ease: "back.out(1.7)"
                }, 1.8);
              };

              runAnimation();
            }, 500);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Stats data
  const stats = [
    { number: "2+", label: "Years Completed" },
    { number: "15+", label: "Projects Completed" },
    { number: "20+", label: "Technology Master" }
  ];

  // Split text into words for animation and highlight keywords
  const descriptionText = portfolioData.about.description;
  const highlightKeywords = ["AI Engineer", "Full Stack", "Machine Learning", "API"];

  const words = descriptionText.split(' ').map((word, index) => {
    // Clean word from punctuation for matching
    const cleanWord = word.replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, "");

    // Check if the word (or part of it) is a highlight keyword
    // Since keywords can be multiple words, we check if the original word is part of any keyword
    const isHighlight = highlightKeywords.some(kw => 
      kw.toLowerCase().includes(cleanWord.toLowerCase()) && cleanWord.length > 2
    );

    return (
      <span 
        key={index} 
        className={`word ${isHighlight ? 'highlight' : ''}`}
        style={{ marginRight: '0.3em' }}
      >
        {word}
      </span>
    );
  });

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