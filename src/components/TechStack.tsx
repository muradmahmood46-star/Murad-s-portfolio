import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { techStackData, type TechBubbleSize, type TechStackItem } from "../data";
import "./styles/TechStack.css";

type ViewMode = "desktop" | "tablet" | "mobile";

type Setter = (value: number) => void;

type BubbleState = {
  id: string;
  radius: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  phase: number;
  floatSpeed: number;
  floatAmount: number;
  nextBumpAt: number;
  squishReadyAt: number;
  active: boolean;
  node: HTMLDivElement;
  setX: Setter;
  setY: Setter;
};

type AttractionPoint = {
  x: number;
  y: number;
  lastMoveAt: number;
};

const BASE_SIZE: Record<TechBubbleSize, number> = {
  large: 110,
  medium: 90,
  small: 75,
};

const BUBBLE_PALETTES = [
  ["rgba(124, 58, 237, 0.52)", "rgba(59, 130, 246, 0.42)", "rgba(236, 72, 153, 0.44)", "rgba(20, 184, 166, 0.38)"],
  ["rgba(59, 130, 246, 0.5)", "rgba(20, 184, 166, 0.42)", "rgba(196, 181, 253, 0.42)", "rgba(236, 72, 153, 0.34)"],
  ["rgba(236, 72, 153, 0.5)", "rgba(124, 58, 237, 0.44)", "rgba(59, 130, 246, 0.4)", "rgba(255, 255, 255, 0.34)"],
  ["rgba(20, 184, 166, 0.5)", "rgba(59, 130, 246, 0.4)", "rgba(124, 58, 237, 0.44)", "rgba(236, 72, 153, 0.32)"],
];

const getViewMode = () => {
  if (window.innerWidth < 768) {
    return "mobile";
  }

  if (window.innerWidth <= 1024) {
    return "tablet";
  }

  return "desktop";
};

const getVisibleCount = () => {
  return 24;
};

const getSizeScale = (viewMode: ViewMode) => {
  if (viewMode === "mobile") {
    return 0.72;
  }

  if (viewMode === "tablet") {
    return 0.86;
  }

  return 1;
};

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const getOutsidePoint = (width: number, height: number, radius: number) => {
  const side = Math.floor(Math.random() * 4);
  const offset = radius * 3;

  if (side === 0) {
    return { x: randomBetween(0, width), y: -offset };
  }

  if (side === 1) {
    return { x: width + offset, y: randomBetween(0, height) };
  }

  if (side === 2) {
    return { x: randomBetween(0, width), y: height + offset };
  }

  return { x: -offset, y: randomBetween(0, height) };
};

const findClusterPosition = (states: BubbleState[], width: number, height: number, radius: number) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const clusterWidth = width * 0.44;
  const clusterHeight = height * 0.52;
  let best = {
    x: centerX,
    y: centerY,
    score: -Infinity,
  };

  for (let attempt = 0; attempt < 90; attempt += 1) {
    const candidate = {
      x: Math.min(
        width - radius,
        Math.max(radius, centerX + randomBetween(-clusterWidth / 2, clusterWidth / 2))
      ),
      y: Math.min(
        height - radius,
        Math.max(radius, centerY + randomBetween(-clusterHeight / 2, clusterHeight / 2))
      ),
    };

    const spacingScore = states.reduce((nearest, state) => {
      const distance = Math.hypot(candidate.x - state.targetX, candidate.y - state.targetY);
      return Math.min(nearest, distance - (state.radius + radius) * 0.65);
    }, Infinity);
    const centerDistance = Math.hypot(candidate.x - centerX, candidate.y - centerY);
    const score = spacingScore - centerDistance * 0.08;

    if (score > best.score) {
      best = { ...candidate, score };
    }
  }

  return best;
};

type TechBubbleProps = {
  item: TechStackItem;
  index: number;
  size: number;
  registerBubble: (id: string, node: HTMLDivElement | null) => void;
};

const TechBubble = ({ item, index, size, registerBubble }: TechBubbleProps) => {
  const palette = BUBBLE_PALETTES[index % BUBBLE_PALETTES.length];
  const style = {
    width: size,
    height: size,
    "--bubble-a": palette[0],
    "--bubble-b": palette[1],
    "--bubble-c": palette[2],
    "--bubble-d": palette[3],
    "--bubble-spin-duration": `${randomBetween(8, 14)}s`,
  } as CSSProperties;

  return (
    <div ref={(node) => registerBubble(item.id, node)} className="tech-bubble-node" style={style}>
      <button
        className="tech-bubble"
        type="button"
        aria-label={item.name}
        onClick={(event) => {
          gsap.fromTo(
            event.currentTarget,
            { scale: 0.78, opacity: 0.78 },
            { scale: 1, opacity: 1, duration: 0.55, ease: "elastic.out(1, 0.45)" }
          );
        }}
      >
        <span className="tech-bubble-shine" aria-hidden="true" />
        <span className="tech-bubble-content">
          <span className="tech-bubble-icon">{item.icon}</span>
          <span className="tech-bubble-name">{item.name}</span>
        </span>
      </button>
    </div>
  );
};

const TechStack = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => getViewMode());
  const [generation, setGeneration] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bubbleRefs = useRef(new Map<string, HTMLDivElement>());
  const statesRef = useRef<BubbleState[]>([]);
  const frameRef = useRef<number>();
  const attractionRef = useRef<AttractionPoint>({
    x: 0,
    y: 0,
    lastMoveAt: -Infinity,
  });

  const visibleTech = useMemo(
    () => techStackData.slice(0, getVisibleCount()),
    []
  );

  const registerBubble = useCallback((id: string, node: HTMLDivElement | null) => {
    if (node) {
      bubbleRefs.current.set(id, node);
      return;
    }

    bubbleRefs.current.delete(id);
  }, []);

  const getBubbleSize = useCallback(
    (size: TechBubbleSize) => Math.round(BASE_SIZE[size] * getSizeScale(viewMode)),
    [viewMode]
  );

  const launchBubbles = useCallback(
    (withExit = false) => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      const { width, height } = container.getBoundingClientRect();

      if (!width || !height) {
        return;
      }

      const nextStates: BubbleState[] = [];

      visibleTech.forEach((item, index) => {
        const node = bubbleRefs.current.get(item.id);

        if (!node) {
          return;
        }

        const size = getBubbleSize(item.size);
        const radius = size / 2;
        const target = findClusterPosition(nextStates, width, height, radius);
        const start = getOutsidePoint(width, height, radius);
        const state: BubbleState = {
          id: item.id,
          radius,
          x: target.x,
          y: target.y,
          targetX: target.x,
          targetY: target.y,
          velocityX: randomBetween(-0.22, 0.22),
          velocityY: randomBetween(-0.22, 0.22),
          phase: randomBetween(0, Math.PI * 2),
          floatSpeed: randomBetween(0.0018, 0.0038),
          floatAmount: randomBetween(5, 10),
          nextBumpAt: performance.now() + randomBetween(2200, 5200),
          squishReadyAt: 0,
          active: false,
          node,
          setX: gsap.quickSetter(node, "x", "px") as Setter,
          setY: gsap.quickSetter(node, "y", "px") as Setter,
        };

        nextStates.push(state);
        gsap.killTweensOf(node);

        const flyIn = () => {
          gsap.fromTo(
            node,
            {
              x: start.x - radius,
              y: start.y - radius,
              opacity: 0,
              scale: 0.55,
            },
            {
              x: target.x - radius,
              y: target.y - radius,
              opacity: 1,
              scale: 1,
              duration: randomBetween(2, 5),
              delay: index * 0.035,
              ease: "power2.inOut",
              onComplete: () => {
                state.active = true;
                state.x = target.x;
                state.y = target.y;
                gsap.fromTo(
                  node,
                  { scale: 1.04 },
                  { scale: 1, duration: 0.45, ease: "bounce.out" }
                );
              },
            }
          );
        };

        if (withExit) {
          const exit = getOutsidePoint(width, height, radius);
          gsap.to(node, {
            x: exit.x - radius,
            y: exit.y - radius,
            opacity: 0,
            scale: 0.5,
            duration: randomBetween(0.45, 0.8),
            ease: "power2.inOut",
            onComplete: flyIn,
          });
        } else {
          flyIn();
        }
      });

      statesRef.current = nextStates;
    },
    [getBubbleSize, visibleTech]
  );

  useEffect(() => {
    const handleResize = () => setViewMode(getViewMode());
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    launchBubbles(generation > 0);
  }, [generation, launchBubbles]);

  useEffect(() => {
    const updateAttraction = (clientX: number, clientY: number) => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      attractionRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        lastMoveAt: performance.now(),
      };
    };

    const handleMouseMove = (event: MouseEvent) => {
      updateAttraction(event.clientX, event.clientY);
    };

    const handleClick = (event: MouseEvent) => {
      updateAttraction(event.clientX, event.clientY);
    };

    const handleTouch = (event: TouchEvent) => {
      const touch = event.touches[0] ?? event.changedTouches[0];

      if (touch) {
        updateAttraction(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, []);

  useEffect(() => {
    let timeoutId: number;

    const scheduleRegeneration = () => {
      timeoutId = window.setTimeout(() => {
        setGeneration((value) => value + 1);
        scheduleRegeneration();
      }, randomBetween(30000, 40000));
    };

    scheduleRegeneration();

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const tick = (time: number) => {
      const container = containerRef.current;

      if (container) {
        const { width, height } = container.getBoundingClientRect();
        const states = statesRef.current;

        for (let i = 0; i < states.length; i += 1) {
          const current = states[i];

          if (!current.active) {
            continue;
          }

          const attraction = attractionRef.current;
          const elapsedSinceMove = time - attraction.lastMoveAt;
          const influence = Math.max(0, 1 - elapsedSinceMove / 1400);
          const distanceToCursor = Math.hypot(attraction.x - current.x, attraction.y - current.y) || 1;
          const proximity = Math.max(0.18, 1 - distanceToCursor / Math.max(width, height));
          const maxDrift = current.radius > 50 ? 78 : 62;
          const drift = maxDrift * proximity * influence;
          const magneticX = ((attraction.x - current.x) / distanceToCursor) * drift;
          const magneticY = ((attraction.y - current.y) / distanceToCursor) * drift;
          const desiredX = current.targetX + magneticX;
          const desiredY =
            current.targetY +
            magneticY +
            Math.sin(time * current.floatSpeed + current.phase) * current.floatAmount;

          current.velocityX += (desiredX - current.x) * 0.0028;
          current.velocityY += (desiredY - current.y) * 0.021;

          if (time > current.nextBumpAt) {
            current.velocityX += randomBetween(-1.8, 1.8);
            current.velocityY += randomBetween(-1.4, 1.4);
            current.nextBumpAt = time + randomBetween(1800, 4200);
          }
        }

        for (let i = 0; i < states.length; i += 1) {
          const first = states[i];

          if (!first.active) {
            continue;
          }

          for (let j = i + 1; j < states.length; j += 1) {
            const second = states[j];

            if (!second.active) {
              continue;
            }

            const distanceX = second.x - first.x;
            const distanceY = second.y - first.y;
            const distance = Math.hypot(distanceX, distanceY) || 1;
            const minimumDistance = first.radius + second.radius + 4;

            if (distance < minimumDistance) {
              const force = (minimumDistance - distance) * 0.045;
              const pushX = (distanceX / distance) * force;
              const pushY = (distanceY / distance) * force;

              first.velocityX -= pushX;
              first.velocityY -= pushY;
              second.velocityX += pushX;
              second.velocityY += pushY;

              if (time > first.squishReadyAt) {
                gsap.fromTo(
                  first.node,
                  { scaleX: 1.05, scaleY: 0.94 },
                  { scaleX: 1, scaleY: 1, duration: 0.34, ease: "elastic.out(1, 0.55)" }
                );
                first.squishReadyAt = time + 700;
              }

              if (time > second.squishReadyAt) {
                gsap.fromTo(
                  second.node,
                  { scaleX: 0.94, scaleY: 1.05 },
                  { scaleX: 1, scaleY: 1, duration: 0.34, ease: "elastic.out(1, 0.55)" }
                );
                second.squishReadyAt = time + 700;
              }
            }
          }
        }

        states.forEach((state) => {
          if (!state.active) {
            return;
          }

          state.x += state.velocityX;
          state.y += state.velocityY;
          state.velocityX *= 0.94;
          state.velocityY *= 0.94;

          if (state.x < state.radius) {
            state.x = state.radius;
            state.velocityX = Math.abs(state.velocityX) * 0.72;
          } else if (state.x > width - state.radius) {
            state.x = width - state.radius;
            state.velocityX = -Math.abs(state.velocityX) * 0.72;
          }

          if (state.y < state.radius) {
            state.y = state.radius;
            state.velocityY = Math.abs(state.velocityY) * 0.72;
          } else if (state.y > height - state.radius) {
            state.y = height - state.radius;
            state.velocityY = -Math.abs(state.velocityY) * 0.72;
          }

          state.setX(state.x - state.radius);
          state.setY(state.y - state.radius);
        });
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <section className="techstack-section" id="techstack" aria-labelledby="techstack-title">
      <div className="techstack-shell">
        <div className="techstack-heading">
          <h2 className="techstack-title" id="techstack-title">
            My <span>Tech Stack</span>
          </h2>
          <p className="techstack-subtitle">Technologies I Work With</p>
        </div>

        <div className="techstack-bubble-area" ref={containerRef} style={{ "--border-angle": "0deg" } as CSSProperties}>
          {visibleTech.map((item, index) => (
            <TechBubble
              key={item.id}
              item={item}
              index={index}
              size={getBubbleSize(item.size)}
              registerBubble={registerBubble}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;