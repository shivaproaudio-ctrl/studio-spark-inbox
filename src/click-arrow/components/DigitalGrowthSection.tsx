// @ts-nocheck -- imported code written for looser compiler settings
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { GROWTH_CHANNELS } from '../data/clickArrowData';

gsap.registerPlugin(ScrollTrigger);

export function DigitalGrowthSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedId, setSelectedId] = useState(GROWTH_CHANNELS[0].id);
  const selected =
    GROWTH_CHANNELS.find((c) => c.id === selectedId) ?? GROWTH_CHANNELS[0];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-growth-nodes] > button', {
        y: 38,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 76%' },
      });

      gsap.from('[data-growth-panel]', {
        x: 46,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 74%' },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="growth"
      ref={sectionRef}
      className="relative z-10 border-t border-white/15 bg-[#050505] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 border-b border-white/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.22em] text-[#E80012] uppercase">
              06. Digital Growth Architecture
            </p>
            <h2
              className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              MAKE ATTENTION <span className="text-[#E80012]">COUNT.</span>
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
            Creativity earns attention; structured digital architecture converts
            it into compounding momentum. Select any channel below to inspect
            how each layer feeds the brand system.
          </p>
        </div>

        {/* Interactive Signal Pipeline Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
          {/* Left: 6 Selectable Channel Nodes */}
          <div
            data-growth-nodes
            className="lg:col-span-7 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {GROWTH_CHANNELS.map((channel) => {
              const active = channel.id === selectedId;
              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setSelectedId(channel.id)}
                  className={`flex flex-col justify-between border p-5 text-left transition-colors duration-150 cursor-pointer ${
                    active
                      ? 'border-[#E80012] bg-[#E80012] text-white'
                      : 'border-white/15 bg-[#0A0A0A] text-white hover:border-white/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono-tabular text-xs font-bold ${
                        active ? 'text-white' : 'text-[#E80012]'
                      }`}
                    >
                      {channel.index}
                    </span>
                    <span
                      className={`font-mono-tabular text-[11px] uppercase ${
                        active ? 'text-white/90' : 'text-white/50'
                      }`}
                    >
                      {active ? 'Active Node' : 'Inspect'}
                    </span>
                  </div>
                  <div className="mt-5">
                    <h3 className="font-display text-xl font-bold">
                      {channel.title}
                    </h3>
                    <p
                      className={`mt-1.5 text-sm leading-relaxed ${
                        active ? 'text-white/90' : 'text-white/70'
                      }`}
                    >
                      {channel.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Visual Architecture Schematic for Selected Growth Channel */}
          <div
            data-growth-panel
            className="lg:col-span-5 flex flex-col justify-between border border-white/20 bg-[#090909] p-6 sm:p-8"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <span className="font-mono-tabular text-xs font-bold tracking-widest text-[#E80012] uppercase">
                  Channel {selected.index} · Signal Architecture
                </span>
                <span className="font-mono-tabular text-xs text-white/60">
                  Connected Loop
                </span>
              </div>

              <h3 className="mt-6 font-display text-3xl font-extrabold text-white">
                {selected.title}
              </h3>
              <p className="mt-2 text-base text-white/80">{selected.role}</p>

              {/* Procedural Process Flow SVG Diagram (No fake metrics) */}
              <div className="mt-6 border border-white/10 bg-[#050505] p-5">
                <svg
                  viewBox="0 0 360 110"
                  className="w-full h-auto"
                  aria-label="Growth signal flow schematic"
                >
                  <line
                    x1="28"
                    y1="55"
                    x2="332"
                    y2="55"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                  />
                  <line
                    x1="28"
                    y1="55"
                    x2="230"
                    y2="55"
                    stroke="#E80012"
                    strokeWidth="2.5"
                  />
                  {/* Nodes */}
                  <circle cx="32" cy="55" r="8" fill="#FFFFFF" />
                  <circle cx="132" cy="55" r="10" fill="#E80012" />
                  <circle cx="232" cy="55" r="8" fill="#FFFFFF" />
                  <polygon points="324,45 340,55 324,65" fill="#E80012" />
                  <text
                    x="32"
                    y="90"
                    fill="rgba(255,255,255,0.75)"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    CREATIVE
                  </text>
                  <text
                    x="132"
                    y="90"
                    fill="#E80012"
                    fontSize="10"
                    fontWeight="700"
                    textAnchor="middle"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    DISTRIBUTION
                  </text>
                  <text
                    x="232"
                    y="90"
                    fill="rgba(255,255,255,0.75)"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    ENGAGEMENT
                  </text>
                  <text
                    x="328"
                    y="90"
                    fill="#FFFFFF"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    ACTION
                  </text>
                </svg>
              </div>

              <div className="mt-6 space-y-3">
                <p className="font-mono-tabular text-xs tracking-widest text-white/60 uppercase">
                  Executed Deliverables
                </p>
                {selected.outputs.map((out, i) => (
                  <div
                    key={out}
                    className="flex items-center justify-between border-b border-white/10 pb-2.5 text-sm text-white/90"
                  >
                    <span>{out}</span>
                    <span className="font-mono-tabular text-xs text-[#E80012]">
                      0{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
