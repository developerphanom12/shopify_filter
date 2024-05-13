document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const productInfo = document.querySelector(".product-search-section");

  // Hide product info div initially
  productInfo.style.display = "none";

  // Function to handle search
  async function handleSearch() {
    const searchText = searchInput.value.trim(); // Trim whitespace from input
    if (searchText !== "") {
      try {
        const data = await fetchProductData(searchText);
        displayProducts(data);
        // Show product info div if search input has text
        productInfo.style.display = "flex";
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    } else {
      // Hide product info div if search input is empty
      productInfo.innerHTML = "";
      productInfo.style.display = "none";
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
    productInfo.innerHTML = "";

    // Create the two new divs
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("empty-div");
    emptyDiv.textContent = "COLLECTIONS";
    productInfo.appendChild(emptyDiv);

    const searchTitleParentDiv = document.createElement("div");
    searchTitleParentDiv.classList.add("search-title-parent");

    // Append the two new divs to the product info div

    productInfo.appendChild(searchTitleParentDiv);

    if (data.products.length > 0) {
      data.products.forEach((product) => {
        const productContainer = document.createElement("div");
        productContainer.classList.add("productsearchContainer");

        const sliderContainer = document.createElement("div");
        sliderContainer.classList.add("search-productshow");

        product.node.images.edges.forEach((variantEdge) => {
          const img = document.createElement("img");
          img.src = variantEdge.node.src; // Access the src property of the node object
          sliderContainer.appendChild(img);
        });
        productContainer.appendChild(sliderContainer);

        const titlePriceSec = document.createElement("div");
        titlePriceSec.classList.add("title-price");
        productContainer.appendChild(titlePriceSec);

        const titleElement = document.createElement("h2");
        titleElement.textContent = product.node.title;
        titlePriceSec.appendChild(titleElement);

        const variants = product.node.variants.edges;
        if (variants.length > 0) {
          const priceElement = document.createElement("p");
          priceElement.textContent = `Rs: ${variants[0].node.price}`; // Displaying the price of the first variant
          titlePriceSec.appendChild(priceElement);
        }

        searchTitleParentDiv.appendChild(productContainer);

        $(sliderContainer).slick(); // Initialize slick slider
      });
    } else {
      const noDataMessage = document.createElement("p");
      noDataMessage.textContent = "No products found for the entered title.";
      productInfo.appendChild(noDataMessage);
    }
  }
});
async function fetchAndDisplayCollections() {
  try {
    const response = await fetch(`/apps/proxy/collectionslist`);
    const data = await response.json();
    displayCollections(data.data);
  } catch (error) {
    console.error("Error fetching collections:", error);
  }
}

searchInput.addEventListener("input", function () {
  console.log("Input event triggered");
  handleSearch();
});
function displayCollections(collections) {
  const collectionListDiv = document.getElementById("collectionList");
  if (!collections || collections.length === 0) {
    collectionListDiv.innerText = "No collections found.";
    return;
  }

  collectionListDiv.innerHTML = "";

  const ul = document.createElement("ul");

  collections.forEach((collection) => {
    const li = document.createElement("li");
    li.textContent = collection.title;
    ul.appendChild(li);
  });

  collectionListDiv.appendChild(ul);
}
document.addEventListener("DOMContentLoaded", fetchAndDisplayCollections);

document.addEventListener("click", function(event) {
  const productSearchSection = document.querySelector(".product-search-section");
  const isClickInsideProductSearchSection = productSearchSection.contains(event.target);
  if (!isClickInsideProductSearchSection) {
    // Click occurred outside of product-search-section, so hide it
    productSearchSection.style.display = "none";
  }
});
