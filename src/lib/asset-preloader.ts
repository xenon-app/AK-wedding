"use client";

import { CRITICAL_ASSETS, SECONDARY_ASSETS, ALL_PAGE_ASSETS } from "./asset-manifest";

export interface PreloadStatus {
  total: number;
  loaded: number;
  failed: number;
  progress: number; // 0 to 100
  isCriticalReady: boolean;
  isAllReady: boolean;
}

// In-memory cache holding decoded Image elements to ensure the browser's
// raster cache retains the decoded bitmaps for instant first-frame rendering.
const inMemoryDecodedImages = new Map<string, HTMLImageElement>();
const inFlightPromises = new Map<string, Promise<boolean>>();

/**
 * Preloads and decodes an individual image with error resilience,
 * caching, and timeout safety.
 */
export function preloadAndDecodeImage(
  url: string,
  timeoutMs: number = 6000,
): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(true);
  }

  // If already decoded in memory, return immediately
  if (inMemoryDecodedImages.has(url)) {
    return Promise.resolve(true);
  }

  // If already in flight, reuse the same promise to prevent duplicate requests
  const existingPromise = inFlightPromises.get(url);
  if (existingPromise) {
    return existingPromise;
  }

  const promise = new Promise<boolean>((resolve) => {
    let resolved = false;
    const finish = (success: boolean) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        if (success) inMemoryDecodedImages.set(url, img);
        inFlightPromises.delete(url);
        resolve(success);
      }
    };

    const timer = setTimeout(() => {
      // Allow the caller to retry rather than treating a timeout as success.
      finish(false);
    }, timeoutMs);

    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";

    img.onload = () => {
      if (resolved) return;
      if ("decode" in img && typeof img.decode === "function") {
        img
          .decode()
          .then(() => finish(true))
          .catch(() => finish(false));
      } else {
        finish(true);
      }
    };

    img.onerror = () => {
      // Handle failed assets gracefully without blocking
      finish(false);
    };

    img.src = url;
  });

  inFlightPromises.set(url, promise);
  return promise;
}

/**
 * Ensures all web fonts (Cinzel, Cormorant Garamond, Montserrat, Gotu, etc.)
 * are fully loaded and rasterized in document.fonts.
 */
export function preloadFonts(timeoutMs: number = 4000): Promise<boolean> {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    let resolved = false;
    const finish = (success: boolean) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      resolve(success);
    };
    const timer = setTimeout(() => finish(false), timeoutMs);
    const requiredFonts = [
      '700 16px "Cinzel"',
      '400 16px "Cormorant"',
      '400 16px "Cormorant Infant"',
      '400 16px "Cormorant Upright"',
      "400 16px Gotu",
      '400 16px "Cormorant Garamond"',
      "400 16px Montserrat",
    ];

    Promise.all([
      document.fonts.ready,
      ...requiredFonts.map((font) => document.fonts.load(font)),
    ])
      .then(() => finish(true))
      .catch(() => finish(false));
  });
}

/**
 * Orchestrates complete asset preparation with Promise.allSettled:
 * 1. Preloads all critical first-viewport images & couple characters.
 * 2. Checks font readiness.
 * 3. Starts secondary image preloading after critical assets finish.
 * 4. Yields real-time progress callbacks for critical assets and fonts.
 */
export function startAssetPreloader(
  onProgress?: (status: PreloadStatus) => void,
): Promise<{ isReady: boolean }> {
  if (typeof window === "undefined") {
    return Promise.resolve({ isReady: true });
  }

  return new Promise((resolveReady) => {
    const totalCritical = CRITICAL_ASSETS.length;
    const total = totalCritical + 1;
    let loadedCount = 0;
    let failedCount = 0;
    let completedCount = 0;

    const report = (isAllReady = false) => {
      const progress = Math.round((completedCount / total) * 100);
      if (onProgress) {
        onProgress({
          total,
          loaded: loadedCount,
          failed: failedCount,
          progress,
          isCriticalReady: isAllReady && failedCount === 0,
          isAllReady: isAllReady && failedCount === 0,
        });
      }
    };

    const recordResult = (success: boolean) => {
      if (success) loadedCount++;
      else failedCount++;
      completedCount++;
      report();
    };

    const fontPromise = preloadFonts().then(
      recordResult,
      () => recordResult(false),
    );

    const criticalPromises = CRITICAL_ASSETS.map((url) =>
      preloadAndDecodeImage(url).then(
        recordResult,
        () => recordResult(false),
      ),
    );

    report();

    Promise.allSettled([fontPromise, ...criticalPromises]).then(() => {
      const isReady = failedCount === 0;
      report(true);
      resolveReady({ isReady });

      if (isReady) {
        void Promise.allSettled(
          SECONDARY_ASSETS.map((url) => preloadAndDecodeImage(url)),
        );
      }
    });
  });
}

