import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TARGET_URL || 'http://localhost:3000';

test.describe('Swaps API - Fulfillment Engine', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { phone: '0933000000', password: 'password123' },
    });
    const body = await loginRes.json();
    authToken = body.token;
  });

  test('GET /api/swaps/my-swaps - should return user swaps', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/swaps/my-swaps`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(response.status()).toBe(200);
    const swaps = await response.json();
    expect(Array.isArray(swaps)).toBe(true);
  });

  test('GET /api/swaps/my-swaps - should reject without auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/swaps/my-swaps`);
    expect(response.status()).toBe(401);
  });

  test('POST /api/swaps - should create a swap for a post', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/swaps`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        postId: 'seed-post-1',
      },
    });
    // Could be 201 (created) or 409 (conflict if already exists)
    expect([201, 409]).toContain(response.status());
  });
});
