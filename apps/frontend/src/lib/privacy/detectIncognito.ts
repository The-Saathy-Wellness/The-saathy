/**
 * detectIncognito.ts
 * Multi-signal browser private/incognito mode detection.
 * Uses storage quota, FileSystem API, and Safari-specific checks.
 * Returns true if the browser appears to be in private browsing mode.
 */

export async function detectIncognito(): Promise<boolean> {
  // Signal 1: Storage Quota — Incognito usually has very low storage quotas
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      // Chrome incognito typically reports ~120MB quota vs several GB in normal mode
      if (estimate.quota && estimate.quota < 200 * 1024 * 1024) {
        return true;
      }
    } catch {
      // Estimation failed — some private browsers restrict this API
    }
  }

  // Signal 2: FileSystem API — Chrome incognito throws on requestFileSystem
  if ("webkitRequestFileSystem" in window) {
    try {
      await new Promise<void>((resolve, reject) => {
        // @ts-expect-error — webkitRequestFileSystem is non-standard
        window.webkitRequestFileSystem(
          0, // TEMPORARY
          1,
          () => resolve(),
          () => reject(new Error("FileSystem denied")),
        );
      });
    } catch {
      return true; // FileSystem denied = incognito in Chrome
    }
  }

  // Signal 3: Safari — ServiceWorker is disabled in private mode
  if (
    /Safari/.test(navigator.userAgent) &&
    !/Chrome/.test(navigator.userAgent)
  ) {
    if (!("serviceWorker" in navigator)) {
      return true;
    }
  }

  // Signal 4: IndexedDB — Firefox private mode throws on open
  try {
    const testDb = indexedDB.open("__saathy_private_test__");
    await new Promise<void>((resolve, reject) => {
      testDb.onerror = () => reject(new Error("IndexedDB blocked"));
      testDb.onsuccess = () => {
        testDb.result.close();
        // Clean up the test database
        indexedDB.deleteDatabase("__saathy_private_test__");
        resolve();
      };
    });
  } catch {
    return true;
  }

  return false;
}
