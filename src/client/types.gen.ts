// This file is auto-generated by @hey-api/openapi-ts

export type ScrapeResponse = {
    success?: boolean;
    data?: {
        markdown?: string;
        /**
         * Raw HTML content of the page if `rawHtml` is in `formats`
         */
        rawHtml?: string | null;
        /**
         * Screenshot of the page if `screenshot` is in `formats`
         */
        screenshot?: string | null;
        /**
         * List of links on the page if `links` is in `formats`
         */
        links?: Array<string>;
        metadata?: {
            title?: string;
            description?: string;
            language?: string | null;
            sourceURL?: string;
            '<any other metadata>'?: string;
            /**
             * The status code of the page
             */
            statusCode?: number;
            /**
             * The error message of the page
             */
            error?: string | null;
        };
        /**
         * Can be displayed when using LLM Extraction. Warning message will let you know any issues with the extraction.
         */
        warning?: string | null;
    };
};

export type CrawlStatusResponseObj = {
    /**
     * The current status of the crawl. Can be `scraping`, `completed`, or `failed`.
     */
    status?: string;
    /**
     * The total number of pages that were attempted to be crawled.
     */
    total?: number;
    /**
     * The number of pages that have been successfully crawled.
     */
    completed?: number;
    /**
     * The date and time when the crawl will expire.
     */
    expiresAt?: string;
    /**
     * The URL to retrieve the next 10MB of data. Returned if the crawl is not completed or if the response is larger than 10MB.
     */
    next?: string | null;
    /**
     * The data of the crawl.
     */
    data?: Array<{
        markdown?: string;
        /**
         * Raw HTML content of the page if `includeRawHtml`  is true
         */
        rawHtml?: string | null;
        /**
         * List of links on the page if `includeLinks` is true
         */
        links?: Array<string>;
        /**
         * Screenshot of the page if `includeScreenshot` is true
         */
        screenshot?: string | null;
        metadata?: {
            title?: string;
            description?: string;
            language?: string | null;
            sourceURL?: string;
            '<any other metadata>'?: string;
            /**
             * The status code of the page
             */
            statusCode?: number;
            /**
             * The error message of the page
             */
            error?: string | null;
        };
    }>;
};

export type CrawlResponse = {
    success?: boolean;
    id?: string;
    url?: string;
};

export type MapResponse = {
    success?: boolean;
    links?: Array<string>;
};

export type ScrapeAndExtractFromUrlData = {
    body: {
        /**
         * The URL to scrape
         */
        url: string;
        /**
         * Formats to include in the output.
         */
        formats?: Array<'markdown' | 'rawHtml' | 'screenshot'>;
        /**
         * Tags to include in the output.
         */
        includeTags?: Array<string>;
        /**
         * Tags to exclude from the output.
         */
        excludeTags?: Array<string>;
        /**
         * Headers to send with the request. Can be used to send cookies, user-agent, etc.
         */
        headers?: {
            [key: string]: unknown;
        };
        /**
         * Specify a delay in milliseconds before fetching the content, allowing the page sufficient time to load.
         */
        waitFor?: number;
        /**
         * Timeout in milliseconds for the request
         */
        timeout?: number;
    };
    path?: never;
    query?: never;
    url: '/scrape';
};

export type ScrapeAndExtractFromUrlErrors = {
    /**
     * Payment required
     */
    402: {
        error?: string;
    };
    /**
     * Too many requests
     */
    429: {
        error?: string;
    };
    /**
     * Server error
     */
    500: {
        error?: string;
    };
};

export type ScrapeAndExtractFromUrlError = ScrapeAndExtractFromUrlErrors[keyof ScrapeAndExtractFromUrlErrors];

export type ScrapeAndExtractFromUrlResponses = {
    /**
     * Successful response
     */
    200: ScrapeResponse;
};

export type ScrapeAndExtractFromUrlResponse = ScrapeAndExtractFromUrlResponses[keyof ScrapeAndExtractFromUrlResponses];

export type CancelCrawlData = {
    body?: never;
    path: {
        /**
         * The ID of the crawl job
         */
        id: string;
    };
    query?: never;
    url: '/crawl/{id}';
};

export type CancelCrawlErrors = {
    /**
     * Crawl job not found
     */
    404: {
        error?: string;
    };
    /**
     * Server error
     */
    500: {
        error?: string;
    };
};

export type CancelCrawlError = CancelCrawlErrors[keyof CancelCrawlErrors];

export type CancelCrawlResponses = {
    /**
     * Successful cancellation
     */
    200: {
        success?: boolean;
        message?: string;
    };
};

export type CancelCrawlResponse = CancelCrawlResponses[keyof CancelCrawlResponses];

export type GetCrawlStatusData = {
    body?: never;
    path: {
        /**
         * The ID of the crawl job
         */
        id: string;
    };
    query?: never;
    url: '/crawl/{id}';
};

export type GetCrawlStatusErrors = {
    /**
     * Payment required
     */
    402: {
        error?: string;
    };
    /**
     * Too many requests
     */
    429: {
        error?: string;
    };
    /**
     * Server error
     */
    500: {
        error?: string;
    };
};

export type GetCrawlStatusError = GetCrawlStatusErrors[keyof GetCrawlStatusErrors];

export type GetCrawlStatusResponses = {
    /**
     * Successful response
     */
    200: CrawlStatusResponseObj;
};

export type GetCrawlStatusResponse = GetCrawlStatusResponses[keyof GetCrawlStatusResponses];

export type CrawlUrlsData = {
    body: {
        /**
         * The base URL to start crawling from
         */
        url: string;
        /**
         * URL patterns to exclude
         */
        excludePaths?: Array<string>;
        /**
         * URL patterns to include
         */
        includePaths?: Array<string>;
        /**
         * Maximum depth to crawl relative to the entered URL.
         */
        maxDepth?: number;
        /**
         * Ignore the website sitemap when crawling
         */
        ignoreSitemap?: boolean;
        /**
         * Maximum number of pages to crawl
         */
        limit?: number;
        /**
         * Enables the crawler to navigate from a specific URL to previously linked pages.
         */
        allowBackwardLinks?: boolean;
        /**
         * Allows the crawler to follow links to external websites.
         */
        allowExternalLinks?: boolean;
        /**
         * The URL to send the webhook to. This will trigger for every page crawled and return the specified formats along with the metadata.
         */
        webhookUrl?: string;
        /**
         * Metadata to send with the webhook
         */
        webhookMetadata?: {
            [key: string]: unknown;
        };
        scrapeOptions?: {
            /**
             * Formats to include in the output.
             */
            formats?: Array<'markdown' | 'rawHtml' | 'screenshot'>;
            /**
             * Headers to send with the request. Can be used to send cookies, user-agent, etc.
             */
            headers?: {
                [key: string]: unknown;
            };
            /**
             * Tags to include in the output.
             */
            includeTags?: Array<string>;
            /**
             * Tags to exclude from the output.
             */
            excludeTags?: Array<string>;
            /**
             * Wait x amount of milliseconds for the page to load to fetch content
             */
            waitFor?: number;
        };
    };
    path?: never;
    query?: never;
    url: '/crawl';
};

export type CrawlUrlsErrors = {
    /**
     * Payment required
     */
    402: {
        error?: string;
    };
    /**
     * Too many requests
     */
    429: {
        error?: string;
    };
    /**
     * Server error
     */
    500: {
        error?: string;
    };
};

export type CrawlUrlsError = CrawlUrlsErrors[keyof CrawlUrlsErrors];

export type CrawlUrlsResponses = {
    /**
     * Successful response
     */
    200: CrawlResponse;
};

export type CrawlUrlsResponse = CrawlUrlsResponses[keyof CrawlUrlsResponses];

export type MapUrlsData = {
    body: {
        /**
         * The base URL to start crawling from
         */
        url: string;
        /**
         * Search query to use for mapping. During the Alpha phase, the 'smart' part of the search functionality is limited to 100 search results. However, if map finds more results, there is no limit applied.
         */
        search?: string;
        /**
         * Ignore the website sitemap when crawling
         */
        ignoreSitemap?: boolean;
        /**
         * Include subdomains of the website
         */
        includeSubdomains?: boolean;
        /**
         * Maximum number of links to return
         */
        limit?: number;
    };
    path?: never;
    query?: never;
    url: '/map';
};

export type MapUrlsErrors = {
    /**
     * Payment required
     */
    402: {
        error?: string;
    };
    /**
     * Too many requests
     */
    429: {
        error?: string;
    };
    /**
     * Server error
     */
    500: {
        error?: string;
    };
};

export type MapUrlsError = MapUrlsErrors[keyof MapUrlsErrors];

export type MapUrlsResponses = {
    /**
     * Successful response
     */
    200: MapResponse;
};

export type MapUrlsResponse = MapUrlsResponses[keyof MapUrlsResponses];

export type ClientOptions = {
    baseURL: 'https://api.firecrawl.dev/v1' | (string & {});
};