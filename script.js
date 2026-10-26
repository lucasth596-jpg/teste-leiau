
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const productGrid = document.getElementById("product-grid");
  const searchStatus = document.getElementById("search-status");
  const emptyState = document.getElementById("empty-state");
  const clearSearch = document.getElementById("clear-search");
  const categoryButtons = document.querySelectorAll(".category-chip");
  const backToTop = document.getElementById("back-to-top");
  const currentYear = document.getElementById("current-year");

  const products = Array.from(
    document.querySelectorAll(".product-card")
  );

  let selectedCategory = "todos";
  let searchTerm = "";

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Remove acentos para facilitar a pesquisa.
  function normalizeText(value) {
    return value
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // Pesquisa produtos e aplica a categoria selecionada.
  function filterProducts() {
    let visibleCount = 0;

    products.forEach((product) => {
      const category = product.dataset.category || "";
      const name = product.dataset.name || "";
      const title = product.querySelector("h3")?.textContent || "";
      const description =
        product.querySelector(".product-description")?.textContent || "";

      const searchableText = normalizeText(
        `${name} ${title} ${description} ${category}`
      );

      const matchesCategory =
        selectedCategory === "todos" ||
        category === selectedCategory;

      const matchesSearch =
        normalizeText(searchTerm) === "" ||
        searchableText.includes(normalizeText(searchTerm));

      const isVisible = matchesCategory && matchesSearch;

      product.hidden = !isVisible;

      if (isVisible) {
        visibleCount++;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    if (productGrid) {
      productGrid.hidden = visibleCount === 0;
    }

    if (searchStatus) {
      if (searchTerm.trim() !== "") {
        searchStatus.textContent =
          `${visibleCount} produto(s) encontrado(s) para "${searchTerm}".`;
      } else {
        searchStatus.textContent = "";
      }
    }
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      searchTerm = searchInput.value;
      filterProducts();

      document.getElementById("ofertas")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value;
      filterProducts();
    });
  }

  // Filtros de categoria.
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category || "todos";

      categoryButtons.forEach((item) => {
        const isSelected = item === button;

        item.classList.toggle("selected", isSelected);
        item.setAttribute("aria-pressed", String(isSelected));
      });

      filterProducts();
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("selected"))
    );
  });

  // Limpa a pesquisa quando nenhum produto é encontrado.
  if (clearSearch) {
    clearSearch.addEventListener("click", () => {
      searchTerm = "";
      selectedCategory = "todos";

      if (searchInput) {
        searchInput.value = "";
      }

      categoryButtons.forEach((button) => {
        const isSelected = button.dataset.category === "todos";

        button.classList.toggle("selected", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
      });

      filterProducts();
    });
  }

  // Botão de voltar ao topo.
  function updateBackToTop() {
    if (!backToTop) return;

    backToTop.classList.toggle("visible", window.scrollY > 350);
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  updateBackToTop();
  filterProducts();
});
