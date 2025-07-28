/**
 * Tool to list all available Motion components and APIs
 */
import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logDebug, logError } from '../../utils/logger.js';
import { categorySchema } from '../../utils/validation.js';

export const schema = {
  category: {
    type: 'string',
    description: 'Filter by category (react, javascript, hooks, gestures, layout)'
  }
};

const MOTION_COMPONENTS_LIST = {
  react: [
    {
      name: 'motion.div',
      description: 'Animated div element with Motion props',
      usage: '<motion.div animate={{ x: 100 }} />'
    },
    {
      name: 'motion.button',
      description: 'Animated button element with Motion props',
      usage: '<motion.button whileHover={{ scale: 1.05 }} />'
    },
    {
      name: 'motion.img',
      description: 'Animated image element with Motion props',
      usage: '<motion.img layoutId="hero" />'
    },
    {
      name: 'motion.span',
      description: 'Animated span element with Motion props',
      usage: '<motion.span animate={{ opacity: 1 }} />'
    },
    {
      name: 'motion.p',
      description: 'Animated paragraph element with Motion props',
      usage: '<motion.p initial={{ y: 20 }} animate={{ y: 0 }} />'
    },
    {
      name: 'AnimatePresence',
      description: 'Component to animate components when they are removed from the tree',
      usage: '<AnimatePresence>{show && <motion.div exit={{ opacity: 0 }} />}</AnimatePresence>'
    },
    {
      name: 'LazyMotion',
      description: 'Reduce bundle size by loading features on demand',
      usage: '<LazyMotion features={domMax}><motion.div /></LazyMotion>'
    },
    {
      name: 'MotionConfig',
      description: 'Configure Motion settings for child components',
      usage: '<MotionConfig transition={{ duration: 0.5 }}><motion.div /></MotionConfig>'
    }
  ],
  javascript: [
    {
      name: 'animate',
      description: 'Animate elements using CSS selectors or DOM elements',
      usage: 'animate("#box", { x: 100 })'
    },
    {
      name: 'timeline',
      description: 'Create complex, sequenced animations',
      usage: 'timeline([["#box1", { x: 100 }], ["#box2", { y: 100 }]])'
    },
    {
      name: 'scroll',
      description: 'Create scroll-triggered animations',
      usage: 'scroll(animate("#box", { x: 100 }))'
    },
    {
      name: 'inView',
      description: 'Trigger animations when elements come into view',
      usage: 'inView("#box", () => animate("#box", { opacity: 1 }))'
    },
    {
      name: 'stagger',
      description: 'Create staggered animations for multiple elements',
      usage: 'animate(".item", { x: 100 }, { delay: stagger(0.1) })'
    }
  ],
  hooks: [
    {
      name: 'useAnimate',
      description: 'Hook for imperative animations in React',
      usage: 'const [scope, animate] = useAnimate()'
    },
    {
      name: 'useSpring',
      description: 'Create spring-animated values',
      usage: 'const spring = useSpring(0, { stiffness: 300 })'
    },
    {
      name: 'useScroll',
      description: 'Track scroll progress and create scroll-linked animations',
      usage: 'const { scrollYProgress } = useScroll()'
    },
    {
      name: 'useTransform',
      description: 'Transform one motion value into another',
      usage: 'const y = useTransform(scrollYProgress, [0, 1], [0, -100])'
    },
    {
      name: 'useMotionValue',
      description: 'Create a motion value to track animated values',
      usage: 'const x = useMotionValue(0)'
    },
    {
      name: 'useAnimationControls',
      description: 'Create imperative animation controls',
      usage: 'const controls = useAnimationControls()'
    },
    {
      name: 'useInView',
      description: 'Track when an element is in view',
      usage: 'const { ref, inView } = useInView()'
    },
    {
      name: 'useDragControls',
      description: 'Create custom drag controls',
      usage: 'const dragControls = useDragControls()'
    }
  ],
  gestures: [
    {
      name: 'whileHover',
      description: 'Animation state while hovering',
      usage: '<motion.div whileHover={{ scale: 1.1 }} />'
    },
    {
      name: 'whileTap',
      description: 'Animation state while tapping/clicking',
      usage: '<motion.div whileTap={{ scale: 0.9 }} />'
    },
    {
      name: 'whileDrag',
      description: 'Animation state while dragging',
      usage: '<motion.div drag whileDrag={{ scale: 1.2 }} />'
    },
    {
      name: 'whileInView',
      description: 'Animation state while element is in viewport',
      usage: '<motion.div whileInView={{ opacity: 1 }} />'
    },
    {
      name: 'drag',
      description: 'Make elements draggable',
      usage: '<motion.div drag />'
    },
    {
      name: 'dragConstraints',
      description: 'Constrain drag movements',
      usage: '<motion.div drag dragConstraints={{ left: 0, right: 300 }} />'
    }
  ],
  layout: [
    {
      name: 'layout',
      description: 'Automatically animate layout changes',
      usage: '<motion.div layout />'
    },
    {
      name: 'layoutId',
      description: 'Share layout animations between components',
      usage: '<motion.div layoutId="shared-element" />'
    },
    {
      name: 'layoutScroll',
      description: 'Maintain scroll position during layout animations',
      usage: '<motion.div layout layoutScroll />'
    },
    {
      name: 'layoutRoot',
      description: 'Create a new layout animation context',
      usage: '<motion.div layoutRoot />'
    },
    {
      name: 'LayoutGroup',
      description: 'Group related layout animations',
      usage: '<LayoutGroup><motion.div layoutId="item" /></LayoutGroup>'
    }
  ]
};

export async function handleListMotionComponents(params: any) {
  try {
    const validatedParams = params || {};
    const category = validatedParams.category;
    
    logDebug(`Listing Motion components${category ? ` for category: ${category}` : ''}`);
    
    // Check cache first
    const cacheKey = `motion-components-list-${category || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    let result;
    
    if (category) {
      // Validate category
      categorySchema.parse(category);
      
      if (!MOTION_COMPONENTS_LIST[category as keyof typeof MOTION_COMPONENTS_LIST]) {
        result = {
          error: `Invalid category: ${category}`,
          availableCategories: Object.keys(MOTION_COMPONENTS_LIST)
        };
      } else {
        result = {
          category,
          components: MOTION_COMPONENTS_LIST[category as keyof typeof MOTION_COMPONENTS_LIST],
          totalCount: MOTION_COMPONENTS_LIST[category as keyof typeof MOTION_COMPONENTS_LIST].length
        };
      }
    } else {
      // Return all components organized by category
      const totalCount = Object.values(MOTION_COMPONENTS_LIST).reduce((sum, components) => sum + components.length, 0);
      
      result = {
        categories: MOTION_COMPONENTS_LIST,
        summary: {
          totalComponents: totalCount,
          categoryCounts: Object.entries(MOTION_COMPONENTS_LIST).reduce((acc, [key, components]) => {
            acc[key] = components.length;
            return acc;
          }, {} as Record<string, number>)
        },
        gettingStarted: {
          react: 'npm install motion',
          javascript: 'import { animate } from "motion"',
          documentation: 'https://motion.dev/docs'
        }
      };
    }
    
    // Cache the result
    cache.set(cacheKey, result, 600000); // 10 minutes
    
    return result;
    
  } catch (error) {
    logError('Error listing Motion components', error);
    
    if (error instanceof z.ZodError) {
      return {
        error: 'Invalid parameters',
        details: error.errors
      };
    }
    
    return {
      error: 'An error occurred while listing components',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}