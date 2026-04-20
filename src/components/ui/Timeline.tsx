import React from 'react';
import { motion } from 'framer-motion';

interface TimelineItem {
  time: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-[88px] md:left-[120px] top-0 bottom-0 w-px bg-gradient-to-b from-[#99AD7A]/50 via-[#99AD7A]/20 to-transparent z-0" />

      <div className="relative z-10 space-y-5">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
            viewport={{ once: true, margin: '-40px' }}
            className="flex items-start gap-6 md:gap-8"
          >
            {/* Left: year + dot */}
            <div className="flex flex-col items-end flex-shrink-0 w-20 md:w-28 pt-1">
              <span className="text-xs font-bold text-[#99AD7A] tracking-wider text-right leading-tight">
                {item.time}
              </span>
              <div className="relative mt-2 w-3 h-3 ml-auto mr-[-6.5px] md:mr-[-8.5px]">
                <div className="w-3 h-3 rounded-full bg-[#99AD7A] ring-2 ring-[#99AD7A]/35 ring-offset-2 ring-offset-[#FFF8EC]" />
              </div>
            </div>

            {/* Right: card */}
            <div className="flex-1 min-w-0 rounded-2xl border border-[#DCCCAC]/70 bg-[#FFF8EC] p-5 hover:border-[#99AD7A]/50 hover:shadow-nature transition-all duration-300">
              <h3 className="text-sm font-bold text-[#2d3d24] mb-0.5 leading-snug">
                {item.title}
              </h3>
              {item.subtitle && (
                <div className="text-xs text-[#99AD7A] mb-2 font-semibold">
                  {item.subtitle}
                </div>
              )}
              <div className="text-[#546B41]/65 text-sm leading-relaxed">
                {item.content}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
