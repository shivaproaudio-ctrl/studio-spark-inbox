// @ts-nocheck -- imported code written for looser compiler settings
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { PROCESS_STAGES } from '../data/clickArrowData';

gsap.registerPlugin(ScrollTrigger);

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);

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
        start: 'top 25%',
        end: 'bottom 65%',
        onUpdate: (self) => {
          // Hold stage 01 for the first stretch of the scroll so the red
          // progress animation only begins once the section is properly in view.
          const LEAD_IN = 0.22;
          const eased = Math.max(
            0,
            (self.progress - LEAD_IN) / (1 - LEAD_IN),
          );
          const idx = Math.min(
            PROCESS_STAGES.length - 1,
            Math.floor(eased * PROCESS_STAGES.length),
          );
          setActiveStage(idx);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const progressPct = ((activeStage + 1) / PROCESS_STAGES.length) * 100;

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative z-10 border-t border-white/15 bg-[#050505] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col gap-6 border-b border-white/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.22em] text-[#E80012] uppercase">
              08. Our Process
            </p>
            <h2
              className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              GREAT WORK IS{' '}
              <span className="text-[#E80012]">NEVER RANDOM.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono-tabular text-xs text-white/65 uppercase">
              Active Stage
            </span>
            <span className="bg-[#E80012] px-3 py-1.5 font-mono-tabular text-xs font-bold text-white">
              {PROCESS_STAGES[activeStage].number} ·{' '}
              {PROCESS_STAGES[activeStage].title}
            </span>
          </div>
        </div>

        {/* Animated Connecting Line */}
        <div className="mt-10 relative h-[3px] w-full bg-white/15">
          <div
            className="h-full bg-[#E80012] transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* 6 Stage Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS_STAGES.map((stage, idx) => {
            const isActive = idx === activeStage;
            const isPassed = idx <= activeStage;
            return (
              <button
                key={stage.number}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`flex flex-col justify-between border p-6 sm:p-7 text-left transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'border-[#E80012] bg-[#E80012] text-white'
                    : isPassed
                      ? 'border-white/30 bg-[#0D0D0D] text-white'
                      : 'border-white/15 bg-[#080808] text-white/75 hover:border-white/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-display text-4xl font-extrabold font-mono-tabular ${
                      isActive ? 'text-white' : 'text-[#E80012]'
                    }`}
                  >
                    {stage.number}
                  </span>
                  <span
                    className={`h-2.5 w-2.5 ${
                      isActive ? 'bg-white' : isPassed ? 'bg-[#E80012]' : 'bg-white/20'
                    }`}
                  />
                </div>

                <div className="mt-8">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight">
                    {stage.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      isActive ? 'text-white' : 'text-white/90'
                    }`}
                  >
                    {stage.tagline}
                  </p>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      isActive ? 'text-white/90' : 'text-white/70'
                    }`}
                  >
                    {stage.detail}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
