import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TARGET_URL || 'http://localhost:3000';

test.describe('Initiatives API', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { phone: '0933000000', password: 'password123' },
    });
    const body = await loginRes.json();
    authToken = body.token;
  });

  test('GET /api/initiatives - should return all initiatives', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/initiatives`);
    expect(response.status()).toBe(200);
    const initiatives = await response.json();
    expect(Array.isArray(initiatives)).toBe(true);
  });

  test('GET /api/initiatives?category=... - should filter by category', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/initiatives?category=cleanup`);
    expect(response.status()).toBe(200);
    const initiatives = await response.json();
    expect(Array.isArray(initiatives)).toBe(true);
  });

  test('POST /api/initiatives - should create an initiative', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/initiatives`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        title: 'حملة تنظيف الحي الشمالي',
        description: 'مبادرة تنظيف شاملة للحي',
        category: 'cleanup',
        date: new Date().toISOString(),
        location: 'حي الروضة، دمشق',
      },
    });
    expect([201, 200]).toContain(response.status());
    const initiative = await response.json();
    expect(initiative).toHaveProperty('id');
  });

  test('POST /api/initiatives - should reject without auth', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/initiatives`, {
      data: {
        title: 'Should Fail',
        description: 'No auth',
      },
    });
    expect(response.status()).toBe(401);
  });
});
