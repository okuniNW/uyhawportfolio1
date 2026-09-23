/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PreloadProgress {
  loaded: number;
  total: number;
  percentage: number;
  currentAsset?: string;
}

export type ProgressCallback = (progress: PreloadProgress) => void;

export interface ImagePreloadOptions {
  timeoutMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
}

export interface PreloadResult {
  success: boolean;
  loadedCount: number;
  totalAssets: number;
  failedAssets: string[];
  durationMs: number;
}

/**
 * Loads a single image attempt using HTMLImageElement and GPU-accelerated decode.
 */
function attemptImageElementDecode(
  url: string,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve(false);
      return;
    }

    const img = new Image();
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        img.onload = null;
        img.onerror = null;
        resolve(false);
      }
    }, timeoutMs);

    const abortHandler = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        img.onload = null;
        img.onerror = null;
        resolve(false);
      }
    };

    signal?.addEventListener('abort', abortHandler, { once: true });

    const finish = async (success: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', abortHandler);

      if (success && typeof img.decode === 'function') {
        try {
          await img.decode();
        } catch {
          // Decoding failures (e.g. cross-origin restrictions) still leave image rendered in DOM
        }
      }
      resolve(success);
    };

    if (img.complete && img.naturalWidth > 0) {
      finish(true);
      return;
    }

    img.onload = () => finish(true);
    img.onerror = () => finish(false);

    if (url.startsWith('http://') || url.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }
    img.src = url;
  });
}

/**
 * Secondary fetch-based decode strategy if Image() fails due to cross-origin or caching quirks.
 */
async function attemptFetchBitmapDecode(
  url: string,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<boolean> {
  if (typeof fetch === 'undefined' || typeof createImageBitmap === 'undefined') {
    return false;
  }

  const fetchController = new AbortController();
  const abortHandler = () => fetchController.abort();
  signal?.addEventListener('abort', abortHandler, { once: true });

  const timer = setTimeout(() => fetchController.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      mode: 'cors',
      cache: 'force-cache',
      signal: fetchController.signal,
    });
    if (!res.ok) return false;
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);
    bitmap.close();
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abortHandler);
  }
}

/**
 * Loads and definitively decodes an image with exponential backoff retries,
 * cache-busting retry fallback, and secondary bitmap decode fallback.
 */
export async function preloadAndDecodeImageWithRetry(
  url: string,
  options: ImagePreloadOptions = {},
  signal?: AbortSignal
): Promise<{ url: string; success: boolean }> {
  if (!url) {
    return { url, success: false };
  }

  const {
    timeoutMs = 4500,
    maxRetries = 2,
    retryDelayMs = 300,
  } = options;

  let attempt = 0;
  while (attempt <= maxRetries) {
    if (signal?.aborted) {
      return { url, success: false };
    }

    // On retry, try cache-busting parameter if it's a remote URL to bypass corrupted local/CDN cache
    let targetUrl = url;
    if (attempt > 0 && (url.startsWith('http://') || url.startsWith('https://'))) {
      const separator = url.includes('?') ? '&' : '?';
      targetUrl = `${url}${separator}retry=${attempt}&t=${Date.now()}`;
    }

    // Try primary Image element + decode()
    let success = await attemptImageElementDecode(targetUrl, timeoutMs, signal);

    // If primary failed on first attempt, try secondary fetch bitmap decode
    if (!success && !signal?.aborted) {
      success = await attemptFetchBitmapDecode(url, Math.min(timeoutMs, 2500), signal);
    }

    if (success) {
      return { url, success: true };
    }

    attempt++;
    if (attempt <= maxRetries && !signal?.aborted) {
      // Exponential backoff with small random jitter
      const backoff = retryDelayMs * Math.pow(1.5, attempt - 1) + Math.random() * 75;
      await new Promise((res) => setTimeout(res, backoff));
    }
  }

  // Graceful resolution even on total failure: ensures entrance sequence never halts
  return { url, success: false };
}

/**
 * Backwards-compatible single-call preloader function.
 */
export async function preloadAndDecodeImage(
  url: string,
  timeoutMs = 5000
): Promise<{ url: string; success: boolean }> {
  return preloadAndDecodeImageWithRetry(url, { timeoutMs, maxRetries: 2 });
}

/**
 * Ensures all font resources and specific web fonts are definitively loaded and rendered
 * using the modern CSS Font Loading API (document.fonts).
 */
export async function preloadFonts(
  fontDescriptors: string[] = ['1em "Helvetica Neue ME"'],
  timeoutMs = 3500,
  signal?: AbortSignal
): Promise<{ success: boolean }> {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return { success: true };
  }

  const fontPromises: Promise<any>[] = [];

  // Wait for general document fonts ready state
  if (document.fonts.ready) {
    fontPromises.push(document.fonts.ready);
  }

  // Explicitly trigger loading for specified font faces
  for (const fontDesc of fontDescriptors) {
    try {
      if (typeof document.fonts.load === 'function') {
        fontPromises.push(document.fonts.load(fontDesc));
      }
    } catch {
      // Ignore unsupported font descriptor syntax
    }
  }

  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve({ success: false });
      }
    }, timeoutMs);

    const abortHandler = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve({ success: false });
      }
    };

    signal?.addEventListener('abort', abortHandler, { once: true });

    Promise.allSettled(fontPromises).then(() => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        signal?.removeEventListener('abort', abortHandler);
        resolve({ success: true });
      }
    });
  });
}

/**
 * Forces the browser to complete layout computation and execute a paint cycle
 * before the entrance animations begin.
 */
export function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.requestAnimationFrame) {
      setTimeout(resolve, 32);
      return;
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

export interface PreloadAllOptions {
  images: string[];
  criticalImages?: string[];
  fonts?: string[];
  onProgress?: ProgressCallback;
  signal?: AbortSignal;
  maxPerAssetTimeoutMs?: number;
  maxRetries?: number;
  overallTimeoutMs?: number;
  concurrencyLimit?: number;
}

/**
 * Preloads all visual and typographic assets in parallel with robust retry logic,
 * non-stalling error fallbacks, and font verification.
 */
export async function preloadAllAssets({
  images,
  criticalImages = [],
  fonts = ['1em "Helvetica Neue ME"'],
  onProgress,
  signal,
  maxPerAssetTimeoutMs = 4500,
  maxRetries = 2,
  overallTimeoutMs = 7000,
  concurrencyLimit = 4,
}: PreloadAllOptions): Promise<PreloadResult> {
  const startTime = Date.now();
  // Ensure critical images come first in parallel processing order
  const allUniqueImages = Array.from(new Set([...criticalImages, ...images].filter(Boolean)));
  const totalAssets = allUniqueImages.length + (fonts.length > 0 ? 1 : 0);
  let loadedCount = 0;
  const failedAssets: string[] = [];

  const notify = (assetName: string, success: boolean) => {
    if (signal?.aborted) return;
    loadedCount++;
    if (!success) {
      failedAssets.push(assetName);
    }
    const percentage = Math.min(100, Math.round((loadedCount / totalAssets) * 100));
    onProgress?.({
      loaded: loadedCount,
      total: totalAssets,
      percentage,
      currentAsset: assetName,
    });
  };

  // Overall watchdog timer to absolutely guarantee that on ultra-slow or hung networks,
  // the preloader never indefinitely stalls the entrance animation
  const watchdogPromise = new Promise<void>((resolve) => {
    setTimeout(resolve, overallTimeoutMs);
  });

  // Task queue with concurrency control
  const executeWithConcurrency = async () => {
    const queue = [...allUniqueImages];
    const workers: Promise<void>[] = [];

    const runWorker = async () => {
      while (queue.length > 0) {
        if (signal?.aborted) break;
        const url = queue.shift();
        if (!url) break;

        const isCritical = criticalImages.includes(url);
        const result = await preloadAndDecodeImageWithRetry(
          url,
          {
            timeoutMs: maxPerAssetTimeoutMs,
            maxRetries: isCritical ? Math.max(maxRetries, 2) : maxRetries,
          },
          signal
        );
        notify(url, result.success);
      }
    };

    const workerCount = Math.min(concurrencyLimit, allUniqueImages.length);
    for (let i = 0; i < workerCount; i++) {
      workers.push(runWorker());
    }

    // Font preloading task executed concurrently
    const fontTask = async () => {
      if (signal?.aborted || fonts.length === 0) return;
      const fontResult = await preloadFonts(fonts, 3500, signal);
      notify('fonts:all', fontResult.success);
    };

    await Promise.allSettled([...workers, fontTask()]);
  };

  // Race asset loading with the global watchdog
  await Promise.race([executeWithConcurrency(), watchdogPromise]);

  if (!signal?.aborted) {
    // Guarantee that layout is reflowed and textures are committed to GPU before return
    await waitForNextPaint();
  }

  const durationMs = Date.now() - startTime;
  return {
    success: failedAssets.length === 0,
    loadedCount,
    totalAssets,
    failedAssets,
    durationMs,
  };
}
