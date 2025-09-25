const menuContainer = document.getElementById("menuContainer");
const cartDropdown = document.getElementById("cartDropdown");
const cartCount = document.getElementById("cartCount");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

let cart = [];

// Map restaurant-style categories to DummyJSON categories
const categoryMap = {
  "Starters": "groceries",
  "Main Courses": "furniture",
  "Desserts": "fragrances"
};

// Fetch menu by categories
async function loadMenu() {
  for (const [title, apiCategory] of Object.entries(categoryMap)) {
    const res = await fetch(`https://dummyjson.com/products/category/${apiCategory}?limit=3`);
    const data = await res.json();

    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("menu-category");
    categoryDiv.innerHTML = `<h3>${title}</h3><div class="menu-grid"></div>`;
    const grid = categoryDiv.querySelector(".menu-grid");

    data.products.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("menu-card");
      card.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <h4>${product.title}</h4>
        <p class="desc">${product.description.substring(0, 50)}...</p>
        <p class="price">$${product.price}</p>
        <button class="add-cart">Add to Cart</button>
      `;
      grid.appendChild(card);

      card.querySelector(".add-cart").addEventListener("click", () => {
        addToCart(product);
      });
    });

    menuContainer.appendChild(categoryDiv);
  }
}

// Load menu
loadMenu();

// Toggle cart dropdown
document.querySelector(".cart-container").addEventListener("click", () => {
  cartDropdown.classList.toggle("show");
});

// Add item to cart
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
}

// Update cart UI
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.title} (${item.qty})</span>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
      <button onclick="removeFromCart(${item.id})">❌</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartCount.textContent = cart.length;
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("✅ Order placed successfully!");
  cart = [];
  updateCart();
});
