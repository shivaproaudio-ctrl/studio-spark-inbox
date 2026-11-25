import { useEffect, useRef, useState } from 'react';

interface CustomCursorProps {
  cursorLabel: string | null;
}

export function CustomCursor({ cursorLabel }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!finePointer || reducedMotion) return;

    setEnabled(true);

    let x = -100;
    let y = -100;
    let cx = -100;
    let cy = -100;
    let rafId = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      cx += (x - cx) * 0.24;
      cy += (y - cy) * 0.24;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (!enabled || !visible) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 -translate-x-1/2 -translate-y-1/2"
    >
      {cursorLabel ? (
        <div className="flex items-center gap-2 border border-white bg-[#E80012] px-3 py-1.5 text-[11px] font-bold tracking-widest text-white uppercase shadow-lg">
          <span>{cursorLabel}</span>
        </div>
      ) : (
        <div className="h-4 w-4 rounded-full border border-white bg-[#E80012]/80 mix-blend-difference" />
      )}
    </div>
  );
}
