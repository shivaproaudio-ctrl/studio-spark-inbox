// @ts-nocheck -- imported code written for looser compiler settings
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { EXPERIENCE_PLATFORMS, STUDIO_ASSETS } from '../data/clickArrowData';
import { CrtCanvasScreen } from './CrtCanvasScreen';

gsap.registerPlugin(ScrollTrigger);

export function BrandExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [focusedId, setFocusedId] = useState(EXPERIENCE_PLATFORMS[0].id);

  const focused =
    EXPERIENCE_PLATFORMS.find((p) => p.id === focusedId) ??
    EXPERIENCE_PLATFORMS[0];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          once: true,
          invalidateOnRefresh: true,
        },
      });

      reveal
        .fromTo(
          '[data-exp-cards] > button',
          { y: 56, autoAlpha: 0, rotateX: -6, scale: 0.97 },
          {
            y: 0,
            autoAlpha: 1,
            rotateX: 0,
            scale: 1,
            duration: 0.72,
            stagger: 0.11,
            ease: 'power3.out',
            clearProps: 'transform',
          },
        )
        .fromTo(
          '[data-exp-hub]',
          { x: 48, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.82,
            ease: 'power3.out',
            clearProps: 'transform',
          },
          '-=0.62',
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative z-10 border-t border-white/15 bg-[#050505]/92 py-24 sm:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono-tabular text-xs font-medium tracking-[0.22em] text-[#E80012] uppercase">
            07. Multi-Screen Brand Experience
          </p>
          <h2
            className="mt-4 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-6xl"
            style={{ textWrap: 'balance' }}
          >
            ONE IDEA. EVERY PLATFORM.{' '}
            <span className="text-[#E80012]">ONE EXPERIENCE.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            From tactile CRT broadcast aesthetics to frameless modern web and
            vertical mobile feeds, every touchpoint connects back to one central
            brand identity.
          </p>
        </div>

        {/* Multi-Screen Convergence Stage */}
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
          {/* Left: Vintage CRT Broadcast Monitor + Frameless Modern Web Frame */}
          <div
            data-exp-cards
            className="lg:col-span-8 grid grid-cols-1 gap-6 sm:grid-cols-2"
          >
            {/* Retro CRT Screen Frame */}
            <button
              type="button"
              onClick={() => setFocusedId('crt-broadcast')}
              className={`group text-left border p-4 transition-colors duration-200 cursor-pointer ${
                focusedId === 'crt-broadcast'
                  ? 'border-[#E80012] bg-[#101010]'
                  : 'border-white/15 bg-[#0A0A0A] hover:border-white/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono-tabular text-[11px] font-bold text-[#E80012] uppercase">
                  CRT Broadcast
                </span>
                <span className="font-mono-tabular text-[11px] text-white/55">
                  Analog Texture
                </span>
              </div>
              <div className="border-4 border-[#050505] bg-black">
                <CrtCanvasScreen
                  program="visual-stories"
                  backdropImage={STUDIO_ASSETS.spatialScreens}
                  className="aspect-[4/3] w-full"
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/75">
                {EXPERIENCE_PLATFORMS[0].caption}
              </p>
            </button>

            {/* Modern Frameless Digital Flagship */}
            <button
              type="button"
              onClick={() => setFocusedId('web-flagship')}
              className={`group text-left border p-4 transition-colors duration-200 cursor-pointer ${
                focusedId === 'web-flagship'
                  ? 'border-[#E80012] bg-[#101010]'
                  : 'border-white/15 bg-[#0A0A0A] hover:border-white/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono-tabular text-[11px] font-bold text-[#E80012] uppercase">
                  Interactive Web
                </span>
                <span className="font-mono-tabular text-[11px] text-white/55">
                  Modern Surface
                </span>
              </div>
              <div className="border border-white/20 bg-black">
                <CrtCanvasScreen
                  program="digital-experiences"
                  backdropImage={STUDIO_ASSETS.brandFilm}
                  className="aspect-[4/3] w-full"
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/75">
                {EXPERIENCE_PLATFORMS[1].caption}
              </p>
            </button>

            {/* Vertical Social Screen */}
            <button
              type="button"
              onClick={() => setFocusedId('social-vertical')}
              className={`group text-left border p-4 transition-colors duration-200 cursor-pointer ${
                focusedId === 'social-vertical'
                  ? 'border-[#E80012] bg-[#101010]'
                  : 'border-white/15 bg-[#0A0A0A] hover:border-white/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono-tabular text-[11px] font-bold text-[#E80012] uppercase">
                  Social Feed
                </span>
                <span className="font-mono-tabular text-[11px] text-white/55">
                  Vertical Canvas
                </span>
              </div>
              <div className="border border-white/20 bg-black">
                <CrtCanvasScreen
                  program="social-presence"
                  backdropImage={STUDIO_ASSETS.lifestyleEditorial}
                  className="aspect-[4/3] w-full"
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/75">
                {EXPERIENCE_PLATFORMS[2].caption}
              </p>
            </button>

            {/* Search & Commerce Screen */}
            <button
              type="button"
              onClick={() => setFocusedId('search-commerce')}
              className={`group text-left border p-4 transition-colors duration-200 cursor-pointer ${
                focusedId === 'search-commerce'
                  ? 'border-[#E80012] bg-[#101010]'
                  : 'border-white/15 bg-[#0A0A0A] hover:border-white/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono-tabular text-[11px] font-bold text-[#E80012] uppercase">
                  Search &amp; Growth
                </span>
                <span className="font-mono-tabular text-[11px] text-white/55">
                  Intent Signal
                </span>
              </div>
              <div className="border border-white/20 bg-black">
                <CrtCanvasScreen
                  program="search-growth"
                  backdropImage={STUDIO_ASSETS.identitySystem}
                  className="aspect-[4/3] w-full"
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/75">
                {EXPERIENCE_PLATFORMS[3].caption}
              </p>
            </button>
          </div>

          {/* Right: Central Brand Identity Hub */}
          <div
            data-exp-hub
            className="lg:col-span-4 flex flex-col justify-between border border-white/20 bg-[#080808] p-7"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <span className="font-mono-tabular text-xs font-bold tracking-widest text-[#E80012] uppercase">
                  Central Brand Core
                </span>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 4H12.5L21 12L12.5 20H3L11 12L3 4Z"
                    fill="#E80012"
                  />
                </svg>
              </div>

              <h3 className="mt-6 font-display text-2xl font-extrabold text-white">
                {focused.label}
              </h3>
              <p className="mt-1 font-mono-tabular text-xs text-white/60 uppercase">
                {focused.deviceType}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                {focused.caption}
              </p>
            </div>

            <div className="mt-8 border-t border-white/15 pt-5">
              <p className="font-mono-tabular text-xs text-white/60 uppercase mb-3">
                Connected Platforms
              </p>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_PLATFORMS.map((plat) => (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => setFocusedId(plat.id)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      plat.id === focusedId
                        ? 'bg-[#E80012] text-white'
                        : 'border border-white/20 text-white/75 hover:border-white hover:text-white'
                    }`}
                  >
                    {plat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
