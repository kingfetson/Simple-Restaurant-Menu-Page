const cartDropdown = document.getElementById("cartDropdown");
const cartCount = document.getElementById("cartCount");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
let cart = [];

// Load menu from TheMealDB
async function loadMenu() {
  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=c"); 
    const data = await response.json();

    const menuGrid = document.getElementById("menuGrid");
    menuGrid.innerHTML = "";

    data.meals.forEach(meal => {
      const card = document.createElement("div");
      card.classList.add("menu-card");

      const price = (Math.random() * 20 + 5).toFixed(2); // random price

      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h4>${meal.strMeal}</h4>
        <p class="desc">${meal.strCategory}</p>
        <p class="price">$${price}</p>
        <button class="add-to-cart">Add to Cart</button>
      `;

      menuGrid.appendChild(card);

      // Add to cart button
      card.querySelector(".add-to-cart").addEventListener("click", () => {
        addToCart({
          id: meal.idMeal,
          title: meal.strMeal,
          price: parseFloat(price),
          thumbnail: meal.strMealThumb
        });
      });
    });
  } catch (err) {
    console.error("Error loading menu:", err);
  }
}

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

// Remove from cart
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

// Load menu on page start
document.addEventListener("DOMContentLoaded", loadMenu);
