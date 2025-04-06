/**
 * @file Configuration types and defaults for the Firecrawl API client
 * @author Dmitriy Safonov
 */

/**
 * Configuration for the Firecrawl API client
 *
 * @interface FirecrawlConfig
 */
export interface FirecrawlConfig {
  /**
   * The URL of the Firecrawl API server
   *
   * @example 'http://localhost:3002/v1'
   * @example 'https://api.firecrawl.com/v1'
   */
  apiUrl: string;

  /**
   * The API key for authentication with the Firecrawl API
   * If not provided, requests will be made without authentication
   *
   * @example 'your-api-key-here'
   */
  apiKey?: string;
}

/**
 * Default configuration values used when creating a client without explicit configuration
 *
 * @const DEFAULT_CONFIG
 */
export const DEFAULT_CONFIG: FirecrawlConfig = {
  apiUrl: 'http://localhost:3002/v1',
};
