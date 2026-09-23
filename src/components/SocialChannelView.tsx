/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube';

interface SocialChannelViewProps {
  platform: SocialPlatform;
  onBackToHome: () => void;
}

interface ChannelData {
  platformName: string;
  handle: string;
  tagline: string;
  category: string;
  overview: string;
  frequency: string;
  curatedEntries: {
    id: string;
    index: string;
    title: string;
    format: string;
    date: string;
    note: string;
  }[];
  externalUrl: string;
}

const CHANNELS: Record<SocialPlatform, ChannelData> = {
  instagram: {
    platformName: 'Instagram',
    handle: '@marcusbennet',
    tagline: 'Visual Diary & Editorial Stills',
    category: '04 / Photography & Graphic Ephemera',
    overview:
      'Archival 35mm film captures, stark contrast silhouettes, graphic ephemera, and raw explorations from the Bay Area underground creative scene.',
    frequency: 'Bi-weekly photo dispatches & typographic studies',
    curatedEntries: [
      {
        id: 'ig-01',
        index: '01',
        title: 'Bay Area Low Light // Concrete & Neon',
        format: '35mm Tri-X 400',
        date: 'Sept 2025',
        note: 'Monochrome high-grain studies around the Embarcadero after hours.',
      },
      {
        id: 'ig-02',
        index: '02',
        title: 'DedSec Graphic Language Prototype',
        format: 'Vector & Print',
        date: 'Aug 2025',
        note: 'Deconstructed glitch typography printed on heavy 300gsm cotton rag.',
      },
      {
        id: 'ig-03',
        index: '03',
        title: 'Analog Rig & Modular Frequency Deck',
        format: 'Still Capture',
        date: 'July 2025',
        note: 'Patch cables and oscilloscope waveforms fueling late night web audio.',
      },
      {
        id: 'ig-04',
        index: '04',
        title: 'Kinetic Type Exhibition Stills',
        format: 'Exhibition',
        date: 'May 2025',
        note: 'Gallery installation documentation at Neue Form Institute.',
      },
    ],
    externalUrl: 'https://instagram.com',
  },
  tiktok: {
    platformName: 'TikTok',
    handle: '@marcusbennet',
    tagline: 'Kinetic Snippets & Code Labs',
    category: '05 / Rapid Technical Transmissions',
    overview:
      'Short-form technical breakdowns, real-time GLSL canvas experiments, sub-60-second micro-interactions, and creative coding workflows.',
    frequency: 'Weekly reels on motion engineering & creative design',
    curatedEntries: [
      {
        id: 'tt-01',
        index: '01',
        title: 'CRT Scanline Shader in 30 Seconds',
        format: 'GLSL Code Breakdown',
        date: 'Recent',
        note: 'Simulating vintage cathode tube distortion without GPU overhead.',
      },
      {
        id: 'tt-02',
        index: '02',
        title: 'Watch Dogs 2 HUD Typography Breakdown',
        format: 'UI Anatomy',
        date: 'Recent',
        note: 'Why brutalist grid alignment and high-contrast letterforms endure.',
      },
      {
        id: 'tt-03',
        index: '03',
        title: 'Zero-JS Kinetic Marquee Physics',
        format: 'CSS Engine',
        date: 'Recent',
        note: 'Fluid continuous horizontal marquee scrolling at 120fps.',
      },
    ],
    externalUrl: 'https://tiktok.com',
  },
  youtube: {
    platformName: 'YouTube',
    handle: 'Marcus Bennet',
    tagline: 'Long-Form Ephemera & Lectures',
    category: '06 / Archival Cinema & Soundscapes',
    overview:
      'In-depth technical documentaries, deconstructions of subversive counter-culture media, and uncut generative audio-visual studio sessions.',
    frequency: 'Monthly 4K archival masterclasses & studio sessions',
    curatedEntries: [
      {
        id: 'yt-01',
        index: '01',
        title: 'The Tactile Web: Rejecting Disposable UI',
        format: '42 min Documentary',
        date: '2025',
        note: 'An editorial manifesto on permanence, print typography, and software soul.',
      },
      {
        id: 'yt-02',
        index: '02',
        title: 'Building Real-time Frequency Modulators in WebGL',
        format: '28 min Deep Dive',
        date: '2024',
        note: 'From raw Fourier audio analysis to responsive typographic distortion.',
      },
      {
        id: 'yt-03',
        index: '03',
        title: 'Late Night Live Session // Modular Synth & GLSL Canvas',
        format: '60 min Performance',
        date: '2024',
        note: 'Uncut ambient modular synth jam coupled with live shader coding.',
      },
    ],
    externalUrl: 'https://youtube.com',
  },
};

export default function SocialChannelView({ platform, onBackToHome }: SocialChannelViewProps) {
  const data = CHANNELS[platform] || CHANNELS.instagram;

  return (
    <div
      id={`social-view-${platform}`}
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
          <p
            className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-cream/40 mb-3 sm:mb-4"
            dangerouslySetInnerHTML={{ __html: data.category }}
          />
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]">
            {data.tagline}
          </h1>
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-[13px] text-cream/60">
            <span className="font-mono text-sm text-cream">{data.handle}</span>
            <span>/</span>
            <span>{data.frequency}</span>
          </div>
        </div>

        {/* Channel Overview & Curated Archive */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 md:gap-12 lg:gap-16 border-t border-cream/15 pt-8 sm:pt-10 md:pt-12">
          {/* Left Column: Context & External Link */}
          <div className="md:col-span-5 space-y-6 sm:space-y-8 md:sticky md:top-32 self-start">
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-cream/40 mb-3">
                Tentang Saluran Ini
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-cream/80 font-light">
                {data.overview}
              </p>
            </div>

            {/* External Redirect Action */}
            <div className="border border-cream/15 p-5 sm:p-6 bg-black/40">
              <p className="text-[11px] sm:text-xs uppercase tracking-widest text-cream/40 mb-2">
                Tautan Platform Eksternal
              </p>
              <p className="text-xs text-cream/60 mb-5">
                Buka profil resmi {data.platformName} di tab peramban baru:
              </p>
              <a
                href={data.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full border border-cream/30 bg-cream/5 px-4 py-3 text-xs uppercase tracking-widest text-cream hover:bg-cream hover:text-black transition-colors"
              >
                <span>Kunjungi {data.handle}</span>
                <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="text-xs text-cream/40 leading-relaxed">
              Arsip disinkronkan secara berkala. Seluruh konten media diproduksi secara independen di Studio Bennet.
            </div>
          </div>

          {/* Right Column: Curated Dispatches List */}
          <div className="md:col-span-7">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-cream/40 mb-5 sm:mb-6">
              Transmisi & Arsip Unggulan
            </p>

            <div className="space-y-4">
              {data.curatedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-cream/10 bg-black/60 p-5 sm:p-6 transition-all hover:border-cream/30"
                >
                  <div className="flex items-center justify-between text-xs text-cream/40 mb-2">
                    <span className="font-mono">{entry.index}</span>
                    <span className="uppercase tracking-wider text-[11px] sm:text-xs">{entry.format} / {entry.date}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-light text-cream tracking-tight">
                    {entry.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-cream/70 font-light leading-relaxed">
                    {entry.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
