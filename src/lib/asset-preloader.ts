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
        resolve(success);
      }
    };

    const timer = setTimeout(() => {
      // Timeout fallback: don't block the app if an asset is slow
      finish(false);
    }, timeoutMs);

    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";

    img.onload = () => {
      inMemoryDecodedImages.set(url, img);
      if ("decode" in img && typeof img.decode === "function") {
        img
          .decode()
          .then(() => finish(true))
          .catch(() => finish(true)); // Image is loaded even if decode fails
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
 * Ensures all web fonts (Cinzel, Cormorant Garamond, Montserrat, etc.)
 * are fully loaded and rasterized in document.fonts.
 */
export function preloadFonts(timeoutMs: number = 4000): Promise<boolean> {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(true), timeoutMs);
    document.fonts.ready
      .then(() => {
        clearTimeout(timer);
        resolve(true);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(true);
      });
  });
}

/**
 * Orchestrates complete asset preparation with Promise.allSettled:
 * 1. Preloads all critical first-viewport images & couple characters.
 * 2. Checks font readiness.
 * 3. Preloads secondary images in parallel.
 * 4. Yields real-time progress callbacks.
 */
export function startAssetPreloader(
  onProgress?: (status: PreloadStatus) => void,
): Promise<{ isReady: boolean }> {
  if (typeof window === "undefined") {
    return Promise.resolve({ isReady: true });
  }

  return new Promise((resolveReady) => {
    const totalCritical = CRITICAL_ASSETS.length;
    let loadedCount = 0;
    let failedCount = 0;
    let criticalResolved = false;

    const report = () => {
      const progress = Math.min(
        100,
        Math.round((loadedCount / Math.max(1, totalCritical)) * 100),
      );
      if (onProgress) {
        onProgress({
          total: totalCritical,
          loaded: loadedCount,
          failed: failedCount,
          progress,
          isCriticalReady: criticalResolved,
          isAllReady: false,
        });
      }
    };

    // Safety timeout: Maximum 6.5 seconds waiting time under any circumstance
    const safetyTimer = setTimeout(() => {
      if (!criticalResolved) {
        criticalResolved = true;
        resolveReady({ isReady: true });
      }
    }, 6500);

    // Font readiness promise
    const fontPromise = preloadFonts(3500);

    // Critical images promises
    const criticalPromises = CRITICAL_ASSETS.map((url) =>
      preloadAndDecodeImage(url).then((success) => {
        if (success) loadedCount++;
        else failedCount++;
        report();
      }),
    );

    // When all critical assets and fonts are settled:
    Promise.allSettled([fontPromise, ...criticalPromises]).then(() => {
      clearTimeout(safetyTimer);
      if (!criticalResolved) {
        criticalResolved = true;
        report();
        resolveReady({ isReady: true });
      }
    });

    // Secondary assets continue warming in parallel without blocking the initial view
    Promise.allSettled(
      SECONDARY_ASSETS.map((url) => preloadAndDecodeImage(url)),
    ).catch(() => {});
  });
}

