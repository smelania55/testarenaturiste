const fs = require("fs");
const path = require("path");

// Numele sursei de date JSON
const JSON_FILE = "produse_2performant.json";

// Citim produsele din fișierul tău JSON
fs.readFile(JSON_FILE, "utf8", (err, data) => {
  if (err) {
    console.error("Eroare la citirea fișierului JSON:", err);
    return;
  }

  try {
    const products = JSON.parse(data);
    console.log(
      `Am găsit ${products.length} produse. Începe generarea paginilor HTML...`,
    );

    products.forEach((product) => {
      // Generăm un nume de fișier curat pentru URL (ex: miere-de-manuka-mgo-400.html)
      let safeTitle = product.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-") // Înlocuim spațiile și caracterele speciale cu cratime
        .replace(/-+/g, "-") // Eliminăm cratimele duble
        .replace(/^-|-$/g, ""); // Curățăm cratimele de la început sau final

      const fileName = `${safeTitle}.html`;

      // Identificăm link-ul de afiliat automat
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
        `Descoperă calitățile excepționale ale acestui sortiment de miere de Manuka originală, certificată și importată direct de la producători de top.`;
      const facebookDescription = `Cauți ${product.title}? Vezi beneficiile acestei miere de Manuka originală pentru imunitate și stomac. Profită de preț și comandă acum!`;

      // Șablonul HTML brut (cu etichetele META scrise fix în text pentru Facebook/WhatsApp)
      const htmlContent = `<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.title} - Miere de Manuka Originală</title>
    
    <meta property="og:title" content="${product.title}" />
    <meta property="og:description" content="${facebookDescription}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:type" content="product" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <link rel="stylesheet" href="style.css?v=5">
</head>
<body>

    <div class="container" style="margin-top: 40px; margin-bottom: 40px;">
        <div id="productContainer">
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
        </div>
    </div>

    <div class="container" style="margin-top: 50px;">
        <h3 style="color: #ffffff; text-align: center; margin-bottom: 20px;">Produse Recomandate</h3>
        <div id="recomandate-grid"></div>
    </div>

    <script>
        // Trimitem datele către o funcție simplă de recomandări direct în pagină
        window.addEventListener('DOMContentLoaded', () => {
            fetch('${JSON_FILE}')
                .then(res => res.json())
                .then(products => {
                    const grid = document.getElementById('recomandate-grid');
                    if(!grid) return;
                    grid.style.display = "flex";
                    grid.style.flexWrap = "wrap";
                    grid.style.gap = "20px";
                    grid.style.justifyContent = "center";

                    const filtrate = products.filter(p => p.title !== "${product.title.replace(/"/g, '\\"')}");
                    const amestecate = filtrate.sort(() => 0.5 - Math.random()).slice(0, 4);

                    grid.innerHTML = amestecate.map(p => \`
                        <div class="product-card" style="width: 230px; background: #1a2332; border-radius: 10px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between; text-align: center;">
                            <div style="height: 180px; display: flex; align-items: center; justify-content: center; background: #ffffff; border-radius: 8px; padding: 10px; margin-bottom: 12px; overflow: hidden;">
                                <img src="\${p.image_urls || '${imageUrl}'}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                            </div>
                            <h4 style="font-size: 0.9rem; margin: 10px 0; color: #ffffff; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; height: 55px;">\${p.title}</h4>
                            <div style="font-weight: bold; color: #fbe7c6; margin-bottom: 12px;">\${p.price} RON</div>
                            <a href="\${p.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}.html" style="display: block; text-decoration: none; padding: 8px 15px; background-color: #fbe7c6; color: #b15b2c; font-weight: bold; border-radius: 6px; font-size: 0.85rem;">Vezi Produs</a>
                        </div>
                    \`).join('');
                });
        });
    </script>
</body>
</html>`;

      fs.writeFile(fileName, htmlContent, "utf8", (err) => {
        if (err)
          console.error(`Eroare la scrierea fișierului ${fileName}:`, err);
      });
    });

    console.log(
      "Succes! Toate paginile HTML fizice au fost generate în folderul curent.",
    );
  } catch (e) {
    console.error("Eroare la procesarea datelor JSON:", e);
  }
});
