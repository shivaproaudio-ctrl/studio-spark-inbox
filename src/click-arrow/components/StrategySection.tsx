// @ts-nocheck -- imported code written for looser compiler settings
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { STRATEGY_PILLARS } from '../data/clickArrowData';

gsap.registerPlugin(ScrollTrigger);

export function StrategySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePillar, setActivePillar] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 35%',
        end: 'bottom 65%',
        onUpdate: (self) => {
          const idx = Math.min(
            STRATEGY_PILLARS.length - 1,
            Math.floor(self.progress * STRATEGY_PILLARS.length),
          );
          setActivePillar(idx);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const current = STRATEGY_PILLARS[activePillar];
  const angle = activePillar * 60;

  return (
    <section
      id="strategy"
      ref={sectionRef}
      className="relative z-10 border-t border-white/15 bg-[#050505]/92 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Sticky Strategy Compass & Headline */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="font-mono-tabular text-xs font-medium tracking-[0.22em] text-[#E80012] uppercase">
              05. Strategy &amp; Direction
            </p>
            <h2
              className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              BEFORE WE CREATE,{' '}
              <span className="text-[#E80012]">WE FIND THE DIRECTION.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/75">
              Execution without clarity only amplifies noise. We interrogate
              every market angle before designing a single frame.
            </p>

            {/* Interactive Directional Vector Dial */}
            <div className="mt-10 flex items-center gap-6 border border-white/15 bg-[#0A0A0A] p-6">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#050505]">
                {/* Compass Tick Marks */}
                {[0, 60, 120, 180, 240, 300].map((deg, idx) => (
                  <button
                    key={deg}
                    type="button"
                    aria-label={`Focus ${STRATEGY_PILLARS[idx].title}`}
                    onClick={() => setActivePillar(idx)}
                    style={{
                      transform: `rotate(${deg}deg) translateY(-48px)`,
                    }}
                    className={`absolute h-2.5 w-2.5 rounded-full transition-colors cursor-pointer ${
                      idx === activePillar
                        ? 'bg-[#E80012] scale-125'
                        : 'bg-white/35 hover:bg-white'
                    }`}
                  />
                ))}

                {/* Rotating Click Arrow Vector Needle */}
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: `rotate(${angle - 90}deg)` }}
                >
                  <path
                    d="M3 4H12.5L21 12L12.5 20H3L11 12L3 4Z"
                    fill="#E80012"
                  />
                </svg>
              </div>

              <div>
                <span className="font-mono-tabular text-xs font-bold text-[#E80012] uppercase">
                  Vector {current.index} · {current.focus}
                </span>
                <h3 className="mt-1 font-display text-xl font-bold text-white">
                  {current.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                  {current.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Right 6-Stage Interactive Strategic Pillars */}
          <div className="lg:col-span-7 divide-y divide-white/15 border-y border-white/15">
            {STRATEGY_PILLARS.map((pillar, idx) => {
              const isActive = idx === activePillar;
              return (
                <button
                  key={pillar.index}
                  type="button"
                  onClick={() => setActivePillar(idx)}
                  onMouseEnter={() => setActivePillar(idx)}
                  className={`group flex w-full flex-col gap-3 py-7 px-4 text-left transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between cursor-pointer ${
                    isActive ? 'bg-[#E80012]/12' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-start gap-5 sm:items-center">
                    <span
                      className={`font-mono-tabular text-sm font-bold transition-colors ${
                        isActive ? 'text-[#E80012]' : 'text-white/45'
                      }`}
                    >
                      {pillar.index}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                        {pillar.title}
                      </h3>
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/75">
                        {pillar.summary}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 font-mono-tabular text-xs uppercase transition-colors ${
                      isActive ? 'text-white' : 'text-white/45'
                    }`}
                  >
                    {pillar.focus}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
