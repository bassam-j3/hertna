import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TARGET_URL || 'http://localhost:3000';

test.describe('Alerts API', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { phone: '0933000000', password: 'password123' },
    });
    const body = await loginRes.json();
    authToken = body.token;
  });

  test('GET /api/alerts - should return user alerts', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/alerts`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(response.status()).toBe(200);
    const alerts = await response.json();
    expect(Array.isArray(alerts)).toBe(true);
  });

  test('GET /api/alerts - should reject without auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/alerts`);
    expect(response.status()).toBe(401);
  });

  test('POST /api/alerts - should create an alert', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/alerts`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        title: 'Test Alert',
        message: 'QA test alert - تنبيه تجريبي',
        type: 'info',
      },
    });
    expect([201, 200]).toContain(response.status());
  });
});
