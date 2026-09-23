/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface StoryViewProps {
  onBackToHome: () => void;
}

export default function StoryView({ onBackToHome }: StoryViewProps) {
  return (
    <div
      id="story-view-container"
      className="relative z-20 flex min-h-[100dvh] w-full flex-col justify-between overflow-y-auto px-6 pt-24 pb-24 sm:px-10 sm:pt-28 sm:pb-28 md:px-12 md:pt-32 md:pb-32 lg:px-16 lg:pt-36 lg:pb-36 font-hn text-cream"
    >
      <div className="mx-auto w-full max-w-5xl xl:max-w-6xl">
        {/* Breadcrumb / Back button */}
        <button
          type="button"
          onClick={onBackToHome}
          className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase text-cream/50 hover:text-cream transition-colors cursor-pointer mb-8 sm:mb-10 md:mb-12"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Header Title */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-cream/40 mb-3 sm:mb-4">
            01 / Statement of Craft
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.5rem] font-light tracking-tight leading-[1.08]">
            Where kinetic code, light, and narrative converge.
          </h1>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16 border-t border-cream/15 pt-8 sm:pt-10 md:pt-12">
          {/* Metadata Column */}
          <div className="md:col-span-4 lg:col-span-4 space-y-6 sm:space-y-8 text-xs">
            <div>
              <p className="uppercase tracking-[0.2em] text-cream/40 mb-2">Discipline</p>
              <p className="text-sm font-normal text-cream/90">Visuals Composer & Digital Crafter</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.2em] text-cream/40 mb-2">Origins</p>
              <p className="text-sm font-normal text-cream/90">Bay Area / Underground Creative Scene</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.2em] text-cream/40 mb-2">Influences</p>
              <p className="text-sm font-normal text-cream/90">
                DedSec aesthetic, brutalist print typography, and high-frequency tactile motion.
              </p>
            </div>
            <div>
              <p className="uppercase tracking-[0.2em] text-cream/40 mb-2">Obsessions</p>
              <p className="text-sm font-normal text-cream/90">The Office, modular synths, analog noise.</p>
            </div>
          </div>

          {/* Prose Column */}
          <div className="md:col-span-8 lg:col-span-8 space-y-6 text-sm sm:text-base md:text-[17px] leading-[1.75] text-cream/80 font-light">
            <p>
              Marcus Bennet operates at the boundary where software architecture meets art direction.
              Rejecting sterile, cookie-cutter templates, each composition is treated as a physical,
              ink-printed canvas engineered with modern real-time graphics.
            </p>
            <p>
              Drawing inspiration from Marcus Holloway&rsquo;s rebellious technological ethos in Watch Dogs 2,
              the aesthetic pairs stark silhouette cutouts with relentless horizontal typographic motion.
              The result is a presence that feels simultaneously street-level and razor-sharp.
            </p>
            <p className="border-l-2 border-cream/35 pl-5 text-cream/95 italic text-sm sm:text-base md:text-lg leading-relaxed my-6">
              True craftsmanship means executing the requested scope with pristine layout, spacing,
              color, and typography: every pixel deliberate, never accidental.
            </p>
            <p>
              Every layout is crafted with mathematical baseline rhythms, zero unrequested visual clutter,
              and low-opacity film grain to emulate the tactile permanence of editorial print publications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
