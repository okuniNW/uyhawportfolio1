/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type CurtainPhase = 'idle' | 'fading-in' | 'opaque' | 'fading-out';

interface CurtainTransitionProps {
  phase: CurtainPhase;
  targetPageName?: string;
}

export default function CurtainTransition({ phase, targetPageName }: CurtainTransitionProps) {
  const isVisible = phase !== 'idle';
  const isOpaque = phase === 'fading-in' || phase === 'opaque';

  return (
    <div
      id="curtain-viewport-overlay"
      aria-hidden={!isVisible}
      className={`fixed inset-0 z-[95] bg-black transition-opacity ${
        phase === 'fading-out' ? 'duration-400 ease-out' : 'duration-350 ease-[cubic-bezier(0.76,0,0.24,1)]'
      } ${
        isOpaque
          ? 'opacity-100 pointer-events-auto'
          : isVisible
          ? 'opacity-0 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Editorial watermark mark shown at the peak of the blackout */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200 ${
          phase === 'opaque' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="font-hn text-xs tracking-[0.35em] uppercase text-cream/40 select-none">
          MARCUS / BENNET
        </span>
        {targetPageName && (
          <span className="mt-2 font-hn text-[11px] tracking-[0.25em] uppercase text-cream/20 select-none">
            {targetPageName}
          </span>
        )}
      </div>
    </div>
  );
}
