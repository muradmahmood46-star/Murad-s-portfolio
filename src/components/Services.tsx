import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { servicesData } from "../data";
import "./styles/Services.css";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const truckRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const truck = truckRef.current;
    if (!section || !truck) return;

    const cards = gsap.utils.toArray<HTMLElement>(".service-card", section);
    
    // Group cards by row (3 columns)
    const rowSize = 3;
    const rows = [];
    for (let i = 0; i < cards.length; i += rowSize) {
      rows.push(cards.slice(i, i + rowSize));
    }

    // Initial state
    gsap.set(cards, { opacity: 0, y: -50 });
    gsap.set(truck, { x: -100, y: 50, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
      },
    });

    tl.to(truck, { opacity: 1, duration: 0.2 });

    rows.forEach((row, rowIndex) => {
      // Determine direction: Even rows (0, 2...) Left->Right, Odd rows (1, 3...) Right->Left
      const isLeftToRight = rowIndex % 2 === 0;
      const sortedRow = isLeftToRight ? [...row] : [...row].reverse();

      // Flip truck based on direction (invert logic if cab was on wrong side)
      tl.to(truck, { scaleX: isLeftToRight ? -1 : 1, duration: 0 });

      sortedRow.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const sectionRect = sectionRef.current!.getBoundingClientRect();
        const targetX = cardRect.left - sectionRect.left;
        const targetY = cardRect.top - sectionRect.top - 50;

        // Move Truck to delivery point
        tl.to(truck, { x: targetX, y: targetY, duration: 0.4, ease: "power1.inOut" })
          .to(card, { opacity: 1, y: 0, duration: 0.3, ease: "bounce.out" }, "-=0.1");
      });
    });

    // Drive away
    tl.to(truck, { scaleX: 1, duration: 0 })
      .to(truck, { x: 1200, duration: 0.8, ease: "power1.in" });

    return () => tl.kill();
  }, []);

  return (
    <section className="services-section section-container" id="services" ref={sectionRef} style={{ position: 'relative', minHeight: '800px' }}>
      <div className="truck" ref={truckRef} style={{ position: 'absolute', fontSize: '3rem', zIndex: 10, pointerEvents: 'none' }}>🚚</div>
      
      <div className="services-heading">
        <h2 className="services-title">MY SERVICES</h2>
        <div className="services-underline"></div>
      </div>

      <div className="services-grid">
        {servicesData.map((service, index) => (
          <article className={`service-card service-card-${service.tone}`} key={service.id}>
            <div className="service-card-topline">
              <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="service-icon" aria-hidden="true">
                {service.icon}
              </span>
            </div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Services;
