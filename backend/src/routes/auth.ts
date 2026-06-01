import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { sign } from 'hono/jwt';

export const authRoutes = new OpenAPIHono();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string(),
    name: z.string().nullable(),
  }),
});

const ErrorSchema = z.object({
  error: z.string(),
});

const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  summary: 'User login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LoginResponseSchema,
        },
      },
      description: 'Login successful',
    },
    401: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Invalid credentials',
    },
  },
});

authRoutes.openapi(loginRoute, async (c) => {
  const { email, password } = c.req.valid('json');

  // TODO: Verify against database
  // For now, simple mock login
  if (email === 'admin@blackincode.com' && password === 'admin123') {
    const payload = {
      sub: 1, // user id
      email: email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    };
    
    const token = await sign(payload, process.env.JWT_SECRET || 'secret');
    
    return c.json({
      token,
      user: {
        id: 1,
        email: email,
        name: 'Admin User',
      },
    });
  }

  return c.json({ error: 'Invalid credentials' }, 401);
});
