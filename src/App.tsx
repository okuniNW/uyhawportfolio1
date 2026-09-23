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
import { preloadAllAssets } from './utils/assetPreloader';
import CustomCharacterModal from './components/CustomCharacterModal';
import CurtainTransition, { CurtainPhase } from './components/CurtainTransition';
import StoryView from './components/StoryView';
import JobsView from './components/JobsView';
import MessageView from './components/MessageView';
import SocialChannelView from './components/SocialChannelView';

export type PageId = 'home' | 'story' | 'jobs' | 'message' | 'instagram' | 'tiktok' | 'youtube';

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [readyToAnimate, setReadyToAnimate] = useState(false);
  const [preloaderExited, setPreloaderExited] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Page routing state & curtain transition
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [curtainPhase, setCurtainPhase] = useState<CurtainPhase>('idle');
  const [targetPageName, setTargetPageName] = useState<string>('');

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

  // Seamless curtain navigation
  const handleNavigate = (target: PageId) => {
    if (curtainPhase !== 'idle') return;
    if (target === currentPage) {
      if (drawerOpen) setDrawerOpen(false);
      return;
    }

    if (drawerOpen) {
      setDrawerOpen(false);
    }

    const titles: Record<PageId, string> = {
      home: 'Beranda',
      story: 'The Narrative',
      jobs: 'Selected Works',
      message: 'Transmission',
      instagram: 'Instagram // @marcusbennet',
      tiktok: 'TikTok // @marcusbennet',
      youtube: 'YouTube // Marcus Bennet',
    };

    setTargetPageName(titles[target]);
    setCurtainPhase('fading-in');

    // Peak curtain blackout
    setTimeout(() => {
      setCurtainPhase('opaque');
      setCurrentPage(target);
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Hold briefly at peak black, then open curtain
      setTimeout(() => {
        setCurtainPhase('fading-out');

        setTimeout(() => {
          setCurtainPhase('idle');
          setTargetPageName('');
        }, 400);
      }, 120);
    }, 350);
  };

  // Definitive asset preloader: native Promise-based image decoding + font rendering
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    // Smooth baseline counter ticker for editorial feel
    let currentProgress = 0;
    const progressTimer = setInterval(() => {
      if (!isMounted) return;
      currentProgress = Math.min(
        currentProgress + (currentProgress < 50 ? 3 : currentProgress < 85 ? 2 : 1),
        92
      );
      setLoadProgress((prev) => Math.max(prev, currentProgress));
    }, 30);

    // Definitively load and decode all images & verify web font readiness
    preloadAllAssets({
      criticalImages: [DEFAULT_BG_IMAGE, characterImage],
      images: [DEFAULT_BG_IMAGE, characterImage],
      fonts: ['1em "Helvetica Neue ME"'],
      signal: abortController.signal,
      onProgress: ({ percentage }) => {
        if (!isMounted) return;
        currentProgress = Math.max(currentProgress, Math.round(percentage * 0.94));
        setLoadProgress((prev) => Math.max(prev, currentProgress));
      },
    })
      .then(() => {
        if (!isMounted) return;
        clearInterval(progressTimer);
        setLoadProgress(100);

        // Allow user to register 100% completion briefly
        setTimeout(() => {
          if (!isMounted) return;
          setIsLoaded(true);
          setReadyToAnimate(true);
        }, 220);

        // Preloader fully unmounts/hides after fade out transition completes
        setTimeout(() => {
          if (isMounted) {
            setPreloaderExited(true);
          }
        }, 950);
      })
      .catch(() => {
        // Fallback resilience: guarantee the entrance sequence still triggers if any network fault occurs
        if (!isMounted) return;
        clearInterval(progressTimer);
        setLoadProgress(100);
        setIsLoaded(true);
        setReadyToAnimate(true);
        setTimeout(() => {
          if (isMounted) setPreloaderExited(true);
        }, 700);
      });

    return () => {
      isMounted = false;
      clearInterval(progressTimer);
      abortController.abort();
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

  const navLinks: { label: string; page: PageId }[] = [
    { label: 'Story', page: 'story' },
    { label: 'Jobs', page: 'jobs' },
    { label: 'Message', page: 'message' },
  ];

  const socialLinks: { label: string; page: PageId }[] = [
    { label: 'Instagram', page: 'instagram' },
    { label: 'TikTok', page: 'tiktok' },
    { label: 'YouTube', page: 'youtube' },
  ];

  const isHomePage = currentPage === 'home';

  return (
    <main
      id="hero-section"
      className={`relative w-full bg-black font-hn text-cream select-none ${
        isHomePage ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh] overflow-y-auto'
      }`}
    >
      {/* Full-viewport Curtain Page Transition */}
      <CurtainTransition phase={curtainPhase} targetPageName={targetPageName} />

      {/* Editorial Preloader */}
      {!preloaderExited && (
        <div
          id="preloader-overlay"
          aria-hidden={isLoaded}
          className={`fixed inset-0 z-[100] flex flex-col justify-between bg-black px-6 py-6 sm:px-10 sm:py-8 md:px-12 md:py-10 lg:px-16 lg:py-12 font-hn text-cream transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Preloader Top */}
          <div className="flex items-start justify-between text-xs sm:text-sm tracking-widest uppercase">
            <span className="font-normal text-cream">Marcus</span>
            <span className="opacity-50 tabular-nums">2025</span>
          </div>

          {/* Preloader Center Display */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="overflow-hidden">
              <span className="block font-hn text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-light tracking-tighter tabular-nums leading-none">
                {String(loadProgress).padStart(3, '0')}
              </span>
            </div>
            <div className="mt-6 sm:mt-8 h-[1.5px] w-24 sm:w-32 md:w-36 bg-cream/20 overflow-hidden">
              <div
                className="h-full bg-cream transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>

          {/* Preloader Bottom */}
          <div className="flex items-end justify-between text-[11px] sm:text-xs md:text-sm tracking-wider uppercase opacity-50">
            <span>Visuals Composer</span>
            <span>Bennet</span>
          </div>
        </div>
      )}

      {/* Grain / noise texture overlay to enhance the editorial/printed aesthetic */}
      <div
        id="grain-texture-overlay"
        aria-hidden="true"
        className="grain-overlay pointer-events-none fixed inset-0 z-25 opacity-[0.045] mix-blend-screen"
      />

      {/* Persistent Site Header (Layer: z-30) */}
      <header
        id="site-header"
        className="fixed inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8 md:px-12 md:pt-10 lg:px-16 lg:pt-12 pointer-events-auto"
      >
        {/* Brand / logo link -> Home */}
        <button
          id="brand-link"
          type="button"
          onClick={() => handleNavigate('home')}
          className={`font-hn text-lg sm:text-xl md:text-2xl tracking-wide text-cream transition-opacity duration-300 hover:opacity-75 cursor-pointer ${
            readyToAnimate ? 'anim-fade-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '800ms' }}
        >
          Marcus
        </button>

        {/* Desktop right cluster (hidden on mobile) */}
        <div
          id="desktop-nav-group"
          className="hidden sm:flex items-start gap-8 sm:gap-10 md:gap-14 lg:gap-20 xl:gap-24"
        >
          {/* Year */}
          <span
            id="desktop-year"
            className={`font-hn text-xs sm:text-xs md:text-sm tracking-wider tabular-nums text-cream/70 ${
              readyToAnimate ? 'anim-fade-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '900ms' }}
          >
            2025
          </span>

          {/* Nav column */}
          <nav
            id="desktop-nav-links"
            className="flex flex-col gap-1 sm:gap-1.5 text-xs sm:text-xs md:text-sm font-hn"
          >
            {navLinks.map(({ label, page }, index) => {
              const isActive = currentPage === page;
              return (
                <button
                  key={label}
                  id={`desktop-nav-${label.toLowerCase()}`}
                  type="button"
                  onClick={() => handleNavigate(page)}
                  className={`text-left text-cream transition-all duration-300 hover:opacity-60 cursor-pointer ${
                    isActive ? 'opacity-100 font-normal border-b border-cream/60 pb-0.5' : 'opacity-75'
                  } ${readyToAnimate ? 'anim-fade-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${1000 + index * 80}ms` }}
                >
                  {label}
                </button>
              );
            })}
            <button
              id="desktop-nav-custom-character"
              type="button"
              onClick={() => setCustomModalOpen(true)}
              className={`text-left text-cream transition-opacity duration-300 hover:opacity-60 cursor-pointer pt-0.5 ${
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
            className="flex flex-col gap-1 sm:gap-1.5 text-xs sm:text-xs md:text-sm font-hn"
          >
            {socialLinks.map(({ label, page }, index) => {
              const isActive = currentPage === page;
              return (
                <button
                  key={label}
                  id={`desktop-social-${label.toLowerCase()}`}
                  type="button"
                  onClick={() => handleNavigate(page)}
                  className={`text-left text-cream transition-all duration-300 hover:opacity-60 cursor-pointer ${
                    isActive ? 'opacity-100 font-normal border-b border-cream/60 pb-0.5' : 'opacity-75'
                  } ${readyToAnimate ? 'anim-fade-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${1150 + index * 80}ms` }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile-only hamburger trigger button (Layer: z-50) */}
        <button
          id="mobile-menu-trigger"
          type="button"
          aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`sm:hidden relative z-50 flex h-10 w-10 items-center justify-center -mr-2 cursor-pointer ${
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

      {/* PAGE VIEW ROUTING */}
      {isHomePage ? (
        <>
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
            className={`absolute inset-x-0 top-[16vh] sm:top-[14vh] md:top-[12vh] lg:top-[11vh] xl:top-[10vh] z-10 overflow-hidden ${
              readyToAnimate ? 'anim-fade-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '500ms' }}
          >
            <div
              id="marquee-track"
              className="marquee flex w-max whitespace-nowrap font-hn text-[16vh] sm:text-[20vh] md:text-[22vh] lg:text-[24vh] xl:text-[26vh] 2xl:text-[28vh] font-normal leading-none tracking-tight text-cream"
            >
              <span className="pr-[6vw]">
                Marcus / Bennet{'\u00A0'}
              </span>
              <span className="pr-[6vw]">
                Marcus / Bennet{'\u00A0'}
              </span>
            </div>
          </div>

          {/* 3. Horizontal cream rule (Layer: z-10, grows from left) */}
          <div
            id="cream-divider-rule"
            className={`absolute inset-x-6 sm:inset-x-10 md:inset-x-12 lg:inset-x-16 bottom-[5.5rem] sm:bottom-24 md:bottom-28 lg:bottom-30 xl:bottom-32 z-10 h-[1.5px] bg-cream ${
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

          {/* Footer on Home Page (Layer: z-30 on mobile, sm:z-10 on desktop) */}
          <footer
            id="site-footer"
            className="absolute inset-x-0 bottom-0 z-30 sm:z-10 flex items-end justify-between px-6 pb-6 sm:px-10 sm:pb-8 md:px-12 md:pb-10 lg:px-16 lg:pb-12 text-xs sm:text-xs md:text-sm leading-relaxed font-hn text-cream"
          >
            <div
              id="footer-left-info"
              className={`flex flex-col space-y-0.5 sm:space-y-1 text-cream/80 ${
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
              className={`hidden sm:flex items-center gap-2 border border-cream/25 px-4 py-2 text-xs uppercase tracking-widest text-cream hover:border-cream/80 hover:bg-cream/10 transition-colors cursor-pointer ${
                readyToAnimate ? 'anim-fade-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '1480ms' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cream" />
              Costum Gambar Karakter
            </button>

            <div
              id="footer-right-homage"
              className={`flex flex-col space-y-0.5 sm:space-y-1 text-right text-cream/80 ${
                readyToAnimate ? 'anim-fade-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '1550ms' }}
            >
              <span>A homage to</span>
              <span>Marcus Holloway</span>
            </div>
          </footer>
        </>
      ) : currentPage === 'story' ? (
        <StoryView onBackToHome={() => handleNavigate('home')} />
      ) : currentPage === 'jobs' ? (
        <JobsView onBackToHome={() => handleNavigate('home')} />
      ) : currentPage === 'message' ? (
        <MessageView onBackToHome={() => handleNavigate('home')} />
      ) : (
        <SocialChannelView
          platform={currentPage as 'instagram' | 'tiktok' | 'youtube'}
          onBackToHome={() => handleNavigate('home')}
        />
      )}

      {/* Mobile Drawer (Layer: z-40, sm:hidden) */}
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
            className={`absolute right-6 top-6 z-50 text-cream transition-all duration-300 cursor-pointer ${
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
                {/* Home link */}
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className={`text-left text-4xl text-cream font-normal transition-all duration-500 hover:opacity-60 cursor-pointer ${
                    currentPage === 'home' ? 'opacity-100' : 'opacity-80'
                  } ${drawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                  style={{
                    transitionDelay: drawerOpen ? '250ms' : '0ms',
                  }}
                >
                  Beranda
                </button>

                {navLinks.map(({ label, page }, index) => (
                  <button
                    key={label}
                    id={`mobile-nav-${label.toLowerCase()}`}
                    type="button"
                    onClick={() => handleNavigate(page)}
                    className={`text-left text-4xl text-cream font-normal transition-all duration-500 hover:opacity-60 cursor-pointer ${
                      currentPage === page ? 'opacity-100' : 'opacity-80'
                    } ${drawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                    style={{
                      transitionDelay: drawerOpen ? `${300 + index * 80}ms` : '0ms',
                    }}
                  >
                    {label}
                  </button>
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
                    transitionDelay: drawerOpen ? `${300 + (navLinks.length + 1) * 80}ms` : '0ms',
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
                {socialLinks.map(({ label, page }, index) => {
                  const isActive = currentPage === page;
                  return (
                    <button
                      key={label}
                      id={`mobile-social-${label.toLowerCase()}`}
                      type="button"
                      onClick={() => handleNavigate(page)}
                      className={`text-left text-cream transition-all duration-500 hover:opacity-60 cursor-pointer ${
                        isActive ? 'opacity-100 font-normal underline underline-offset-4' : 'opacity-80'
                      } ${
                        drawerOpen
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-4 opacity-0'
                      }`}
                      style={{
                        transitionDelay: drawerOpen ? `${550 + index * 60}ms` : '0ms',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
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

