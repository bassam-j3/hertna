import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TARGET_URL || 'http://localhost:3000';

test.describe('Auth API - Registration & Login', () => {
  const uniquePhone = `09${Date.now().toString().slice(-8)}`;

  test('POST /api/auth/register - should register a new user', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/register`, {
      data: {
        phone: uniquePhone,
        password: 'TestPass123',
        name: 'Test User Registration',
        city: 'دمشق',
        neighborhood: 'المزة',
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('id');
    expect(body.user.phone).toBe(uniquePhone);
    expect(body.user.name).toBe('Test User Registration');
  });

  test('POST /api/auth/register - should reject duplicate phone', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/register`, {
      data: {
        phone: '0933000000',
        password: 'TestPass123',
        name: 'Duplicate User',
        city: 'دمشق',
        neighborhood: 'المزة',
      },
    });
    expect(response.status()).toBe(409);
  });

  test('POST /api/auth/login - should login with valid credentials', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        phone: '0933000000',
        password: 'password123',
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('user');
    expect(body.user.phone).toBe('0933000000');
  });

  test('POST /api/auth/login - should reject invalid credentials', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        phone: '0933000000',
        password: 'wrongpassword',
      },
    });
    expect(response.status()).toBe(401);
  });

  test('GET /api/auth/me - should return profile for authenticated user', async ({ request }) => {
    // First login
    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { phone: '0933000000', password: 'password123' },
    });
    const { token } = await loginRes.json();

    const profileRes = await request.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(profileRes.status()).toBe(200);
    const profile = await profileRes.json();
    expect(profile).toHaveProperty('id');
    expect(profile).toHaveProperty('name');
    expect(profile).toHaveProperty('email');
  });

  test('GET /api/auth/me - should reject unauthenticated request', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/me`);
    expect(response.status()).toBe(401);
  });
});
