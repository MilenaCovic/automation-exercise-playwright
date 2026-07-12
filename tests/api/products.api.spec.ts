import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/api-client';

test.describe('API Tests — Products', () => {
  let api: ApiClient;

  test.beforeEach(async ({ request }) => {
    api = new ApiClient(request);
  });

  test('GET /productsList - returns all products with valid schema', async () => {
    const res = await api.getProductsList();
    const body = await ApiClient.assertResponse(res, 200);

    expect(body).toHaveProperty('products');
    expect(body.products).toBeInstanceOf(Array);
    expect(body.products.length).toBeGreaterThan(0);

    const product = body.products[0];
    expect(product).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      price: expect.any(String),
      brand: expect.any(String),
      category: expect.any(Object),
    });
  });

  test('GET /productsList - response contains well-known product categories', async () => {
    const res = await api.getProductsList();
    const body = await ApiClient.assertResponse(res, 200);

    const categories = new Set<string>();
    for (const p of body.products) {
      if (p.category?.category) categories.add(p.category.category);
    }

    expect(categories.size).toBeGreaterThan(0);
  });

  test('POST /searchProduct - search for "top" returns matching products', async () => {
    const res = await api.searchProduct('top');
    const body = await ApiClient.assertResponse(res, 200);

    expect(body).toHaveProperty('products');
    expect(body.products).toBeInstanceOf(Array);
    expect(body.products.length).toBeGreaterThan(0);

    const hasTop = body.products.some((p: { name: string }) =>
      p.name.toLowerCase().includes('top'),
    );
    expect(hasTop).toBeTruthy();
  });

  test('POST /searchProduct - search for "tshirt" returns results', async () => {
    const res = await api.searchProduct('tshirt');
    const body = await ApiClient.assertResponse(res, 200);

    expect(body.products).toBeInstanceOf(Array);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('POST /searchProduct - search for non-existent product returns empty list', async () => {
    const res = await api.searchProduct('xyznonexistent12345');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.responseCode).toBe(200);
    expect(body.products).toBeInstanceOf(Array);
    expect(body.products.length).toBe(0);
  });

  test('POST /searchProduct - empty search parameter still returns a response', async () => {
    const res = await api.searchProduct('');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('responseCode');
    expect([200, 400]).toContain(body.responseCode);
  });
});

test.describe('API Tests — Brands', () => {
  let api: ApiClient;

  test.beforeEach(async ({ request }) => {
    api = new ApiClient(request);
  });

  test('GET /brandsList - returns all brands', async () => {
    const res = await api.getBrandsList();
    const body = await ApiClient.assertResponse(res, 200);

    expect(body).toHaveProperty('brands');
    expect(body.brands).toBeInstanceOf(Array);
    expect(body.brands.length).toBeGreaterThan(0);

    const brand = body.brands[0];
    expect(brand).toMatchObject({
      id: expect.any(Number),
      brand: expect.any(String),
    });
  });

  test('PUT /brandsList - method not supported (returns 405)', async () => {
    const res = await api.putBrandsList();
    const body = await ApiClient.assertResponse(res, 405, 'not supported');
    expect(body.message).toMatch(/not supported/i);
  });
});