// utils/cartStorage.js

const CART_KEY = "miCarrito";

export function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : { items: [], total: 0 };
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.items.find((item) => item.id === product.id);

  if (existing) {
    existing.cantidad += product.cantidad || 1;
  } else {
    cart.items.push({ ...product, cantidad: product.cantidad || 1 });
  }

  cart.total = cart.items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart();
  cart.items = cart.items.filter((item) => item.id !== productId);
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );
  saveCart(cart);
  return cart;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
