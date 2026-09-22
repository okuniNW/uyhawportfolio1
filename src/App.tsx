/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  DEFAULT_CHARACTER_IMAGE,
  DEFAULT_BG_IMAGE,
  CUSTOM_CHARACTER_IMAGE,
} from './config/character';
import CustomCharacterModal from './components/CustomCharacterModal';

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [readyToAnimate, setReadyToAnimate] = useState(false);
  const [preloaderExited, setPreloaderExited] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Character image: takes from config file first, then localStorage, then default
  const [characterImage, setCharacterImage] = useState<string>(() => {
    if (CUSTOM_CHARACTER_IMAGE) {
      return CUSTOM_CHARACTER_IMAGE;
    }
    const saved = localStorage.getItem('custom_character_image');
    return saved || DEFAULT_CHARACTER_IMAGE;
  });

  const handleSaveCustomImage = (newUrl: string) => {
    setCharacterImage(newUrl);
    localStorage.setItem('custom_character_image', newUrl);
  };

  const handleResetCustomImage = () => {
    localStorage.removeItem('custom_character_image');
    setCharacterImage(CUSTOM_CHARACTER_IMAGE || DEFAULT_CHARACTER_IMAGE);
  };

  // Asset preloading: images + fonts
  useEffect(() => {
    let isMounted = true;
    let imagesLoaded = 0;
    const totalAssets = 2;

    const updateAssetProgress = () => {
      imagesLoaded++;
      if (isMounted) {
        const nextProgress = Math.min(100, Math.round((imagesLoaded / totalAssets) * 90));
        setLoadProgress((prev) => Math.max(prev, nextProgress));
      }
      if (imagesLoaded >= totalAssets) {
        // Complete the progress to 100%
        if (isMounted) {
          setLoadProgress(100);
          setTimeout(() => {
            if (isMounted) {
              setIsLoaded(true);
              setReadyToAnimate(true);
            }
          }, 250);
          setTimeout(() => {
            if (isMounted) {
              setPreloaderExited(true);
            }
          }, 950);
        }
      }
    };

    // Smooth progress increment while fetching
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev < 70) return prev + 3;
        if (prev < 88) return prev + 1;
        return prev;
      });
    }, 40);

    const preload = (url: string) => {
      const img = new Image();
      img.src = url;
      if (img.complete) {
        updateAssetProgress();
      } else {
        img.onload = updateAssetProgress;
        img.onerror = updateAssetProgress; // fallback so it never hangs
      }
    };

    preload(DEFAULT_BG_IMAGE);
    preload(characterImage);

    // Wait for fonts if API available
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.catch(() => {});
    }

    // Safety fallback timeout (max 3.5s)
    const fallbackTimer = setTimeout(() => {
      if (isMounted && !isLoaded) {
        setLoadProgress(100);
        setIsLoaded(true);
        setReadyToAnimate(true);
        setTimeout(() => {
          if (isMounted) setPreloaderExited(true);
        }, 700);
      }
    }, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const navLinks = ['Story', 'Jobs', 'Message'];
  const socialLinks = ['Instagram', 'TikTok', 'YouTube'];

  return (
    <main
      id="hero-section"
      className="relative h-[100dvh] w-full overflow-hidden bg-black font-hn text-cream select-none"
    >
      {/* Editorial Preloader */}
      {!preloaderExited && (
        <div
          id="preloader-overlay"
          aria-hidden={isLoaded}
          className={`fixed inset-0 z-[100] flex flex-col justify-between bg-black px-6 py-6 sm:px-10 sm:py-8 font-hn text-cream transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Preloader Top */}
          <div className="flex items-start justify-between">
            <span className="text-lg tracking-wide">Marcus</span>
            <span className="text-sm opacity-60">2025</span>
          </div>

          {/* Preloader Center Display */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="overflow-hidden">
              <span className="block font-hn text-6xl sm:text-8xl md:text-9xl font-light tracking-tighter tabular-nums leading-none">
                {String(loadProgress).padStart(3, '0')}
              </span>
            </div>
            <div className="mt-6 h-[1px] w-24 sm:w-32 bg-cream/20 overflow-hidden">
              <div
                className="h-full bg-cream transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>

          {/* Preloader Bottom */}
          <div className="flex items-end justify-between text-xs sm:text-sm opacity-60">
            <span>Visuals Composer</span>
            <span>Bennet</span>
          </div>
        </div>
      )}

      {/* 1. Background image (full-bleed, behind everything, Layer: default/z-0) */}
      <img
        id="bg-image"
        src={DEFAULT_BG_IMAGE}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover ${
          readyToAnimate ? 'anim-fade-in' : 'opacity-0'
        }`}
      />

      {/* 2. Marquee name (Layer: z-10, scrolls continuously behind front portrait) */}
      <div
        id="marquee-container"
        className={`absolute inset-x-0 top-[16vh] sm:top-[14vh] z-10 overflow-hidden ${
          readyToAnimate ? 'anim-fade-up' : 'opacity-0'
        }`}
        style={{ animationDelay: '500ms' }}
      >
        <div
          id="marquee-track"
          className="marquee flex w-max whitespace-nowrap font-hn text-[16vh] sm:text-[26vh] font-normal leading-none tracking-tight text-cream"
        >
          <span className="pr-[6vw]">
            Marcus &mdash; Bennet{'\u00A0'}
          </span>
          <span className="pr-[6vw]">
            Marcus &mdash; Bennet{'\u00A0'}
          </span>
        </div>
      </div>

      {/* 3. Horizontal cream rule (Layer: z-10, grows from left) */}
      <div
        id="cream-divider-rule"
        className={`absolute inset-x-6 sm:inset-x-10 bottom-[5.5rem] sm:bottom-28 z-10 h-0.5 bg-cream ${
          readyToAnimate ? 'anim-line' : 'scale-x-0'
        }`}
      />

      {/* 4. Front portrait (cutout overlay, above marquee, pointer-events none, Layer: z-20) */}
      <img
        id="front-portrait"
        src={characterImage}
        alt="Portrait"
        className={`absolute inset-0 z-20 h-full w-full object-cover pointer-events-none ${
          readyToAnimate ? 'anim-rise-in' : 'opacity-0'
        }`}
      />

      {/* Grain / noise texture overlay to enhance the editorial/printed aesthetic */}
      <div
        id="grain-texture-overlay"
        aria-hidden="true"
        className="grain-overlay pointer-events-none fixed inset-0 z-25 opacity-[0.045] mix-blend-screen"
      />

      {/* 5. Header (Layer: z-30) */}
      <header
        id="site-header"
        className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8"
      >
        {/* Brand / logo link */}
        <a
          id="brand-link"
          href="#"
          className={`font-hn text-lg tracking-wide text-cream transition-opacity duration-300 hover:opacity-80 ${
            readyToAnimate ? 'anim-fade-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '800ms' }}
        >
          Marcus
        </a>

        {/* Desktop right cluster (hidden on mobile) */}
        <div
          id="desktop-nav-group"
          className="hidden sm:flex items-start gap-16 lg:gap-24"
        >
          {/* Year */}
          <span
            id="desktop-year"
            className={`font-hn text-sm text-cream ${
              readyToAnimate ? 'anim-fade-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '900ms' }}
          >
            2025
          </span>

          {/* Nav column */}
          <nav
            id="desktop-nav-links"
            className="flex flex-col gap-0.5 text-sm font-hn"
          >
            {navLinks.map((label, index) => (
              <a
                key={label}
                id={`desktop-nav-${label.toLowerCase()}`}
                href="#"
                className={`text-cream transition-opacity duration-300 hover:opacity-60 ${
                  readyToAnimate ? 'anim-fade-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${1000 + index * 80}ms` }}
              >
                {label}
              </a>
            ))}
            <button
              id="desktop-nav-custom-character"
              type="button"
              onClick={() => setCustomModalOpen(true)}
              className={`text-left text-cream transition-opacity duration-300 hover:opacity-60 cursor-pointer ${
                readyToAnimate ? 'anim-fade-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${1000 + navLinks.length * 80}ms` }}
            >
              Costum Karakter
            </button>
          </nav>

          {/* Social column */}
          <div
            id="desktop-social-links"
            className="flex flex-col gap-0.5 text-sm font-hn"
          >
            {socialLinks.map((label, index) => (
              <a
                key={label}
                id={`desktop-social-${label.toLowerCase()}`}
                href="#"
                className={`text-cream transition-opacity duration-300 hover:opacity-60 ${
                  readyToAnimate ? 'anim-fade-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${1150 + index * 80}ms` }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile-only hamburger trigger button (Layer: z-50) */}
        <button
          id="mobile-menu-trigger"
          type="button"
          aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`sm:hidden relative z-50 flex h-10 w-10 items-center justify-center -mr-2 ${
            readyToAnimate ? 'anim-fade-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '900ms' }}
        >
          <div className="flex h-4 w-6 flex-col justify-between">
            <span
              className={`h-[1.5px] w-6 bg-cream transition-transform duration-500 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)] ${
                drawerOpen ? 'translate-y-[7.25px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-[1.5px] w-6 bg-cream transition-opacity duration-300 ${
                drawerOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`h-[1.5px] w-6 bg-cream transition-transform duration-500 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)] ${
                drawerOpen ? '-translate-y-[7.25px] -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </header>

      {/* 6. Footer (Layer: z-30 on mobile, sm:z-10 on desktop) */}
      <footer
        id="site-footer"
        className="absolute inset-x-0 bottom-0 z-30 sm:z-10 flex items-end justify-between px-6 pb-5 sm:px-10 sm:pb-8 text-xs sm:text-sm leading-relaxed font-hn text-cream"
      >
        <div
          id="footer-left-info"
          className={`flex flex-col ${
            readyToAnimate ? 'anim-fade-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '1400ms' }}
        >
          <span>Visuals Composer</span>
          <span>Digital Crafter</span>
          <span>Obsessed by The Office</span>
        </div>

        {/* Center Custom Character Quick Action on Desktop */}
        <button
          id="footer-custom-character-trigger"
          type="button"
          onClick={() => setCustomModalOpen(true)}
          className={`hidden sm:flex items-center gap-2 border border-cream/20 px-3.5 py-1.5 text-xs text-cream hover:border-cream/70 hover:bg-cream/10 transition-colors cursor-pointer ${
            readyToAnimate ? 'anim-fade-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '1480ms' }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cream" />
          Costum Gambar Karakter
        </button>

        <div
          id="footer-right-homage"
          className={`flex flex-col text-right ${
            readyToAnimate ? 'anim-fade-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '1550ms' }}
        >
          <span>A homage to</span>
          <span>Marcus Holloway</span>
        </div>
      </footer>

      {/* 7. Mobile Drawer (Layer: z-40, sm:hidden) */}
      <div
        id="mobile-drawer-root"
        className="sm:hidden"
      >
        {/* Backdrop */}
        <div
          id="mobile-drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
            drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Panel */}
        <aside
          id="mobile-drawer-panel"
          className={`fixed top-0 bottom-0 right-0 z-40 w-[80%] max-w-sm bg-[#141414] px-8 py-10 transition-transform duration-600 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)] ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Close button inside panel */}
          <button
            id="mobile-drawer-close-btn"
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className={`absolute right-6 top-6 z-50 text-cream transition-all duration-300 ${
              drawerOpen ? 'rotate-0 opacity-100 delay-300' : 'rotate-90 opacity-0 pointer-events-none'
            }`}
          >
            <X size={26} strokeWidth={1.5} />
          </button>

          <div className="flex h-full flex-col justify-between pt-8">
            {/* Site Index Section */}
            <div>
              <p
                id="mobile-site-index-label"
                className={`text-xs uppercase tracking-[0.2em] text-cream/50 transition-all duration-500 ${
                  drawerOpen
                    ? 'translate-y-0 opacity-100 delay-[250ms]'
                    : 'translate-y-4 opacity-0'
                }`}
              >
                Site Index
              </p>
              <nav
                id="mobile-nav-links"
                className="mt-6 flex flex-col gap-4 font-hn"
              >
                {navLinks.map((label, index) => (
                  <a
                    key={label}
                    id={`mobile-nav-${label.toLowerCase()}`}
                    href="#"
                    onClick={() => setDrawerOpen(false)}
                    className={`text-4xl text-cream font-normal transition-all duration-500 hover:opacity-60 ${
                      drawerOpen
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-6 opacity-0'
                    }`}
                    style={{
                      transitionDelay: drawerOpen ? `${300 + index * 80}ms` : '0ms',
                    }}
                  >
                    {label}
                  </a>
                ))}
                <button
                  id="mobile-nav-custom-character"
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    setCustomModalOpen(true);
                  }}
                  className={`text-left text-3xl text-cream font-normal transition-all duration-500 hover:opacity-60 cursor-pointer pt-2 ${
                    drawerOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-6 opacity-0'
                  }`}
                  style={{
                    transitionDelay: drawerOpen ? `${300 + navLinks.length * 80}ms` : '0ms',
                  }}
                >
                  Costum Karakter
                </button>
              </nav>
            </div>

            {/* Find Me Section */}
            <div>
              <p
                id="mobile-find-me-label"
                className={`text-xs uppercase tracking-[0.2em] text-cream/50 transition-all duration-500 ${
                  drawerOpen
                    ? 'translate-y-0 opacity-100 delay-[500ms]'
                    : 'translate-y-4 opacity-0'
                }`}
              >
                Find Me
              </p>
              <div
                id="mobile-social-links"
                className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-hn"
              >
                {socialLinks.map((label, index) => (
                  <a
                    key={label}
                    id={`mobile-social-${label.toLowerCase()}`}
                    href="#"
                    onClick={() => setDrawerOpen(false)}
                    className={`text-cream transition-all duration-500 hover:opacity-60 ${
                      drawerOpen
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: drawerOpen ? `${550 + index * 60}ms` : '0ms',
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Custom Character Modal */}
      <CustomCharacterModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        currentImage={characterImage}
        onSaveImage={handleSaveCustomImage}
        onResetImage={handleResetCustomImage}
      />
    </main>
  );
}

