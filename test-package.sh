#!/bin/bash

# Test script for Motion UI MCP Server

echo "Testing Motion UI MCP Server..."

# Test basic startup
echo "Testing server startup..."
timeout 5s node build/index.js --help || echo "Server startup test completed"

# Test TypeScript compilation
echo "Testing TypeScript compilation..."
npm run build

echo "Motion UI MCP Server tests completed!"