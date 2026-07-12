
export const Button = {
  addToCart: "Add to cart",
  proceedToCheckout: "Proceed To Checkout",
  payAndConfirm: "Pay and Confirm Order",
  continue: "Continue",
  signup: "Signup",
  login: "Login",
  createAccount: "Create Account",
  submit: "Submit",
} as const;
export type Button = (typeof Button)[keyof typeof Button];

export const Heading = {
  allProducts: "All Products",
  searchedProducts: "Searched Products",
  payment: "Payment",
  orderPlaced: "Order Placed!",
  enterAccountInfo: "Enter Account Information",
  accountCreated: "Account Created!",
} as const;
export type Heading = (typeof Heading)[keyof typeof Heading];

export const PageUrl = {
  home: "/",
  products: "/products",
  cart: "/view_cart",
  login: "/login",
  contactUs: "/contact_us",
  payment: "/payment",
  productDetails: (id: number) => `/product_details/${id}`,
} as const;

export const Toast = {
  orderPlaced: "Congratulations! Your order has been confirmed!",
  accountCreated: "Account Created!",
  subscribed: "You have been successfully subscribed!",
  productAdded: "Added!",
  cartEmpty: "Cart is empty!",
  reviewSubmitted: "Thank you for your review.",
} as const;
export type Toast = (typeof Toast)[keyof typeof Toast];

export const ErrorMessage = {
  loginIncorrect: "incorrect",
} as const;
export type ErrorMessage = (typeof ErrorMessage)[keyof typeof ErrorMessage];
