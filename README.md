# Motion UI MCP Server

A Model Context Protocol (MCP) server for the Motion animation library, providing AI assistants with access to Motion components, APIs, examples, and documentation.

## Features

- **Component Information**: Detailed information about Motion components and APIs
- **Code Examples**: Comprehensive examples for common animation patterns
- **Documentation**: Access to Motion documentation and best practices
- **Search Functionality**: Find relevant examples and components
- **Performance Guidance**: Optimization tips and best practices

## Installation

```bash
npm install @pavi/motion-ui-mcp-server
```

## Usage

### Command Line

```bash
# Run the server
npx @pavi/motion-ui-mcp-server

# With GitHub API key for enhanced functionality
npx @pavi/motion-ui-mcp-server --github-api-key YOUR_TOKEN

# Or using environment variable
GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_TOKEN npx @pavi/motion-ui-mcp-server
```

### Claude Desktop Configuration

Add to your Claude Desktop MCP settings file (usually located at `%APPDATA%\Claude\claude_desktop_config.json` on Windows or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "motion-ui": {
      "command": "npx",
      "args": ["@pavi/motion-ui-mcp-server"]
    }
  }
}
```

#### Windows Users - Claude CLI Installation

Windows users can add the MCP server to Claude using the Claude CLI:

```bash
claude mcp add motionui -e GITHUB_PERSONAL_ACCESS_TOKEN=<token> -- cmd /c npx -y motion-ui-mcp-server
```

### Other MCP Clients

For other MCP-compatible clients, add to your MCP settings file:

```json
{
  "mcpServers": {
    "motion-ui": {
      "command": "npx",
      "args": ["@pavi/motion-ui-mcp-server"]
    }
  }
}
```

## Available Tools

### get_motion_component
Get detailed information about a specific Motion component or API.

```typescript
get_motion_component({
  componentName: "motion.div" // or "animate", "useSpring", etc.
})
```

### list_motion_components
List all available Motion components and APIs, optionally filtered by category.

```typescript
list_motion_components({
  category?: "react" | "javascript" | "hooks" | "gestures" | "layout"
})
```

### get_motion_example
Get example code for specific Motion animation patterns.

```typescript
get_motion_example({
  exampleType: "spring-animation" // or "drag-gesture", "layout-animation", etc.
})
```

### search_motion_examples
Search through Motion examples and code snippets.

```typescript
search_motion_examples({
  query: "button hover animation"
})
```

### get_motion_docs
Get documentation for Motion features and concepts.

```typescript
get_motion_docs({
  topic: "getting-started" // or "animation-controls", "performance", etc.
})
```

## Resources

- `resource:get_motion_components` - Complete list of Motion components and APIs

## Prompts

- `component_usage` - Get usage examples for a specific component
- `animation_tutorial` - Step-by-step animation tutorials
- `performance_optimization` - Performance optimization guidance

## Categories

### React Components
- motion.div, motion.button, motion.img, etc.
- AnimatePresence, LazyMotion, MotionConfig, LayoutGroup

### JavaScript APIs
- animate, timeline, scroll, inView, stagger

### React Hooks
- useAnimate, useSpring, useScroll, useTransform, useMotionValue, etc.

### Gesture Props
- whileHover, whileTap, whileDrag, whileInView, drag, dragConstraints

### Layout Animation
- layout, layoutId, layoutScroll, layoutRoot

## Examples

The server provides examples for common animation patterns:

- Spring animations
- Drag gestures
- Layout animations
- Scroll-triggered effects
- Staggered animations
- Modal animations
- Loading spinners
- Hero text effects
- Image galleries
- Navigation menus
- Progress indicators

## Documentation Topics

- getting-started: Basic setup and concepts
- animation-controls: Programmatic control
- gestures: Interactive animations
- layout-animations: Layout transitions
- performance: Optimization best practices
- scroll-animations: Scroll-triggered effects

## Development

```bash
# Install dependencies
npm install

# Build the server
npm run build

# Run in development mode
npm run dev

# Clean build files
npm run clean
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT

## Links

- [Motion Documentation](https://motion.dev)
- [Motion Examples](https://motion.dev/examples)
- [GitHub Repository](https://github.com/motiondivision/motion)
- [Model Context Protocol](https://modelcontextprotocol.io)