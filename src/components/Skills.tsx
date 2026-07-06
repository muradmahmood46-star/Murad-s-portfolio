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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reset",
        },
      });

      tl.from(titleRef.current, {
        y: -60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      })
      .from(underlineRef.current, {
        width: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.6")
      .from(".skills-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.4");

      gsap.to(".skill-category-card", {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none reset",
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(".category-header", {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          });

          const categories = gsap.utils.toArray<HTMLElement>(".skill-category-card");

          categories.forEach((category) => {
            const skillItems = category.querySelectorAll(".skill-item");
            const bars = category.querySelectorAll(".progress-bar-fill");
            const percentageTexts = category.querySelectorAll(".percentage-text");

            gsap.to(skillItems, {
              opacity: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power2.out",
              onComplete: () => {
                bars.forEach((bar, i) => {
                  const target = parseFloat(skillItems[i]?.getAttribute("data-percentage") || "0");
                  const textEl = percentageTexts[i] as HTMLElement;

                  // Animate the progress bar
                  gsap.to(bar, {
                    width: `${target}%`,
                    duration: 1.5,
                    ease: "power2.inOut",
                    delay: i * 0.08,
                  });

                  // Animate the percentage text with % symbol
                  if (textEl) {
                    const proxy = { val: 0 };
                    gsap.to(proxy, {
                      val: target,
                      duration: 1.5,
                      ease: "power2.inOut",
                      delay: i * 0.08,
                      onUpdate: () => {
                        textEl.textContent = `${Math.round(proxy.val)}%`;
                      },
                    });
                  }
                });
              }
            });
          });
        }
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