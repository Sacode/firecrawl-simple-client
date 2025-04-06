# Firecrawl Simple Client Examples

This directory contains examples demonstrating how to use the Firecrawl Simple Client.

## Examples

### Basic Usage (`basic-usage.js`)

A simple JavaScript example that demonstrates the core functionality of the client:

- Creating a client instance
- Scraping a webpage (synchronous operation)
- Starting a crawl job
- Checking the status of a crawl job
- Generating a sitemap

To run this example:

```bash
# Install the package
npm install firecrawl-simple-client

# Run the example
node basic-usage.js
```

### Advanced Usage (`advanced-usage.ts`)

A more complex TypeScript example that demonstrates advanced usage patterns:

- TypeScript integration with full type safety
- Error handling and retries with exponential backoff
- Parallel scrape operations
- Job status polling with timeout
- Cancellation of long-running jobs

To run this example:

```bash
# Install the package
npm install firecrawl-simple-client

# Install TypeScript if you don't have it
npm install -g typescript

# Compile the TypeScript file
tsc advanced-usage.ts

# Run the compiled JavaScript
node advanced-usage.js
```

## Configuration

Both examples use environment variables for configuration:

- `FIRECRAWL_API_URL`: The URL of the Firecrawl API (defaults to `http://localhost:3000`)
- `FIRECRAWL_API_KEY`: Your API key for authentication (optional)

You can set these environment variables before running the examples:

```bash
# On Windows
set FIRECRAWL_API_URL=https://api.firecrawl.com/v1
set FIRECRAWL_API_KEY=your-api-key

# On Linux/macOS
export FIRECRAWL_API_URL=https://api.firecrawl.com/v1
export FIRECRAWL_API_KEY=your-api-key
```

## Notes

- These examples assume you have a running Firecrawl Simple API server.
- If you're running the API server locally, make sure it's running on the default port (3000) or update the `apiUrl` in the examples.
- The examples use placeholder URLs (`example.com`, etc.). Replace them with actual URLs you want to crawl or scrape.
