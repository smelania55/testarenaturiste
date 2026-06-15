const fs = require("fs");
const path = require("path");

const JSON_FILE = "produse_2performant.json";

fs.readFile(JSON_FILE, "utf8", (err, data) => {
  if (err) {
    console.error("Eroare la citirea fișierului JSON:", err);
    return;
  }

  try {
    const products = JSON.parse(data);
    console.log(`Am găsit ${products.length} produse. Începe generarea...`);

    products.forEach((product) => {
      let safeTitle = product.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const fileName = `${safeTitle}.html`;

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
        `Descoperă calitățile excepționale ale acestui sortiment de miere de Manuka originală.`;
      const facebookDescription = `Cauți ${product.title}? Vezi beneficiile acestei miere de Manuka originală pentru imunitate și stomac.`;

      const baseUrl = `https://smelania55.github.io/testarenaturiste/${fileName}`;
      const encodedUrl = encodeURIComponent(baseUrl);
      const encodedImg = encodeURIComponent(imageUrl);
      const shareText = encodeURIComponent(
        `Cauți ${product.title}? Vezi detalii!`,
      );

      const htmlContent = `<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.title} - Detalii Produs</title>
    
    <meta property="og:title" content="${product.title}" />
    <meta property="og:description" content="${facebookDescription}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:type" content="product" />

    <link rel="stylesheet" href="style.css?v=6">
</head>
<body>

    <div class="container" style="margin-top: 40px; margin-bottom: 40px; max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 20px;">
        <div id="productContainer" style="display: flex; flex-wrap: wrap; gap: 40px;">
            <div class="product-left" style="flex: 1; min-width: 300px; text-align: center;">
                <img src="${imageUrl}" alt="${product.title}" class="main-product-img" style="max-width: 100%; height: auto; border-radius: 8px;">
            </div>
            <div class="product-right" style="flex: 1; min-width: 300px;">
                <h1 class="product-full-title" style="font-size: 2rem; margin-bottom: 15px; color: #ffffff;">${product.title}</h1>
                <p class="product-full-price" style="font-size: 1.5rem; color: #fbe7c6; font-weight: bold; margin-bottom: 20px;">${product.price} RON</p>
                
                <div style="margin-bottom: 25px;">
                    <a href="${affiliateLink}" target="_blank" rel="noopener noreferrer" class="buy-now-btn" style="display: inline-block; padding: 12px 30px; background: #b15b2c; color: white; text-decoration: none; font-weight: bold; border-radius: 6px;">
                        🍯 Vezi Preț
                    </a>
                </div>

                <p class="product-description" style="line-height: 1.6; margin-bottom: 30px; color: #cbd5e1;">${description}</p>

                <div class="share-inline-section" style="padding-top: 20px; border-top: 1px solid #334155; margin-top: 20px;">
                    <p style="font-size: 0.9rem; font-weight: bold; color: #fbe7c6; margin-bottom: 12px;">Distribuie acest produs:</p>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" style="background: #1877F2; color: white; padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; text-decoration: none; display: inline-block;">📘 Facebook</a>
                        <a href="https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" style="background: #25D366; color: white; padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; text-decoration: none; display: inline-block;">🟢 WhatsApp</a>
                        <a href="https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImg}&description=${shareText}" target="_blank" rel="noopener noreferrer" style="background: #E60023; color: white; padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; text-decoration: none; display: inline-block;">📌 Pinterest</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container" style="margin-top: 60px; margin-bottom: 60px; max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 20px;">
        <h3 style="color: #ffffff; text-align: center; margin-bottom: 30px; font-size: 1.5rem;">Produse Recomandate</h3>
        <div id="recomandate-grid"></div>
    </div>

    <footer style="margin-top: 80px; padding: 40px 0; border-top: 1px solid #334155;">
        <div class="container" style="max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 20px; text-align: center;">
            <p class="copyright-text" style="color: #cbd5e1;">
              &copy; 2026 <a href="https://www.mieredemanuka.com" style="color: #fbe7c6; text-decoration: none; font-weight: bold;">mieredemanuka.com</a>
            </p>
        </div>
    </footer>

    <script>
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

                    const currentTitle = document.querySelector('.product-full-title').innerText;
                    const filtrate = products.filter(p => p.title !== currentTitle);
                    const amestecate = filtrate.sort(() => 0.5 - Math.random()).slice(0, 4);

                    let gridHTML = '';
                    amestecate.forEach(p => {
                        let pSafe = p.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                        let pImg = p.image_urls || 'https://via.placeholder.com/230';
                        
                        gridHTML += '<div class="product-card" style="width: 230px; background: #1a2332; border-radius: 10px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">';
                        gridHTML += '  <div style="height: 180px; display: flex; align-items: center; justify-content: center; background: #ffffff; border-radius: 8px; padding: 10px; margin-bottom: 12px; overflow: hidden;">';
                        gridHTML += '    <img src="' + pImg + '" style="max-width: 100%; max-height: 100%; object-fit: contain;">';
                        gridHTML += '  </div>';
                        gridHTML += '  <h4 style="font-size: 0.9rem; margin: 10px 0; color: #ffffff; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; height: 55px; line-height: 1.3;">' + p.title + '</h4>';
                        gridHTML += '  <div style="font-weight: bold; color: #fbe7c6; margin-bottom: 12px; font-size: 1.1rem;">' + p.price + ' RON</div>';
                        gridHTML += '  <a href="' + pSafe + '.html" style="display: block; text-decoration: none; padding: 8px 15px; background-color: #fbe7c6; color: #b15b2c; font-weight: bold; border-radius: 6px; font-size: 0.85rem;">Vezi Produs</a>';
                        gridHTML += '</div>';
                    });
                    
                    grid.innerHTML = gridHTML;
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

    console.log("Succes! Toate paginile au fost re-generate curat.");
  } catch (e) {
    console.error("Eroare la procesarea datelor JSON:", e);
  }
});
