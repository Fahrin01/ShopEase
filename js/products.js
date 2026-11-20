/* ==========================================================================
   ShopEase — products.js
   Product data + rendering + search/filter/sort logic.
   Shared across index.html, products.html and every category page.
   ========================================================================== */

/* ---------- Product catalog ---------- */
/* In a real store this would come from a server / database. */
const products = [
  { id: 1, name: "Wireless Over-Ear Headphones", category: "Electronics", price: 59.99, oldPrice: 89.99, rating: 4.5, image: "", featured: true },
  { id: 2, name: "Smart Fitness Watch", category: "Electronics", price: 129.99, oldPrice: 179.99, rating: 4.7, image: "", featured: false },
  { id: 3, name: "Men's Denim Jacket", category: "Fashion", price: 45.99, oldPrice: 65.99, rating: 4.2, image: "", featured: true },
  { id: 4, name: "Women's Summer Dress", category: "Fashion", price: 34.99, oldPrice: 49.99, rating: 4.6, image: "", featured: false },
  { id: 5, name: "Running Sneakers", category: "Shoes", price: 54.99, oldPrice: 79.99, rating: 4.4, image: "", featured: true },
  { id: 6, name: "Classic Leather Boots", category: "Shoes", price: 89.99, oldPrice: 119.99, rating: 4.3, image: "", featured: false },
  { id: 7, name: "Classic Sunglasses", category: "Accessories", price: 19.99, oldPrice: 29.99, rating: 4.1, image: "", featured: false },
  { id: 8, name: "Leather Wallet", category: "Accessories", price: 24.99, oldPrice: 34.99, rating: 4.5, image: "", featured: false },
  { id: 9, name: "Ceramic Vase Set", category: "Home & Living", price: 39.99, oldPrice: 54.99, rating: 4.6, image: "", featured: true },
  { id: 10, name: "Cozy Throw Blanket", category: "Home & Living", price: 29.99, oldPrice: 44.99, rating: 4.8, image: "", featured: false }
];

/* ---------- Helpers ---------- */
/* Renders the product photo, or a neutral placeholder when no image is set. */
function productImage(product) {
  return product.image
    ? `<img src="${product.image}" alt="${product.name}">`
    : `<div class="img-placeholder" role="img" aria-label="${product.name} image placeholder"></div>`;
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  let stars = "";
  for (let i = 0; i < fullStars; i++) stars += "\u2605";
  if (hasHalf) stars += "\u2606";
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) stars += "\u2729";
  return stars;
}

function createProductCard(product) {
  const discountPct = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  return `
    <div class="product-card">
      <div class="product-image">
        <span class="discount-badge">-${discountPct}%</span>
        ${productImage(product)}
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">
          <span>${renderStars(product.rating)}</span>
          <span class="rating-num">${product.rating.toFixed(1)}</span>
        </div>
        <div class="product-price-row">
          <span class="price-now">$${product.price.toFixed(2)}</span>
          <span class="price-old">$${product.oldPrice.toFixed(2)}</span>
        </div>
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `;
}

function renderGrid(containerId, list, noResultsId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = list.map(createProductCard).join("");
  if (noResultsId) {
    const noResults = document.getElementById(noResultsId);
    if (noResults) noResults.hidden = list.length !== 0;
  }
}

function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || "";
}

function sortList(list, sortValue) {
  if (sortValue === "price-asc") return list.slice().sort((a, b) => a.price - b.price);
  if (sortValue === "price-desc") return list.slice().sort((a, b) => b.price - a.price);
  if (sortValue === "rating") return list.slice().sort((a, b) => b.rating - a.rating);
  return list;
}

/* ---------- Home page: featured products ---------- */
function initFeatured() {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;
  renderGrid("featuredGrid", products.filter((p) => p.featured));
}

/* ---------- Products page: search + filter + sort ---------- */
function initProductsPage() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const searchInput = document.getElementById("pageSearchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortSelect");

  const state = {
    search: getUrlParam("search"),
    category: getUrlParam("category") || "All",
    sort: "default"
  };

  if (searchInput) searchInput.value = state.search;
  if (categoryFilter) categoryFilter.value = state.category;

  function apply() {
    let list = products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(state.search.toLowerCase());
      const matchesCategory = state.category === "All" || p.category === state.category;
      return matchesSearch && matchesCategory;
    });
    list = sortList(list, state.sort);
    renderGrid("productGrid", list, "noResults");
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.search = searchInput.value.trim();
      apply();
    });
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      state.category = categoryFilter.value;
      apply();
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      apply();
    });
  }

  apply();
}

/* ---------- Category pages: fixed category + sort ---------- */
function initCategoryPage() {
  const grid = document.getElementById("categoryProductGrid");
  if (!grid) return;

  const category = document.body.dataset.category;
  const sortSelect = document.getElementById("categorySortSelect");

  function apply(sortValue) {
    let list = products.filter((p) => p.category === category);
    list = sortList(list, sortValue);
    renderGrid("categoryProductGrid", list, "noResults");
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => apply(sortSelect.value));
  }

  apply("default");
}

/* ---------- Add to cart (works on any page that renders product cards) ---------- */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart-btn");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  addToCart(id); // defined in cart.js

  btn.textContent = "Added \u2713";
  btn.classList.add("added");
  setTimeout(() => {
    btn.textContent = "Add to Cart";
    btn.classList.remove("added");
  }, 1000);
});

document.addEventListener("DOMContentLoaded", () => {
  initFeatured();
  initProductsPage();
  initCategoryPage();
});
