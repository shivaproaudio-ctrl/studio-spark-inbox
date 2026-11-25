import { useEffect, useRef } from 'react';
import { ScreenProgramType, renderScreenProgram } from '../three/screenPrograms';

interface CrtCanvasScreenProps {
  program: ScreenProgramType;
  backdropImage?: string;
  active?: boolean;
  className?: string;
}

/**
 * GPU-lightweight animated 2D Canvas CRT display component.
 * Automatically pauses rendering when scrolled off-screen via IntersectionObserver
 * or when prefers-reduced-motion is enabled.
 */
export function CrtCanvasScreen({
  program,
  backdropImage,
  active = true,
  className = '',
}: CrtCanvasScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleRef = useRef(true);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!backdropImage) {
      imgRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = backdropImage;
    imgRef.current = img;
  }, [backdropImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const observer = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);

    let rafId = 0;
    let lastDraw = 0;
    const start = performance.now();

    // Immediate first frame
    renderScreenProgram(
      ctx,
      canvas.width,
      canvas.height,
      program,
      0.5,
      imgRef.current,
    );

    if (prefersReducedMotion || !active) {
      return () => observer.disconnect();
    }

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      if (!visibleRef.current || document.hidden) return;
      if (now - lastDraw < 48) return; // ~20fps vintage CRT refresh cadence
      lastDraw = now;
      const elapsed = (now - start) * 0.001;
      renderScreenProgram(
        ctx,
        canvas.width,
        canvas.height,
        program,
        elapsed,
        imgRef.current,
      );
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [program, active]);

  return (
    <div className={`relative overflow-hidden bg-[#050505] ${className}`}>
      <canvas
        ref={canvasRef}
        width={640}
        height={420}
        className="h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="crt-scanlines crt-vignette pointer-events-none absolute inset-0"
      />
    </div>
  );
}
