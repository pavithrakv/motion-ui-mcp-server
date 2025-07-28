/**
 * Tool to search Motion examples and code snippets
 */
import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logDebug, logError } from '../../utils/logger.js';
import { searchQuerySchema } from '../../utils/validation.js';

export const schema = {
  query: {
    type: 'string',
    description: 'Search query for examples'
  }
};

// Searchable examples database
const SEARCHABLE_EXAMPLES = [
  {
    id: 'spring-button',
    title: 'Spring Button Animation',
    description: 'Interactive button with spring physics on hover and tap',
    tags: ['button', 'spring', 'hover', 'tap', 'interactive'],
    category: 'gestures',
    difficulty: 'beginner',
    code: `<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>`
  },
  {
    id: 'drag-card',
    title: 'Draggable Card',
    description: 'Card component that can be dragged with constraints and elastic behavior',
    tags: ['drag', 'card', 'constraints', 'elastic', 'gesture'],
    category: 'gestures',
    difficulty: 'intermediate',
    code: `<motion.div
  drag
  dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
  dragElastic={0.1}
  whileDrag={{ scale: 1.1 }}
>
  Drag me around!
</motion.div>`
  },
  {
    id: 'fade-in-list',
    title: 'Staggered Fade-in List',
    description: 'List items that fade in with staggered timing',
    tags: ['list', 'stagger', 'fade', 'opacity', 'animation'],
    category: 'animations',
    difficulty: 'beginner',
    code: `{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    {item.content}
  </motion.div>
))}`
  },
  {
    id: 'parallax-scroll',
    title: 'Parallax Scroll Effect',
    description: 'Background elements that move at different speeds during scroll',
    tags: ['parallax', 'scroll', 'background', 'transform', 'useScroll'],
    category: 'scroll',
    difficulty: 'advanced',
    code: `const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

return (
  <motion.div
    style={{ y }}
    className="parallax-background"
  >
    Background content
  </motion.div>
);`
  },
  {
    id: 'modal-animation',
    title: 'Animated Modal',
    description: 'Modal that slides in from bottom with backdrop fade',
    tags: ['modal', 'slide', 'backdrop', 'overlay', 'animate-presence'],
    category: 'layout',
    difficulty: 'intermediate',
    code: `<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="backdrop"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="modal"
      >
        Modal content
      </motion.div>
    </>
  )}
</AnimatePresence>`
  },
  {
    id: 'loading-spinner',
    title: 'Loading Spinner',
    description: 'Rotating loading spinner with smooth animation',
    tags: ['loading', 'spinner', 'rotate', 'infinite', 'transition'],
    category: 'animations',
    difficulty: 'beginner',
    code: `<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: "linear"
  }}
  className="spinner"
/>`
  },
  {
    id: 'hero-text-animation',
    title: 'Hero Text Animation',
    description: 'Large hero text that animates in with typewriter effect',
    tags: ['text', 'hero', 'typewriter', 'stagger', 'letters'],
    category: 'text',
    difficulty: 'advanced',
    code: `const text = "Hello World";
const letters = Array.from(text);

return (
  <div>
    {letters.map((letter, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {letter === " " ? "\\u00A0" : letter}
      </motion.span>
    ))}
  </div>
);`
  },
  {
    id: 'image-gallery',
    title: 'Animated Image Gallery',
    description: 'Image gallery with hover effects and layout animations',
    tags: ['gallery', 'images', 'grid', 'hover', 'layout'],
    category: 'layout',
    difficulty: 'intermediate',
    code: `<motion.div
  layout
  whileHover={{ scale: 1.05 }}
  className="image-container"
>
  <motion.img
    src={image.src}
    alt={image.alt}
    layoutId={image.id}
  />
</motion.div>`
  },
  {
    id: 'navigation-menu',
    title: 'Animated Navigation Menu',
    description: 'Mobile navigation menu that slides in from the side',
    tags: ['navigation', 'menu', 'mobile', 'slide', 'hamburger'],
    category: 'layout',
    difficulty: 'intermediate',
    code: `<motion.nav
  initial={{ x: "-100%" }}
  animate={{ x: isOpen ? 0 : "-100%" }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  className="mobile-nav"
>
  {menuItems.map(item => (
    <motion.a
      key={item.id}
      whileHover={{ x: 10 }}
      href={item.href}
    >
      {item.label}
    </motion.a>
  ))}
</motion.nav>`
  },
  {
    id: 'progress-bar',
    title: 'Animated Progress Bar',
    description: 'Progress bar that fills based on scroll position',
    tags: ['progress', 'bar', 'scroll', 'indicator', 'transform'],
    category: 'scroll',
    difficulty: 'beginner',
    code: `const { scrollYProgress } = useScroll();

return (
  <motion.div
    className="progress-bar"
    style={{ scaleX: scrollYProgress }}
    transformOrigin="0%"
  />
);`
  }
];

export async function handleSearchMotionExamples(params: any) {
  try {
    const query = searchQuerySchema.parse(params.query);
    
    logDebug(`Searching Motion examples with query: ${query}`);
    
    // Check cache first
    const cacheKey = `motion-search-${query.toLowerCase().replace(/\s+/g, '-')}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    const searchTerms = query.toLowerCase().split(/\s+/);
    
    // Search through examples
    const results = SEARCHABLE_EXAMPLES.filter(example => {
      const searchableText = [
        example.title,
        example.description,
        ...example.tags,
        example.category,
        example.code
      ].join(' ').toLowerCase();
      
      return searchTerms.some((term: string) => searchableText.includes(term));
    }).map(example => {
      // Calculate relevance score
      let relevanceScore = 0;
      const searchableText = [
        example.title,
        example.description,
        ...example.tags
      ].join(' ').toLowerCase();
      
      searchTerms.forEach((term: string) => {
        if (example.title.toLowerCase().includes(term)) relevanceScore += 3;
        if (example.description.toLowerCase().includes(term)) relevanceScore += 2;
        if (example.tags.some((tag: string) => tag.includes(term))) relevanceScore += 1;
      });
      
      return { ...example, relevanceScore };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    const result = {
      query,
      totalResults: results.length,
      results: results.map(({ relevanceScore, ...example }) => example),
      suggestions: results.length === 0 ? [
        'Try broader terms like "animation", "gesture", or "scroll"',
        'Search for specific components like "button", "modal", or "card"',
        'Look for animation types like "spring", "fade", or "slide"'
      ] : undefined,
      categories: ['animations', 'gestures', 'layout', 'scroll', 'text'],
      popularExamples: results.length === 0 ? [
        'spring-button',
        'drag-card',
        'fade-in-list',
        'parallax-scroll'
      ] : undefined
    };
    
    // Cache the result
    cache.set(cacheKey, result, 300000); // 5 minutes
    
    return result;
    
  } catch (error) {
    logError('Error searching Motion examples', error);
    
    if (error instanceof z.ZodError) {
      return {
        error: 'Invalid search query',
        details: error.errors
      };
    }
    
    return {
      error: 'An error occurred while searching examples',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}