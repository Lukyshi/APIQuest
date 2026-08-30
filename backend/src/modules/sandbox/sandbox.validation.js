'use strict';
const { z } = require('zod');

const restSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  path: z.string().min(1, 'Path is required').startsWith('/', 'Path must start with /'),
  headers: z.record(z.string()).optional().default({}),
  body: z.any().optional(),
});

const graphqlSchema = z.object({
  query: z.string().min(1, 'GraphQL query is required'),
  variables: z.record(z.any()).optional().default({}),
});

const soapSchema = z.object({
  operation: z.enum(['Add', 'Subtract', 'Multiply', 'Divide']),
  intA: z.number({ coerce: true }),
  intB: z.number({ coerce: true }),
});

module.exports = { restSchema, graphqlSchema, soapSchema };
