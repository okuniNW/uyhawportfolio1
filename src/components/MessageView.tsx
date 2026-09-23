/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Check, Copy, Send } from 'lucide-react';

interface MessageViewProps {
  onBackToHome: () => void;
}

export default function MessageView({ onBackToHome }: MessageViewProps) {
  const [copied, setCopied] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const emailAddress = 'marcus@bennet.design';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !senderEmail.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSenderName('');
      setSenderEmail('');
      setMessageText('');
    }, 1500);
  };

  return (
    <div
      id="message-view-container"
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
            03 / Direct Channel
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-none">
            Send a Message
          </h1>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 md:gap-12 lg:gap-16 border-t border-cream/15 pt-8 sm:pt-10 md:pt-12">
          {/* Left Column: Direct Info & Availability */}
          <div className="md:col-span-5 space-y-6 sm:space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-cream/60">
                  Status Ketersediaan
                </span>
              </div>
              <p className="text-base sm:text-lg font-light text-cream">
                Terbuka untuk kolaborasi proyek Q4 2025 & 2026.
              </p>
            </div>

            {/* Quick Copy Email Box */}
            <div className="border border-cream/15 p-5 sm:p-6 bg-black/40">
              <p className="text-[11px] sm:text-xs uppercase tracking-widest text-cream/40 mb-2">
                Kontak Langsung
              </p>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm sm:text-base text-cream select-all">
                  {emailAddress}
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 border border-cream/25 px-2.5 py-1 text-xs text-cream hover:bg-cream hover:text-black transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={13} />
                      <span>Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-xs sm:text-[13px] leading-relaxed text-cream/50 space-y-2">
              <p>
                Tertarik mendiskusikan komposisi visual, identitas interaktif, atau instalasi digital?
                Tinggalkan pesan di samping atau hubungi langsung via email.
              </p>
              <p>Respon rata-rata: dalam 24-48 jam kerja.</p>
            </div>
          </div>

          {/* Right Column: Transmission Form */}
          <div className="md:col-span-7">
            {sentSuccess ? (
              <div className="border border-cream/30 p-8 sm:p-10 text-center bg-cream/5">
                <Check size={32} strokeWidth={1.5} className="mx-auto text-cream mb-4" />
                <h3 className="text-2xl font-light tracking-tight text-cream">
                  Pesan Terkirim
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-cream/60">
                  Terima kasih. Kami akan meninjau pesan Anda dan segera membalasnya.
                </p>
                <button
                  type="button"
                  onClick={() => setSentSuccess(false)}
                  className="mt-6 border border-cream/30 px-5 py-2 text-xs uppercase tracking-wider text-cream hover:bg-cream hover:text-black transition-colors"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-[11px] sm:text-xs uppercase tracking-[0.18em] text-cream/60 mb-2">
                    Nama / Studio
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-black/60 border border-cream/20 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs uppercase tracking-[0.18em] text-cream/60 mb-2">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@domain.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full bg-black/60 border border-cream/20 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs uppercase tracking-[0.18em] text-cream/60 mb-2">
                    Catatan Pesan / Ringkasan Proyek
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ceritakan tentang proyek atau gagasan yang ingin Anda diskusikan..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full bg-black/60 border border-cream/20 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-cream text-black px-6 py-3.5 text-xs font-medium uppercase tracking-widest hover:bg-cream/90 transition-colors cursor-pointer"
                  >
                    <span>Kirim Transmisi</span>
                    <Send size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
