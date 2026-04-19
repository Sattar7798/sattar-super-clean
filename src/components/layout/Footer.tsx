import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#080d18] text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/4 h-56 w-56 rounded-full bg-violet-700/10 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-cyan-500/10 blur-[90px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
              Portfolio
            </div>
            <h3 className="mb-4 text-2xl font-bold tracking-tight">Sattar Hedayat</h3>
            <p className="max-w-sm text-sm leading-7 text-gray-400">
              BIM Coordinator, BIM Automation Engineer, Structural Engineer, and research assistant
              focused on seismic resilience, BIM workflows, and AI-powered engineering tools.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-gray-300">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/research" className="text-gray-400 transition-colors duration-300 hover:text-white">
                  Research
                </Link>
              </li>
              <li>
                <Link href="/publications" className="text-gray-400 transition-colors duration-300 hover:text-white">
                  Publications
                </Link>
              </li>
              <li>
                <Link href="/interactive-model" className="text-gray-400 transition-colors duration-300 hover:text-white">
                  Interactive Lab
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 transition-colors duration-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 transition-colors duration-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-gray-300">Contact</h3>
            <address className="not-italic space-y-2 text-sm text-gray-400">
              <p>Rieti / Rome, Italy</p>
              <p>Sapienza University of Rome</p>
              <p>
                <a href="mailto:sattarhedayat2020@gmail.com" className="transition-colors duration-300 hover:text-white">
                  sattarhedayat2020@gmail.com
                </a>
              </p>
            </address>
            
            <div className="mt-5 flex space-x-4">
              <a href="https://www.linkedin.com/in/sattar-hedayat/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://github.com/sattarhedayat" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {currentYear} Sattar Hedayat. All rights reserved.</p>
          <p>BIM Coordination, Structural Engineering, and AI-driven building systems.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
