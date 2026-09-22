/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * ============================================================================
 * KONFIGURASI GAMBAR KARAKTER / CHARACTER IMAGE CONFIGURATION
 * ============================================================================
 *
 * File ini didedikasikan agar Anda dapat mengganti gambar karakter dengan mudah.
 *
 * PANDUAN PENGGUNAAN:
 * ----------------------------------------------------------------------------
 * OPSI 1 (URL Gambar Online):
 * Ganti nilai CUSTOM_CHARACTER_IMAGE di bawah dengan URL gambar Anda:
 * Contoh:
 * export const CUSTOM_CHARACTER_IMAGE = "https://link-gambar-anda.com/foto.png";
 *
 * OPSI 2 (File Gambar Lokal di Proyek):
 * 1. Masukkan file gambar Anda ke dalam folder `public/` (misalnya: `public/karakter.png`)
 * 2. Ganti nilai CUSTOM_CHARACTER_IMAGE menjadi nama file tersebut:
 *    export const CUSTOM_CHARACTER_IMAGE = "/karakter.png";
 *
 * TIPS VISUAL TERBAIK:
 * Gunakan gambar format PNG atau WebP dengan latar belakang transparan (cutout),
 * agar animasi teks marquee "Marcus — Bennet" tetap tampak mengalir di belakang
 * siluet karakter Anda seperti desain aslinya.
 * ----------------------------------------------------------------------------
 */

// Gambar default asli (homage to Marcus Holloway)
export const DEFAULT_CHARACTER_IMAGE =
  'https://stone-expand-60400629.figma.site/_assets/v11/8da570354e86aa0d44ac3e4aa335a72c8e750d68.png';

// Gambar background pemandangan default
export const DEFAULT_BG_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85';

/**
 * Masukkan URL atau path file gambar kustom Anda di sini.
 * Jika diisi string (misal: "https://..." atau "/karakter.png"), sistem akan
 * otomatis menggunakan gambar tersebut sebagai karakter utama.
 * Jika dibiarkan null, aplikasi akan menggunakan gambar default atau upload di aplikasi.
 */
export const CUSTOM_CHARACTER_IMAGE: string | null = null;
