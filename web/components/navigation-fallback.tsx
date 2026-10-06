"use client";

import { useEffect } from "react";

/**
 * vinext currently intercepts internal anchors on Cloudflare before the browser
 * can follow them. Keep page navigation reliable by delegating those links to
 * the browser while preserving hashes, downloads, new tabs and modified clicks.
 */
export function NavigationFallback() {
  useEffect(() => {
    const navigate = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search && destination.hash) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(destination.href);
    };

    window.addEventListener("click", navigate, true);
    return () => window.removeEventListener("click", navigate, true);
  }, []);

  return null;
}
