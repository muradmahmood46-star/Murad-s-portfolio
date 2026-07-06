import { portfolioData } from "../data";
import "./styles/Projects.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { FiArrowUpRight, FiCpu, FiGlobe, FiDatabase, FiLayout } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Force ScrollTrigger to calculate positions correctly on mount
    ScrollTrigger.refresh();

    const cards = sectionRef.current.querySelectorAll(".project-card");
    
    gsap.fromTo(cards, 
      { opacity: 0, y: 60, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 1, 
        stagger: 0.15, 
        ease: "expo.out" 
      }, 
      { 
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        } 
      }
    );

    cards.forEach((card: any) => {
      const glow = card.querySelector(".project-card-glow");

      card.addEventListener("mousemove", (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(glow, {
          x: x - glow.offsetWidth / 2,
          y: y - glow.offsetHeight / 2,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20; 
        const rotateY = (centerX - x) / 20;

        gsap.to(card, {
          rotateX: -rotateX,
          rotateY: rotateY,
          duration: 0.5,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
        });
        
        gsap.to(glow, {
          opacity: 0,
          duration: 0.5,
        });
      });
    });

  }, { scope: sectionRef });

  const getProjectIcon = (techs: string[]) => {
    const t = techs.join(" ").toLowerCase();
    if (t.includes("python") || t.includes("core") || t.includes("machine learning") || t.includes("scikit")) return <FiCpu />;
    if (t.includes("mysql") || t.includes("database") || t.includes("mongodb")) return <FiDatabase />;
    if (t.includes("react") || t.includes("angular") || t.includes("html")) return <FiLayout />;
    return <FiGlobe />;
  };

  const projectColors = [
    "linear-gradient(135deg, #7c3aed, #db4437)",
    "linear-gradient(135deg, #3b82f6, #2dd4bf)",
    "linear-gradient(135deg, #f59e0b, #ef4444)",
    "linear-gradient(135deg, #10b981, #3b82f6)",
    "linear-gradient(135deg, #8b5cf6, #ec4899)",
    "linear-gradient(135deg, #f97316, #facc15)",
  ];

  return (
    <section className="projects-section section-container" id="projects" ref={sectionRef}>
      <div className="section-heading">
        <p className="section-label">{portfolioData.projects.title}</p>
        <h2>Featured Projects</h2>
      </div>

      <div className="projects-grid">
        {portfolioData.projects.list.map((project, index) => (
          <article 
            className="project-card" 
            key={project.name}
            style={{ "--card-gradient": projectColors[index % projectColors.length] } as any}
          >
            <div className="project-card-glow" />
            
            <div className="project-card-header">
              <div className="project-icon-wrapper">
                {getProjectIcon(project.technologies)}
              </div>
              <a href={project.link} target="_blank" rel="noreferrer" className="project-link">
                <FiArrowUpRight />
              </a>
            </div>

            <div className="project-card-body">
              <h3 className="project-title">{project.name}</h3>
              <p className="project-description">{project.description}</p>
              
              <div className="project-tech-stack">
                {project.technologies.map((tech) => (
                  <span key={tech} className="tech-badge">{tech}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;
