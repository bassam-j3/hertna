import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TARGET_URL || 'http://localhost:3000';

test.describe('Posts API - CRUD Operations', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { phone: '0933000000', password: 'password123' },
    });
    const body = await loginRes.json();
    authToken = body.token;
  });

  test('GET /api/posts - should return all posts', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/posts`);
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  test('GET /api/posts?category=... - should filter by category', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/posts?category=أدوات منزلية`);
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
  });

  test('POST /api/posts - should create a new post', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/posts`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        title: 'Test Post - مطلوب مفك براغي',
        description: 'أحتاج مفك براغي لإصلاح باب',
        category: 'أدوات منزلية',
        type: 'REQUEST',
        urgent: false,
        lat: 33.5138,
        lng: 36.2765,
      },
    });
    expect(response.status()).toBe(201);
    const post = await response.json();
    expect(post).toHaveProperty('id');
    expect(post.title).toBe('Test Post - مطلوب مفك براغي');
    expect(post.type).toBe('REQUEST');
  });

  test('POST /api/posts - should reject without auth', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/posts`, {
      data: {
        title: 'Should Fail',
        description: 'No auth token',
        category: 'أدوات منزلية',
        type: 'REQUEST',
      },
    });
    expect(response.status()).toBe(401);
  });

  test('GET /api/posts/:id - should return a specific post', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/posts/seed-post-1`);
    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('user');
  });
});
