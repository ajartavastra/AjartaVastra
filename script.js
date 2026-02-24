async function loadProducts() {
  const response = await fetch("data/products.json");
  const products = await response.json();

  let html = '<div class="grid">';

  products.forEach((p) => {
    const imagePath = `products/${p.Category}/${p.ProductCode} - ${p.ProductName}.jpg`;

    html += `
        <div class="card">
            <img src="${imagePath}">
<!--            <h3>${p.Category}/${p.ProductCode} - ${p.ProductName}.jpg */ -->
            <h3>${p.ProductName}</h3>
            <p>${p.ProductCode}</p>
            <p class="price">₹${formatPrice(p.Price)}</p>
        </div>
        `;
  });

  html += "</div>";

  document.getElementById("content").innerHTML = html;
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN").format(price);
}

function loadGallery() {
  document.getElementById("content").innerHTML =
    "<h2 style='padding:20px'>Gallery will load from gallery folder.</h2>";
}
