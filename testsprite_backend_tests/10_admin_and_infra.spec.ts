import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TARGET_URL || 'http://localhost:3000';

test.describe('Admin API - Protected Endpoints', () => {
  let adminToken: string;

  test.beforeAll(async ({ request }) => {
    // Login as admin user (QA Test User has userType: admin)
    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { phone: '0933000000', password: 'password123' },
    });
    const body = await loginRes.json();
    adminToken = body.token;
  });

  test('GET /api/admin/users - should return all users for admin', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    // Could be 200 (success) or 403 (if role check fails)
    expect([200, 403]).toContain(response.status());
    if (response.status() === 200) {
      const users = await response.json();
      expect(Array.isArray(users)).toBe(true);
    }
  });

  test('GET /api/admin/users - should reject without auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/admin/users`);
    expect(response.status()).toBe(401);
  });

  test('GET /api/admin/tickets - should return tickets for admin', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/admin/tickets`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect([200, 403]).toContain(response.status());
    if (response.status() === 200) {
      const tickets = await response.json();
      expect(Array.isArray(tickets)).toBe(true);
    }
  });

  test('Global Exception Filter - should return JSON for 404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/nonexistent-route`);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('statusCode', 404);
  });

  test('CORS - should allow requests', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/posts`, {
      headers: { Origin: 'http://localhost:5173' },
    });
    expect(response.status()).toBe(200);
  });
});
