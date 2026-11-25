import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useEffect } from 'react';
import { SERVICES_CHANNELS } from '../data/clickArrowData';
import { CrtCanvasScreen } from './CrtCanvasScreen';

interface TvShowcaseModalProps {
  channelIndex: number | null;
  onClose: () => void;
  onChangeChannel: (nextIndex: number) => void;
  onStartProject: (serviceTitle: string) => void;
}

export function TvShowcaseModal({
  channelIndex,
  onClose,
  onChangeChannel,
  onStartProject,
}: TvShowcaseModalProps) {
  const isOpen = channelIndex !== null;
  const service =
    channelIndex !== null ? SERVICES_CHANNELS[channelIndex] : null;

  useEffect(() => {
    if (!isOpen || channelIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        onChangeChannel((channelIndex + 1) % SERVICES_CHANNELS.length);
      }
      if (e.key === 'ArrowLeft') {
        onChangeChannel(
          (channelIndex - 1 + SERVICES_CHANNELS.length) %
            SERVICES_CHANNELS.length,
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, channelIndex, onClose, onChangeChannel]);

  if (!isOpen || !service || channelIndex === null) return null;

  const prevIdx =
    (channelIndex - 1 + SERVICES_CHANNELS.length) % SERVICES_CHANNELS.length;
  const nextIdx = (channelIndex + 1) % SERVICES_CHANNELS.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${service.channelNumber} ${service.title}`}
      data-no-3d="true"
      className="ca-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="ca-modal-panel relative w-full max-w-5xl border border-white/20 bg-[#080808] p-5 sm:p-8 lg:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Row */}
        <div className="mb-6 flex items-center justify-between border-b border-white/15 pb-4">
          <div className="flex items-center gap-3 text-xs font-mono-tabular tracking-widest text-white/75 uppercase">
            <span className="font-bold text-[#E80012]">{service.channelNumber}</span>
            <span aria-hidden="true">/</span>
            <span>Interactive Channel Showcase</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close channel showcase"
            className="flex h-10 w-10 items-center justify-center border border-white/25 text-white transition-colors hover:border-[#E80012] hover:bg-[#E80012] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CRT Chassis Showcase Grid */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left: Physical 3D-Styled CRT Television Housing */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#111111] border border-white/15 p-4 sm:p-6">
            <div className="relative border-[8px] border-[#050505] bg-[#050505] shadow-[0_0_50px_rgba(232,0,18,0.22)]">
              <CrtCanvasScreen
                program={service.programType}
                backdropImage={service.backdropImage}
                active={true}
                className="aspect-[4/3] w-full"
              />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <div className="flex items-center gap-3">
                <span className="inline-block h-2.5 w-6 bg-[#E80012]" />
                <span className="font-mono-tabular text-xs text-white/70 uppercase">
                  Broadcast Active · {service.channelNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChangeChannel(prevIdx)}
                  aria-label="Previous TV channel"
                  className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:bg-white hover:text-black cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeChannel(nextIdx)}
                  aria-label="Next TV channel"
                  className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:bg-white hover:text-black cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Service Brief & Deliverables */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="font-mono-tabular text-xs font-semibold tracking-widest text-[#E80012] uppercase">
                {service.channelNumber}
              </p>
              <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {service.title}
              </h3>
              <p className="mt-3 text-base font-medium text-white">
                {service.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                {service.description}
              </p>

              <div className="mt-6 border-t border-white/15 pt-5">
                <p className="font-mono-tabular text-xs tracking-widest text-white/60 uppercase">
                  Core Capabilities
                </p>
                <ul className="mt-3 space-y-2.5">
                  {service.deliverables.map((item, idx) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3 text-sm text-white/90"
                    >
                      <span className="font-mono-tabular text-xs font-bold text-[#E80012]">
                        0{idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-white/15">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartProject(service.title);
                }}
                className="flex-1 bg-[#E80012] px-6 py-3.5 text-center text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black cursor-pointer"
              >
                Discuss {service.title}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
