import { handleGetMotionComponent } from './components/get-motion-component.js';
import { handleListMotionComponents } from './components/list-motion-components.js';
import { handleGetMotionExample } from './examples/get-motion-example.js';
import { handleSearchMotionExamples } from './examples/search-motion-examples.js';
import { handleGetMotionDocs } from './repository/get-motion-docs.js';

import { schema as getMotionComponentSchema } from './components/get-motion-component.js';
import { schema as listMotionComponentsSchema } from './components/list-motion-components.js';
import { schema as getMotionExampleSchema } from './examples/get-motion-example.js';
import { schema as searchMotionExamplesSchema } from './examples/search-motion-examples.js';
import { schema as getMotionDocsSchema } from './repository/get-motion-docs.js';

export const toolHandlers = {
  get_motion_component: handleGetMotionComponent,
  list_motion_components: handleListMotionComponents,
  get_motion_example: handleGetMotionExample,
  search_motion_examples: handleSearchMotionExamples,
  get_motion_docs: handleGetMotionDocs
};

export const toolSchemas = {
  get_motion_component: getMotionComponentSchema,
  list_motion_components: listMotionComponentsSchema,
  get_motion_example: getMotionExampleSchema,
  search_motion_examples: searchMotionExamplesSchema,
  get_motion_docs: getMotionDocsSchema
};

export const tools = {
  'get_motion_component': {
    name: 'get_motion_component',
    description: 'Get information and examples for a specific Motion component or API',
    inputSchema: {
      type: 'object',
      properties: getMotionComponentSchema,
      required: ['componentName']
    }
  },
  'list_motion_components': {
    name: 'list_motion_components',
    description: 'Get all available Motion components and APIs',
    inputSchema: {
      type: 'object',
      properties: listMotionComponentsSchema
    }
  },
  'get_motion_example': {
    name: 'get_motion_example',
    description: 'Get example code for a specific Motion animation pattern',
    inputSchema: {
      type: 'object',
      properties: getMotionExampleSchema,
      required: ['exampleType']
    }
  },
  'search_motion_examples': {
    name: 'search_motion_examples',
    description: 'Search Motion examples and code snippets',
    inputSchema: {
      type: 'object',
      properties: searchMotionExamplesSchema,
      required: ['query']
    }
  },
  'get_motion_docs': {
    name: 'get_motion_docs',
    description: 'Get documentation for Motion features and concepts',
    inputSchema: {
      type: 'object',
      properties: getMotionDocsSchema,
      required: ['topic']
    }
  }
};