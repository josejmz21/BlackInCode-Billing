import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import { authRoutes } from './routes/auth';
import { metricsRoutes } from './routes/metrics';

const app = new OpenAPIHono();

app.use('*', logger());
app.use('*', cors());

// Swagger OpenAPI documentation
app.get(
  '/ui',
  swaggerUI({
    url: '/doc',
  })
);

app.doc('/doc', {
  info: {
    title: 'BlackInCode Billing API',
    version: 'v1',
  },
  openapi: '3.1.0',
});

// Routes
app.route('/auth', authRoutes);
app.route('/api/metrics', metricsRoutes);

app.get('/', (c) => {
  return c.text('BlackInCode Billing API is running!');
});

export default {
  port: 3000,
  fetch: app.fetch,
};
