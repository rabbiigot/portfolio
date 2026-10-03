import { Injectable, Logger } from '@nestjs/common';

interface CacheEntry {
  up: boolean;
  ts: number;
}

/**
 * Server-side reachability checks for external "live" URLs. The browser can't
 * cross-origin ping those domains, so the API does it and the frontend only
 * shows a "Live" link when the site actually responds. Results are cached so a
 * list request doesn't re-ping every URL.
 */
@Injectable()
export class UptimeService {
  private readonly logger = new Logger(UptimeService.name);
  private readonly cache = new Map<string, CacheEntry>();
  private readonly ttlMs = 5 * 60 * 1000; // 5 minutes
  private readonly timeoutMs = 6000;

  async check(url?: string | null): Promise<boolean> {
    if (!url) return false;
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.ts < this.ttlMs) return cached.up;

    const up = await this.ping(url);
    this.cache.set(url, { up, ts: Date.now() });
    return up;
  }

  /** Check many URLs in parallel; returns a url→up map. */
  async checkMany(urls: Array<string | null | undefined>): Promise<Map<string, boolean>> {
    const unique = [...new Set(urls.filter((u): u is string => !!u))];
    const results = await Promise.all(unique.map(async (u) => [u, await this.check(u)] as const));
    return new Map(results);
  }

  /**
   * A host that returns ANY HTTP response is "available". Only a network
   * error / DNS failure / timeout counts as down. HEAD first (cheap), GET as a
   * fallback for servers that reject HEAD.
   */
  private async ping(url: string): Promise<boolean> {
    for (const method of ['HEAD', 'GET'] as const) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        await fetch(url, { method, redirect: 'follow', signal: controller.signal });
        clearTimeout(timer);
        return true; // any response means the host is reachable
      } catch {
        clearTimeout(timer);
        // try the next method; if both fail, it's down
      }
    }
    this.logger.debug(`Uptime: ${url} unreachable`);
    return false;
  }
}
