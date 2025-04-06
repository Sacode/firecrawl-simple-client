# Firecrawl Simple API Client

[![npm version](https://img.shields.io/npm/v/firecrawl-simple-client.svg)](https://www.npmjs.com/package/firecrawl-simple-client)
[![Build Status](https://github.com/Sacode/firecrawl-simple-client/actions/workflows/ci.yml/badge.svg)](https://github.com/Sacode/firecrawl-simple-client/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)

A TypeScript API client library for Firecrawl Simple.

## What is Firecrawl Simple?

Firecrawl Simple is a stripped down and stable version of Firecrawl optimized for self-hosting and ease of contribution. Billing logic and AI features are completely removed.

## Installation

```bash
npm install firecrawl-simple-client
```

## Structure

The API client is organized for better flexibility and maintainability:

```
src/
├── firecrawl-client.ts - Main API client class implementation
├── config.ts           - Configuration types and defaults
├── index.ts            - Entry point exporting the API client and types
└── client/             - Auto-generated API client code
```

## Usage

### Creating a Client Instance

```typescript
import { FirecrawlClient } from 'firecrawl-simple-client';

// Create a client with default configuration (localhost:3002/v1)
const client = new FirecrawlClient();

// Create a client with custom configuration
const clientWithConfig = new FirecrawlClient({
  apiUrl: 'https://api.firecrawl.com/v1',
  apiKey: 'your-api-key',
});
```

### Basic Usage

```typescript
import { FirecrawlClient } from 'firecrawl-simple-client';

const client = new FirecrawlClient({
  apiUrl: 'https://api.firecrawl.com/v1',
  apiKey: 'your-api-key',
});

// Start a crawl job
const crawlResult = await client.startCrawl({
  url: 'https://example.com',
  maxDepth: 3,
  limit: 100 // Changed from maxPages to limit
});

// Check crawl status
const crawlStatus = await client.getCrawlStatus(crawlResult.id);

// Cancel a crawl job
await client.cancelCrawl(crawlResult.id);

// Scrape a single webpage (synchronous operation)
const scrapeResult = await client.scrapeWebpage({
  url: 'https://example.com',
  waitFor: 0, // Time in ms to wait for JavaScript execution
  formats: ['markdown', 'html'],
  timeout: 30000
});

// Access scrape results directly
console.log(scrapeResult.data.markdown);

// Generate a sitemap
const sitemapResult = await client.generateSitemap({
  url: 'https://example.com'
});

// Check API health
const liveness = await client.checkLiveness();
const readiness = await client.checkReadiness();
```

## Configuration

The client can be configured when creating an instance:

```typescript
import { FirecrawlClient } from 'firecrawl-simple-client';

// Default configuration
const DEFAULT_CONFIG = {
  apiUrl: 'http://localhost:3002/v1',
};

// Create a client with custom configuration
const client = new FirecrawlClient({
  apiUrl: 'https://api.firecrawl.com/v1',
  apiKey: 'your-api-key',
});

// Get the current configuration
const config = client.getConfig();
console.log(config);
```

## API Reference

### FirecrawlClient

The main client class for interacting with the Firecrawl API.

#### Constructor

```typescript
new FirecrawlClient(config?: Partial<FirecrawlConfig>)
```

#### Methods

- `getConfig()`: Returns the current configuration
- `startCrawl(options)`: Start a new web crawling job
- `getCrawlStatus(jobId)`: Get the status of a crawl job
- `cancelCrawl(jobId)`: Cancel a running crawl job
- `scrapeWebpage(options)`: Scrape a single webpage (synchronous operation)
- `generateSitemap(options)`: Generate a sitemap for a website

#### Deprecated Methods

- `getScrapeStatus(jobId)`: Deprecated as scrape operations are now synchronous
- `checkLiveness()`: No longer supported in the new API
- `checkReadiness()`: No longer supported in the new API

### Scrape Options

```typescript
{
  url: string;                  // The URL to scrape (required)
  formats?: Array<string>;      // Formats to include: 'markdown', 'html', 'rawHtml', 'links', 'screenshot', 'extract', 'screenshot@fullPage'
  includeTags?: Array<string>;  // HTML tags to include in the result
  excludeTags?: Array<string>;  // HTML tags to exclude from the result
  headers?: object;             // Custom headers for the request
  waitFor?: number;             // Time in ms to wait for JavaScript execution
  timeout?: number;             // Request timeout in milliseconds
  extract?: {                   // LLM extraction configuration
    schema?: object;            // Schema for structured data extraction
    systemPrompt?: string;      // System prompt for extraction
    prompt?: string;            // User prompt for extraction
  }
}
```

### Crawl Options

```typescript
{
  url: string;                  // The URL to start crawling from (required)
  maxDepth?: number;            // Maximum depth to crawl
  limit?: number;               // Maximum number of pages to crawl (formerly maxPages)
  includePaths?: Array<string>; // URL patterns to include (formerly includeUrls)
  excludePaths?: Array<string>; // URL patterns to exclude (formerly excludeUrls)
  ignoreSitemap?: boolean;      // Whether to ignore the website's sitemap
  allowBackwardLinks?: boolean; // Allow navigation to previously linked pages
  allowExternalLinks?: boolean; // Allow following links to external websites
  scrapeOptions?: object;       // Options for scraping each page
}
```

### Error Handling

The API may return the following error codes:

- `402`: Payment Required - You've exceeded your usage limits
- `429`: Too Many Requests - Rate limit exceeded
- `404`: Not Found - Resource not found
- `500`: Server Error - Internal server error

## License

MIT
