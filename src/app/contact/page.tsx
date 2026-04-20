'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/LayoutFix';
import DotField from '@/components/animations/DotField';
import { EmailIcon, PhoneIcon, LocationIcon, ExternalLinkIcon } from '@/components/ui/Icons';

interface FormData {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

function CountUp({ to, suffix = '', duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [value, setValue] = React.useState(0);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStarted(true);
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  React.useEffect(() => {
    if (!started) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, started, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const fadeUpView = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const inputClass =
  'w-full px-4 py-3 bg-[#FFF8EC] border border-[#DCCCAC]/70 rounded-xl text-[#2d3d24] placeholder-[#546B41]/35 text-sm outline-none transition-all duration-200 focus:border-[#99AD7A] focus:ring-2 focus:ring-[#99AD7A]/20';

const labelClass = 'block text-[#546B41] font-semibold mb-2 text-xs uppercase tracking-wide';

const collaborationCards = [
  {
    title: 'BIM Coordination',
    description: 'Infrastructure, public-sector, and multidisciplinary BIM coordination support.',
    category: 'bim',
  },
  {
    title: 'Automation & Tools',
    description: 'pyRevit, Dynamo, CME workflows, reporting, and BIM process acceleration.',
    category: 'automation',
  },
  {
    title: 'Research & Academic',
    description: 'Publications, technical writing, seismic research, and engineering collaboration.',
    category: 'research',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = `[${formData.category}] ${formData.subject}`.trim();
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Category: ${formData.category}`,
      '',
      formData.message,
    ].join('\n');

    window.location.href = `mailto:sattarhedayat2020@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Layout>
      <section className="relative min-h-[82vh] flex items-center bg-[#1e2d14] overflow-hidden">
        <div className="absolute inset-0">
          <DotField
            gradientFrom="rgba(84,107,65,0.48)"
            gradientTo="rgba(153,173,122,0.26)"
            glowColor="#1e2d14"
            dotSpacing={20}
            dotRadius={1.15}
            bulgeStrength={60}
            waveAmplitude={0}
          />
        </div>

        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="contact-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#FFF8EC" strokeWidth="0.7" />
                <path d="M 0 56 L 56 0" fill="none" stroke="#99AD7A" strokeWidth="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-grid)" />
          </svg>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[14%] left-[12%] w-[34rem] h-[34rem] rounded-full bg-[#546B41]/28 blur-[150px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[26rem] h-[26rem] rounded-full bg-[#99AD7A]/14 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 pt-28 pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.06fr_0.94fr] gap-14 items-end">
            <div>
              <motion.div {...fadeUp()} className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-[#99AD7A]/45" />
                <span className="text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase">
                  Contact
                </span>
              </motion.div>

              <motion.h1
                {...fadeUp(0.08)}
                className="font-black leading-[0.9] tracking-[-0.05em] mb-7"
              >
                <span className="block text-[clamp(3.9rem,10vw,8.2rem)] text-[#FFF8EC]">Let&apos;s</span>
                <span className="block text-[clamp(3.9rem,10vw,8.2rem)] text-gradient-nature">Connect.</span>
              </motion.h1>

              <motion.p
                {...fadeUp(0.18)}
                className="max-w-2xl text-base md:text-lg leading-relaxed text-[#DCCCAC]/68"
              >
                Open to BIM coordination, automation workflows, structural engineering discussions,
                research collaboration, and engineering-focused digital projects.
              </motion.p>

              <motion.div {...fadeUp(0.28)} className="flex flex-col sm:flex-row gap-4 mt-9">
                <a
                  href="mailto:sattarhedayat2020@gmail.com"
                  className="px-7 py-3.5 bg-[#99AD7A] text-[#1e2d14] rounded-xl font-bold text-sm shadow-[0_0_28px_rgba(153,173,122,0.35)] hover:bg-[#b8c99a] hover:-translate-y-1 transition-all duration-300"
                >
                  Email Directly
                </a>
                <Link
                  href="/works"
                  className="px-7 py-3.5 border border-[#99AD7A]/25 text-[#DCCCAC] rounded-xl font-semibold text-sm hover:border-[#99AD7A]/50 hover:bg-[#546B41]/25 hover:-translate-y-1 transition-all duration-300"
                >
                  View Projects
                </Link>
              </motion.div>
            </div>

            <motion.div {...fadeUp(0.34)} className="grid grid-cols-2 gap-4 max-w-[28rem] lg:ml-auto">
              {[
                { label: 'Cities', to: 2, suffix: '' },
                { label: 'Phone Line', to: 1, suffix: '' },
                { label: 'Direct Email', to: 1, suffix: '' },
                { label: 'Main Routes', to: 3, suffix: '' },
              ].map((item, index) => (
                <div key={item.label} className="glass-panel-dark rounded-[2rem] px-5 py-6 min-h-[150px] flex flex-col justify-between">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#DCCCAC]/42">{item.label}</div>
                  <div className="stat-callout text-[clamp(2.7rem,6vw,4.2rem)] text-[#b8c99a] leading-none">
                    <CountUp to={item.to} suffix={item.suffix} duration={1400 + index * 180} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-28 bg-[#FFF8EC] overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px divider-organic" />
        <div className="absolute -top-16 right-0 w-[46rem] h-[46rem] rounded-full bg-[#99AD7A]/08 blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.76fr_1.24fr] gap-8 items-start">
            <motion.div {...fadeUpView()} className="rounded-3xl card-warm p-8 md:p-10">
              <p className="label-dash text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-5">
                Direct Contact
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-[#1e2d14] leading-tight mb-5">
                Reach out through
                <br />
                <span className="text-gradient-forest">real channels.</span>
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-[#546B41]/62 mb-8">
                This section uses your actual contact details from the CV and removes the old
                placeholder lab and office-hour content.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: <EmailIcon className="w-5 h-5" />,
                    title: 'Email',
                    primary: 'sattarhedayat2020@gmail.com',
                    href: 'mailto:sattarhedayat2020@gmail.com',
                    secondary: 'Best for project, research, and collaboration inquiries',
                  },
                  {
                    icon: <PhoneIcon className="w-5 h-5" />,
                    title: 'Phone',
                    primary: '(+39) 388 978 4912',
                    href: 'tel:+393889784912',
                    secondary: 'Italy',
                  },
                  {
                    icon: <LocationIcon className="w-5 h-5" />,
                    title: 'Location',
                    primary: 'Rieti / Rome, Italy',
                    href: 'https://maps.google.com/?q=Rieti+Italy',
                    secondary: 'Available for local and remote collaboration',
                  },
                ].map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="flex items-start gap-4 rounded-2xl border border-[#546B41]/12 bg-[#546B41]/05 px-5 py-5 hover:border-[#99AD7A]/35 transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#546B41]/10 text-[#546B41] flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#99AD7A] font-bold mb-1">{item.title}</div>
                      <div className="text-sm md:text-base font-semibold text-[#1e2d14] break-all">{item.primary}</div>
                      <div className="text-sm text-[#546B41]/58 mt-1">{item.secondary}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#DCCCAC]/60">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#99AD7A] font-bold mb-3">Profiles</div>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://www.linkedin.com/in/sattar-hedayat/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#546B41] hover:text-[#2d3d24]"
                  >
                    LinkedIn
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/sattarhedayat"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#546B41] hover:text-[#2d3d24]"
                  >
                    GitHub
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUpView(0.08)} className="rounded-3xl card-warm p-8 md:p-10">
              <p className="label-dash text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-5">
                Send a Message
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-[#1e2d14] leading-tight mb-4">
                Use the form to
                <br />
                <span className="text-gradient-forest">draft an email.</span>
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-[#546B41]/62 mb-8">
                There is no fake submission flow here. The form opens your email client with the
                message details prefilled so the contact method stays transparent.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className={labelClass}>Name</label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className={labelClass}>Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="general">General inquiry</option>
                    <option value="bim">BIM coordination</option>
                    <option value="automation">Automation & tools</option>
                    <option value="research">Research collaboration</option>
                    <option value="structural">Structural engineering</option>
                    <option value="web">Web / visualization work</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Subject"
                  />
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={7}
                    className={`${inputClass} resize-none`}
                    placeholder="Describe the project, collaboration, or question."
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-7 py-3 bg-[#546B41] text-[#FFF8EC] rounded-xl font-semibold hover:bg-[#3d5030] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(84,107,65,0.4)] transition-all duration-300"
                  >
                    Draft Email
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-[#FFF8EC]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collaborationCards.map((card, index) => (
              <motion.button
                key={card.title}
                type="button"
                {...fadeUpView(index * 0.08)}
                onClick={() => setFormData((previous) => ({ ...previous, category: card.category }))}
                className="text-left rounded-3xl card-warm p-7 hover:shadow-nature-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#99AD7A] font-bold mb-3">Quick Route</div>
                <h3 className="text-xl font-black text-[#1e2d14] mb-3">{card.title}</h3>
                <p className="text-sm leading-relaxed text-[#546B41]/62 mb-4">{card.description}</p>
                <span className="text-sm font-semibold text-[#546B41]">Use this category</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pt-20 pb-8 md:pt-24 md:pb-10 bg-[#546B41] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="contact-cta-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#FFF8EC" strokeWidth="0.7" />
                <path d="M 0 0 L 56 56" fill="none" stroke="#FFF8EC" strokeWidth="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-cta-grid)" />
          </svg>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] rounded-full bg-[#99AD7A]/18 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[24rem] h-[24rem] rounded-full bg-[#2d3d24]/45 blur-[110px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeUpView()} className="glass-panel-dark rounded-3xl p-10 md:p-12 max-w-4xl mx-auto text-center">
            <p className="label-dash justify-center text-[#99AD7A] text-xs font-bold tracking-[0.22em] uppercase mb-6">
              Continue
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-[#FFF8EC] leading-tight mb-5">
              Want to review the profile
              <br />
              <span className="text-gradient-nature">before getting in touch?</span>
            </h2>
            <p className="max-w-2xl mx-auto text-base leading-relaxed text-[#DCCCAC]/65 mb-10">
              Go back to the about section or explore the works archive to see the context behind
              the collaboration areas listed here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/about"
                className="px-8 py-4 bg-[#FFF8EC] text-[#1e2d14] rounded-xl font-bold hover:bg-[#DCCCAC] hover:-translate-y-1 transition-all duration-300"
              >
                View About
              </Link>
              <Link
                href="/works"
                className="px-8 py-4 border border-[#99AD7A]/24 text-[#FFF8EC] rounded-xl font-semibold hover:bg-[#2d3d24]/28 hover:border-[#99AD7A]/45 hover:-translate-y-1 transition-all duration-300"
              >
                View Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
