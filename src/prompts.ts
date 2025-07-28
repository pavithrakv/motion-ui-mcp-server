/**
 * Prompt definitions for the Motion UI MCP Server
 */

export const prompts = {
  component_usage: {
    name: "component_usage",
    description: "Get usage examples for a specific Motion component or API",
    arguments: [
      {
        name: "componentName",
        description: "Name of the Motion component or API to get usage for",
        required: true
      }
    ]
  },
  animation_tutorial: {
    name: "animation_tutorial", 
    description: "Get a step-by-step tutorial for creating animations with Motion",
    arguments: [
      {
        name: "animationType",
        description: "Type of animation (e.g., 'spring', 'keyframes', 'gesture')",
        required: true
      }
    ]
  },
  performance_optimization: {
    name: "performance_optimization",
    description: "Get performance optimization tips for Motion animations",
    arguments: [
      {
        name: "useCase",
        description: "Specific use case or performance concern",
        required: true
      }
    ]
  }
};

export const promptHandlers = {
  component_usage: async (args: { componentName: string }) => {
    const { componentName } = args;
    
    return {
      description: `Usage examples and best practices for ${componentName}`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please provide comprehensive usage examples and best practices for the Motion component "${componentName}". Include:

1. Basic usage example with clear code snippets
2. Common use cases and patterns
3. Props and configuration options
4. Performance considerations
5. Accessibility recommendations
6. Common mistakes to avoid
7. Related components or APIs that work well together

Format the response with clear headings and well-commented code examples.`
          }
        }
      ]
    };
  },

  animation_tutorial: async (args: { animationType: string }) => {
    const { animationType } = args;
    
    return {
      description: `Step-by-step tutorial for ${animationType} animations`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Create a comprehensive step-by-step tutorial for implementing ${animationType} animations with Motion. Include:

1. Introduction to ${animationType} animations and when to use them
2. Required setup and imports
3. Step-by-step implementation guide with code examples
4. Explanation of key concepts and parameters
5. Common variations and advanced techniques
6. Troubleshooting common issues
7. Performance optimization tips
8. Real-world examples and use cases

Make the tutorial beginner-friendly but also include advanced tips for experienced developers.`
          }
        }
      ]
    };
  },

  performance_optimization: async (args: { useCase: string }) => {
    const { useCase } = args;
    
    return {
      description: `Performance optimization guidance for ${useCase}`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Provide specific performance optimization advice for Motion animations in the context of "${useCase}". Include:

1. Analysis of potential performance bottlenecks for this use case
2. Recommended animation properties and techniques
3. Properties to avoid and why
4. Specific Motion features that can help optimize performance
5. Code examples showing optimized vs non-optimized approaches
6. Monitoring and debugging techniques
7. Mobile performance considerations
8. Accessibility and reduced motion preferences
9. Bundle size optimization strategies

Focus on actionable, specific recommendations with measurable performance benefits.`
          }
        }
      ]
    };
  }
};