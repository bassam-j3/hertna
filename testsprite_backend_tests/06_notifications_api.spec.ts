import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TARGET_URL || 'http://localhost:3000';

test.describe('Notifications API', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { phone: '0933000000', password: 'password123' },
    });
    const body = await loginRes.json();
    authToken = body.token;
  });

  test('GET /api/notifications - should return user notifications', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(response.status()).toBe(200);
    const notifications = await response.json();
    expect(Array.isArray(notifications)).toBe(true);
  });

  test('GET /api/notifications - should reject without auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/notifications`);
    expect(response.status()).toBe(401);
  });

  test('PATCH /api/notifications/read-all - should mark all as read', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/notifications/read-all`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(response.status()).toBe(200);
  });
});
