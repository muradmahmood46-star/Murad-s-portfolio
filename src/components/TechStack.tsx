import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { techStackData, type TechBubbleSize, type TechStackItem } from "../data";
import "./styles/TechStack.css";

type ViewMode = "desktop" | "tablet" | "mobile";
type Setter = (x: number, y: number) => void;

type BubbleState = {
  id: string;
  radius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  floatSpeed: number;
  floatAmount: number;
  squishReadyAt: number;
  active: boolean;
  node: HTMLDivElement;
  setX: Setter;
};

type CursorPoint = { x: number; y: number; lastMoveAt: number };

const BASE_SIZE: Record<TechBubbleSize, number> = { large: 112, medium: 92, small: 76 };

const PALETTES = [
  ["rgba(124,58,237,0.7)", "rgba(59,130,246,0.6)", "rgba(236,72,153,0.6)", "rgba(20,184,166,0.55)"],
  ["rgba(59,130,246,0.68)", "rgba(20,184,166,0.6)", "rgba(196,181,253,0.6)", "rgba(236,72,153,0.5)"],
  ["rgba(236,72,153,0.68)", "rgba(124,58,237,0.62)", "rgba(59,130,246,0.58)", "rgba(255,255,255,0.5)"],
  ["rgba(20,184,166,0.68)", "rgba(59,130,246,0.58)", "rgba(124,58,237,0.62)", "rgba(236,72,153,0.5)"],
  ["rgba(168,85,247,0.68)", "rgba(236,72,153,0.6)", "rgba(59,130,246,0.56)", "rgba(20,184,166,0.52)"],
];

const rnd = (min: number, max: number) => min + Math.random() * (max - min);

const getViewMode = (): ViewMode => {
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth <= 1024) return "tablet";
  return "desktop";
};

const getSizeScale = (vm: ViewMode) => vm === "mobile" ? 0.68 : vm === "tablet" ? 0.82 : 1;

const outsidePoint = (w: number, h: number, r: number) => {
  const side = Math.floor(Math.random() * 4);
  const off = r * 3;
  if (side === 0) return { x: rnd(0, w), y: -off };
  if (side === 1) return { x: w + off, y: rnd(0, h) };
  if (side === 2) return { x: rnd(0, w), y: h + off };
  return { x: -off, y: rnd(0, h) };
};

const placeTarget = (placed: BubbleState[], w: number, h: number, r: number) => {
  const cx = w / 2, cy = h / 2;
  let best = { x: cx, y: cy, score: -Infinity };
  for (let t = 0; t < 120; t++) {
    const c = {
      x: Math.min(w - r, Math.max(r, cx + rnd(-w * 0.44, w * 0.44))),
      y: Math.min(h - r, Math.max(r, cy + rnd(-h * 0.44, h * 0.44))),
    };
    const spacing = placed.reduce((mn, s) => {
      return Math.min(mn, Math.hypot(c.x - s.x, c.y - s.y) - (s.radius + r) * 0.6);
    }, Infinity);
    const score = spacing - Math.hypot(c.x - cx, c.y - cy) * 0.06;
    if (score > best.score) best = { ...c, score };
  }
  return best;
};

/* ── Bubble UI ── */
const TechBubble = ({
  item, index, size,
  registerBubble,
}: {
  item: TechStackItem; index: number; size: number;
  registerBubble: (id: string, node: HTMLDivElement | null) => void;
}) => {
  const pal = PALETTES[index % PALETTES.length];
  const style = {
    width: size, height: size,
    "--bubble-a": pal[0], "--bubble-b": pal[1],
    "--bubble-c": pal[2], "--bubble-d": pal[3],
    "--bubble-spin-duration": `${rnd(9, 16)}s`,
    "--pulse-delay": `${(index % 6) * 0.5}s`,
  } as CSSProperties;

  return (
    <div ref={(n) => registerBubble(item.id, n)} className="tech-bubble-node" style={style}>
      <button
        className="tech-bubble" type="button" aria-label={item.name}
        onClick={(e) => gsap.fromTo(e.currentTarget,
          { scale: 0.72 }, { scale: 1, duration: 0.55, ease: "elastic.out(1,0.4)" }
        )}
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

/* ── Main ── */
const TechStack = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(getViewMode);
  const [generation, setGeneration] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bubbleRefs = useRef(new Map<string, HTMLDivElement>());
  const statesRef = useRef<BubbleState[]>([]);
  const cursorRef = useRef<CursorPoint>({ x: -9999, y: -9999, lastMoveAt: -Infinity });
  const launchedRef = useRef(false);
  const obsRef = useRef<IntersectionObserver | null>(null);
  const viewModeRef = useRef(viewMode);

  const visibleTech = useMemo(() => techStackData.slice(0, 24), []);

  const registerBubble = useCallback((id: string, node: HTMLDivElement | null) => {
    if (node) bubbleRefs.current.set(id, node);
    else bubbleRefs.current.delete(id);
  }, []);

  // Keep viewModeRef in sync
  useEffect(() => { viewModeRef.current = viewMode; }, [viewMode]);

  const getBubbleSize = useCallback(
    (s: TechBubbleSize) => Math.round(BASE_SIZE[s] * getSizeScale(viewMode)),
    [viewMode]
  );

  /* ── Launch ── */
  const launchBubbles = useCallback((withExit = false) => {
    const container = containerRef.current;
    if (!container) return;
    const { width: W, height: H } = container.getBoundingClientRect();
    if (!W || !H) return;

    const vm = viewModeRef.current;
    const scale = getSizeScale(vm);
    const next: BubbleState[] = [];

    visibleTech.forEach((item, idx) => {
      const node = bubbleRefs.current.get(item.id);
      if (!node) return;

      const size = Math.round(BASE_SIZE[item.size] * scale);
      const r = size / 2;
      const target = placeTarget(next, W, H, r);
      const start = outsidePoint(W, H, r);

      // Give every bubble a constant base velocity so they're always dancing
      const isMob = viewModeRef.current === "mobile";
      const angle = rnd(0, Math.PI * 2);
      const speed = rnd(isMob ? 0.2 : 0.6, isMob ? 0.55 : 1.4);

      const state: BubbleState = {
        id: item.id, radius: r,
        x: target.x, y: target.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        phase: rnd(0, Math.PI * 2),
        floatSpeed: rnd(0.0014, 0.003),
        floatAmount: rnd(5, 10),
        squishReadyAt: 0,
        active: false, node,
        setX: (x: number, y: number) => {
          node.style.transform = `translate(${x}px,${y}px)`;
        },
      };

      next.push(state);
      gsap.killTweensOf(node);

      const flyIn = () => {
        state.active = true;
        const isMobNow = viewModeRef.current === "mobile";
        if (isMobNow) {
          // Mobile: no fly-in animation — just fade in instantly at position
          gsap.set(node, { x: target.x - r, y: target.y - r, scale: 1, force3D: true });
          gsap.fromTo(node,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, delay: idx * 0.015, ease: "power1.out", force3D: true,
              onComplete: () => { state.x = target.x; state.y = target.y; }
            }
          );
        } else {
          gsap.fromTo(node,
            { x: start.x - r, y: start.y - r, opacity: 0, scale: 0.45, force3D: true },
            {
              x: target.x - r, y: target.y - r,
              opacity: 1, scale: 1, force3D: true,
              duration: rnd(1.4, 3.2),
              delay: idx * 0.038,
              ease: "power2.inOut",
              onComplete: () => {
                state.x = target.x; state.y = target.y;
                gsap.fromTo(node, { scale: 1.1 }, { scale: 1, duration: 0.45, ease: "elastic.out(1,0.5)", force3D: true });
              },
            }
          );
        }
      };

      if (withExit) {
        const exit = outsidePoint(W, H, r);
        gsap.to(node, {
          x: exit.x - r, y: exit.y - r, opacity: 0, scale: 0.4,
          duration: rnd(0.35, 0.65), ease: "power2.in",
          onComplete: flyIn,
        });
      } else {
        flyIn();
      }
    });

    statesRef.current = next;
  }, [visibleTech]);

  /* resize */
  useEffect(() => {
    const onResize = () => { setViewMode(getViewMode()); setGeneration(v => v + 1); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* scroll-triggered launch — IntersectionObserver only, no eager retry */
  useEffect(() => {
    launchedRef.current = false;
    obsRef.current?.disconnect();

    const tryLaunch = (): boolean => {
      const c = containerRef.current;
      if (!c) return false;
      const { width, height } = c.getBoundingClientRect();
      if (!width || !height) return false;
      if (bubbleRefs.current.size < 1) return false;
      launchBubbles(false);
      launchedRef.current = true;
      return true;
    };

    // On iOS Safari the container may have 0 dimensions until it's in view.
    // Use IntersectionObserver as the primary trigger — fires reliably on all browsers.
    const section = document.getElementById("techstack");
    if (section) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !launchedRef.current) {
            // Defer one rAF so layout is complete (critical for iOS)
            requestAnimationFrame(() => {
              if (!launchedRef.current) tryLaunch();
            });
          }
        },
        { threshold: 0.01 }
      );
      obsRef.current = obs;
      obs.observe(section);
    }

    // Also try immediately in case section is already visible on mount
    requestAnimationFrame(() => {
      if (!launchedRef.current) tryLaunch();
    });

    return () => obsRef.current?.disconnect();
  }, [launchBubbles]);

  /* re-launch on generation */
  useEffect(() => {
    if (generation === 0) return;
    launchBubbles(true);
  }, [generation, launchBubbles]);

  /* cursor tracking */
  useEffect(() => {
    const update = (cx: number, cy: number) => {
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      cursorRef.current = { x: cx - rect.left, y: cy - rect.top, lastMoveAt: performance.now() };
    };
    const onMouse = (e: MouseEvent) => update(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0] ?? e.changedTouches[0];
      if (t) update(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  /* periodic regen */
  useEffect(() => {
    let id: number;
    const sched = () => { id = window.setTimeout(() => { setGeneration(v => v + 1); sched(); }, rnd(25000, 35000)); };
    sched();
    return () => clearTimeout(id);
  }, []);

  /* ── Physics loop ── */
  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const tick = (time: number) => {
      // Clamp delta to avoid huge jumps after tab switch / iOS background
      const delta = Math.min(time - lastTime, 50);
      lastTime = time;
      const scale = delta / 16.67; // normalize to 60fps

      const container = containerRef.current;
      if (container) {
        const { width: W, height: H } = container.getBoundingClientRect();
        const states = statesRef.current;
        const cursor = cursorRef.current;
        const cursorAge = time - cursor.lastMoveAt;
        const cursorInfluence = Math.max(0, 1 - cursorAge / 400);

        for (const s of states) {
          if (!s.active) continue;

          const floatY = Math.sin(time * s.floatSpeed + s.phase) * s.floatAmount;
          const floatX = Math.cos(time * s.floatSpeed * 0.7 + s.phase) * (s.floatAmount * 0.5);

          s.vx += ((s.x + floatX - s.x) * 0.0008 + floatX * 0.004) * scale;
          s.vy += floatY * 0.004 * scale;

          if (cursorInfluence > 0) {
            const cdx = cursor.x - s.x;
            const cdy = cursor.y - s.y;
            const cdist = Math.hypot(cdx, cdy) || 1;
            const attractRadius = Math.max(W, H) * 0.75;
            if (cdist < attractRadius) {
              const t = 1 - cdist / attractRadius;
              const strength = t * t * 2.8 * cursorInfluence * scale;
              s.vx += (cdx / cdist) * strength;
              s.vy += (cdy / cdist) * strength;
            }
          }

          s.vx += rnd(-0.08, 0.08) * scale;
          s.vy += rnd(-0.08, 0.08) * scale;
        }

        for (let i = 0; i < states.length; i++) {
          const a = states[i];
          if (!a.active) continue;
          for (let j = i + 1; j < states.length; j++) {
            const b = states[j];
            if (!b.active) continue;

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            const minDist = a.radius + b.radius;

            if (dist < minDist) {
              const nx = dx / dist;
              const ny = dy / dist;
              const overlap = (minDist - dist) / 2;
              a.x -= nx * overlap;
              a.y -= ny * overlap;
              b.x += nx * overlap;
              b.y += ny * overlap;

              const dvx = a.vx - b.vx;
              const dvy = a.vy - b.vy;
              const dvn = dvx * nx + dvy * ny;

              if (dvn > 0) {
                const restitution = 1.15;
                const impulse = dvn * restitution;
                a.vx -= impulse * nx;
                a.vy -= impulse * ny;
                b.vx += impulse * nx;
                b.vy += impulse * ny;

                const kick = viewModeRef.current === "mobile" ? 0.8 : 2.2;
                a.vx -= nx * kick;
                a.vy -= ny * kick;
                b.vx += nx * kick;
                b.vy += ny * kick;

                if (time > a.squishReadyAt) {
                  gsap.fromTo(a.node,
                    { scaleX: 0.88, scaleY: 1.12 },
                    { scaleX: 1, scaleY: 1, duration: 0.3, ease: "elastic.out(1,0.45)" }
                  );
                  a.squishReadyAt = time + 500;
                }
                if (time > b.squishReadyAt) {
                  gsap.fromTo(b.node,
                    { scaleX: 1.12, scaleY: 0.88 },
                    { scaleX: 1, scaleY: 1, duration: 0.3, ease: "elastic.out(1,0.45)" }
                  );
                  b.squishReadyAt = time + 500;
                }
              }
            }
          }
        }

        for (const s of states) {
          if (!s.active) continue;

          s.x += s.vx * scale;
          s.y += s.vy * scale;

          const speed = Math.hypot(s.vx, s.vy);
          const maxSpeed = viewModeRef.current === "mobile" ? 1.8 : 5.5;
          if (speed > maxSpeed) {
            s.vx = (s.vx / speed) * maxSpeed;
            s.vy = (s.vy / speed) * maxSpeed;
          }

          const minSpeed = viewModeRef.current === "mobile" ? 0.1 : 0.25;
          if (speed < minSpeed && speed > 0) {
            s.vx = (s.vx / speed) * minSpeed;
            s.vy = (s.vy / speed) * minSpeed;
          }

          s.vx *= 0.978;
          s.vy *= 0.978;

          if (s.x < s.radius) { s.x = s.radius; s.vx = Math.abs(s.vx) * 0.85; }
          else if (s.x > W - s.radius) { s.x = W - s.radius; s.vx = -Math.abs(s.vx) * 0.85; }
          if (s.y < s.radius) { s.y = s.radius; s.vy = Math.abs(s.vy) * 0.85; }
          else if (s.y > H - s.radius) { s.y = H - s.radius; s.vy = -Math.abs(s.vy) * 0.85; }

          s.setX(s.x - s.radius, s.y - s.radius);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
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
        <div
          className="techstack-bubble-area"
          ref={containerRef}
          style={{ "--border-angle": "0deg" } as CSSProperties}
        >
          {visibleTech.map((item, index) => (
            <TechBubble
              key={item.id} item={item} index={index}
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
