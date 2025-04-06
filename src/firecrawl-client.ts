/**
 * @file Main client implementation for the Firecrawl Simple API
 * @author Dmitriy Safonov
 */

import type { Client } from '@hey-api/client-axios';
import { createClient, createConfig } from '@hey-api/client-axios';
import {
  scrapeAndExtractFromUrl,
  cancelCrawl,
  getCrawlStatus,
  crawlUrls,
  mapUrls,
  ScrapeAndExtractFromUrlData,
  CrawlUrlsData,
  MapUrlsData,
} from './client/index';
import { FirecrawlConfig, DEFAULT_CONFIG } from './config';

/**
 * FirecrawlClient provides a clean, organized interface to the Firecrawl API.
 * It wraps the auto-generated SDK functions and organizes them into logical groups.
 *
 * @example
 * ```typescript
 * // Create a client with default configuration
 * const client = new FirecrawlClient();
 *
 * // Create a client with custom configuration
 * const clientWithConfig = new FirecrawlClient({
 *   apiUrl: 'https://api.firecrawl.com',
 *   apiKey: 'your-api-key',
 * });
 * ```
 */
export class FirecrawlClient {
  /**
   * The underlying HTTP client used to make API requests
   * @private
   */
  private client: Client;

  /**
   * The configuration for the client
   * @private
   */
  private config: FirecrawlConfig;

  /**
   * Creates a new FirecrawlClient instance.
   *
   * @param config - Configuration for the client. If not provided, default config will be used.
   *
   * @example
   * ```typescript
   * // Create with default config
   * const client = new FirecrawlClient();
   *
   * // Create with custom config
   * const client = new FirecrawlClient({
   *   apiUrl: 'https://api.firecrawl.com',
   *   apiKey: 'your-api-key',
   * });
   * ```
   */
  constructor(config: Partial<FirecrawlConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Create the client with the provided configuration
    this.client = createClient(
      createConfig({
        baseURL: this.config.apiUrl,
      }),
    );
  }

  /**
   * Get the headers for API requests, including authentication if an API key is provided.
   *
   * @returns An object containing the headers for API requests
   * @private
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  /**
   * Get the current client configuration.
   *
   * @returns A read-only copy of the configuration to prevent modification
   *
   * @example
   * ```typescript
   * const client = new FirecrawlClient();
   * const config = client.getConfig();
   * console.log(config.apiUrl); // http://localhost:3002/v1
   * ```
   */
  public getConfig(): Readonly<FirecrawlConfig> {
    return Object.freeze({ ...this.config });
  }

  // ===== Crawl Operations =====

  /**
   * Start a new web crawling job.
   *
   * @param options - Crawl options including URL, depth, and other parameters
   * @returns Promise with the crawl job details
   *
   * @example
   * ```typescript
   * const result = await client.startCrawl({
   *   url: 'https://example.com',
   *   maxDepth: 3,
   *   limit: 100
   * });
   * console.log(result.id); // The job ID for tracking
   * ```
   */
  public async startCrawl(options: Omit<CrawlUrlsData['body'], 'url'> & { url: string }) {
    const { url, ...rest } = options;

    const response = await crawlUrls({
      client: this.client,
      headers: this.getHeaders(),
      body: {
        url,
        ...rest,
      },
    });

    return response.data;
  }

  /**
   * Get the status of a crawl job.
   *
   * @param jobId - The ID of the crawl job
   * @returns Promise with the crawl job status and results
   *
   * @example
   * ```typescript
   * const status = await client.getCrawlStatus('job-123');
   * console.log(status.status); // 'scraping', 'completed', or 'failed'
   * console.log(status.data); // Array of crawled pages if completed
   * ```
   */
  public async getCrawlStatus(jobId: string) {
    const response = await getCrawlStatus({
      client: this.client,
      headers: this.getHeaders(),
      path: {
        id: jobId,
      },
    });

    return response.data;
  }

  /**
   * Cancel a running crawl job.
   *
   * @param jobId - The ID of the crawl job to cancel
   * @returns Promise with the cancellation result
   *
   * @example
   * ```typescript
   * const result = await client.cancelCrawl('job-123');
   * console.log(result.success); // true if successfully cancelled
   * ```
   */
  public async cancelCrawl(jobId: string) {
    const response = await cancelCrawl({
      client: this.client,
      headers: this.getHeaders(),
      path: {
        id: jobId,
      },
    });

    return response.data;
  }

  // ===== Scrape Operations =====

  /**
   * Scrape a single webpage and optionally extract information using an LLM.
   *
   * @param options - Scrape options including URL, formats, and other parameters
   * @returns Promise with the scrape results
   *
   * @example
   * ```typescript
   * const result = await client.scrapeWebpage({
   *   url: 'https://example.com',
   *   waitFor: 3000,
   *   formats: ['markdown', 'html']
   * });
   * console.log(result.data.markdown); // The markdown content of the page
   * ```
   */
  public async scrapeWebpage(
    options: Omit<ScrapeAndExtractFromUrlData['body'], 'url'> & { url: string },
  ) {
    const { url, ...rest } = options;

    const response = await scrapeAndExtractFromUrl({
      client: this.client,
      headers: this.getHeaders(),
      body: {
        url,
        ...rest,
      },
    });

    return response.data;
  }

  // ===== Map Operations =====

  /**
   * Generate a sitemap for a website.
   *
   * @param options - Map options including URL and other parameters
   * @returns Promise with the sitemap results
   *
   * @example
   * ```typescript
   * const result = await client.generateSitemap({
   *   url: 'https://example.com',
   *   includeSubdomains: false,
   *   limit: 1000
   * });
   * console.log(result.links); // Array of URLs found in the sitemap
   * ```
   */
  public async generateSitemap(options: Omit<MapUrlsData['body'], 'url'> & { url: string }) {
    const { url, ...rest } = options;

    const response = await mapUrls({
      client: this.client,
      headers: this.getHeaders(),
      body: {
        url,
        ...rest,
      },
    });

    return response.data;
  }

  // ===== Health Operations =====
}
