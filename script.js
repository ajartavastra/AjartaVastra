document.addEventListener("DOMContentLoaded", function () {
  // Load products immediately when the site starts
  loadProducts();
});

let products = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 16;

async function loadProducts() {
  const response = await fetch("data/products.json");
  products = await response.json();
  filteredProducts = [...products];

  renderProducts();
  setupPagination();
  setupCategoryFilter(); // dynamically build filter options

  // 👇 Apply search term AFTER products are loaded
  const params = new URLSearchParams(window.location.search);
  const searchTerm = params.get("search");
  if (searchTerm) {
    searchProducts(searchTerm);
  }
}

function renderProducts() {
  // Hide catalog-specific controls + pagination
  document.getElementById("controls").style.display = "flex";
  document.getElementById("pagination").style.display = "flex";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = filteredProducts.slice(start, end);

  let html = '<div class="grid">';
  paginatedItems.forEach((p) => {
    const imagePath = `products/${p.Category}/${p.ProductCode} - ${p.ProductName}.jpg`;
    html += `
      <div class="card" onclick="openModal('${imagePath}')">
        <img src="${imagePath}">
        <h3>${p.ProductName}</h3>
        <p>${p.ProductCode}</p>
        <p class="price">₹${formatPrice(p.Price)}</p>
      </div>
    `;
  });
  html += "</div>";

  document.getElementById("content").innerHTML = html;
}
// Modal functions
function openModal(imagePath) {
  const modal = document.getElementById("productModal");
  const modalImg = document.getElementById("modalImage");
  modal.style.display = "block";
  modalImg.src = imagePath;
}
function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

function setupPagination() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  let paginationHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button onclick="goToPage(${i})" class="${i === currentPage ? "active" : ""}">${i}</button>`;
  }

  document.getElementById("pagination").innerHTML = paginationHTML;
}

function goToPage(page) {
  currentPage = page;
  renderProducts();
  setupPagination();
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN").format(price);
}

// 🔍 Search
function searchProducts() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  filteredProducts = products.filter(
    (p) =>
      p.ProductName.toLowerCase().includes(query) ||
      p.ProductCode.toLowerCase().includes(query) ||
      p.Category.toLowerCase().includes(query),
  );
  currentPage = 1;
  renderProducts();
  setupPagination();
}

// ⬇️ Sort
function sortProducts(criteria) {
  if (criteria === "name") {
    filteredProducts.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
  } else if (criteria === "priceLowHigh") {
    filteredProducts.sort((a, b) => a.Price - b.Price);
  } else if (criteria === "priceHighLow") {
    filteredProducts.sort((a, b) => b.Price - a.Price);
  }
  currentPage = 1;
  renderProducts();
  setupPagination();
}

// 🏷️ Filter by category
function filterCategory(category) {
  if (category === "all") {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter((p) => p.Category === category);
  }
  currentPage = 1;
  renderProducts();
  setupPagination();
}

// 🛠️ Build category filter dynamically
function setupCategoryFilter() {
  const categorySelect = document.getElementById("categoryFilter");
  const categories = [...new Set(products.map((p) => p.Category))];

  // Clear existing options
  categorySelect.innerHTML = "";

  // Add "All" option
  categorySelect.innerHTML += `<option value="all">All</option>`;

  // Add unique categories
  categories.forEach((cat) => {
    categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

/* Loading Home */

function loadHome() {
  // Hide catalog-specific controls + pagination
  document.getElementById("controls").style.display = "none";
  document.getElementById("pagination").style.display = "none";

  // Use your provided text directly
  const aboutText = `
    Ajarta Vastra brings you the timeless beauty of authentic handwoven silk and cotton sarees, crafted by skilled Indian artisans. 
    Our endeavour is rooted in a dual purpose — to help you reconnect with India’s rich cultural heritage, and to support the handloom weavers who preserve these traditions through their craft.
    The name “Ajarta” (pronounced Ajaratha) signifies eternal youth, reflecting the ageless elegance of handloom textiles, while “Vastra” represents clothing. 
    Together, Ajarta Vastra stands for apparel that transcends time and trends.
    With sincerity and care, we are committed to offering genuine, high-quality handloom sarees that carry tradition, authenticity, and meaning in every weave.
  `;

  let html = `
    <div class="about-section">
      <div class="about-block">
        <div class="about-text">
          <p>${aboutText}</p>
        </div>
        <div class="about-image">
          <img src="assets/home1.png" alt="Handloom tradition">
        </div>
      </div>

      <div class="about-block reverse">
        <div class="about-text">
          <p>Our artisans weave stories into every thread, blending heritage with modern elegance.</p>
        </div>
        <div class="about-image">
          <img src="assets/home2.png" alt="Craftsmanship">
        </div>
      </div>

      <div class="about-block">
        <div class="about-text">
          <p>Each saree is a celebration of culture, designed to bring timeless beauty to your wardrobe.</p>
        </div>
        <div class="about-image">
          <img src="assets/home3.png" alt="Saree showcase">
        </div>
      </div>
    </div>
  `;

  document.getElementById("content").innerHTML = html;
  // 👇 Force scroll to top whenever Home loads
  window.scrollTo(0, 0);
}

function setActiveMenu(button) {
  // Remove active class from all buttons
  document
    .querySelectorAll(".nav button")
    .forEach((btn) => btn.classList.remove("active"));
  // Add active class to the clicked button
  button.classList.add("active");
}

/* Footer links related */

function loadPage(page) {
  // Hide catalog-specific controls + pagination
  document.getElementById("controls").style.display = "none";
  document.getElementById("pagination").style.display = "none";

  fetch(`pages/${page}.html`)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("content").innerHTML = data;
      window.scrollTo(0, 0); // always scroll to top
    })
    .catch((err) => {
      document.getElementById("content").innerHTML =
        "<p>Error loading page.</p>";
      console.error(err);
    });
}

/* Load Gallery Function */

function loadGallery() {
  fetch("data/gallery.json")
    .then((response) => response.json())
    .then((data) => {
      const content = document.getElementById("content");
      content.innerHTML = ""; // clear previous content

      // Add welcome heading
      const welcome = document.createElement("h1");
      welcome.textContent = "Welcome to our Gallery";
      welcome.className = "gallery-welcome";
      /*      welcome.style.fontWeight = "bold";
      welcome.style.fontSize = "2em";
      welcome.style.margin = "20px 0";*/
      content.appendChild(welcome);

      // Loop through gallery sections
      Object.keys(data).forEach((titleText) => {
        const title = document.createElement("div");
        title.className = "gallery-title";
        title.textContent = titleText;
        content.appendChild(title);

        const row = document.createElement("div");
        row.className = "gallery-row";

        data[titleText].forEach((imgPath) => {
          const img = document.createElement("img");
          img.src = imgPath;
          img.alt = titleText;
          img.style.cursor = "pointer";
          img.onclick = () => openModal(imgPath, titleText); // reuse your existing modal
          row.appendChild(img);
        });

        content.appendChild(row);
      });
    })
    .catch((err) => console.error("Error loading gallery:", err));
}

/*
// Modal functions
function openModal(src, captionText) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const caption = document.getElementById("caption");

  modal.style.display = "block";
  modalImg.src = src;
  caption.textContent = captionText;
}

document.querySelector(".close").onclick = function () {
  document.getElementById("imageModal").style.display = "none";
};
*/
