import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logoAsset from '../../assets/click-arrow-logo.png.asset.json';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { label: 'Home', id: 'hero' },
  { label: 'Services', id: 'services' },
  { label: 'Strategy', id: 'strategy' },
  { label: 'Process', id: 'process' },
  { label: 'Contact', id: 'contact' },
];

export function Navbar({ onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/15 bg-[#050505]/85">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-8 px-5 sm:px-8 lg:px-12">
        {/* Zone 1: Single-element Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-2.5 text-left font-display text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer"
        >
          <img
            src={logoAsset.url}
            alt="Click Arrow — Creative Studio"
            className="h-9 w-auto shrink-0 object-contain"
          />
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-white/80"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleLinkClick(item.id)}
              className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#E80012] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('contact')}
            className="hidden sm:inline-flex items-center justify-center bg-[#E80012] px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-white hover:text-[#050505] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
          >
            Let&apos;s Talk
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center border border-white/20 text-white md:hidden focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-white/15 bg-[#050505] px-5 py-6 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                className="flex min-h-[44px] items-center justify-between border-b border-white/10 py-2 text-left font-display text-xl font-bold text-white transition-colors hover:text-[#E80012]"
              >
                <span>{item.label}</span>
                <span className="text-sm text-[#E80012]">&rarr;</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleLinkClick('contact')}
              className="mt-4 flex min-h-[44px] w-full items-center justify-center bg-[#E80012] px-5 py-3 text-sm font-bold tracking-wider text-white uppercase"
            >
              Let&apos;s Talk
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
