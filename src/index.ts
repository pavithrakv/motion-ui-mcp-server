#!/usr/bin/env node
/**
 * Motion UI MCP Server
 * 
 * A Model Context Protocol server for Motion animation library.
 * Provides AI assistants with access to Motion components, APIs, examples, and documentation.
 * 
 * Usage:
 *   npx motion-ui-mcp-server
 *   npx motion-ui-mcp-server --github-api-key YOUR_TOKEN
 *   npx motion-ui-mcp-server -g YOUR_TOKEN
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { setupHandlers } from './handler.js';
import { axios } from './utils/axios.js';
import { z } from 'zod';
import { 
  toolHandlers,
  toolSchemas
} from './tools/index.js';
import { logError, logInfo, logWarning } from './utils/logger.js';


/**
 * Parse command line arguments
 */
async function parseArgs() {
  const args = process.argv.slice(2);
  
  // Help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Motion UI MCP Server

Usage:
  npx motion-ui-mcp-server [options]

Options:
  --github-api-key, -g <token>    GitHub Personal Access Token for API access
  --help, -h                      Show this help message
  --version, -v                   Show version information

Examples:
  npx motion-ui-mcp-server
  npx motion-ui-mcp-server --github-api-key ghp_your_token_here
  npx motion-ui-mcp-server -g ghp_your_token_here

Environment Variables:
  GITHUB_PERSONAL_ACCESS_TOKEN    Alternative way to provide GitHub token
  LOG_LEVEL                       Log level (debug, info, warn, error) - default: info

For more information, visit: https://motion.dev
`);
    process.exit(0);
  }

  // Version flag
  if (args.includes('--version') || args.includes('-v')) {
    // Read version from package.json
    try {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const packagePath = path.join(__dirname, '..', 'package.json');
      
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      console.log(`motion-ui-mcp-server v${packageJson.version}`);
    } catch (error) {
      console.log('motion-ui-mcp-server v1.0.0');
    }
    process.exit(0);
  }

  // GitHub API key
  const githubApiKeyIndex = args.findIndex(arg => arg === '--github-api-key' || arg === '-g');
  let githubApiKey = null;
  
  if (githubApiKeyIndex !== -1 && args[githubApiKeyIndex + 1]) {
    githubApiKey = args[githubApiKeyIndex + 1];
  } else if (process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
    githubApiKey = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  }

  return { githubApiKey };
}

/**
 * Main function to start the MCP server
 */
async function main() {
  try {
    logInfo('Starting Motion UI MCP Server...');

    const { githubApiKey } = await parseArgs();

    // Configure GitHub API key if provided
    if (githubApiKey) {
      axios.setGitHubApiKey(githubApiKey);
      logInfo('GitHub API configured with token');
    } else {
      logWarning('No GitHub API key provided. Rate limited to 60 requests/hour.');
    }

    // Initialize the MCP server with metadata and capabilities
    // Following MCP SDK 1.16.0 best practices
    const server = new Server(
      {
        name: "motion-ui-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          resources: {
            "get_motion_components": {
              description: "List of available Motion animation components and APIs",
              uri: "resource:get_motion_components",
              contentType: "text/plain"
            }
          },
          prompts: {
            "component_usage": {
              description: "Get usage examples for a specific Motion component or API",
              arguments: {
                componentName: {
                  type: "string",
                  description: "Name of the Motion component or API to get usage for"
                }
              }
            },
            "animation_tutorial": {
              description: "Get a step-by-step tutorial for creating animations with Motion",
              arguments: {
                animationType: {
                  type: "string",
                  description: "Type of animation (e.g., 'spring', 'keyframes', 'gesture')"
                }
              }
            },
            "performance_optimization": {
              description: "Get performance optimization tips for Motion animations",
              arguments: {
                useCase: {
                  type: "string",
                  description: "Specific use case or performance concern"
                }
              }
            }
          },
          tools: {
            "get_motion_component": {
              description: "Get information and examples for a specific Motion component or API",
              inputSchema: {
                type: "object",
                properties: {
                  componentName: {
                    type: "string",
                    description: "Name of the Motion component or API (e.g., 'motion.div', 'animate', 'useSpring')"
                  }
                },
                required: ["componentName"]
              }
            },
            "get_motion_example": {
              description: "Get example code for a specific Motion animation pattern",
              inputSchema: {
                type: "object",
                properties: {
                  exampleType: {
                    type: "string",
                    description: "Type of example (e.g., 'spring-animation', 'drag-gesture', 'layout-animation')"
                  }
                },
                required: ["exampleType"]
              }
            },
            "list_motion_components": {
              description: "Get all available Motion components and APIs",
              inputSchema: {
                type: "object",
                properties: {
                  category: {
                    type: "string",
                    description: "Filter by category (react, javascript, hooks, gestures, layout)"
                  }
                }
              }
            },
            "get_motion_docs": {
              description: "Get documentation for Motion features and concepts",
              inputSchema: {
                type: "object",
                properties: {
                  topic: {
                    type: "string",
                    description: "Documentation topic (e.g., 'getting-started', 'animation-controls', 'performance')"
                  }
                },
                required: ["topic"]
              }
            },
            "search_motion_examples": {
              description: "Search Motion examples and code snippets",
              inputSchema: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "Search query for examples"
                  }
                },
                required: ["query"]
              }
            }
          }
        }
      }
    );

    // Set up request handlers and register components (tools, resources, etc.)
    setupHandlers(server);

    // Start server using stdio transport
    const transport = new StdioServerTransport();
    
    logInfo('Transport initialized: stdio');

    await server.connect(transport);
    
    logInfo('Server started successfully');

  } catch (error) {
    logError('Failed to start server', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  logError('Unhandled startup error', error);
  process.exit(1);
});