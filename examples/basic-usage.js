/**
 * Basic usage example for the Firecrawl Simple Client
 *
 * This example demonstrates how to:
 * 1. Create a client instance
 * 2. Scrape a webpage
 * 3. Start a crawl job
 * 4. Generate a sitemap
 *
 * To run this example:
 * 1. Install the package: npm install firecrawl-simple-client
 * 2. Run: node basic-usage.js
 */

import { FirecrawlClient } from 'firecrawl-simple-client';

// Create a client instance with custom configuration
const client = new FirecrawlClient({
    apiUrl: 'http://localhost:3002/v1', // Replace with your Firecrawl API URL
    apiKey: 'your-api-key', // Replace with your API key if required
});

// Helper function to wait for a specified time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main async function to run the examples
async function runExamples() {
    try {
        console.log('Firecrawl Simple Client Example');
        console.log('===============================');

        // 1. Scrape a webpage
        console.log('\n1. Scraping a webpage...');

        try {
            const scrapeResult = await client.scrapeWebpage({
                url: 'https://example.com',
                formats: ['markdown'],
                timeout: 30000, // Add timeout to prevent hanging requests
            });

            if (!scrapeResult) {
                throw new Error('Received empty response from scrape operation');
            }

            if (!scrapeResult.success) {
                throw new Error(`Scrape operation failed: ${scrapeResult.error || 'Unknown error'}`);
            }

            console.log('Scrape completed successfully');

            if (scrapeResult.data) {
                console.log('Scrape content length:',
                    scrapeResult.data.markdown?.length || 'N/A',
                    'characters (markdown)');
            } else {
                console.warn('Scrape completed but no data was returned');
            }
        } catch (error) {
            console.error('Error during scrape operation:', error.message);
            if (error.response) {
                console.error('Server response:', error.response.status, error.response.statusText);
            }
        }

        // 2. Start a crawl job
        console.log('\n2. Starting a crawl job...');

        let crawlResult = null;

        try {
            crawlResult = await client.startCrawl({
                url: 'https://example.com',
                maxDepth: 2,
                limit: 10,
                timeout: 60000, // Add timeout to prevent hanging requests
            });

            if (!crawlResult) {
                throw new Error('Received empty response from crawl operation');
            }

            if (!crawlResult.success) {
                throw new Error(`Crawl operation failed: ${crawlResult.error || 'Unknown error'}`);
            }

            console.log('Crawl job started:', crawlResult);

            // Check if we have a valid job ID
            if (!crawlResult.id) {
                throw new Error('No valid crawl job ID returned');
            }

            // Get crawl status with retry logic
            console.log('Checking crawl job status...');
            let retries = 3;
            let crawlStatus = null;

            while (retries > 0) {
                try {
                    crawlStatus = await client.getCrawlStatus(crawlResult.id);
                    break;
                } catch (statusError) {
                    retries--;
                    if (retries === 0) throw statusError;
                    console.log(`Error getting status, retrying... (${retries} attempts left)`);
                    await sleep(2000); // Wait 2 seconds before retrying
                }
            }

            console.log('Crawl status:', crawlStatus.status);
            console.log(`Progress: ${crawlStatus.completed || 0}/${crawlStatus.total || 0} pages`);

            if (crawlStatus.data && crawlStatus.data.length > 0) {
                console.log('Sample crawled page:', crawlStatus.data[0].metadata?.sourceURL || crawlStatus.data[0].url);
            }
        } catch (error) {
            console.error('Error during crawl operation:', error.message);
            if (error.response) {
                console.error('Server response:', error.response.status, error.response.statusText);
            }

            // Try to cancel the crawl job if it was started but then failed
            if (crawlResult && crawlResult.id) {
                try {
                    console.log('Attempting to cancel the failed crawl job...');
                    await client.cancelCrawl(crawlResult.id);
                    console.log('Crawl job cancelled successfully');
                } catch (cancelError) {
                    console.error('Failed to cancel crawl job:', cancelError.message);
                }
            }
        }

        // 3. Generate a sitemap
        console.log('\n3. Generating a sitemap...');

        try {
            const sitemapResult = await client.generateSitemap({
                url: 'https://example.com',
                limit: 100,
                timeout: 60000, // Add timeout to prevent hanging requests
                ignoreSitemap: true, // Explicitly set default values
            });

            if (!sitemapResult) {
                throw new Error('Received empty response from sitemap operation');
            }

            if (!sitemapResult.success) {
                throw new Error(`Sitemap operation failed: ${sitemapResult.error || 'Unknown error'}`);
            }

            console.log('Sitemap generated successfully');

            // Validate sitemap data
            if (!sitemapResult.links || !Array.isArray(sitemapResult.links)) {
                console.warn('Sitemap response does not contain a valid links array');
            } else {
                console.log(`Sitemap contains ${sitemapResult.links.length} links`);

                // Log a few sample links if available
                if (sitemapResult.links.length > 0) {
                    console.log('Sample links:');
                    sitemapResult.links.slice(0, 3).forEach((link, index) => {
                        console.log(`  ${index + 1}. ${link}`);
                    });
                } else {
                    console.warn('Sitemap was generated but no links were found');
                }
            }
        } catch (error) {
            console.error('Error generating sitemap:', error.message);
            if (error.response) {
                console.error('Server response:', error.response.status, error.response.statusText);

                if (error.response.status === 429) {
                    console.error('Rate limit exceeded. Please try again later.');
                } else if (error.response.status === 404) {
                    console.error('The specified URL could not be found or accessed.');
                }
            }
        }

        console.log('\nAll examples completed!');
    } catch (error) {
        console.error('Fatal error running examples:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Run the examples
runExamples().catch(error => {
    console.error('Unhandled error in runExamples:', error.message);
    process.exit(1);
});