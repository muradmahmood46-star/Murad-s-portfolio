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

    const isMobile = window.innerWidth < 680;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth >= 680;
    const rowSize = isMobile ? 1 : isTablet ? 2 : 3;
    // Mobile: slow enough to clearly see truck stop at each card
    const truckSpeed = isMobile ? 0.55 : 0.4;
    const cardDropDuration = isMobile ? 0.45 : 0.3;
    const cardDropDelay = isMobile ? "-=0.15" : "-=0.08";
    truck.style.fontSize = isMobile ? "2.2rem" : "3rem";

    const cards = gsap.utils.toArray<HTMLElement>(".service-card", section);
    const rows: HTMLElement[][] = [];
    for (let i = 0; i < cards.length; i += rowSize) {
      rows.push(cards.slice(i, i + rowSize));
    }

    gsap.set(cards, { opacity: 0, y: -50 });
    gsap.set(truck, { x: -80, y: 0, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: isMobile ? "top 70%" : "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
      onStart: () => {
        // Capture positions after layout is stable (inside viewport)
        const sectionRect = section.getBoundingClientRect();
        const cardPositions = cards.map(card => {
          const r = card.getBoundingClientRect();
          return {
            x: r.left - sectionRect.left,
            y: r.top - sectionRect.top - (isMobile ? 20 : 40),
          };
        });

        const deliveryTl = gsap.timeline();
        deliveryTl.to(truck, { opacity: 1, duration: 0.15 });

        rows.forEach((row, rowIndex) => {
          const isLeftToRight = rowIndex % 2 === 0;
          const sortedRow = isLeftToRight ? [...row] : [...row].reverse();
          deliveryTl.to(truck, { scaleX: isLeftToRight ? -1 : 1, duration: 0 });

          sortedRow.forEach((card) => {
            const pos = cardPositions[cards.indexOf(card)];
            deliveryTl
              .to(truck, { x: pos.x, y: pos.y, duration: truckSpeed, ease: "power1.inOut" })
              .to(card, { opacity: 1, y: 0, duration: cardDropDuration, ease: "bounce.out" }, cardDropDelay);
          });
        });

        // Drive off screen and fade out
        const sectionWidth = section.getBoundingClientRect().width;
        deliveryTl
          .to(truck, { scaleX: 1, duration: 0 })
          .to(truck, {
            x: sectionWidth + 100,
            opacity: 0,
            duration: isMobile ? 0.7 : 0.7,
            ease: "power1.in",
          });
      },
    });

    // Dummy tl entry so scrollTrigger fires onStart
    tl.to({}, { duration: 0.01 });

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="services-section section-container" id="services" ref={sectionRef} style={{ position: 'relative', minHeight: '60vh' }}>
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
