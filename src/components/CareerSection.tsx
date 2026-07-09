import { portfolioData } from "../data";
import "./styles/CareerSection.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const CareerSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !sectionRef.current || !progressRef.current) return;

    const isMobile = window.innerWidth <= 1024;

    // ── MOBILE + TABLET: one-shot slide-in per card ──
    if (isMobile) {
      const cards = Array.from(containerRef.current.querySelectorAll(".career-card"));
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: -80 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });
      return;
    }

    // Disable GSAP horizontal scroll on tablet — now handled above
    // Desktop only below

    const section = sectionRef.current;
    const container = containerRef.current;
    const progress = progressRef.current;

    const getScrollAmount = () => {
      return container.scrollWidth - window.innerWidth;
    };

    // We increase the scroll duration further to make the whole experience feel more premium and relaxed.
    const scrollDuration = getScrollAmount() + 2500;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${scrollDuration}`, 
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // --- THE FIX: Settling Period ---
    // We want the first card to appear and STAY for a moment before we move left.
    // We add a small gap at the beginning of the timeline.
    
    // 1. Entrance animations start first
    const cards = container.querySelectorAll(".career-card");
    cards.forEach((card, index) => {
      tl.fromTo(
        card,
        { opacity: 0, y: 50, scale: 0.8 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.4,
        },
        index * 0.25 + 0.1 // Entrance timing
      );
    });

    // 2. Delay the horizontal movement
    // By starting the movement at 0.6, we give the first card (which starts at 0.1 and takes 0.4)
    // plenty of time to settle at 0.5 before the movement begins.
    tl.to(container, {
      x: () => -getScrollAmount(),
      ease: "none",
    }, 0.6); 

    // Sync the progress bar to the horizontal movement
    tl.to(progress, {
      scaleX: 1,
      ease: "none",
    }, 0.6);

    // Center-focus scale animations
    cards.forEach((card) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          containerAnimation: tl,
          start: "left center",
          end: "right center",
          toggleActions: "play reverse play reverse",
        },
        scale: 1.05,
        duration: 0.4,
        ease: "power2.out",
      });
    });

  }, { scope: sectionRef });

  return (
    <section className="career-section" id="career" ref={sectionRef}>
      <div className="career-progress-bar-wrapper">
        <div className="career-progress-bar" ref={progressRef} />
      </div>

      <div className="career-content-wrapper">
        <div className="career-header">
          <p className="career-section-label">{portfolioData.career.title}</p>
          <h2 className="career-section-title">Experience Timeline</h2>
        </div>

        <div className="career-horizontal-viewport">
          <div className="career-horizontal-container" ref={containerRef}>
            {portfolioData.career.experiences.map((experience, index) => {
              const colors = [
                "rgba(124, 58, 237, 0.3)", 
                "rgba(59, 130, 246, 0.3)",  
                "rgba(168, 85, 247, 0.3)",  
              ];
              const accentColor = colors[index % colors.length];

              return (
                <article 
                  className="career-card" 
                  key={`${experience.position}-${experience.company}`}
                  style={{ "--accent-color": accentColor } as any}
                >
                  <div className="career-card-index">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="career-card-body">
                    <div className="career-card-meta">
                      <div className="career-card-info">
                      <h3 className="career-card-position">{experience.position}</h3>
                      <span className="career-card-company">{experience.company}</span>
                    </div>
                    <time className="career-card-date">
                      {experience.yearStart} — {experience.yearEnd}
                    </time>
                  </div>
                  <p className="career-card-description">{experience.description}</p>
                </div>
                <div className="career-card-glow" />
              </article>
            );
          })}
            <div className="career-end-spacer" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerSection;
