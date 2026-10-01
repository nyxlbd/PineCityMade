import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.API_URL || 'http://localhost:5000/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await response.json();
  assert.equal(response.ok, true, `${path} returned ${response.status}: ${body.message || 'unknown error'}`);
  return body;
};

const login = async (email, password) => {
  const response = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  assert.ok(response.data.token);
  return response.data.token;
};

test('API health and public catalog are available', async () => {
  const health = await request('/health');
  assert.equal(health.data.mongoConnected, true);

  const products = await request('/products?limit=12&sort=newest');
  assert.ok(products.data.products.length > 0);
});

test('buyer authentication and order history work', async () => {
  const token = await login('buyer@pinecitymade.com', 'Client123!');
  const orders = await request('/client/orders', { headers: { Authorization: `Bearer ${token}` } });
  assert.ok(Array.isArray(orders.data.orders));
});

test('seller dashboard and order workflow are available', async () => {
  const token = await login('seller@pinecitymade.com', 'Seller123!');
  const dashboard = await request('/seller/dashboard', { headers: { Authorization: `Bearer ${token}` } });
  assert.ok(Array.isArray(dashboard.data.products));
  assert.ok(Array.isArray(dashboard.data.orders));
});

test('admin dashboard and moderation data are available', async () => {
  const token = await login('admin@pinecitymade.com', 'Admin123!');
  const dashboard = await request('/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
  assert.ok(dashboard.data.stats.totalUsers >= 3);
  assert.ok(Array.isArray(dashboard.data.sellers));
  assert.ok(Array.isArray(dashboard.data.categories));
});