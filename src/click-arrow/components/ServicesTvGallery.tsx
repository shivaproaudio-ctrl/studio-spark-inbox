// @ts-nocheck -- imported code written for looser compiler settings
import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SERVICES_CHANNELS } from '../data/clickArrowData';
import { CrtCanvasScreen } from './CrtCanvasScreen';

interface ServicesTvGalleryProps {
  onOpenModal: (channelIndex: number) => void;
  onCursorHint: (label: string | null) => void;
}

export function ServicesTvGallery({
  onOpenModal,
  onCursorHint,
}: ServicesTvGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const touchStartX = useRef<number | null>(null);
  const wheelLock = useRef(0);
  const activeTvRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;

  const activeService = SERVICES_CHANNELS[activeIndex];
  const total = SERVICES_CHANNELS.length;

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const isActiveTvFullyVisible = useCallback(() => {
    const tv = activeTvRef.current;
    if (!tv) return false;

    const rect = tv.getBoundingClientRect();
    const fixedHeaderBottom =
      document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;

    return (
      rect.top >= fixedHeaderBottom &&
      rect.bottom <= window.innerHeight &&
      rect.left >= 0 &&
      rect.right <= window.innerWidth
    );
  }, []);

  // Let the page reveal the complete CRT first; then wheel input tunes channels.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 12) return;
      const idx = activeIndexRef.current;
      const goingDown = e.deltaY > 0;
      const canCycle = goingDown ? idx < total - 1 : idx > 0;
      if (!canCycle) return; // at the edge: let the page scroll on

      if (!isActiveTvFullyVisible()) return;

      e.preventDefault();
      e.stopPropagation(); // keep Lenis smooth-scroll from moving the page
      const now = Date.now();
      if (now - wheelLock.current < 350) return;
      wheelLock.current = now;
      setActiveIndex(goingDown ? idx + 1 : idx - 1);
    };

    section.addEventListener('wheel', onWheel, { passive: false });
    return () => section.removeEventListener('wheel', onWheel);
  }, [isActiveTvFullyVisible, total]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({ x: ny * -5, y: nx * 7 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const diff = endX - touchStartX.current;
    if (Math.abs(diff) > 40 && isActiveTvFullyVisible()) {
      if (diff < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative z-10 border-t border-white/15 bg-[#050505]/92 py-24 sm:py-32 overflow-hidden"
    >
      {/* Controlled bright red studio floor illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[540px] w-[960px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(232,0,18,0.22)_0%,rgba(5,5,5,0)_70%)]"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Section Heading & Controls Header */}
        <div className="flex flex-col gap-6 border-b border-white/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.22em] text-[#E80012] uppercase">
              03. Services — Interactive CRT Gallery
            </p>
            <h2
              className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              ONE BRAND.{' '}
              <span className="text-[#E80012]">CONNECTED POSSIBILITIES.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous service television"
              className="flex h-11 w-11 items-center justify-center border border-white/25 bg-[#0B0B0B] text-white transition-colors hover:border-[#E80012] hover:bg-[#E80012] cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[64px] text-center font-mono-tabular text-xs font-semibold text-white/80">
              0{activeIndex + 1} / 0{total}
            </span>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next service television"
              className="flex h-11 w-11 items-center justify-center border border-white/25 bg-[#0B0B0B] text-white transition-colors hover:border-[#E80012] hover:bg-[#E80012] cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Channel Switcher Bar (6 Service Televisions) */}
        <div
          role="tablist"
          aria-label="Click Arrow Services Channels"
          className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
        >
          {SERVICES_CHANNELS.map((ch, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={ch.id}
                role="tab"
                aria-selected={isSelected}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`flex flex-col items-start border px-3.5 py-3 text-left transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-[#E80012] bg-[#E80012] text-white'
                    : 'border-white/15 bg-[#0B0B0B] text-white/75 hover:border-white/50 hover:text-white'
                }`}
              >
                <span
                  className={`font-mono-tabular text-[11px] font-semibold ${
                    isSelected ? 'text-white' : 'text-[#E80012]'
                  }`}
                >
                  {ch.channelNumber}
                </span>
                <span className="mt-1 font-display text-xs font-bold tracking-wide uppercase truncate w-full">
                  {ch.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive 3D-Perspective CRT Television Stage */}
        <div
          className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Spatial CRT Stage */}
          <div
            className="lg:col-span-7 relative flex items-center justify-center py-6 sm:py-10 [perspective:1400px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Background Flank TVs floating in depth */}
            <div className="relative flex w-full items-center justify-center">
              {SERVICES_CHANNELS.map((ch, idx) => {
                // Shortest circular distance from activeIndex
                let offset = idx - activeIndex;
                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                const isCenter = offset === 0;
                const absOff = Math.abs(offset);

                // Hide far-back screens cleanly on mobile, show 3D cluster on desktop
                const tx = offset * 155;
                const tz = isCenter ? 60 : -absOff * 160;
                const ry = offset * -16;
                const scale = isCenter ? 1 : Math.max(0.56, 1 - absOff * 0.18);
                const opacity = isCenter ? 1 : Math.max(0.24, 0.72 - absOff * 0.22);

                return (
                  <div
                    key={ch.id}
                    ref={isCenter ? activeTvRef : null}
                    onClick={() => {
                      if (isCenter) onOpenModal(idx);
                      else setActiveIndex(idx);
                    }}
                    onMouseEnter={() =>
                      onCursorHint(isCenter ? 'INSPECT TV' : `TUNE ${ch.channelNumber}`)
                    }
                    onMouseLeave={() => onCursorHint(null)}
                    style={{
                      transform: isCenter
                        ? `translate3d(0px, 0px, ${tz}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1)`
                        : `translate3d(${tx}px, ${absOff * 10}px, ${tz}px) rotateY(${ry}deg) scale(${scale})`,
                      zIndex: 20 - absOff * 4,
                      opacity,
                    }}
                    className={`${
                      isCenter
                        ? 'relative w-full max-w-[540px]'
                        : 'hidden md:block absolute w-[420px]'
                    } transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none`}
                  >
                    {/* Physical Retro-Futuristic CRT Television Housing */}
                    <div className="relative border border-white/25 bg-[#121212] p-3 sm:p-4 shadow-[0_28px_70px_rgba(0,0,0,0.92)]">
                      {/* Dipole Antenna Accent on Active Center TV */}
                      {isCenter && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-7 left-1/2 flex -translate-x-1/2 items-end gap-16"
                        >
                          <div className="h-8 w-[2px] -rotate-[28deg] bg-white/60 origin-bottom" />
                          <div className="h-8 w-[2px] rotate-[28deg] bg-white/60 origin-bottom" />
                        </div>
                      )}

                      <div className="grid grid-cols-12 gap-3 items-stretch">
                        {/* Curved CRT Tube Screen */}
                        <div className="col-span-10 relative border-[6px] border-[#050505] bg-[#050505] overflow-hidden shadow-[inset_0_0_24px_rgba(0,0,0,0.9)]">
                          <CrtCanvasScreen
                            program={ch.programType}
                            backdropImage={ch.backdropImage}
                            active={absOff <= 1}
                            className="aspect-[4/3] w-full"
                          />

                          {/* Subtle Screen Top Reflection */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-black/35"
                          />
                        </div>

                        {/* Right Side Tactile Control Strip (Rotary Dials + Louvers + Power LED) */}
                        <div className="col-span-2 flex flex-col items-center justify-between border-l border-white/10 bg-[#0A0A0A] py-2 px-1">
                          <div className="flex flex-col items-center gap-2.5">
                            <div
                              className="h-6 w-6 rounded-full border border-white/50 bg-[#1B1B1B] shadow-inner transition-transform duration-500"
                              style={{
                                transform: `rotate(${idx * 45}deg)`,
                              }}
                            >
                              <div className="mx-auto mt-1 h-2 w-[2px] bg-[#E80012]" />
                            </div>
                            <div className="h-5 w-5 rounded-full border border-white/35 bg-[#151515]" />
                          </div>

                          {/* Speaker Grille */}
                          <div className="my-2 flex w-full flex-col gap-1 px-1">
                            {[0, 1, 2, 3, 4, 5].map((slat) => (
                              <div
                                key={slat}
                                className="h-[2px] w-full bg-white/20"
                              />
                            ))}
                          </div>

                          {/* Vivid Red Power Bar */}
                          <div
                            className={`h-2 w-4 ${
                              isCenter ? 'bg-[#E80012]' : 'bg-white/25'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Chassis Footer Bar */}
                      <div className="mt-3 flex items-center justify-between px-1">
                        <span className="font-mono-tabular text-[11px] font-semibold tracking-widest text-white/75 uppercase">
                          {ch.channelNumber} · {ch.title}
                        </span>
                        {isCenter && (
                          <span className="inline-flex items-center gap-1.5 font-mono-tabular text-[11px] font-bold text-[#E80012] uppercase">
                            <Maximize2 className="h-3 w-3" />
                            <span>Expand</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Service Details Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-white/15 bg-[#080808] p-6 sm:p-8">
            <div>
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <span className="font-mono-tabular text-xs font-bold tracking-widest text-[#E80012] uppercase">
                  {activeService.channelNumber}
                </span>
                <span className="font-mono-tabular text-xs text-white/60">
                  Service {activeIndex + 1} of {total}
                </span>
              </div>

              <h3 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {activeService.title}
              </h3>

              <p className="mt-3 text-base font-semibold text-white">
                {activeService.subtitle}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
                {activeService.description}
              </p>

              <div className="mt-6 border-t border-white/15 pt-5">
                <p className="font-mono-tabular text-xs tracking-widest text-white/60 uppercase">
                  Channel Output
                </p>
                <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                  {activeService.deliverables.map((item, i) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3 text-sm text-white/90"
                    >
                      <span className="font-mono-tabular text-xs font-bold text-[#E80012]">
                        0{i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-white/15">
              <button
                type="button"
                onClick={() => onOpenModal(activeIndex)}
                className="flex-1 bg-[#E80012] px-5 py-3.5 text-center text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black cursor-pointer"
              >
                Inspect {activeService.channelNumber} Showcase
              </button>
            </div>
          </div>
        </div>

        {/* Progress Indicator Bar */}
        <div className="mt-8 flex items-center gap-2">
          {SERVICES_CHANNELS.map((ch, idx) => (
            <button
              key={ch.id}
              type="button"
              aria-label={`Select ${ch.channelNumber} ${ch.title}`}
              onClick={() => setActiveIndex(idx)}
              className="group py-2 flex-1 cursor-pointer"
            >
              <div
                className={`h-[3px] w-full transition-colors duration-200 ${
                  idx === activeIndex
                    ? 'bg-[#E80012]'
                    : 'bg-white/15 group-hover:bg-white/40'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
