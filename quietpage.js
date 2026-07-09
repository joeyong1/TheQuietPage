const backTop = document.querySelector(".back-top");
const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("quiet-page-theme");

if (savedTheme === "dark") {
  document.documentElement.dataset.theme = "dark";
}

if (themeToggle) {
  const updateThemeLabel = () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    themeToggle.textContent = isDark ? "\u2600" : "\u263E";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.setAttribute("aria-pressed", String(isDark));
  };

  updateThemeLabel();

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("quiet-page-theme", "light");
    } else {
      document.documentElement.dataset.theme = "dark";
      localStorage.setItem("quiet-page-theme", "dark");
    }
    updateThemeLabel();
  });
}

if (backTop) {
  window.addEventListener("scroll", () => {
    backTop.classList.toggle("show", window.scrollY > 500);
  });

  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const cartButtons = document.querySelectorAll(".add-cart");
const cartCountEl = document.querySelector(".cart-count");

function getCart() {
  return JSON.parse(localStorage.getItem("quiet-page-cart") || "[]");
}

function updateCartCount() {
  const cart = getCart();
  if (cartCountEl) cartCountEl.textContent = cart.length;
}

cartButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const bookName = btn.getAttribute("data-book");
    const cart = getCart();
    cart.push(bookName);
    localStorage.setItem("quiet-page-cart", JSON.stringify(cart));
    updateCartCount();
    btn.textContent = "Added ✓";
    setTimeout(() => { btn.textContent = "Add to Cart"; }, 1000);
  });
});

updateCartCount();

const cartListEl = document.querySelector("#cart-list");

if (cartListEl) {
  const cart = getCart();

  if (cart.length === 0) {
    cartListEl.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    const counts = {};
    cart.forEach((book) => {
      counts[book] = (counts[book] || 0) + 1;
    });

    let html = "<ul class='cart-items'>";
    Object.keys(counts).forEach((book) => {
      html += `<li>${book} × ${counts[book]} <button class="remove-item" data-book="${book}">Remove</button></li>`;
    });
    html += "</ul>";
    cartListEl.innerHTML = html;

    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const bookName = btn.getAttribute("data-book");
        let updatedCart = getCart();
        const index = updatedCart.indexOf(bookName);
        if (index > -1) updatedCart.splice(index, 1);
        localStorage.setItem("quiet-page-cart", JSON.stringify(updatedCart));
        updateCartCount();
        location.reload();
      });
    });
  }
}

const themeSelect = document.querySelector("#theme-select");

if (themeSelect) {
  const savedTheme = localStorage.getItem("quiet-page-theme");
  themeSelect.value = savedTheme || "system";

  themeSelect.addEventListener("change", () => {
    const choice = themeSelect.value;

    if (choice === "dark") {
      document.documentElement.dataset.theme = "dark";
      localStorage.setItem("quiet-page-theme", "dark");
    } else if (choice === "light") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("quiet-page-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("quiet-page-theme");
    }

    if (typeof updateThemeLabel === "function") updateThemeLabel();
  });
}

const clearCartBtn = document.querySelector("#clear-cart");

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    localStorage.removeItem("quiet-page-cart");
    updateCartCount();
    location.reload();
  });
}