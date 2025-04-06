# Publishing Guide for firecrawl-simple-client

This document provides comprehensive instructions for publishing the `firecrawl-simple-client` package to npm. Follow these guidelines to ensure a smooth publishing process.

## Prerequisites

Before publishing the package, ensure you have:

1. **npm Account**: You need an npm account with publishing rights to the `firecrawl-simple-client` package.
   - If you don't have an account, create one at [npmjs.com](https://www.npmjs.com/signup)
   - If you need access to publish this package, contact the current maintainers

2. **GitHub Access**: You need write access to the GitHub repository to create releases or trigger workflows.

3. **Environment Setup**:
   - Node.js 16.0.0 or higher installed
   - npm 7.0.0 or higher recommended

4. **Authentication**:
   - For manual publishing: Be logged in to npm (`npm login`)
   - For GitHub Actions: The repository must have an `NPM_TOKEN` secret configured

## Publishing Methods

### Method 1: Automatic Publishing via GitHub Releases

The package is automatically published when a GitHub release is created. This is the preferred method for publishing.

1. Go to the [GitHub repository](https://github.com/Sacode/firecrawl-simple-client)
2. Click on "Releases" in the right sidebar
3. Click "Draft a new release"
4. Create a new tag in the format `v{version}` (e.g., `v1.2.3`)
5. Add a title and description for the release
6. Click "Publish release"

The GitHub Actions workflow will automatically:

- Run tests and build the package
- Verify the version doesn't already exist on npm
- Publish the package to npm

### Method 2: Manual Publishing via GitHub Actions

You can manually trigger the publishing workflow with a specific version:

1. Go to the [GitHub Actions tab](https://github.com/Sacode/firecrawl-simple-client/actions)
2. Select the "Publish Package" workflow
3. Click "Run workflow"
4. Choose the branch (usually `main`)
5. Enter the version parameter:
   - Use `patch`, `minor`, or `major` for semantic versioning increments
   - Or specify an exact version like `1.2.3`
6. Click "Run workflow"

The workflow will:

- Update the version in package.json
- Run tests and build the package
- Publish to npm
- Create a GitHub release with the new version

### Method 3: Manual Publishing from Local Environment

If you need to publish directly from your local environment:

1. Ensure your local repository is up to date:

   ```bash
   git checkout main
   git pull
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Run tests to ensure everything is working:

   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. Update the version:

   ```bash
   # For patch, minor, or major updates:
   npm version patch|minor|major
   
   # For a specific version:
   npm version x.y.z
   ```

5. Push the new version and tag to GitHub:

   ```bash
   git push
   git push --tags
   ```

6. Publish to npm:

   ```bash
   npm publish
   ```

## Versioning Strategy

This package follows [Semantic Versioning (SemVer)](https://semver.org/) principles:

- **MAJOR version (x.0.0)**: Incremented for incompatible API changes
  - Breaking changes that require users to update their code
  - Removal of deprecated features
  - Major architectural changes

- **MINOR version (0.x.0)**: Incremented for new functionality in a backward-compatible manner
  - New features or endpoints
  - New optional parameters
  - Expanded functionality that doesn't break existing code

- **PATCH version (0.0.x)**: Incremented for backward-compatible bug fixes
  - Bug fixes
  - Performance improvements
  - Documentation updates
  - Dependency updates that don't affect functionality

### Version Workflow Examples

1. **For bug fixes**:

   ```bash
   npm version patch
   # e.g., 1.2.3 → 1.2.4
   ```

2. **For new features**:

   ```bash
   npm version minor
   # e.g., 1.2.3 → 1.3.0
   ```

3. **For breaking changes**:

   ```bash
   npm version major
   # e.g., 1.2.3 → 2.0.0
   ```

## Package Contents

When published to npm, the package includes:

### Included Files

The following files are included in the published package (as specified in `package.json`):

- `dist/` directory containing compiled JavaScript files and type definitions
- `README.md` with package documentation
- `LICENSE` file with the MIT license

### Excluded Files

The `.npmignore` file excludes the following from the published package:

- Source code (`src/`, `test/`, `examples/`)
- Configuration files (`.github/`, `.vscode/`, `.prettierrc`, etc.)
- Build artifacts (`coverage/`, `*.tsbuildinfo`)
- Dependencies (`node_modules/`, `package-lock.json`, etc.)
- IDE and OS-specific files (`.idea/`, `.DS_Store`, etc.)
- Environment files (`.env*`)
- Logs (`logs/`, `*.log`)

## Troubleshooting

### Common Publishing Issues

1. **Version already exists**

   Error: `npm ERR! 403 403 Forbidden - PUT https://registry.npmjs.org/firecrawl-simple-client - You cannot publish over the previously published versions`

   Solution:
   - Check the current version on npm: `npm view firecrawl-simple-client version`
   - Ensure you're incrementing the version: `npm version patch|minor|major`

2. **Authentication issues**

   Error: `npm ERR! code E401` or `npm ERR! need auth`

   Solution:
   - Ensure you're logged in: `npm login`
   - Check if your token is valid: `npm token list`
   - For GitHub Actions, verify the `NPM_TOKEN` secret is correctly set

3. **Failed tests or build**

   Error: Workflow fails at test or build step

   Solution:
   - Run tests locally: `npm test`
   - Fix any failing tests or lint issues
   - Ensure the build completes successfully: `npm run build`

4. **Package size issues**

   Error: `npm notice package size limit exceeded`

   Solution:
   - Review what's being included in the package
   - Update `.npmignore` to exclude unnecessary files
   - Run `npm pack` locally to inspect the package contents before publishing

5. **Node.js version compatibility**

   Error: Issues with different Node.js versions

   Solution:
   - Ensure compatibility with the Node.js versions specified in `package.json` (>=16.0.0)
   - Test with multiple Node.js versions before publishing

### Reverting a Published Version

If you need to unpublish a version due to critical issues:

1. For packages published less than 72 hours ago:

   ```bash
   npm unpublish firecrawl-simple-client@x.y.z
   ```

2. For older packages, you'll need to contact npm support as unpublishing is restricted.

3. Always publish a fixed version immediately after unpublishing a problematic version.

## Additional Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
