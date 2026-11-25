// @ts-nocheck -- imported code written for looser compiler settings
import { Check, Copy, Mail, MessageCircle, Phone } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { CONTACT_DETAILS, SERVICES_CHANNELS } from '../data/clickArrowData';

interface ContactSectionProps {
  preselectedInterest?: string;
}

export function ContactSection({ preselectedInterest }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [interest, setInterest] = useState(
    preselectedInterest || SERVICES_CHANNELS[0].title,
  );
  const [brief, setBrief] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedInterest) {
      setInterest(preselectedInterest);
      setSubmitted(false);
    }
  }, [preselectedInterest]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      setErrorMsg('Please enter your name so we know who to address.');
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid work or personal email address.');
      return;
    }
    if (brief.trim().length < 10) {
      setErrorMsg('Please share a brief note (at least 10 characters) about your goals.');
      return;
    }

    setSubmitted(true);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_DETAILS.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_DETAILS.phone);
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 2400);
    } catch {
      setCopiedPhone(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative z-10 border-t border-white/15 bg-gradient-to-b from-[#050505]/85 via-[#050505]/65 to-[#050505]/95 pt-24 pb-16 sm:pt-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* Left Closing Brand Statement & Direct Channels */}
          <div className="lg:col-span-6">
            <p className="font-mono-tabular text-xs font-medium tracking-[0.22em] text-[#E80012] uppercase">
              09. Start The Conversation
            </p>
            <h2
              className="mt-4 font-display text-4xl font-extrabold leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ textWrap: 'balance' }}
            >
              YOUR BRAND HAS A STORY.{' '}
              <span className="text-[#E80012]">
                LET&apos;S MAKE PEOPLE REMEMBER IT.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Ready to build an unmistakable brand identity, flagship web
              experience, or creative growth campaign? Tell us where you want
              your brand to move next.
            </p>

            {/* Direct Contact Action Cards */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="border border-white/20 bg-[#080808]/90 p-5 sm:col-span-2">
                <span className="font-mono-tabular text-xs text-[#E80012] uppercase">
                  Direct Email
                </span>
                <a
                  href={`mailto:${CONTACT_DETAILS.email}`}
                  className="mt-2 flex items-center gap-2 font-display text-lg font-bold text-white hover:text-[#E80012] transition-colors"
                >
                  <Mail className="h-4 w-4 text-[#E80012] shrink-0" />
                  <span>{CONTACT_DETAILS.email}</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#E80012]" />
                      <span>Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy address</span>
                    </>
                  )}
                </button>
              </div>

              <div className="border border-white/20 bg-[#080808]/90 p-5">
                <span className="font-mono-tabular text-xs text-[#E80012] uppercase">
                  Studio Desk
                </span>
                <a
                  href={`tel:${CONTACT_DETAILS.phone.replace(/[^+\d]/g, '')}`}
                  className="mt-2 flex items-center gap-2 font-display text-lg font-bold text-white hover:text-[#E80012] transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#E80012] shrink-0" />
                  <span>{CONTACT_DETAILS.phone}</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white cursor-pointer"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#E80012]" />
                      <span>Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy number</span>
                    </>
                  )}
                </button>
              </div>

              <div className="border border-white/20 bg-[#080808]/90 p-5">
                <span className="font-mono-tabular text-xs text-[#E80012] uppercase">
                  WhatsApp
                </span>
                <a
                  href={`https://wa.me/${CONTACT_DETAILS.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-2 font-display text-lg font-bold text-white hover:text-[#E80012] transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-[#E80012] shrink-0" />
                  <span>{CONTACT_DETAILS.phone}</span>
                </a>
                <p className="mt-3 text-xs text-white/65">
                  Chat with the studio directly
                </p>
              </div>
            </div>

            {/* Social Channels */}
            <div className="mt-6 inline-flex flex-wrap items-center gap-2.5 border border-white/15 bg-[#080808]/90 px-3.5 py-2.5">
              <span className="font-mono-tabular text-[10px] text-white/60 uppercase tracking-widest">
                Channels
              </span>
              {CONTACT_DETAILS.socials.map((soc) => (
                <button
                  key={soc.label}
                  type="button"
                  onClick={() =>
                    setSocialNotice(
                      `${soc.label} (${soc.handle}) — inquire via ${CONTACT_DETAILS.email} or the brief form.`,
                    )
                  }
                  className="border border-white/20 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:border-[#E80012] hover:bg-[#E80012] cursor-pointer"
                >
                  {soc.label}
                </button>
              ))}
              {socialNotice && (
                <p className="w-full text-[11px] text-white/80">{socialNotice}</p>
              )}
            </div>
          </div>

          {/* Right Interactive Project Brief Form */}
          <div className="lg:col-span-6 border border-white/20 bg-[#080808]/95 p-6 sm:p-10">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <h3 className="font-display text-2xl font-extrabold text-white">
                LET&apos;S TALK.
              </h3>
              <span className="font-mono-tabular text-xs text-[#E80012] uppercase">
                New Project Brief
              </span>
            </div>

            {submitted ? (
              <div className="py-10 space-y-5">
                <div className="inline-flex h-12 w-12 items-center justify-center bg-[#E80012] text-white">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-display text-3xl font-extrabold text-white">
                  Brief Received, {name}.
                </h4>
                <p className="text-sm leading-relaxed text-white/80">
                  Your inquiry regarding{' '}
                  <strong className="text-white">{interest}</strong> has been
                  prepared for our strategy &amp; creative leads. You can also
                  launch your email client directly with the pre-filled brief
                  below.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={`mailto:${CONTACT_DETAILS.email}?subject=${encodeURIComponent(
                      `Click Arrow Inquiry: ${interest} — ${company || name}`,
                    )}&body=${encodeURIComponent(
                      `Name: ${name}\nCompany: ${company}\nInterest: ${interest}\n\nBrief:\n${brief}`,
                    )}`}
                    className="bg-[#E80012] px-6 py-3.5 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black"
                  >
                    Send Via Email App
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setBrief('');
                    }}
                    className="border border-white/25 px-5 py-3.5 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:border-white cursor-pointer"
                  >
                    Edit Brief
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                {errorMsg && (
                  <div
                    role="alert"
                    className="border border-[#E80012] bg-[#E80012]/15 px-4 py-3 text-xs font-medium text-white"
                  >
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block font-mono-tabular text-xs text-white/75 uppercase"
                    >
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="mt-2 w-full border border-white/20 bg-[#050505] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#E80012] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block font-mono-tabular text-xs text-white/75 uppercase"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="mt-2 w-full border border-white/20 bg-[#050505] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#E80012] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-company"
                      className="block font-mono-tabular text-xs text-white/75 uppercase"
                    >
                      Brand / Company
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company Ltd"
                      className="mt-2 w-full border border-white/20 bg-[#050505] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#E80012] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-interest"
                      className="block font-mono-tabular text-xs text-white/75 uppercase"
                    >
                      Primary Focus
                    </label>
                    <select
                      id="contact-interest"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="mt-2 w-full border border-white/20 bg-[#050505] px-4 py-3 text-sm text-white focus:border-[#E80012] focus:outline-none"
                    >
                      {SERVICES_CHANNELS.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.channelNumber} — {s.title}
                        </option>
                      ))}
                      <option value="Full Brand & Digital Partnership">
                        Full Brand &amp; Digital Partnership
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-brief"
                    className="block font-mono-tabular text-xs text-white/75 uppercase"
                  >
                    Project Brief *
                  </label>
                  <textarea
                    id="contact-brief"
                    rows={4}
                    required
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="Share what you are launching, your timeline, and what needs to change..."
                    className="mt-2 w-full border border-white/20 bg-[#050505] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#E80012] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E80012] px-6 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors duration-150 hover:bg-white hover:text-[#050505] cursor-pointer"
                >
                  LET&apos;S TALK.
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Clean Minimal Agency Footer */}
        <footer className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-8 text-xs text-white/60 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-white">
              CLICK ARROW
            </span>
            <span aria-hidden="true">·</span>
            <span>Creative Digital Marketing Agency</span>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} Click Arrow. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
