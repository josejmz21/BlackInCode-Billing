import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { db } from '../db';
import { invoices, clients, products } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

export const metricsRoutes = new OpenAPIHono();

// Schemas for responses
const MetricsSchema = z.object({
  totalInvoices: z.number(),
  totalBilled: z.number(),
  totalClients: z.number(),
  monthlyData: z.array(z.object({
    name: z.string(),
    total: z.number(),
  })),
});

const ClientSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().nullable(),
  rfc: z.string().nullable(),
});

const getDashboardMetricsRoute = createRoute({
  method: 'get',
  path: '/dashboard',
  summary: 'Get dashboard overview metrics',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MetricsSchema,
        },
      },
      description: 'Dashboard metrics',
    },
  },
});

const getClientsRoute = createRoute({
  method: 'get',
  path: '/clients',
  summary: 'List all clients',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(ClientSchema),
        },
      },
      description: 'List of clients',
    },
  },
});


metricsRoutes.openapi(getDashboardMetricsRoute, async (c) => {
  // Mock data for initial UI building
  return c.json({
    totalInvoices: 156,
    totalBilled: 125000.50,
    totalClients: 45,
    monthlyData: [
      { name: 'Jan', total: 4000 },
      { name: 'Feb', total: 3000 },
      { name: 'Mar', total: 2000 },
      { name: 'Apr', total: 2780 },
      { name: 'May', total: 1890 },
      { name: 'Jun', total: 2390 },
    ],
  });
});

metricsRoutes.openapi(getClientsRoute, async (c) => {
  const allClients = await db.select().from(clients);
  return c.json(allClients);
});
