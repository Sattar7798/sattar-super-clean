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
  height = 'md:h-80'
}) => {
  return (
    <header 
      className={`relative mb-12 flex w-full items-center justify-center overflow-hidden border-b border-white/5 bg-[#0b1120] ${height} ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.2),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.15),transparent_30%),linear-gradient(180deg,#0d0618_0%,#0b1120_100%)]" />
      {imageUrl && (
        <div className="absolute inset-0 h-full w-full opacity-30">
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover" 
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/30 via-[#0d0618]/65 to-[#0b1120]" />
          )}
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[15%] top-[18%] h-40 w-40 rounded-full bg-violet-600/15 blur-[90px]" />
        <div className="absolute bottom-[18%] right-[12%] h-36 w-36 rounded-full bg-cyan-500/10 blur-[80px]" />
      </div>

      <div className="relative z-10 px-4 py-16 text-center sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="mb-5 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300"
        >
          Sattar Hedayat
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-3xl text-lg leading-8 text-gray-300 md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </header>
  );
};

export default PageHeader; 
