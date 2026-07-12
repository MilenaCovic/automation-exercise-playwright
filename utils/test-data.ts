
export const PAYMENT_DATA = {
  nameOnCard: 'Test User',
  cardNumber: '4111111111111111',   
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2030',
} as const;

export const REGISTRATION_DATA = {
  password: 'Test12345',
  day: '15',
  month: '6',
  year: '1995',
  firstName: 'Test',
  lastName: 'User',
  address: 'Test Street 123',
  address2: '',                     
  company: '',                      
  country: 'United States',
  state: 'California',
  city: 'Los Angeles',
  zipcode: '90001',
  mobileNumber: '9876543210',
} as const;

export const CONTACT_FORM_DATA = {
  name: 'Test User',
  email: 'test@contact.com',
  subject: 'Test Subject',
  message: 'This is a test message for the contact form.',
  filePath: 'test-data/test-upload.txt',
} as const;

export const MESSAGES = {
  orderComment: 'Please deliver before 5 PM.',
} as const;

const TEST_USERS = {
  defaultName: 'Test User',
} as const;

export const REVIEW_DATA = {
  name: 'Reviewer',
  email: 'reviewer@test.com',
  text: 'Great product!',
} as const;

export function getApiAccountData(email: string) {
  return {
    name: TEST_USERS.defaultName,
    email,
    password: REGISTRATION_DATA.password,
    firstname: REGISTRATION_DATA.firstName,
    lastname: REGISTRATION_DATA.lastName,
    address1: REGISTRATION_DATA.address,
    country: REGISTRATION_DATA.country,
    state: REGISTRATION_DATA.state,
    city: REGISTRATION_DATA.city,
    zipcode: REGISTRATION_DATA.zipcode,
    mobile_number: REGISTRATION_DATA.mobileNumber,
  };
}
