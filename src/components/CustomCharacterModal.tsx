/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { X, Upload, RotateCcw, Check, Image as ImageIcon } from 'lucide-react';
import { DEFAULT_CHARACTER_IMAGE } from '../config/character';

interface CustomCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string;
  onSaveImage: (newImageUrl: string) => void;
  onResetImage: () => void;
}

export default function CustomCharacterModal({
  isOpen,
  onClose,
  currentImage,
  onSaveImage,
  onResetImage,
}: CustomCharacterModalProps) {
  const [urlInput, setUrlInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Format file harus berupa gambar (PNG, WebP, JPG).');
      return;
    }
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPreviewUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setPreviewUrl(urlInput.trim());
    setErrorMsg('');
  };

  const handleSave = () => {
    onSaveImage(previewUrl);
    onClose();
  };

  const handleReset = () => {
    onResetImage();
    setPreviewUrl(DEFAULT_CHARACTER_IMAGE);
    setUrlInput('');
    onClose();
  };

  return (
    <div
      id="custom-character-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
    >
      <div
        id="custom-character-modal-panel"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg border border-cream/20 bg-[#0d0d0d] p-6 sm:p-8 font-hn text-cream shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-cream/15">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal tracking-tight">
              Costum Gambar Karakter
            </h2>
            <p className="mt-1 text-xs text-cream/60">
              Gunakan foto atau karakter Anda sendiri untuk overlay utama.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="text-cream/70 hover:text-cream transition-colors p-1"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-5 text-sm">
          {/* File Upload Dropzone */}
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-cream/70 mb-2">
              1. Unggah File Gambar (PNG Transparan Disarankan)
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center border border-dashed p-6 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-cream bg-cream/10'
                  : 'border-cream/25 hover:border-cream/50 bg-white/[0.02]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <Upload size={22} strokeWidth={1.5} className="mb-2 text-cream/70" />
              <p className="text-xs text-cream/80">
                Klik untuk memilih file atau seret gambar ke sini
              </p>
              <p className="mt-1 text-[11px] text-cream/40">
                Format: PNG cutout / WebP / JPG
              </p>
            </div>
          </div>

          {/* Direct URL Input */}
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-cream/70 mb-2">
              2. Atau Masukkan URL Gambar Langsung
            </label>
            <form onSubmit={handleApplyUrl} className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/karakter-anda.png"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-black border border-cream/20 px-3 py-2 text-xs text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
              />
              <button
                type="submit"
                className="border border-cream/30 px-3 py-2 text-xs text-cream hover:bg-cream hover:text-black transition-colors"
              >
                Tinjau
              </button>
            </form>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-400">{errorMsg}</p>
          )}

          {/* Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-[0.15em] text-cream/70">
                Pratinjau Karakter
              </span>
              <span className="text-[11px] text-cream/40">
                Layer Z-20 (di atas teks marquee)
              </span>
            </div>
            <div className="relative h-44 w-full overflow-hidden border border-cream/15 bg-black/60 flex items-center justify-center">
              {/* Checkerboard subtle pattern to show cutout transparency */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                }}
              />
              {/* Background preview label representing marquee behind portrait */}
              <div className="absolute text-center select-none text-cream/15 text-2xl font-bold tracking-tight">
                Marcus &mdash; Bennet
              </div>
              <img
                src={previewUrl}
                alt="Preview karakter"
                className="relative z-10 h-full max-h-full object-contain drop-shadow-md"
              />
            </div>
          </div>

          {/* Important Editorial Note */}
          <p className="text-[11px] leading-relaxed text-cream/50 border-l border-cream/30 pl-3">
            <strong>Tips:</strong> Agar efek visual tetap maksimal, pastikan gambar yang diunggah
            sudah di-cutout (latar belakang transparan) sehingga teks nama &ldquo;Marcus &mdash; Bennet&rdquo;
            di belakangnya tetap terlihat menembus siluet karakter. Anda juga bisa mengatur file langsung di{' '}
            <code className="text-cream/80 bg-white/10 px-1 py-0.5">src/config/character.ts</code>.
          </p>
        </div>

        {/* Actions Footer */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-cream/15">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-cream/60 hover:text-cream transition-colors py-1"
          >
            <RotateCcw size={14} />
            Reset ke Asli
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-cream/20 px-4 py-2 text-xs text-cream/80 hover:text-cream transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-cream px-5 py-2 text-xs text-black font-medium hover:bg-cream/90 transition-colors"
            >
              <Check size={14} />
              Terapkan Gambar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
