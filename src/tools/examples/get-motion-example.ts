/**
 * Tool to get example code for specific Motion animation patterns
 */
import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logDebug, logError } from '../../utils/logger.js';

export const schema = {
  exampleType: {
    type: 'string',
    description: 'Type of example (e.g., "spring-animation", "drag-gesture", "layout-animation")'
  }
};

const exampleTypeSchema = z.string()
  .min(1, 'Example type cannot be empty')
  .max(100, 'Example type too long');

const MOTION_EXAMPLES = {
  'spring-animation': {
    title: 'Spring Animation',
    description: 'Smooth spring-based animations with customizable physics',
    category: 'animations',
    examples: [
      {
        framework: 'React',
        code: `import { motion } from "motion/react";

function SpringButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg"
    >
      Spring Button
    </motion.button>
  );
}`
      },
      {
        framework: 'JavaScript',
        code: `import { animate } from "motion";

const button = document.querySelector('.spring-button');

button.addEventListener('mouseenter', () => {
  animate(button, 
    { scale: 1.1 },
    { 
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  );
});

button.addEventListener('mouseleave', () => {
  animate(button, 
    { scale: 1 },
    { 
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  );
});`
      }
    ],
    relatedTopics: ['transitions', 'hover-effects', 'gestures']
  },
  'drag-gesture': {
    title: 'Drag Gesture',
    description: 'Interactive dragging with constraints and snap-back behavior',
    category: 'gestures',
    examples: [
      {
        framework: 'React',
        code: `import { motion } from "motion/react";

function DraggableCard() {
  return (
    <motion.div
      drag
      dragConstraints={{
        top: -50,
        left: -50,
        right: 50,
        bottom: 50,
      }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.1, zIndex: 1 }}
      className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-center h-full text-white font-bold">
        Drag me!
      </div>
    </motion.div>
  );
}`
      },
      {
        framework: 'JavaScript',
        code: `import { animate } from "motion";

const draggable = document.querySelector('.draggable');
let isDragging = false;
let startX, startY, currentX = 0, currentY = 0;

draggable.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX - currentX;
  startY = e.clientY - currentY;
  
  animate(draggable, { scale: 1.1 }, { duration: 0.1 });
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  
  currentX = e.clientX - startX;
  currentY = e.clientY - startY;
  
  // Apply constraints
  currentX = Math.max(-50, Math.min(50, currentX));
  currentY = Math.max(-50, Math.min(50, currentY));
  
  draggable.style.transform = \`translate(\${currentX}px, \${currentY}px)\`;
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  
  animate(draggable, { scale: 1 }, { duration: 0.1 });
});`
      }
    ],
    relatedTopics: ['constraints', 'gestures', 'interactive-animations']
  },
  'layout-animation': {
    title: 'Layout Animation',
    description: 'Smooth animations when elements change size or position in the layout',
    category: 'layout',
    examples: [
      {
        framework: 'React',
        code: `import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

function ExpandableCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-white rounded-lg shadow-lg cursor-pointer overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div layout className="p-6">
        <motion.h2 layout className="text-xl font-bold mb-2">
          Expandable Card
        </motion.h2>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-600">
                This content appears with a smooth animation when the card expands.
                The layout animation ensures smooth transitions even when the
                content changes the card's dimensions.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}`
      },
      {
        framework: 'JavaScript',
        code: `import { animate, timeline } from "motion";

const card = document.querySelector('.expandable-card');
const content = document.querySelector('.expandable-content');
let isExpanded = false;

card.addEventListener('click', () => {
  if (!isExpanded) {
    // Expand animation
    timeline([
      [card, { height: "auto" }],
      [content, { opacity: [0, 1] }, { at: "<" }]
    ], {
      duration: 0.3,
      ease: "easeOut"
    });
  } else {
    // Collapse animation
    timeline([
      [content, { opacity: 0 }],
      [card, { height: "60px" }, { at: "-0.1" }]
    ], {
      duration: 0.3,
      ease: "easeOut"
    });
  }
  
  isExpanded = !isExpanded;
});`
      }
    ],
    relatedTopics: ['layout', 'animate-presence', 'height-animations']
  },
  'scroll-triggered': {
    title: 'Scroll-Triggered Animation',
    description: 'Animations that trigger based on scroll position and element visibility',
    category: 'scroll',
    examples: [
      {
        framework: 'React',
        code: `import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

function ScrollAnimation() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600"
    >
      <motion.h1
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-6xl font-bold text-white"
      >
        Scroll Magic
      </motion.h1>
    </motion.div>
  );
}`
      },
      {
        framework: 'JavaScript',
        code: `import { scroll, animate, inView } from "motion";

// Parallax effect based on scroll
scroll(
  animate(".parallax-element", {
    y: [0, -200]
  })
);

// Animate elements when they come into view
inView(".fade-in-element", (info) => {
  animate(info.target, 
    { opacity: [0, 1], y: [50, 0] },
    { duration: 0.6, ease: "easeOut" }
  );
});

// Progress bar based on scroll progress
const progressBar = document.querySelector('.progress-bar');
scroll(({ y }) => {
  const progress = y.progress;
  progressBar.style.transform = \`scaleX(\${progress})\`;
});`
      }
    ],
    relatedTopics: ['scroll', 'parallax', 'in-view', 'progress-indicators']
  },
  'stagger-animation': {
    title: 'Stagger Animation',
    description: 'Sequential animations with delays for multiple elements',
    category: 'animations',
    examples: [
      {
        framework: 'React',
        code: `import { motion } from "motion/react";

const items = [1, 2, 3, 4, 5];

function StaggerList() {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * 0.1,
            type: "spring",
            stiffness: 100
          }}
          className="p-4 bg-white rounded-lg shadow-md"
        >
          Item {item}
        </motion.div>
      ))}
    </div>
  );
}`
      },
      {
        framework: 'JavaScript',
        code: `import { animate, stagger } from "motion";

// Stagger animation for multiple elements
animate(
  ".list-item",
  { opacity: [0, 1], y: [20, 0] },
  { 
    delay: stagger(0.1),
    duration: 0.5,
    ease: "easeOut"
  }
);

// Stagger with different directions
animate(
  ".grid-item",
  { scale: [0, 1], rotate: [180, 0] },
  { 
    delay: stagger(0.05, { from: "center" }),
    duration: 0.3
  }
);`
      }
    ],
    relatedTopics: ['stagger', 'lists', 'sequential-animations']
  }
};

export async function handleGetMotionExample(params: any) {
  try {
    const exampleType = exampleTypeSchema.parse(params.exampleType);
    
    logDebug(`Getting Motion example: ${exampleType}`);
    
    // Check cache first
    const cacheKey = `motion-example-${exampleType}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Get example from our mapping
    const example = MOTION_EXAMPLES[exampleType as keyof typeof MOTION_EXAMPLES];
    
    if (!example) {
      // Try to find similar examples
      const similar = Object.keys(MOTION_EXAMPLES).filter(name => 
        name.toLowerCase().includes(exampleType.toLowerCase()) ||
        exampleType.toLowerCase().includes(name.toLowerCase())
      );
      
      const result = {
        error: `Example "${exampleType}" not found`,
        availableExamples: Object.keys(MOTION_EXAMPLES),
        suggestions: similar.length > 0 ? similar : ['spring-animation', 'drag-gesture', 'layout-animation']
      };
      
      cache.set(cacheKey, result, 300000); // 5 minutes
      return result;
    }
    
    // Prepare comprehensive example information
    const result = {
      exampleType,
      title: example.title,
      description: example.description,
      category: example.category,
      examples: example.examples,
      relatedTopics: example.relatedTopics,
      tips: [
        'Always import Motion components from "motion/react" for React projects',
        'Use TypeScript for better development experience and type safety',
        'Consider performance with many animated elements - use transform properties when possible',
        'Test animations on different devices and screen sizes'
      ],
      documentation: `https://motion.dev/docs/${example.category}`,
      playground: 'https://motion.dev/examples'
    };
    
    // Cache the result
    cache.set(cacheKey, result, 600000); // 10 minutes
    
    return result;
    
  } catch (error) {
    logError('Error getting Motion example', error);
    
    if (error instanceof z.ZodError) {
      return {
        error: 'Invalid parameters',
        details: error.errors
      };
    }
    
    return {
      error: 'An error occurred while fetching example',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}