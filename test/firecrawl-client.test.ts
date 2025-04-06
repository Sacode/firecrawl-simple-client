import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FirecrawlClient } from '../src/firecrawl-client';
import { DEFAULT_CONFIG } from '../src/config';
import * as sdk from '../src/client/sdk.gen';

// Mock the SDK functions
vi.mock('../src/client/sdk.gen', async () => {
  const actual = await vi.importActual('../src/client/sdk.gen');
  return {
    ...actual,
    crawlUrls: vi.fn(),
    getCrawlStatus: vi.fn(),
    cancelCrawl: vi.fn(),
    scrapeAndExtractFromUrl: vi.fn(),
    mapUrls: vi.fn(),
  };
});

describe('FirecrawlClient', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ===== Constructor and Configuration Tests =====
  describe('Constructor and Configuration', () => {
    it('should initialize with default config when no config is provided', () => {
      const client = new FirecrawlClient();
      const config = client.getConfig();

      expect(config).toEqual(DEFAULT_CONFIG);
      expect(config.apiUrl).toBe('http://localhost:3002/v1');
      expect(config.apiKey).toBeUndefined();
    });

    it('should initialize with custom config when provided', () => {
      const customConfig = {
        apiUrl: 'https://api.example.com',
        apiKey: 'test-api-key',
      };

      const client = new FirecrawlClient(customConfig);
      const config = client.getConfig();

      expect(config).toEqual(customConfig);
      expect(config.apiUrl).toBe('https://api.example.com');
      expect(config.apiKey).toBe('test-api-key');
    });

    it('should merge custom config with default config', () => {
      const partialConfig = {
        apiKey: 'test-api-key',
      };

      const client = new FirecrawlClient(partialConfig);
      const config = client.getConfig();

      expect(config.apiUrl).toBe(DEFAULT_CONFIG.apiUrl);
      expect(config.apiKey).toBe('test-api-key');
    });

    it('should return a frozen copy of the config from getConfig', () => {
      const client = new FirecrawlClient();
      const config = client.getConfig();

      expect(() => {
        // @ts-expect-error - Testing that the object is frozen
        config.apiUrl = 'https://modified.example.com';
      }).toThrow();
    });
  });

  // ===== Crawl Operations Tests =====
  describe('Crawl Operations', () => {
    it('should start a crawl job successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          id: 'test-job-id',
          url: 'https://example.com',
        },
      };

      vi.mocked(sdk.crawlUrls).mockResolvedValue(mockResponse as any);

      const client = new FirecrawlClient({ apiKey: 'test-api-key' });
      const options = {
        url: 'https://example.com',
        maxDepth: 2,
        limit: 10,
      };

      const result = await client.startCrawl(options);

      expect(result).toEqual(mockResponse.data);
      expect(sdk.crawlUrls).toHaveBeenCalledWith({
        client: expect.anything(),
        headers: {
          Authorization: 'Bearer test-api-key',
        },
        body: options,
      });
    });

    it('should handle errors when starting a crawl job', async () => {
      const errorMessage = 'API Error';
      vi.mocked(sdk.crawlUrls).mockRejectedValue(new Error(errorMessage));

      const client = new FirecrawlClient();
      const options = {
        url: 'https://example.com',
      };

      await expect(client.startCrawl(options)).rejects.toThrow(errorMessage);
    });

    it('should get crawl status successfully', async () => {
      const mockResponse = {
        data: {
          status: 'completed',
          pages: [
            {
              url: 'https://example.com',
              content: '<html>...</html>',
            },
          ],
        },
      };

      vi.mocked(sdk.getCrawlStatus).mockResolvedValue(mockResponse as any);

      const client = new FirecrawlClient({ apiKey: 'test-api-key' });
      const jobId = 'test-job-id';

      const result = await client.getCrawlStatus(jobId);

      expect(result).toEqual(mockResponse.data);
      expect(sdk.getCrawlStatus).toHaveBeenCalledWith({
        client: expect.anything(),
        headers: {
          Authorization: 'Bearer test-api-key',
        },
        path: {
          id: jobId,
        },
      });
    });

    it('should handle errors when getting crawl status', async () => {
      const errorMessage = 'API Error';
      vi.mocked(sdk.getCrawlStatus).mockRejectedValue(new Error(errorMessage));

      const client = new FirecrawlClient();
      const jobId = 'test-job-id';

      await expect(client.getCrawlStatus(jobId)).rejects.toThrow(errorMessage);
    });

    it('should cancel a crawl job successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
        },
      };

      vi.mocked(sdk.cancelCrawl).mockResolvedValue(mockResponse as any);

      const client = new FirecrawlClient({ apiKey: 'test-api-key' });
      const jobId = 'test-job-id';

      const result = await client.cancelCrawl(jobId);

      expect(result).toEqual(mockResponse.data);
      expect(sdk.cancelCrawl).toHaveBeenCalledWith({
        client: expect.anything(),
        headers: {
          Authorization: 'Bearer test-api-key',
        },
        path: {
          id: jobId,
        },
      });
    });

    it('should handle errors when canceling a crawl job', async () => {
      const errorMessage = 'API Error';
      vi.mocked(sdk.cancelCrawl).mockRejectedValue(new Error(errorMessage));

      const client = new FirecrawlClient();
      const jobId = 'test-job-id';

      await expect(client.cancelCrawl(jobId)).rejects.toThrow(errorMessage);
    });
  });

  // ===== Scrape Operations Tests =====
  describe('Scrape Operations', () => {
    it('should scrape a webpage successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          jobId: 'test-job-id',
        },
      };

      vi.mocked(sdk.scrapeAndExtractFromUrl).mockResolvedValue(mockResponse as any);

      const client = new FirecrawlClient({ apiKey: 'test-api-key' });
      const options = {
        url: 'https://example.com',
        waitFor: 0,
        timeout: 30000,
      };

      const result = await client.scrapeWebpage(options);

      expect(result).toEqual(mockResponse.data);
      expect(sdk.scrapeAndExtractFromUrl).toHaveBeenCalledWith({
        client: expect.anything(),
        headers: {
          Authorization: 'Bearer test-api-key',
        },
        body: options,
      });
    });

    it('should handle errors when scraping a webpage', async () => {
      const errorMessage = 'API Error';
      vi.mocked(sdk.scrapeAndExtractFromUrl).mockRejectedValue(new Error(errorMessage));

      const client = new FirecrawlClient();
      const options = {
        url: 'https://example.com',
      };

      await expect(client.scrapeWebpage(options)).rejects.toThrow(errorMessage);
    });
  });

  // ===== Map Operations Tests =====
  describe('Map Operations', () => {
    it('should generate a sitemap successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          links: [
            'https://example.com',
            'https://example.com/about',
            'https://example.com/contact',
          ],
        },
      };

      vi.mocked(sdk.mapUrls).mockResolvedValue(mockResponse as any);

      const client = new FirecrawlClient({ apiKey: 'test-api-key' });
      const options = {
        url: 'https://example.com',
      };

      const result = await client.generateSitemap(options);

      expect(result).toEqual(mockResponse.data);
      expect(sdk.mapUrls).toHaveBeenCalledWith({
        client: expect.anything(),
        headers: {
          Authorization: 'Bearer test-api-key',
        },
        body: options,
      });
    });

    it('should handle errors when generating a sitemap', async () => {
      const errorMessage = 'API Error';
      vi.mocked(sdk.mapUrls).mockRejectedValue(new Error(errorMessage));

      const client = new FirecrawlClient();
      const options = {
        url: 'https://example.com',
      };

      await expect(client.generateSitemap(options)).rejects.toThrow(errorMessage);
    });
  });

  // ===== Headers Tests =====
  describe('Headers Handling', () => {
    it('should not include Authorization header when no API key is provided', async () => {
      const mockResponse = {
        data: {
          success: true,
          id: 'test-job-id',
          url: 'https://example.com',
        },
      };

      vi.mocked(sdk.crawlUrls).mockResolvedValue(mockResponse as any);

      const client = new FirecrawlClient(); // No API key
      const options = {
        url: 'https://example.com',
      };

      await client.startCrawl(options);

      expect(sdk.crawlUrls).toHaveBeenCalledWith({
        client: expect.anything(),
        headers: {}, // Empty headers
        body: options,
      });
    });

    it('should include Authorization header when API key is provided', async () => {
      const mockResponse = {
        data: {
          success: true,
          id: 'test-job-id',
          url: 'https://example.com',
        },
      };

      vi.mocked(sdk.crawlUrls).mockResolvedValue(mockResponse as any);

      const client = new FirecrawlClient({ apiKey: 'test-api-key' });
      const options = {
        url: 'https://example.com',
      };

      await client.startCrawl(options);

      expect(sdk.crawlUrls).toHaveBeenCalledWith({
        client: expect.anything(),
        headers: {
          Authorization: 'Bearer test-api-key',
        },
        body: options,
      });
    });
  });
});
