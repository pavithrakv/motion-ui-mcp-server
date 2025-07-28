/**
 * Resource definitions for the Motion UI MCP Server
 */

export const resources = [
  {
    uri: "resource:get_motion_components",
    name: "Motion Components List",
    description: "Complete list of available Motion animation components and APIs",
    mimeType: "text/plain"
  }
];

export const resourceHandlers = {
  "resource:get_motion_components": () => ({
    contentType: "text/plain",
    content: `# Motion Animation Library Components

## React Components
- motion.div - Animated div element with Motion props
- motion.button - Animated button element with Motion props  
- motion.img - Animated image element with Motion props
- motion.span - Animated span element with Motion props
- motion.p - Animated paragraph element with Motion props
- AnimatePresence - Component to animate components when they are removed from the tree
- LazyMotion - Reduce bundle size by loading features on demand
- MotionConfig - Configure Motion settings for child components

## JavaScript APIs
- animate - Animate elements using CSS selectors or DOM elements
- timeline - Create complex, sequenced animations
- scroll - Create scroll-triggered animations
- inView - Trigger animations when elements come into view
- stagger - Create staggered animations for multiple elements

## React Hooks
- useAnimate - Hook for imperative animations in React
- useSpring - Create spring-animated values
- useScroll - Track scroll progress and create scroll-linked animations
- useTransform - Transform one motion value into another
- useMotionValue - Create a motion value to track animated values
- useAnimationControls - Create imperative animation controls
- useInView - Track when an element is in view
- useDragControls - Create custom drag controls

## Gesture Props
- whileHover - Animation state while hovering
- whileTap - Animation state while tapping/clicking
- whileDrag - Animation state while dragging
- whileInView - Animation state while element is in viewport
- drag - Make elements draggable
- dragConstraints - Constrain drag movements

## Layout Animation Props
- layout - Automatically animate layout changes
- layoutId - Share layout animations between components
- layoutScroll - Maintain scroll position during layout animations
- layoutRoot - Create a new layout animation context
- LayoutGroup - Group related layout animations

For detailed information about any component, use the get_motion_component tool.
For examples and tutorials, use the search_motion_examples tool.
For comprehensive documentation, use the get_motion_docs tool.

Visit https://motion.dev for official documentation and examples.`
  })
};