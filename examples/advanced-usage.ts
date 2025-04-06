/**
 * Advanced usage example for the Firecrawl Simple Client
 *
 * This example demonstrates:
 * 1. TypeScript integration with full type safety
 * 2. Error handling and retries
 * 3. Parallel operations
 * 4. Cancellation of long-running jobs
 *
 * To run this example:
 * 1. Install the package: npm install firecrawl-simple-client
 * 2. Compile: tsc advanced-usage.ts
 * 3. Run: node advanced-usage.js
 */

import {
  FirecrawlClient,
  CrawlUrlsData,
  ScrapeAndExtractFromUrlData,
} from 'firecrawl-simple-client';

// Create a client instance
const client = new FirecrawlClient({
  apiUrl: process.env.FIRECRAWL_API_URL || 'http://localhost:3002/v1',
  apiKey: process.env.FIRECRAWL_API_KEY,
});

// Helper function to wait for a specified time
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry an operation with exponential backoff
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      lastError = error as Error;
      await sleep(delay);
      delay *= 2; // Exponential backoff
    }
  }

  throw new Error(`Operation failed after ${maxRetries} attempts: ${lastError?.message}`);
}

// Generic type for status responses
interface StatusResponse {
  status: string;
  [key: string]: any;
}

// Function to poll for job completion with timeout
async function pollUntilComplete<T extends StatusResponse>(
  jobId: string,
  checkStatus: () => Promise<T>,
  timeoutMs: number = 60000,
  intervalMs: number = 1000,
): Promise<T> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const status = await checkStatus();

    if (status && status.status === 'completed') {
      return status;
    }

    if (status && status.status === 'failed') {
      throw new Error(`Job failed: ${JSON.stringify(status)}`);
    }

    await sleep(intervalMs);
  }

  throw new Error(`Operation timed out after ${timeoutMs}ms`);
}

// Main async function to run the examples
async function runAdvancedExamples() {
  try {
    console.log('Firecrawl Simple Client Advanced Example');
    console.log('=======================================');

    // 1. Run multiple scrape operations in parallel
    console.log('\n1. Running parallel scrape operations...');
    const urls = ['https://example.com', 'https://example.org', 'https://example.net'];

    // Define scrape options with proper typing
    const scrapeOptions: Omit<ScrapeAndExtractFromUrlData['body'], 'url'> & { url: string } = {
      url: '', // Will be overridden for each request
      formats: ['markdown', 'rawHtml'],
      timeout: 30000,
      waitFor: 0,
    };

    const scrapePromises = urls.map(url =>
      client.scrapeWebpage({
        ...scrapeOptions,
        url,
      }),
    );

    const scrapeResults = await Promise.all(scrapePromises);

    // Process the direct results
    const successfulScrapes = scrapeResults.filter(result => result?.success);
    console.log(`Successfully scraped ${successfulScrapes.length} out of ${urls.length} URLs`);

    // 2. Start a crawl job with type-safe options
    console.log('\n2. Starting a crawl job with type-safe options...');

    // Define crawl options with TypeScript type safety
    const crawlOptions: Omit<CrawlUrlsData['body'], 'url'> & { url: string } = {
      url: 'https://example.com',
      maxDepth: 3,
      limit: 50, // Changed from maxPages to limit
      // Use the actual properties from the new API schema
      includePaths: ['/blog', '/docs'], // Changed from includeUrls to includePaths
      excludePaths: ['/login', '/admin'], // Changed from excludeUrls to excludePaths
      scrapeOptions: {
        formats: ['markdown', 'rawHtml'],
        waitFor: 0,
      },
    };

    const crawlResult = await client.startCrawl(crawlOptions);
    console.log('Crawl job started:', crawlResult);

    // 3. Poll for crawl completion with timeout
    console.log('\n3. Polling for crawl completion with timeout...');
    try {
      // Ensure crawlResult.id exists before using it
      if (crawlResult && crawlResult.id) {
        const jobId = crawlResult.id; // Store in a constant to ensure it's not undefined
        const completedCrawl = await pollUntilComplete(
          jobId,
          async () => {
            const status = await client.getCrawlStatus(jobId);
            // Ensure the status has the required structure
            return status as StatusResponse;
          },
          30000, // 30 second timeout
        );
        console.log('Crawl completed successfully:', completedCrawl);
      } else {
        console.log('No valid crawl job ID returned');
      }
    } catch (error) {
      console.log('Crawl polling failed or timed out, cancelling job...');
      // Ensure crawlResult.id exists before using it
      if (crawlResult && crawlResult.id) {
        await client.cancelCrawl(crawlResult.id);
        console.log('Crawl job cancelled');
      }
    }

    // 4. Error handling for non-existent job
    console.log('\n4. Demonstrating error handling...');
    try {
      await client.getCrawlStatus('non-existent-job-id');
    } catch (error) {
      console.log('Expected error caught:', (error as Error).message);
    }

    console.log('\nAll advanced examples completed!');
  } catch (error) {
    console.error('Unhandled error in examples:', error);
    process.exit(1);
  }
}

// Run the examples
runAdvancedExamples();
