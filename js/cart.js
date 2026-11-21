/* ==========================================================================
   ShopEase — cart.js
   Cart is stored in localStorage as an array of { id, qty } objects,
   so it stays in sync across index.html, products.html, cart.html, etc.
   Relies on the global `products` array defined in products.js.
   ========================================================================== */

const CART_KEY = "shopease_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart(cart);
  updateCartBadge();
}

function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function changeCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function getCartTotal() {
  return getCart().reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

/* Updates the little badge on the cart icon. Runs on every page. */
function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = getCartCount();
}

/* Renders the full cart list + totals. Only does anything on cart.html. */
function renderCartPage() {
  const container = document.getElementById("cartItemsPage");
  if (!container) return;

  const cart = getCart();
  const emptyMsg = document.getElementById("cartEmptyPage");
  const summary = document.querySelector(".cart-summary");
  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotalPage");

  if (cart.length === 0) {
    container.innerHTML = "";
    if (emptyMsg) emptyMsg.hidden = false;
    if (summary) summary.style.display = "none";
    if (subtotalEl) subtotalEl.textContent = "$0.00";
    if (totalEl) totalEl.textContent = "$0.00";
    return;
  }

  if (emptyMsg) emptyMsg.hidden = true;
  if (summary) summary.style.display = "block";

  container.innerHTML = "";
  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      ${productImage(product)}
      <div class="cart-row-info">
        <h3>${product.name}</h3>
        <span class="cart-row-category">${product.category}</span>
        <span class="cart-row-price">$${product.price.toFixed(2)} each</span>
      </div>
      <div class="qty-controls">
        <button class="qty-decrease" data-id="${product.id}">&minus;</button>
        <span>${item.qty}</span>
        <button class="qty-increase" data-id="${product.id}">&plus;</button>
      </div>
      <div class="cart-row-total">$${(product.price * item.qty).toFixed(2)}</div>
      <button class="remove-item-btn" data-id="${product.id}">Remove</button>
    `;
    container.appendChild(row);
  });

  const total = getCartTotal();
  if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartPage();

  const container = document.getElementById("cartItemsPage");
  if (container) {
    container.addEventListener("click", (e) => {
      const inc = e.target.closest(".qty-increase");
      const dec = e.target.closest(".qty-decrease");
      const rem = e.target.closest(".remove-item-btn");
      if (inc) changeCartQty(Number(inc.dataset.id), 1);
      if (dec) changeCartQty(Number(dec.dataset.id), -1);
      if (rem) removeFromCart(Number(rem.dataset.id));
    });
  }

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (getCart().length === 0) {
        alert("Your cart is empty. Add some products first!");
        return;
      }
      alert("Thank you for your order! Total: $" + getCartTotal().toFixed(2) + "\n(This is a demo, no real payment was processed.)");
      saveCart([]);
      updateCartBadge();
      renderCartPage();
    });
  }
});
