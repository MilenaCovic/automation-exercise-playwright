import { APIRequestContext, expect } from '@playwright/test';

export class ApiClient {
  readonly baseUrl = 'https://automationexercise.com/api';

  constructor(private readonly request: APIRequestContext) {}

  async getProductsList() {
    return this.request.get(`${this.baseUrl}/productsList`);
  }

  async searchProduct(product: string) {
    const form = new URLSearchParams();
    form.set('search_product', product);
    return this.request.post(`${this.baseUrl}/searchProduct`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: form.toString(),
    });
  }

  async getBrandsList() {
    return this.request.get(`${this.baseUrl}/brandsList`);
  }

  async putBrandsList() {
    return this.request.put(`${this.baseUrl}/brandsList`);
  }

  async createAccount(data: {
    name: string;
    email: string;
    password: string;
    title?: string;
    birth_date?: string;
    birth_month?: string;
    birth_year?: string;
    firstname: string;
    lastname: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile_number: string;
  }) {
    const form = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) form.set(key, value);
    }
    return this.request.post(`${this.baseUrl}/createAccount`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: form.toString(),
    });
  }

  async verifyLogin(email: string, password: string) {
    const form = new URLSearchParams();
    form.set('email', email);
    form.set('password', password);
    return this.request.post(`${this.baseUrl}/verifyLogin`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: form.toString(),
    });
  }

  async deleteAccount(email: string, password: string) {
    const form = new URLSearchParams();
    form.set('email', email);
    form.set('password', password);
    return this.request.delete(`${this.baseUrl}/verifyLogin`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: form.toString(),
    });
  }

  async getUserDetailByEmail(email: string) {
    return this.request.get(`${this.baseUrl}/getUserDetailByEmail`, {
      params: { email },
    });
  }

  async updateAccount(data: Record<string, string>) {
    const form = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      form.set(key, value);
    }
    return this.request.put(`${this.baseUrl}/updateAccount`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: form.toString(),
    });
  }

  static async assertResponse(
    response: Awaited<ReturnType<APIRequestContext['post']>>,
    expectedCode: number,
    messageContains?: string,
  ) {
    expect(response.status()).toBe(200); // API always returns HTTP 200, uses responseCode internally
    const body = await response.json();
    expect(body).toHaveProperty('responseCode', expectedCode);
    if (messageContains !== undefined) {
      expect(body.message ?? '').toContain(messageContains);
    }
    return body;
  }
}
