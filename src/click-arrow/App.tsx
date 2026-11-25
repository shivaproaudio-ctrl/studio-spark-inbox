// @ts-nocheck -- imported code written for looser compiler settings
import './click-arrow.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { AttentionSection } from './components/AttentionSection';
import { BrandExperienceSection } from './components/BrandExperienceSection';
import { ContactSection } from './components/ContactSection';
import { CustomCursor } from './components/CustomCursor';
import { DigitalGrowthSection } from './components/DigitalGrowthSection';
import { Navbar } from './components/Navbar';
import { ProcessSection } from './components/ProcessSection';
import { ServicesTvGallery } from './components/ServicesTvGallery';
import { StrategySection } from './components/StrategySection';
import { ThreeHeroStage } from './components/ThreeHeroStage';
import { TvShowcaseModal } from './components/TvShowcaseModal';
import { BRAND_BACKDROP, SERVICES_CHANNELS } from './data/clickArrowData';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [modalChannelIndex, setModalChannelIndex] = useState<number | null>(
    null,
  );
  const [hovered3dChannel, setHovered3dChannel] = useState<number | null>(null);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [contactInterest, setContactInterest] = useState<string | undefined>(
    undefined,
  );
  const [channelFire, setChannelFire] = useState(false);

  // Initialize Lenis smooth scrolling + GSAP ScrollTrigger sync
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const rafUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafUpdate);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafUpdate);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleStartProject = useCallback(
    (topic: string) => {
      setContactInterest(topic);
      scrollToSection('contact');
    },
    [scrollToSection],
  );

  const effectiveCursorLabel =
    hovered3dChannel !== null
      ? `${SERVICES_CHANNELS[hovered3dChannel].channelNumber} · OPEN`
      : cursorLabel;

  return (
    <div className="click-arrow-app relative min-h-screen bg-[#050505] text-white">
      {/* Mandatory Bright Red Brand Background Image Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#E80012]"
      >
        <img
          src={BRAND_BACKDROP}
          alt=""
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/75" />
      </div>

      {/* Persistent Interactive 3D CRT Televisions + Click Arrow Sculpture Stage */}
      <ThreeHeroStage
        modalOpen={modalChannelIndex !== null}
        onSelectChannel={(idx) => setModalChannelIndex(idx)}
        onHoverChannel={(idx) => setHovered3dChannel(idx)}
      />

      {/* Custom Interactive Cursor (Desktop fine pointers) */}
      <CustomCursor cursorLabel={effectiveCursorLabel} />

      {/* Top 3-Zone Navigation Bar */}
      <Navbar onNavigate={scrollToSection} />

      {/* Main Content Flow */}
      <main className="relative z-10 pt-16">
        {/* SECTION 01: HERO — THE OPENING EXPERIENCE */}
        <section
          id="hero"
          className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-20 sm:px-8 lg:px-12"
        >
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="font-display text-[clamp(2.5rem,6.5vw,5.4rem)] font-extrabold leading-[0.94] tracking-tight text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.72)]"
              style={{ textWrap: 'balance' }}
            >
              MAKE YOUR BRAND{' '}
              <span className="block text-white">
                IMPOSSIBLE TO IGNORE.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base font-medium leading-relaxed text-white/95 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] sm:text-xl">
              Strategy, creativity and digital experiences designed to move your
              brand forward.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="bg-white px-7 py-4 text-xs font-extrabold tracking-[0.18em] text-[#050505] uppercase shadow-[0_14px_35px_rgba(0,0,0,0.45)] transition-colors duration-150 hover:bg-[#050505] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer"
              >
                LET&apos;S MAKE IT HAPPEN.
              </button>
              <button
                type="button"
                onClick={() => {
                  setChannelFire(true);
                  setModalChannelIndex(0);
                }}
                onAnimationEnd={() => setChannelFire(false)}
                className={`border border-white/60 bg-[#050505]/70 px-6 py-4 text-xs font-bold tracking-[0.16em] text-white uppercase transition-colors duration-150 hover:border-white hover:bg-[#050505] cursor-pointer ${
                  channelFire ? 'ca-btn-fire' : ''
                }`}
              >
                Tune CRT Channel 01
              </button>
            </div>

            {/* Subtle Hovered 3D TV Indicator */}
            <div className="mt-8 h-6">
              {hovered3dChannel !== null ? (
                <p className="font-mono-tabular text-xs font-semibold tracking-widest text-white uppercase drop-shadow">
                  {SERVICES_CHANNELS[hovered3dChannel].channelNumber} —{' '}
                  {SERVICES_CHANNELS[hovered3dChannel].title} · Click television
                  to explore
                </p>
              ) : (
                <p className="font-mono-tabular text-xs tracking-widest text-white/80 uppercase">
                  Click any floating CRT television or scroll to explore
                </p>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 02: THE ATTENTION SECTION */}
        <AttentionSection />

        {/* SECTION 03: ABOUT CLICK ARROW */}
        <AboutSection
          onExploreServices={() => scrollToSection('services')}
        />

        {/* SECTION 04: SERVICES — INTERACTIVE 6-TV CRT GALLERY */}
        <ServicesTvGallery
          onOpenModal={(idx) => setModalChannelIndex(idx)}
          onCursorHint={setCursorLabel}
        />

        {/* SECTION 06: STRATEGY SECTION */}
        <StrategySection />

        {/* SECTION 07: DIGITAL GROWTH SECTION */}
        <DigitalGrowthSection />

        {/* SECTION 08: BRAND EXPERIENCE SECTION */}
        <BrandExperienceSection />

        {/* SECTION 09: OUR PROCESS */}
        <ProcessSection />

        {/* SECTION 10: FINAL CONTACT SECTION */}
        <ContactSection preselectedInterest={contactInterest} />
      </main>

      {/* Expanded CRT Television Modal */}
      <TvShowcaseModal
        channelIndex={modalChannelIndex}
        onClose={() => setModalChannelIndex(null)}
        onChangeChannel={(idx) => setModalChannelIndex(idx)}
        onStartProject={handleStartProject}
      />
    </div>
  );
}
