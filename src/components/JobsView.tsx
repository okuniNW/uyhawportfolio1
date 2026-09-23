/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface JobsViewProps {
  onBackToHome: () => void;
}

interface ProjectItem {
  id: string;
  number: string;
  title: string;
  client: string;
  year: string;
  role: string;
  description: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'nocturne-chroma',
    number: '01',
    title: 'Nocturne Chroma',
    client: 'Autonomous Sound Lab',
    year: '2025',
    role: 'Art Direction & Web Canvas',
    description:
      'Real-time frequency-modulated audio visualizer and interactive vinyl packaging for underground experimental synthesists.',
  },
  {
    id: 'bay-subsurface',
    number: '02',
    title: 'Bay Area Subsurface',
    client: 'DedSec Archives',
    year: '2024',
    role: 'Identity & Interactive Dossier',
    description:
      'An archival digital exhibition capturing the counter-culture hacker movement in San Francisco with custom monospace typography.',
  },
  {
    id: 'kinetic-typology',
    number: '03',
    title: 'Kinetic Typo-Architecture',
    client: 'Neue Form Institute',
    year: '2024',
    role: 'Creative Engineering',
    description:
      'Multi-axis kinetic type system projecting variable glyph weights onto physical brutalist concrete surfaces.',
  },
  {
    id: 'monochrome-odyssey',
    number: '04',
    title: 'Monochrome Odyssey',
    client: 'Atelier Bennet',
    year: '2023',
    role: 'Editorial Publication',
    description:
      'A limited 120-page tactile risograph publication cataloging high-contrast editorial cutouts and portraiture.',
  },
];

export default function JobsView({ onBackToHome }: JobsViewProps) {
  const [selectedId, setSelectedId] = useState<string>(PROJECTS[0].id);
  const activeProject = PROJECTS.find((p) => p.id === selectedId) || PROJECTS[0];

  return (
    <div
      id="jobs-view-container"
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

        {/* Header */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-cream/40 mb-3 sm:mb-4">
            02 / Selected Commissions & Archives
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-none">
            Selected Works
          </h1>
        </div>

        {/* Project Explorer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-10 lg:gap-14 xl:gap-16 border-t border-cream/15 pt-8 sm:pt-10 md:pt-12">
          {/* Projects List Column */}
          <div className="md:col-span-7 lg:col-span-7 space-y-1">
            {PROJECTS.map((proj) => {
              const isSelected = proj.id === selectedId;
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedId(proj.id)}
                  className={`group relative flex items-baseline justify-between border-b border-cream/10 py-4 sm:py-5 md:py-6 px-3 sm:px-4 cursor-pointer transition-all duration-300 ${
                    isSelected ? 'bg-cream/5 border-cream/35' : 'hover:bg-cream/[0.02]'
                  }`}
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-xs text-cream/40">{proj.number}</span>
                    <div>
                      <h2
                        className={`text-lg sm:text-xl md:text-2xl font-light transition-colors ${
                          isSelected ? 'text-cream' : 'text-cream/70 group-hover:text-cream'
                        }`}
                      >
                        {proj.title}
                      </h2>
                      <p className="text-xs text-cream/45 tracking-wide mt-1">{proj.client}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-xs sm:text-sm font-mono text-cream/40 tabular-nums">{proj.year}</span>
                    <ArrowUpRight
                      size={16}
                      className={`text-cream/40 transition-transform ${
                        isSelected ? 'rotate-45 text-cream' : 'group-hover:text-cream'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Project Detail Card */}
          <div className="md:col-span-5 lg:col-span-5 md:sticky md:top-32 self-start border border-cream/15 bg-black/70 p-6 sm:p-7 md:p-8 backdrop-blur-md">
            <div className="flex items-center justify-between pb-4 border-b border-cream/15">
              <span className="font-mono text-xs text-cream/40">{activeProject.number}</span>
              <span className="text-xs uppercase tracking-widest text-cream/60">{activeProject.year}</span>
            </div>

            <h3 className="mt-5 text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-cream">
              {activeProject.title}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-wider text-cream/55">{activeProject.role}</p>

            <p className="mt-5 text-sm sm:text-base leading-relaxed text-cream/80 font-light">
              {activeProject.description}
            </p>

            <div className="mt-8 pt-5 border-t border-cream/10 flex items-center justify-between text-xs text-cream/50">
              <span>Client: {activeProject.client}</span>
              <span className="uppercase tracking-widest text-[11px]">Archived</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
