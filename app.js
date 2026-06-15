const PRODUCTS_SOURCE = "produse_2performant.json?v=" + Date.now();
const BLOG_SOURCE = "articole_blog.json?v=" + Date.now();

let allProducts = [];
let allArticles = [];
let currentView = "produse"; // implicit afișăm produsele

async function loadAllData() {
  try {
    const [prodRes, blogRes] = await Promise.all([
      fetch(PRODUCTS_SOURCE),
      fetch(BLOG_SOURCE),
    ]);
    allProducts = await prodRes.json();
    allArticles = await blogRes.json();

    displayGridContent();
    checkUrlForSearch(); // Verifică dacă utilizatorul a venit prin link-urile SEO din Footer
  } catch (error) {
    console.error("Eroare la încărcarea datelor:", error);
  }
}

function displayGridContent() {
  const grid = document.getElementById("productsGrid");
  const dynamicTitle = document.getElementById("sectionDynamicTitle");
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  if (!grid) return;

  if (currentView === "blog") {
    if (dynamicTitle) dynamicTitle.innerText = "Articole din blog";
    const filteredArticles = allArticles.filter((a) =>
      a.title.toLowerCase().includes(searchTerm),
    );

    if (filteredArticles.length === 0) {
      grid.innerHTML = '<div class="loading">Niciun articol găsit.</div>';
      return;
    }

    grid.innerHTML = filteredArticles
      .map(
        (article) => `
            <div class="product-card">
                <img src="${article.image}" alt="${article.title}" class="product-image" style="object-fit: cover;">
                <div class="product-info">
                    <h2 class="product-title">${article.title}</h2>
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 15px;">${article.excerpt}</p>
                    <a href="articol.html?slug=${article.slug}" class="affiliate-btn">
                        Citește Articolul
                    </a>
                </div>
            </div>
        `,
      )
      .join("");
  } else {
    if (dynamicTitle) dynamicTitle.innerText = "Catalog produse";
    const filteredProducts = allProducts.filter((p) =>
      p.title.toLowerCase().includes(searchTerm),
    );

    if (filteredProducts.length === 0) {
      grid.innerHTML = '<div class="loading">Niciun produs găsit.</div>';
      return;
    }

    grid.innerHTML = filteredProducts
      .map((product) => {
        // Folosim exact coloana image_urls din noul tău fișier
        const imageUrl =
          product.image_urls || "https://via.placeholder.com/280x200";

        // Pentru că nu există ID, codificăm Titlul pentru a-l folosi ca identificator în URL
        const productIdentifier = encodeURIComponent(product.title);

        return `
                <div class="product-card">
                    <img src="${imageUrl}" alt="${product.title}" class="product-image" loading="lazy">
                    <div class="product-info">
                        <h2 class="product-title">${product.title}</h2>
                        <p class="product-price">${product.price} RON</p>
                        <a href="produs.html?id=${productIdentifier}" class="affiliate-btn">
                            Detalii Produs
                        </a>
                    </div>
                </div>
            `;
      })
      .join("");
  }
}

// Navigare prin Scroll lin la butoanele din Header
document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const targetId = e.target.getAttribute("data-scroll");
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      if (targetId === "blogSection") {
        currentView = "blog";
        document.getElementById("showBlogBtn").classList.add("active");
        document.getElementById("showProductsBtn").classList.remove("active");
        displayGridContent();
      }
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Control comutatoare Produse / Blog (zona de jos)
const showProductsBtn = document.getElementById("showProductsBtn");
const showBlogBtn = document.getElementById("showBlogBtn");

if (showProductsBtn && showBlogBtn) {
  showProductsBtn.addEventListener("click", () => {
    currentView = "produse";
    showProductsBtn.classList.add("active");
    showBlogBtn.classList.remove("active");
    displayGridContent();
  });

  showBlogBtn.addEventListener("click", () => {
    currentView = "blog";
    showBlogBtn.classList.add("active");
    showProductsBtn.classList.remove("active");
    displayGridContent();
  });
}

// Logică bară de căutare
document.getElementById("searchInput").addEventListener("input", () => {
  const gridSection = document.getElementById("blogSection");
  const searchTerm = document.getElementById("searchInput").value.trim();

  if (searchTerm.length > 0 && gridSection) {
    gridSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  displayGridContent();
});

// Suport tehnic pentru link-urile SEO din Footer
function checkUrlForSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("search");
  if (searchParam) {
    const input = document.getElementById("searchInput");
    if (input) {
      input.value = decodeURIComponent(searchParam);
      const gridSection = document.getElementById("blogSection");
      if (gridSection) {
        setTimeout(() => {
          gridSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
      displayGridContent();
    }
  }
}

window.addEventListener("DOMContentLoaded", loadAllData);
