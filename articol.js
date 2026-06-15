const BLOG_SOURCE = "articole_blog.json?v=" + Date.now();

async function loadArticle() {
  const container = document.getElementById("blogContent");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  // Schimbăm citirea de la 'id' la 'slug'
  const articleSlug = urlParams.get("slug");

  if (!articleSlug) {
    container.innerHTML = "<h2>Articolul nu a fost găsit. URL invalid.</h2>";
    return;
  }

  try {
    const response = await fetch(BLOG_SOURCE);
    const articles = await response.json();

    // Căutăm în fișierul JSON articolul care are fix acel slug
    const article = articles.find((a) => a.slug === articleSlug);

    if (!article) {
      container.innerHTML = "<h2>Articolul solicitat nu există.</h2>";
      return;
    }

    // Setăm titlul tab-ului din browser
    document.title = article.title;

    // Păstrăm formatarea alineatelor din text (\n devine <br>)
    const formattedContent = article.content.replace(/\n/g, "<br>");

    container.innerHTML = `
            <h1 style="font-size: 2.5rem; margin-bottom: 20px; color: #2d3748;">${article.title}</h1>
            <img src="${article.image}" alt="${article.title}" style="width:100%; max-height:400px; object-fit:cover; border-radius:8px; margin-bottom:30px;">
            <div style="font-size: 1.2rem; line-height: 1.8; color: #4a5568;">
                ${formattedContent}
            </div>
        `;
  } catch (error) {
    console.error(error);
    container.innerHTML =
      "<h2>Eroare tehnică la încărcarea articolului pe mașina locală.</h2>";
  }
}

window.addEventListener("DOMContentLoaded", loadArticle);
