/**
 * Resource template definitions for the Motion UI MCP Server
 */

export const resourceTemplates = [
  {
    uriTemplate: "motion://component/{componentName}",
    name: "Motion Component Information",
    description: "Get detailed information about a specific Motion component",
    mimeType: "text/plain"
  },
  {
    uriTemplate: "motion://example/{exampleType}",
    name: "Motion Animation Example",
    description: "Get code examples for specific animation patterns",
    mimeType: "text/plain"
  },
  {
    uriTemplate: "motion://docs/{topic}",
    name: "Motion Documentation",
    description: "Get documentation for Motion features and concepts",
    mimeType: "text/markdown"
  }
];

export function getResourceTemplate(uri: string): (() => { contentType: string, content: string }) | null {
  // Parse motion:// URIs
  if (uri.startsWith('motion://component/')) {
    const componentName = uri.replace('motion://component/', '');
    return () => ({
      contentType: "text/plain",
      content: `Motion Component: ${componentName}

This is a template resource for the Motion component "${componentName}".
Use the get_motion_component tool for detailed information and examples.

Available information:
- Component description and usage
- Code examples for React and JavaScript
- Props and configuration options
- Performance considerations
- Related components

To get complete information, use:
get_motion_component(componentName: "${componentName}")`
    });
  }

  if (uri.startsWith('motion://example/')) {
    const exampleType = uri.replace('motion://example/', '');
    return () => ({
      contentType: "text/plain",
      content: `Motion Example: ${exampleType}

This is a template resource for the Motion example "${exampleType}".
Use the get_motion_example tool for detailed code examples and tutorials.

Available information:
- Complete code examples
- Step-by-step implementation
- Variations and customizations
- Best practices
- Related patterns

To get complete information, use:
get_motion_example(exampleType: "${exampleType}")`
    });
  }

  if (uri.startsWith('motion://docs/')) {
    const topic = uri.replace('motion://docs/', '');
    return () => ({
      contentType: "text/markdown",
      content: `# Motion Documentation: ${topic}

This is a template resource for Motion documentation on "${topic}".
Use the get_motion_docs tool for comprehensive documentation.

Available topics:
- getting-started: Basic setup and first animations
- animation-controls: Programmatic animation control
- gestures: Interactive animations (hover, tap, drag)
- layout-animations: Smooth layout transitions
- performance: Optimization best practices
- scroll-animations: Scroll-triggered effects

To get complete information, use:
get_motion_docs(topic: "${topic}")`
    });
  }

  return null;
}