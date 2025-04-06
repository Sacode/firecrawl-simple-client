/**
 * @file Firecrawl Simple Client - Entry point
 * @description A TypeScript API client library for Firecrawl Simple
 * @author Dmitriy Safonov
 * @version 0.1.0
 */

/**
 * Export the main client class for creating instances of the Firecrawl client
 *
 * @example
 * ```typescript
 * import { FirecrawlClient } from 'firecrawl-simple-client';
 *
 * const client = new FirecrawlClient({
 *   apiUrl: 'https://api.firecrawl.com',
 *   apiKey: 'your-api-key',
 * });
 * ```
 */
export { FirecrawlClient } from './firecrawl-client';

/**
 * Export configuration types and default values
 *
 * @example
 * ```typescript
 * import { FirecrawlConfig, DEFAULT_CONFIG } from 'firecrawl-simple-client';
 *
 * // Use default config as a base
 * const config: FirecrawlConfig = {
 *   ...DEFAULT_CONFIG,
 *   apiKey: 'your-api-key',
 * };
 * ```
 */
export { FirecrawlConfig, DEFAULT_CONFIG } from './config';

/**
 * Export types from the generated SDK for advanced usage
 * These types are useful when you need to work with the raw API responses
 * or when you need to create custom request parameters
 */
export {
  // Scrape types
  ScrapeAndExtractFromUrlData,
  ScrapeAndExtractFromUrlResponse,
  ScrapeAndExtractFromUrlError,

  // Crawl types
  CrawlUrlsData,
  CrawlUrlsResponse,
  CrawlUrlsError,
  GetCrawlStatusData,
  GetCrawlStatusResponse,
  GetCrawlStatusError,
  CancelCrawlData,
  CancelCrawlResponse,
  CancelCrawlError,

  // Map types
  MapUrlsData,
  MapUrlsResponse,
  MapUrlsError,
} from './client/index';
