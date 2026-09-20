import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TARGET_URL || 'http://localhost:3000';

test.describe('Ratings API', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { phone: '0933000000', password: 'password123' },
    });
    const body = await loginRes.json();
    authToken = body.token;
  });

  test('GET /api/ratings - should return all ratings', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/ratings`);
    expect(response.status()).toBe(200);
    const ratings = await response.json();
    expect(Array.isArray(ratings)).toBe(true);
  });

  test('POST /api/ratings - should reject without auth', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/ratings`, {
      data: {
        toUserId: 'some-user-id',
        score: 5,
        comment: 'Great neighbor',
      },
    });
    expect(response.status()).toBe(401);
  });
});
