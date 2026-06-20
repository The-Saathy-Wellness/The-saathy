/**
 * fingerprint.ts
 * Generates a privacy-respecting device fingerprint from non-PII browser features.
 * Uses canvas rendering, timezone, screen resolution, platform, language, and
 * WebGL renderer info to produce a SHA-256 hash that is stable per-device but
 * cannot be reversed to identify a person.
 */

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";

    // Draw text with specific styling — rendering differences create unique output
    ctx.textBaseline = "top";
    ctx.font = '14px "Arial"';
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("Saathy 💜", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("companion", 4, 35);

    return canvas.toDataURL();
  } catch {
    return "canvas-error";
  }
}

function getWebGLRenderer(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "no-webgl";

    const debugInfo = (gl as WebGLRenderingContext).getExtension(
      "WEBGL_debug_renderer_info",
    );
    if (!debugInfo) return "no-debug-info";

    const renderer = (gl as WebGLRenderingContext).getParameter(
      debugInfo.UNMASKED_RENDERER_WEBGL,
    );
    return renderer || "unknown-renderer";
  } catch {
    return "webgl-error";
  }
}

/**
 * Generate a stable, privacy-respecting device fingerprint.
 * Returns a SHA-256 hex string (64 characters).
 */
export async function generateFingerprint(): Promise<string> {
  const signals: string[] = [
    // Screen properties
    `${screen.width}x${screen.height}`,
    `${screen.colorDepth}`,
    `${window.devicePixelRatio}`,

    // Timezone
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    `${new Date().getTimezoneOffset()}`,

    // Platform and language
    navigator.platform || "unknown-platform",
    navigator.language,
    (navigator.languages || []).join(","),

    // Hardware hints
    `${navigator.hardwareConcurrency || "unknown"}`,
    `${(navigator as any).deviceMemory || "unknown"}`,

    // Touch support
    `${navigator.maxTouchPoints || 0}`,

    // Canvas rendering fingerprint
    getCanvasFingerprint(),

    // WebGL renderer
    getWebGLRenderer(),
  ];

  const raw = signals.join("|");
  return sha256(raw);
}
