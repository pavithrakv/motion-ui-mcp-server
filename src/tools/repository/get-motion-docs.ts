/**
 * Tool to get documentation for Motion features and concepts
 */
import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logDebug, logError } from '../../utils/logger.js';
import { topicSchema } from '../../utils/validation.js';

export const schema = {
  topic: {
    type: 'string',
    description: 'Documentation topic (e.g., "getting-started", "animation-controls", "performance")'
  }
};

const MOTION_DOCS = {
  'getting-started': {
    title: 'Getting Started with Motion',
    description: 'Learn the basics of Motion animation library',
    content: `# Getting Started with Motion

Motion is a powerful animation library that provides APIs for both JavaScript and React. It combines the simplicity of CSS transitions with the power of JavaScript animations.

## Installation

### For React projects:
\`\`\`bash
npm install motion
\`\`\`

### For vanilla JavaScript:
\`\`\`bash
npm install motion
\`\`\`

## Basic Usage

### React
\`\`\`jsx
import { motion } from "motion/react";

function App() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Hello, Motion!
    </motion.div>
  );
}
\`\`\`

### JavaScript
\`\`\`javascript
import { animate } from "motion";

animate("#my-element", { x: 100, rotate: 180 });
\`\`\`

## Core Concepts

1. **Declarative**: Describe what you want, not how to achieve it
2. **Performant**: Optimized for smooth 60fps animations
3. **Flexible**: Works with any CSS property or custom values
4. **Gesture-ready**: Built-in support for drag, hover, and tap`,
    relatedTopics: ['animation-basics', 'installation', 'first-animation'],
    nextSteps: ['animation-controls', 'gestures', 'layout-animations']
  },
  'animation-controls': {
    title: 'Animation Controls',
    description: 'Learn how to control animations programmatically',
    content: `# Animation Controls

Motion provides several ways to control animations programmatically, giving you fine-grained control over when and how animations play.

## useAnimationControls (React)

\`\`\`jsx
import { motion, useAnimationControls } from "motion/react";

function ControlledAnimation() {
  const controls = useAnimationControls();

  const startAnimation = () => {
    controls.start({
      x: 100,
      transition: { duration: 1 }
    });
  };

  return (
    <div>
      <motion.div animate={controls} />
      <button onClick={startAnimation}>Start Animation</button>
    </div>
  );
}
\`\`\`

## JavaScript Controls

\`\`\`javascript
import { animate } from "motion";

const animation = animate("#element", { x: 100 });

// Control the animation
animation.pause();
animation.play();
animation.stop();
animation.finish();
\`\`\`

## Animation States

- **Play**: Continue or start the animation
- **Pause**: Temporarily stop the animation
- **Stop**: End the animation and reset to initial state
- **Finish**: Jump to the final state

## Chaining Animations

\`\`\`jsx
controls.start({ x: 100 })
  .then(() => controls.start({ y: 100 }))
  .then(() => controls.start({ rotate: 180 }));
\`\`\``,
    relatedTopics: ['useAnimationControls', 'animation-lifecycle', 'chaining'],
    nextSteps: ['gestures', 'timeline', 'sequence']
  },
  'gestures': {
    title: 'Gesture Animations',
    description: 'Interactive animations triggered by user gestures',
    content: `# Gesture Animations

Motion makes it easy to create interactive animations that respond to user input like hover, tap, and drag.

## Hover Animations

\`\`\`jsx
<motion.div
  whileHover={{ scale: 1.1, rotateZ: 5 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  Hover me!
</motion.div>
\`\`\`

## Tap Animations

\`\`\`jsx
<motion.button
  whileTap={{ scale: 0.95 }}
  onTap={() => console.log("Button tapped!")}
>
  Tap me!
</motion.button>
\`\`\`

## Drag Gestures

\`\`\`jsx
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  whileDrag={{ scale: 1.2 }}
  onDrag={(event, info) => console.log(info.point)}
>
  Drag me around!
</motion.div>
\`\`\`

## Advanced Drag Features

- **Constraints**: Limit drag movement to specific bounds
- **Elastic**: Add bounce-back behavior when dragging beyond constraints
- **Momentum**: Continue movement after release based on velocity
- **Snap**: Snap to specific positions or grid

## Gesture Event Handlers

- \`onHoverStart\` / \`onHoverEnd\`
- \`onTapStart\` / \`onTap\` / \`onTapCancel\`
- \`onDragStart\` / \`onDrag\` / \`onDragEnd\`
- \`onPanStart\` / \`onPan\` / \`onPanEnd\``,
    relatedTopics: ['drag', 'hover', 'tap', 'pan', 'gestures'],
    nextSteps: ['drag-controls', 'gesture-recognition', 'touch-gestures']
  },
  'layout-animations': {
    title: 'Layout Animations',
    description: 'Smooth animations when elements change size or position',
    content: `# Layout Animations

Layout animations automatically animate elements when their size or position changes in the DOM layout.

## Basic Layout Animation

\`\`\`jsx
<motion.div layout>
  This element will animate when its layout changes
</motion.div>
\`\`\`

## Shared Layout Animations

\`\`\`jsx
// Component A
<motion.div layoutId="shared-element">
  I'm in component A
</motion.div>

// Component B (rendered conditionally)
<motion.div layoutId="shared-element">
  Now I'm in component B!
</motion.div>
\`\`\`

## Layout Groups

\`\`\`jsx
import { LayoutGroup } from "motion/react";

<LayoutGroup>
  <motion.div layout>Item 1</motion.div>
  <motion.div layout>Item 2</motion.div>
</LayoutGroup>
\`\`\`

## Layout Transition Options

\`\`\`jsx
<motion.div
  layout
  transition={{
    layout: { duration: 0.3, ease: "easeOut" }
  }}
>
  Custom layout transition
</motion.div>
\`\`\`

## Common Use Cases

- **Reordering lists**: Smooth transitions when list items change order
- **Responsive grids**: Animate when grid layout changes
- **Accordion**: Smooth expand/collapse animations
- **Tab switching**: Seamless transitions between tabs
- **Modal positioning**: Animate modal placement changes

## Performance Tips

- Use \`layout="position"\` for position-only changes
- Use \`layout="size"\` for size-only changes  
- Avoid layout animations on many elements simultaneously
- Consider using transforms instead for better performance`,
    relatedTopics: ['layout', 'shared-elements', 'reorder', 'responsive'],
    nextSteps: ['animate-presence', 'reorder-group', 'layout-projections']
  },
  'performance': {
    title: 'Performance Optimization',
    description: 'Best practices for smooth and efficient animations',
    content: `# Performance Optimization

Follow these guidelines to ensure your Motion animations run smoothly at 60fps.

## Prefer Transform Properties

Transform properties are GPU-accelerated and don't trigger layout recalculations:

\`\`\`jsx
// Good - uses transforms
<motion.div animate={{ x: 100, scale: 1.2, rotate: 45 }} />

// Avoid - triggers layout
<motion.div animate={{ left: 100, width: 200 }} />
\`\`\`

## Animatable Properties (GPU-accelerated)

- \`x\`, \`y\`, \`z\`
- \`scale\`, \`scaleX\`, \`scaleY\`
- \`rotate\`, \`rotateX\`, \`rotateY\`, \`rotateZ\`
- \`skew\`, \`skewX\`, \`skewY\`
- \`opacity\`

## Layout-triggering Properties (Use sparingly)

- \`width\`, \`height\`
- \`top\`, \`left\`, \`right\`, \`bottom\`
- \`margin\`, \`padding\`
- \`border-width\`

## Reduce Motion for Accessibility

\`\`\`jsx
import { useReducedMotion } from "motion/react";

function MyComponent() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={{ x: shouldReduceMotion ? 0 : 100 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1 }}
    >
      Respects user preferences
    </motion.div>
  );
}
\`\`\`

## LazyMotion for Bundle Size

\`\`\`jsx
import { LazyMotion, domAnimation, m } from "motion/react";

<LazyMotion features={domAnimation}>
  <m.div animate={{ x: 100 }} />
</LazyMotion>
\`\`\`

## Performance Monitoring

- Use browser dev tools to monitor FPS
- Watch for layout thrashing in the Performance tab
- Use Motion's built-in performance warnings
- Test on lower-end devices

## Best Practices

1. **Batch animations**: Group related animations together
2. **Use will-change sparingly**: Only when needed for complex animations
3. **Debounce scroll events**: Limit update frequency for scroll-based animations
4. **Prefer CSS transforms**: Over changing layout properties
5. **Test on mobile**: Ensure smooth performance on all devices`,
    relatedTopics: ['optimization', 'gpu-acceleration', 'reduced-motion', 'bundle-size'],
    nextSteps: ['debugging', 'profiling', 'accessibility']
  },
  'scroll-animations': {
    title: 'Scroll-Triggered Animations',
    description: 'Create animations that respond to scroll position',
    content: `# Scroll-Triggered Animations

Motion provides powerful tools for creating animations that respond to scroll position and element visibility.

## useScroll Hook

\`\`\`jsx
import { motion, useScroll, useTransform } from "motion/react";

function ScrollComponent() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  
  return (
    <motion.div style={{ opacity }}>
      Fades out as you scroll
    </motion.div>
  );
}
\`\`\`

## Element-specific Scroll Tracking

\`\`\`jsx
function ElementScroll() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  return (
    <motion.div ref={ref} style={{ y }}>
      Parallax effect
    </motion.div>
  );
}
\`\`\`

## whileInView Animation

\`\`\`jsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  Animates when scrolled into view
</motion.div>
\`\`\`

## JavaScript Scroll API

\`\`\`javascript
import { scroll, animate } from "motion";

// Animate based on scroll progress
scroll(animate(".parallax", { y: [0, -200] }));

// Trigger animations when elements enter view
inView(".fade-in", (info) => {
  animate(info.target, { opacity: 1, y: 0 });
});
\`\`\`

## Common Patterns

### Progress Indicator
\`\`\`jsx
const { scrollYProgress } = useScroll();

<motion.div
  style={{ scaleX: scrollYProgress }}
  className="progress-bar"
/>
\`\`\`

### Parallax Backgrounds
\`\`\`jsx
const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

<motion.div style={{ y }} className="background" />
\`\`\`

### Reveal Animations
\`\`\`jsx
<motion.section
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  Content reveals on scroll
</motion.section>
\`\`\``,
    relatedTopics: ['scroll', 'parallax', 'useScroll', 'whileInView', 'inView'],
    nextSteps: ['scroll-velocity', 'intersection-observer', 'scroll-snap']
  }
};

export async function handleGetMotionDocs(params: any) {
  try {
    const topic = topicSchema.parse(params.topic);
    
    logDebug(`Getting Motion documentation for topic: ${topic}`);
    
    // Check cache first
    const cacheKey = `motion-docs-${topic}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Get documentation from our mapping
    const doc = MOTION_DOCS[topic as keyof typeof MOTION_DOCS];
    
    if (!doc) {
      // Try to find similar topics
      const similar = Object.keys(MOTION_DOCS).filter(name => 
        name.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(name.toLowerCase())
      );
      
      const result = {
        error: `Documentation topic "${topic}" not found`,
        availableTopics: Object.keys(MOTION_DOCS),
        suggestions: similar.length > 0 ? similar : ['getting-started', 'animation-controls', 'gestures']
      };
      
      cache.set(cacheKey, result, 300000); // 5 minutes
      return result;
    }
    
    // Prepare comprehensive documentation
    const result = {
      topic,
      title: doc.title,
      description: doc.description,
      content: doc.content,
      relatedTopics: doc.relatedTopics,
      nextSteps: doc.nextSteps,
      officialDocs: `https://motion.dev/docs/${topic}`,
      examples: `https://motion.dev/examples`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    // Cache the result
    cache.set(cacheKey, result, 1800000); // 30 minutes
    
    return result;
    
  } catch (error) {
    logError('Error getting Motion documentation', error);
    
    if (error instanceof z.ZodError) {
      return {
        error: 'Invalid topic parameter',
        details: error.errors
      };
    }
    
    return {
      error: 'An error occurred while fetching documentation',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}