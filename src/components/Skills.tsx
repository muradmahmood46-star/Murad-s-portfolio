import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioData } from "../data";
import "./styles/Skills.css";

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  percentage: number;
}

interface Category {
  name: string;
  icon: string;
  skills: Skill[];
}

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".skill-item", { opacity: 0, x: -40 });
      gsap.set(".skill-category-card", { opacity: 0, y: 80, scale: 0.95 });
      gsap.set(".category-header", { opacity: 0, x: -30 });
      gsap.set(".progress-bar-fill", { width: "0%" });

      // Header animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });
      tl.from(titleRef.current, { y: -30, opacity: 0, duration: 0.7, ease: "power3.out" })
        .from(underlineRef.current, { width: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from(".skills-subtitle", { y: 15, opacity: 0, duration: 0.5, ease: "power3.out" }, "-=0.3");

      // Each card animates when it enters viewport
      const cards = gsap.utils.toArray<HTMLElement>(".skill-category-card", gridRef.current);
      cards.forEach((card) => {
        const header = card.querySelector(".category-header");
        const skillItems = card.querySelectorAll(".skill-item");
        const bars = card.querySelectorAll(".progress-bar-fill");
        const percentageTexts = card.querySelectorAll(".percentage-text");

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
        });

        cardTl
          .to(card, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" })
          .to(header, { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }, "-=0.3")
          .to(skillItems, { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: "power3.out" }, "-=0.2");

        bars.forEach((bar, i) => {
          const target = parseFloat((skillItems[i] as HTMLElement)?.getAttribute("data-percentage") || "0");
          const textEl = percentageTexts[i] as HTMLElement;
          cardTl.fromTo(
            bar,
            { width: "0%" },
            {
              width: `${target}%`,
              duration: 1.2,
              ease: "power2.out",
              delay: i * 0.05,
              onUpdate() {
                if (textEl) {
                  const pct = parseFloat((bar as HTMLElement).style.width) || 0;
                  textEl.textContent = `${Math.round(pct)}%`;
                }
              },
            },
            i === 0 ? "-=0.2" : "<0.05"
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="skills-section" id="skills" ref={sectionRef}>
      <div className="skills-container">
        <div className="skills-header">
          <h2 ref={titleRef} className="skills-title">
            {portfolioData.skills.title}
            <div ref={underlineRef} className="skills-underline"></div>
          </h2>
          <p className="skills-subtitle">Core Skillsets</p>
        </div>

        <div className="skills-grid" ref={gridRef}>
          {portfolioData.skills.categories.map((category: Category) => (
            <div className="skill-category-card" key={category.name}>
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h3>{category.name}</h3>
              </div>
              <div className="skills-list">
                {category.skills.map((skill: Skill) => (
                  <div
                    key={skill.name}
                    className="skill-item"
                    data-percentage={skill.percentage}
                  >
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="percentage-text">0%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;