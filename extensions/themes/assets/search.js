document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  // Function to handle search
  async function handleSearch() {
    const searchText = searchInput.value.trim(); // Trim whitespace from input
    if (searchText !== "") {
      try {
        const data = await fetchProductData(searchText);
        displayProducts(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }
  }

  // Add event listener for search button click
  searchButton.addEventListener("click", handleSearch);

  // Add event listener for search input value change
  searchInput.addEventListener("input", handleSearch);

  async function fetchProductData(title) {
    const response = await fetch(
      `/apps/proxy/search?title=${encodeURIComponent(title)}`
    );
    return await response.json();
  }
  function displayProducts(data) {
    const productInfo = document.querySelector(".product-search-section");
    productInfo.innerHTML = "";

    if (data.products.length > 0) {
      data.products.forEach((product) => {
        const productContainer = document.createElement("div");
        productContainer.classList.add("productsearchContainer");

        const titleElement = document.createElement("h2");
        titleElement.textContent = product.node.title;
        productContainer.appendChild(titleElement);

        const sliderContainer = document.createElement("div");
        sliderContainer.classList.add("search-productshow");

        product.node.images.edges.forEach((variantEdge) => {
          const img = document.createElement("img");
          img.src = variantEdge.node.src; // Access the src property of the node object
          sliderContainer.appendChild(img);
        });

        const variants = product.node.variants.edges;
        if (variants.length > 0) {
          const priceElement = document.createElement("p");
          priceElement.textContent = `Price: $${variants[0].node.price}`; // Displaying the price of the first variant
          productContainer.appendChild(priceElement);
        }

        productContainer.appendChild(sliderContainer);
        productInfo.appendChild(productContainer);

        $(sliderContainer).slick(); // Initialize slick slider
      });
    } else {
      const noDataMessage = document.createElement("p");
      noDataMessage.textContent = "No products found for the entered title.";
      productInfo.appendChild(noDataMessage);
    }
  }
});
