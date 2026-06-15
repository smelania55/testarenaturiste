const PRODUCTS_SOURCE = "produse_2performant.json";

async function loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedId = urlParams.get("id"); // Preia titlul codificat din URL

  if (!encodedId) {
    document.getElementById("productContainer").innerHTML =
      '<div class="loading">Produsul nu a fost găsit.</div>';
    return;
  }

  const productTitle = decodeURIComponent(encodedId);

  try {
    const response = await fetch(PRODUCTS_SOURCE);
    const products = await response.json();

    const product = products.find((p) => p.title === productTitle);

    if (!product) {
      document.getElementById("productContainer").innerHTML =
        '<div class="loading">Produsul nu există în catalog.</div>';
      return;
    }

    document.getElementById("productPageTitle").innerText =
      product.title + " - Detalii Produs";

    // Identificăm linkul automat
    let affiliateLink = "#";
    for (let key in product) {
      if (product[key] && product[key].toString().includes("http")) {
        affiliateLink = product[key];
        break;
      }
    }

    const imageUrl = product.image_urls || "https://via.placeholder.com/350";
    const description =
      product.description ||
      "Descoperă calitățile excepționale ale acestui sortiment de miere de Manuka originală, certificată și importată direct de la producători de top.";

    // URL Absotel/Complet pentru imagini (necesar pentru rețelele sociale)
    let fullImageUrl = imageUrl;
    if (!imageUrl.startsWith("http")) {
      fullImageUrl = window.location.origin + "/" + imageUrl;
    }

    // Configurare link-uri pentru butoanele de distribuire (share)
    const currentUrl = window.location.href;
    const shareText = encodeURIComponent(
      `Cauți ${product.title}? Vezi beneficiile acestei miere de Manuka originală!`,
    );

    // Soluție tehnică: Atașăm parametrii imaginii direct în URL-ul trimis către Facebook
    const fbShareUrl = encodeURIComponent(
      `${currentUrl}&fb_image=${encodeURIComponent(fullImageUrl)}&fb_title=${encodeURIComponent(product.title)}`,
    );
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedImg = encodeURIComponent(fullImageUrl);

    // 1. Randăm structura curată a produsului în pagină
    document.getElementById("productContainer").innerHTML = `
            <div class="product-left">
                <img src="${imageUrl}" alt="${product.title}" class="main-product-img">
            </div>
            <div class="product-right">
                <h1 class="product-full-title">${product.title}</h1>
                <p class="product-full-price">${product.price} RON</p>
                
                <div style="margin-bottom: 25px;">
                    <a href="${affiliateLink}" target="_blank" rel="noopener noreferrer" class="buy-now-btn">
                        🍯 Vezi Preț
                    </a>
                </div>

                <p class="product-description">${description}</p>
            </div>
        `;

    // 2. Creăm și adăugăm bara laterală Sticky pentru rețelele sociale
    EliminaBaraSocialaveche();

    const socialBar = document.createElement("div");
    socialBar.id = "sticky-social-sidebar";
    socialBar.innerHTML = `
        <a href="https://www.facebook.com/sharer/sharer.php?u=${fbShareUrl}" 
           target="_blank" rel="noopener noreferrer" class="sticky-btn fb-btn" title="Distribuie pe Facebook">
           📘
        </a>
        <a href="https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}" 
           target="_blank" rel="noopener noreferrer" class="sticky-btn wa-btn" title="Trimite pe WhatsApp">
           🟢
        </a>
        <a href="https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImg}&description=${shareText}" 
           target="_blank" rel="noopener noreferrer" class="sticky-btn pin-btn" title="Salvează pe Pinterest">
           📌
        </a>
        <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}" 
           target="_blank" rel="noopener noreferrer" class="sticky-btn x-btn" title="Distribuie pe X">
           𝕏
        </a>
    `;
    document.body.appendChild(socialBar);

    // 3. Actualizăm meta-etichetele în fundal pentru browsere și sisteme locale
    if (document.getElementById("ogTitle")) {
      document.getElementById("ogTitle").setAttribute("content", product.title);
    }
    if (document.getElementById("ogDescription")) {
      document
        .getElementById("ogDescription")
        .setAttribute(
          "content",
          `Cauți ${product.title}? Vezi beneficiile acestei miere de Manuka originală.`,
        );
    }
    if (document.getElementById("ogImage")) {
      document.getElementById("ogImage").setAttribute("content", fullImageUrl);
    }

    // Afișăm produsele recomandate la bază
    afiseazaRecomandate(products, product.title);
  } catch (error) {
    console.error("Eroare la încărcarea produsului:", error);
    document.getElementById("productContainer").innerHTML =
      '<div class="loading">Eroare la încărcarea datelor.</div>';
  }
}

function EliminaBaraSocialaveche() {
  const elementulVechi = document.getElementById("sticky-social-sidebar");
  if (elementulVechi) {
    elementulVechi.remove();
  }
}

window.addEventListener("DOMContentLoaded", loadProductDetails);

// Funcție optimizată pentru controlul dimensiunilor și așezare curată a recomandărilor
function afiseazaRecomandate(toateProdusele, titluProdusCurent) {
  const grid = document.getElementById("recomandate-grid");
  if (!grid) return;

  grid.style.display = "flex";
  grid.style.flexWrap = "wrap";
  grid.style.gap = "20px";
  grid.style.justifyContent = "center";
  grid.style.marginTop = "20px";

  // Filtrăm după proprietatea .title ca să NU reafișăm produsul curent
  const produseFiltrate = toateProdusele.filter(
    (p) => p.title !== titluProdusCurent,
  );

  // Le amestecăm aleatoriu
  const produseAmestecate = produseFiltrate.sort(() => 0.5 - Math.random());

  // Luăm exact 4 produse pentru recomandări
  const recomandate = produseAmestecate.slice(0, 4);

  // Generăm structura HTML pentru cele 4 carduri recomandate
  grid.innerHTML = recomandate
    .map(
      (produs) => `
        <div class="product-card" style="width: 230px; background: #1a2332; border-radius: 10px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
            <div class="product-image-wrapper" style="height: 180px; display: flex; align-items: center; justify-content: center; background: #ffffff; border-radius: 8px; padding: 10px; margin-bottom: 12px; overflow: hidden;">
                <img src="${produs.image_urls || "imagini/miere-de-manuka-proprietati.webp"}" alt="${produs.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
            <h4 style="font-size: 0.9rem; margin: 10px 0; color: #ffffff; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; height: 55px; line-height: 1.3;">${produs.title}</h4>
            <div class="product-price" style="font-weight: bold; color: #fbe7c6; margin-bottom: 12px; font-size: 1.1rem;">${produs.price} RON</div>
            <a href="produs.html?id=${encodeURIComponent(produs.title)}" class="view-btn" style="display: block; text-decoration: none; padding: 8px 15px; background-color: #fbe7c6; color: #b15b2c; font-weight: bold; border-radius: 6px; font-size: 0.85rem; transition: background 0.2s;">Vezi Produs</a>
        </div>
    `,
    )
    .join("");
}
