interface AboutSectionProps {
  onExploreServices: () => void;
}

const ABOUT_PILLARS = [
  {
    index: '01',
    title: 'Strategy First',
    body: 'Positioning, audience insight, and clear commercial direction before production begins.',
  },
  {
    index: '02',
    title: 'Fearless Craft',
    body: 'High-contrast identity systems, commercial film, and kinetic storytelling built to stand apart.',
  },
  {
    index: '03',
    title: 'Digital Velocity',
    body: 'Interactive platforms, search visibility, and agile campaign engines that move brands forward.',
  },
];

export function AboutSection({ onExploreServices }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="relative z-10 border-t border-white/15 bg-gradient-to-b from-[#050505]/70 via-[#050505]/45 to-[#050505]/85 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Editorial Column (right side remains open so the 3D Click Arrow Sculpture commands space) */}
          <div className="lg:col-span-7">
            <p className="font-mono-tabular text-xs font-medium tracking-[0.22em] text-white/75 uppercase">
              02. About Click Arrow
            </p>

            <h2
              className="mt-4 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ textWrap: 'balance' }}
            >
              WE DON&apos;T JUST CREATE.{' '}
              <span className="text-[#E80012] drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
                WE MOVE BRANDS.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-xl">
              Click Arrow brings strategy, creativity and digital execution
              together to build stronger brands and meaningful digital
              experiences.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/20 pt-8 sm:grid-cols-3">
              {ABOUT_PILLARS.map((pillar) => (
                <div key={pillar.index} className="space-y-2">
                  <span className="block font-mono-tabular text-xs font-semibold text-[#E80012]">
                    {pillar.index}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/75">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={onExploreServices}
                className="inline-flex items-center gap-3 border border-white bg-[#050505]/90 px-6 py-3.5 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-[#E80012] hover:border-[#E80012] cursor-pointer"
              >
                <span>Explore The 6 Channels</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>

          {/* Right Column: Spatial Frame Annotation around the 3D Click Arrow Sculpture */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center min-h-[260px] sm:min-h-[340px]">
            <div className="w-full max-w-sm border border-white/20 bg-[#050505]/75 p-6">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <span className="font-mono-tabular text-xs tracking-widest text-white/70 uppercase">
                  Directional Emblem
                </span>
                <span className="font-mono-tabular text-xs font-bold text-[#E80012]">
                  3D VECTOR
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                Every engagement starts with directional intent. Our signature
                arrow embodies forward momentum—aligning research, creative
                production, and digital performance on a single trajectory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
