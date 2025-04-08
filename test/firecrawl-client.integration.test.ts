import { describe, it, expect } from 'vitest';
import { FirecrawlClient } from '../src/firecrawl-client';

describe('Integration: FirecrawlClient with example.com', () => {
  const client = new FirecrawlClient();

  it('should scrape example.com and contain "Example Domain"', async () => {
    let response;
    try {
      response = await client.scrapeWebpage({
        url: 'https://example.com',
        formats: ['markdown'],
        waitFor: 0,
        timeout: 30000,
      });
    } catch (error) {
      throw new Error(`scrapeWebpage request failed: ${error}`);
    }

    expect(response).toBeDefined();
    expect(response.data).toBeDefined();
    expect(typeof response.data.markdown).toBe('string');
    expect(response.data.markdown).toContain('Example Domain');
  });

  it('should generate a sitemap for example.com containing the root URL', async () => {
    let sitemap;
    try {
      sitemap = await client.generateSitemap({
        url: 'https://example.com',
        limit: 10,
        includeSubdomains: false,
      });
    } catch (error) {
      throw new Error(`generateSitemap request failed: ${error}`);
    }

    expect(sitemap).toBeDefined();
    expect(Array.isArray(sitemap.links)).toBe(true);
    expect(sitemap.links.length).toBeGreaterThan(0);
    const hasRoot = sitemap.links.some(
      link => link === 'https://example.com' || link === 'https://example.com/',
    );
    expect(hasRoot).toBe(true);
  });

  it('should start a crawl job on example.com and retrieve results', async () => {
    let crawlJob;
    try {
      crawlJob = await client.startCrawl({
        url: 'https://example.com',
        maxDepth: 1,
        limit: 5,
      });
    } catch (error) {
      throw new Error(`startCrawl request failed: ${error}`);
    }

    expect(crawlJob).toBeDefined();
    expect(crawlJob.id).toBeDefined();

    // Poll for crawl status
    let status;
    const maxAttempts = 10;
    const delay = 2000; // 2 seconds
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        status = await client.getCrawlStatus(crawlJob.id);
      } catch (error) {
        throw new Error(`getCrawlStatus request failed: ${error}`);
      }

      if (status.status === 'completed' || status.status === 'failed') {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    expect(status).toBeDefined();
    expect(['completed', 'failed']).toContain(status.status);

    if (status.status === 'completed') {
      console.log('Crawl completed status object:', JSON.stringify(status, null, 2));
      if (!Array.isArray(status.data)) {
        throw new Error(
          `Crawl completed but 'data' is missing or not an array. Full status: ${JSON.stringify(status, null, 2)}`,
        );
      }
      const hasExample = status.data.some(
        page =>
          (typeof page.content === 'string' && page.content.includes('Example Domain')) ||
          (typeof page.markdown === 'string' && page.markdown.includes('Example Domain')) ||
          (typeof page.rawHtml === 'string' && page.rawHtml.includes('Example Domain')),
      );
      expect(hasExample).toBe(true);
    }
  });
});
