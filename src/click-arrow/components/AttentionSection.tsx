import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { STUDIO_ASSETS } from '../data/clickArrowData';
import { CrtCanvasScreen } from './CrtCanvasScreen';

gsap.registerPlugin(ScrollTrigger);

export function AttentionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const impactWordRef = useRef<HTMLSpanElement>(null);
  const leftTvRef = useRef<HTMLDivElement>(null);
  const rightTvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=115%',
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        topLineRef.current,
        { xPercent: -8, opacity: 0.25 },
        { xPercent: 0, opacity: 1, ease: 'none' },
        0,
      )
        .fromTo(
          bottomLineRef.current,
          { xPercent: 10, opacity: 0.25 },
          { xPercent: 0, opacity: 1, ease: 'none' },
          0,
        )
        .fromTo(
          impactWordRef.current,
          { scale: 0.86, letterSpacing: '0.02em' },
          { scale: 1.12, letterSpacing: '-0.04em', ease: 'none' },
          0.15,
        )
        .fromTo(
          leftTvRef.current,
          { yPercent: 25, rotateZ: -6, opacity: 0.35 },
          { yPercent: -12, rotateZ: 2, opacity: 1, ease: 'none' },
          0,
        )
        .fromTo(
          rightTvRef.current,
          { yPercent: -20, rotateZ: 7, opacity: 0.35 },
          { yPercent: 14, rotateZ: -3, opacity: 1, ease: 'none' },
          0,
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="attention"
      ref={sectionRef}
      className="relative z-10 flex min-h-screen items-center overflow-hidden border-t border-white/15 bg-[#050505]/82 py-20"
    >
      {/* Subtle vivid red focal glow behind IMPACT */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(232,0,18,0.34)_0%,rgba(5,5,5,0)_72%)]"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Flanking Scroll-Reactive CRT Monitors (Desktop) */}
        <div
          ref={leftTvRef}
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-6 hidden w-52 border-4 border-[#181818] bg-[#0B0B0B] p-2 shadow-2xl xl:block"
        >
          <CrtCanvasScreen
            program="social-presence"
            backdropImage={STUDIO_ASSETS.lifestyleEditorial}
            className="aspect-[4/3] w-full"
          />
          <div className="mt-1.5 flex items-center justify-between px-1">
            <span className="font-mono-tabular text-[10px] text-white/60">
              SIGNAL 01
            </span>
            <span className="h-1.5 w-3 bg-[#E80012]" />
          </div>
        </div>

        <div
          ref={rightTvRef}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 right-6 hidden w-56 border-4 border-[#181818] bg-[#0B0B0B] p-2 shadow-2xl xl:block"
        >
          <CrtCanvasScreen
            program="visual-stories"
            backdropImage={STUDIO_ASSETS.brandFilm}
            className="aspect-[4/3] w-full"
          />
          <div className="mt-1.5 flex items-center justify-between px-1">
            <span className="font-mono-tabular text-[10px] text-white/60">
              SIGNAL 02
            </span>
            <span className="h-1.5 w-3 bg-[#E80012]" />
          </div>
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <p className="font-mono-tabular text-xs font-medium tracking-[0.22em] text-white/70 uppercase">
            01. The Signal Divide
          </p>

          <div
            ref={topLineRef}
            className="mt-6 font-display text-3xl font-bold leading-[1.06] tracking-tight text-white/85 sm:text-5xl lg:text-6xl"
          >
            EVERYONE WANTS ATTENTION.
          </div>

          <div
            ref={bottomLineRef}
            className="mt-6 font-display text-3xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-7xl"
          >
            BUT NOT EVERYONE MAKES AN{' '}
            <span
              ref={impactWordRef}
              className="mt-3 inline-block bg-[#E80012] px-4 py-1 text-white shadow-[0_0_50px_rgba(232,0,18,0.55)]"
            >
              IMPACT.
            </span>
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Noise is effortless. Memorability is engineered. Click Arrow builds
            brand gravity through deliberate strategy, bold visual craft, and
            digital experiences built to last beyond the scroll.
          </p>
        </div>
      </div>
    </section>
  );
}
