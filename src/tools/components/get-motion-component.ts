/**
 * Tool to get information about a specific Motion component or API
 */
import { z } from 'zod';
import { axios } from '../../utils/axios.js';
import { cache } from '../../utils/cache.js';
import { logDebug, logError } from '../../utils/logger.js';
import { componentNameSchema } from '../../utils/validation.js';

export const schema = {
  componentName: {
    type: 'string',
    description: 'Name of the Motion component or API (e.g., "motion.div", "animate", "useSpring")'
  }
};

// Motion components and APIs mapping
const MOTION_COMPONENTS = {
  // React Components
  'motion.div': {
    type: 'React Component',
    description: 'Animated div element with Motion props',
    category: 'react',
    examples: [
      {
        title: 'Basic Animation',
        code: `<motion.div
  animate={{ x: 100, y: 100 }}
  transition={{ duration: 2 }}
>
  Animated div
</motion.div>`
      },
      {
        title: 'Spring Animation',
        code: `<motion.div
  animate={{ scale: 1.2 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  Spring animated div
</motion.div>`
      }
    ],
    props: ['animate', 'initial', 'exit', 'transition', 'whileHover', 'whileTap', 'whileDrag', 'layout']
  },
  'motion.button': {
    type: 'React Component',
    description: 'Animated button element with Motion props',
    category: 'react',
    examples: [
      {
        title: 'Interactive Button',
        code: `<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>`
      }
    ],
    props: ['animate', 'initial', 'exit', 'transition', 'whileHover', 'whileTap', 'whileDrag']
  },
  // JavaScript APIs
  'animate': {
    type: 'JavaScript API',
    description: 'Animate elements using CSS selectors or DOM elements',
    category: 'javascript',
    examples: [
      {
        title: 'Basic CSS Selector Animation',
        code: `import { animate } from "motion";

animate("#box", { x: 100, rotate: 45 });`
      },
      {
        title: 'DOM Element Animation with Options',
        code: `import { animate } from "motion";

const element = document.querySelector(".target");
animate(element, 
  { opacity: [0, 1], scale: [0.8, 1] },
  { duration: 1, ease: "easeOut" }
);`
      },
      {
        title: 'Keyframes Animation',
        code: `import { animate } from "motion";

animate(".circle", {
  x: [0, 100, 0],
  y: [0, -100, 0]
}, {
  duration: 2,
  repeat: Infinity
});`
      }
    ],
    parameters: ['target', 'keyframes', 'options']
  },
  'timeline': {
    type: 'JavaScript API',
    description: 'Create complex, sequenced animations',
    category: 'javascript',
    examples: [
      {
        title: 'Sequential Animation',
        code: `import { timeline } from "motion";

timeline([
  [".box1", { x: 100 }],
  [".box2", { y: 100 }, { at: "-0.5" }],
  [".box3", { rotate: 180 }, { at: "<" }]
]);`
      }
    ],
    parameters: ['sequence', 'options']
  },
  // React Hooks
  'useAnimate': {
    type: 'React Hook',
    description: 'Hook for imperative animations in React',
    category: 'hooks',
    examples: [
      {
        title: 'Basic useAnimate',
        code: `import { useAnimate } from "motion/react";

function Component() {
  const [scope, animate] = useAnimate();
  
  return (
    <div ref={scope}>
      <button onClick={() => animate(scope.current, { x: 100 })}>
        Animate
      </button>
    </div>
  );
}`
      }
    ],
    returns: ['scope', 'animate']
  },
  'useSpring': {
    type: 'React Hook',
    description: 'Create spring-animated values',
    category: 'hooks',
    examples: [
      {
        title: 'Spring Value',
        code: `import { useSpring } from "motion/react";

function Component() {
  const spring = useSpring(0, { stiffness: 300, damping: 30 });
  
  return (
    <motion.div style={{ x: spring }}>
      <button onClick={() => spring.set(100)}>
        Animate
      </button>
    </motion.div>
  );
}`
      }
    ],
    parameters: ['initialValue', 'options']
  },
  'useScroll': {
    type: 'React Hook',
    description: 'Track scroll progress and create scroll-linked animations',
    category: 'hooks',
    examples: [
      {
        title: 'Scroll Progress',
        code: `import { useScroll, useTransform, motion } from "motion/react";

function Component() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 2]);
  
  return (
    <motion.div style={{ scale }}>
      Scales as you scroll
    </motion.div>
  );
}`
      }
    ],
    returns: ['scrollX', 'scrollY', 'scrollXProgress', 'scrollYProgress']
  }
};

export async function handleGetMotionComponent(params: any) {
  try {
    const componentName = componentNameSchema.parse(params.componentName);
    
    logDebug(`Getting Motion component: ${componentName}`);
    
    // Check cache first
    const cacheKey = `motion-component-${componentName}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Get component info from our mapping
    const componentInfo = MOTION_COMPONENTS[componentName as keyof typeof MOTION_COMPONENTS];
    
    if (!componentInfo) {
      // Try to find similar components
      const similar = Object.keys(MOTION_COMPONENTS).filter(name => 
        name.toLowerCase().includes(componentName.toLowerCase()) ||
        componentName.toLowerCase().includes(name.toLowerCase())
      );
      
      const result = {
        error: `Component "${componentName}" not found`,
        availableComponents: Object.keys(MOTION_COMPONENTS),
        suggestions: similar.length > 0 ? similar : ['motion.div', 'animate', 'useAnimate']
      };
      
      cache.set(cacheKey, result, 300000); // 5 minutes
      return result;
    }
    
    // Prepare comprehensive component information
    const result = {
      name: componentName,
      type: componentInfo.type,
      description: componentInfo.description,
      category: componentInfo.category,
      examples: componentInfo.examples,
      ...('props' in componentInfo && { props: componentInfo.props }),
      ...('parameters' in componentInfo && { parameters: componentInfo.parameters }),
      ...('returns' in componentInfo && { returns: componentInfo.returns }),
      documentation: `https://motion.dev/docs/${componentInfo.category}`,
      relatedComponents: Object.keys(MOTION_COMPONENTS).filter(name => 
        MOTION_COMPONENTS[name as keyof typeof MOTION_COMPONENTS].category === componentInfo.category &&
        name !== componentName
      ).slice(0, 5)
    };
    
    // Cache the result
    cache.set(cacheKey, result, 300000); // 5 minutes
    
    return result;
    
  } catch (error) {
    logError('Error getting Motion component', error);
    
    if (error instanceof z.ZodError) {
      return {
        error: 'Invalid parameters',
        details: error.errors
      };
    }
    
    return {
      error: 'An error occurred while fetching component information',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}