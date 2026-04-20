import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  overlay?: boolean;
  className?: string;
  height?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  overlay = true,
  className = '',
  height = 'md:h-72',
}) => {
  return (
    <header
      className={`relative mb-12 flex w-full items-center justify-center overflow-hidden bg-[#1e2d14] ${height} ${className}`}
    >
      {/* Subtle structural grid */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ph-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFF8EC" strokeWidth="0.7"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ph-grid)" />
        </svg>
      </div>

      {/* Optional background image */}
      {imageUrl && (
        <div className="absolute inset-0 h-full w-full opacity-20">
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#1e2d14]/50 to-[#1e2d14]" />
          )}
        </div>
      )}

      {/* Ambient organic glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[12%] top-[20%] h-36 w-36 rounded-full bg-[#546B41]/30 blur-[90px]" />
        <div className="absolute bottom-[15%] right-[10%] h-32 w-32 rounded-full bg-[#99AD7A]/20 blur-[80px]" />
      </div>

      {/* Bottom fade into page bg */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#FFF8EC] to-transparent pointer-events-none" />

      <div className="relative z-10 px-4 py-14 text-center sm:px-6 sm:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-4 inline-flex rounded-full border border-[#99AD7A]/30 bg-[#99AD7A]/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#99AD7A]"
        >
          Sattar Hedayat
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-4xl font-bold tracking-tight text-[#FFF8EC] md:text-5xl"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-2xl text-base leading-7 text-[#DCCCAC]/75 md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
