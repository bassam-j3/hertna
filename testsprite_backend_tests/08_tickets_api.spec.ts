import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TARGET_URL || 'http://localhost:3000';

test.describe('Tickets API', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { phone: '0933000000', password: 'password123' },
    });
    const body = await loginRes.json();
    authToken = body.token;
  });

  test('POST /api/tickets - should create a support ticket', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/tickets`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        type: 'bug_report',
        message: 'Test ticket for QA - يرجى تجاهل هذه التذكرة',
      },
    });
    expect([201, 200]).toContain(response.status());
    const ticket = await response.json();
    expect(ticket).toHaveProperty('id');
  });

  test('POST /api/tickets - should reject without auth', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/tickets`, {
      data: {
        type: 'bug_report',
        message: 'Should fail without auth',
      },
    });
    expect(response.status()).toBe(401);
  });
});
