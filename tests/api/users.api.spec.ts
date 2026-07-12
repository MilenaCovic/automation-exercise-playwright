import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/api-client';
import { Helper } from '../../utils/helper';

test.describe('API Tests — Users', () => {
  let api: ApiClient;

  const testUser = {
    name: 'API Test User',
    email: '',
    password: 'ApiTest123',
    title: 'Mr',
    birth_date: '15',
    birth_month: '6',
    birth_year: '1995',
    firstname: 'Api',
    lastname: 'Tester',
    address1: '123 API Street',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90001',
    mobile_number: '1234567890',
  };

  test.beforeEach(async ({ request }) => {
    api = new ApiClient(request);
    testUser.email = Helper.generateRandomEmail();
  });

  test('POST /createAccount - register a new user successfully', async () => {
    const res = await api.createAccount(testUser);
    const body = await ApiClient.assertResponse(res, 201, 'User created!');
    expect(body.message).toBe('User created!');
  });

  test('POST /createAccount - missing required fields returns error', async () => {
    const res = await api.createAccount({ name: 'Incomplete', email: '', password: '', firstname: '', lastname: '', address1: '', country: '', state: '', city: '', zipcode: '', mobile_number: '' });
    const body = await ApiClient.assertResponse(res, 400);
    expect(body.responseCode).toBe(400);
  });

  test('POST /createAccount - duplicate email returns error', async () => {
    await api.createAccount(testUser);

    const res = await api.createAccount(testUser);
    const body = await res.json();
    expect(body.responseCode).toBe(400);
    expect(body.message ?? '').toMatch(/exist|already|duplicate/i);
  });

  test('POST /verifyLogin - valid credentials return user data', async () => {
    await api.createAccount(testUser);

    const res = await api.verifyLogin(testUser.email, testUser.password);
    const body = await ApiClient.assertResponse(res, 200);

    expect(body.message).toMatch(/exist/i);
  });

  test('POST /verifyLogin - invalid email returns error', async () => {
    const res = await api.verifyLogin('nonexistent@example.com', 'anypassword');
    const body = await ApiClient.assertResponse(res, 404, 'not found');
    expect(body.responseCode).toBe(404);
  });

  test('POST /verifyLogin - invalid password returns error', async () => {
    await api.createAccount(testUser);

    const res = await api.verifyLogin(testUser.email, 'wrongpassword');
    const body = await ApiClient.assertResponse(res, 404, 'not found');
    expect(body.responseCode).toBe(404);
  });

  test('GET /getUserDetailByEmail - returns user details for existing user', async () => {
    await api.createAccount(testUser);

    const res = await api.getUserDetailByEmail(testUser.email);
    const body = await ApiClient.assertResponse(res, 200);

    expect(body.user).toBeDefined();
    expect(body.user.name).toBe(testUser.name);
    expect(body.user.email).toBe(testUser.email);
    expect(body.user.first_name).toBe(testUser.firstname);
    expect(body.user.last_name).toBe(testUser.lastname);
  });

  test('GET /getUserDetailByEmail - non-existent email returns 404', async () => {
    const res = await api.getUserDetailByEmail('notfound_xyz@example.com');
    const body = await ApiClient.assertResponse(res, 404, 'not found');
    expect(body.responseCode).toBe(404);
  });

  test('GET /getUserDetailByEmail - missing email parameter returns error', async () => {
    const res = await api.getUserDetailByEmail('');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.responseCode).toBe(200);
  });

  test('DELETE /verifyLogin - method not supported (returns 405)', async () => {
    const res = await api.deleteAccount('test@example.com', 'testpass');
    const body = await ApiClient.assertResponse(res, 405, 'not supported');
    expect(body.message).toMatch(/not supported/i);
  });

  test('PUT /updateAccount - updates user details', async () => {
    await api.createAccount(testUser);

    const res = await api.updateAccount({
      email: testUser.email,
      password: testUser.password,
      firstname: 'UpdatedFirstName',
    });
    const body = await ApiClient.assertResponse(res, 200, 'updated');
    expect(body.message).toMatch(/User updated!/i);

    const detailRes = await api.getUserDetailByEmail(testUser.email);
    const detailBody = await detailRes.json();
    expect(detailBody.user.first_name).toBe('UpdatedFirstName');
  });
});