import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TARGET_URL || 'http://localhost:3000';

test.describe('Users API', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { phone: '0933000000', password: 'password123' },
    });
    const body = await loginRes.json();
    authToken = body.token;
  });

  test('PATCH /api/users/me - should update user profile', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        name: 'QA Test User Updated',
        bio: 'Testing profile update',
      },
    });
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user.name).toBe('QA Test User Updated');
  });

  test('PATCH /api/users/me - should reject without auth', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/users/me`, {
      data: { name: 'Should Fail' },
    });
    expect(response.status()).toBe(401);
  });

  // Restore original name
  test('PATCH /api/users/me - restore original name', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { name: 'QA Test User' },
    });
    expect(response.status()).toBe(200);
  });
});
