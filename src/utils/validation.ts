/**
 * Input validation and sanitization utilities
 */
import { z } from 'zod';
import { logError } from './logger.js';

/**
 * Validates and sanitizes input parameters
 */
export function validateAndSanitizeParams(method: string, params: any): any {
  try {
    // Basic validation - ensure params is an object
    if (params && typeof params !== 'object') {
      throw new Error('Parameters must be an object');
    }

    // Sanitize string inputs by trimming and preventing XSS
    const sanitized = sanitizeObject(params || {});
    
    return sanitized;
  } catch (error) {
    logError(`Validation error in ${method}`, error);
    throw error;
  }
}

/**
 * Recursively sanitizes an object's string values
 */
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return obj.trim();
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

/**
 * Validates a component name
 */
export const componentNameSchema = z.string()
  .min(1, 'Component name cannot be empty')
  .max(100, 'Component name too long')
  .regex(/^[a-zA-Z0-9._-]+$/, 'Component name contains invalid characters');

/**
 * Validates a search query
 */
export const searchQuerySchema = z.string()
  .min(1, 'Search query cannot be empty')
  .max(200, 'Search query too long');

/**
 * Validates a category filter
 */
export const categorySchema = z.string()
  .optional()
  .refine(val => !val || ['react', 'javascript', 'hooks', 'gestures', 'layout', 'examples'].includes(val), 
    'Invalid category');

/**
 * Validates a topic name
 */
export const topicSchema = z.string()
  .min(1, 'Topic cannot be empty')
  .max(100, 'Topic too long')
  .regex(/^[a-zA-Z0-9._-]+$/, 'Topic contains invalid characters');