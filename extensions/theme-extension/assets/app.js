document.addEventListener("DOMContentLoaded", async function () {
  try {
    const data = await fetchProductData();
    displayProducts(data);
    const defaultSize = "S"; // Change to your default size
    await fetchAndDisplayProducts(defaultSize, null);
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
});

async function fetchProductData() {
  const response = await fetch("/apps/proxy-1/product");
  return await response.json();
  console.log("bdfhdfhdf", response);
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const data = await fetchProductData();
    displayProducts(data);
    const defaultSize = "S"; // Change to your default size
    await fetchAndDisplayProducts(defaultSize, null);
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
});

async function fetchProductData() {
  const response = await fetch("/apps/proxy-1/product");
  return await response.json();
}

async function fetchAndDisplayProducts(size, color) {
  const productInfo = document.querySelector(".product-section");
  if (!productInfo) {
    console.error("Product info element not found.");
    return;
  }

  try {
    const sizeParam = size ? `sizes=${size}` : "";
    const colorParam = color ? `&colors=${color}` : "";
    const priceOption = document.querySelector(".selectedPriceOption");
    let minPrice = null;
    let maxPrice = null;
    if (priceOption) {
      minPrice = priceOption.dataset.min;
      maxPrice = priceOption.dataset.max;
    }
    const priceParam =
      minPrice && maxPrice ? `&minPrice=${minPrice}&maxPrice=${maxPrice}` : "";

    const response = await fetch(
      `/apps/proxy-1/collections?${sizeParam}${colorParam}${priceParam}`
    );
    const data = await response.json();
    console.log("data", data);
    productInfo.innerHTML = "";

    if (data.products.length > 0) {
      data.products.forEach((product) => {
        const productContainer = document.createElement("div");
        productContainer.classList.add("productContainer");

        const sliderContainer = document.createElement("div");
        sliderContainer.classList.add("slider");

        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";
        product.variants.forEach((variant) => {
          if (variant.image) {
            const img = document.createElement("img");
            img.src = variant.image;
            sliderContainer.appendChild(img);

            addToCartButton.classList.add("addToCartButton");

            // Add event listener to the button if needed
            addToCartButton.addEventListener("click", () => {
              // Handle adding the product to the cart here
              console.log("Product added to cart");
            });

            productContainer.appendChild(addToCartButton);
          }
        });

        // Initialize slick slider for the main images
        $(sliderContainer).slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          asNavFor: ".thumbnails",
          arrows: false,
          fade: true,
          adaptiveHeight: true,
        });
        // ---------------------------thumbnail-----------------------------------------------
        const thumbnailContainer = document.createElement("div");
        thumbnailContainer.classList.add("thumbnails");

        const colorsAdded = new Set(); // Create a set to track added colors for thumbnails

        product.variants.forEach((variant) => {
          if (variant.image) {
            const color = variant.selectedOptions
              .find((option) => option.name.toLowerCase() === "color")
              ?.value.toLowerCase();
            if (color && !colorsAdded.has(color)) {
              const thumbnailImg = document.createElement("img");
              thumbnailImg.src = variant.image;
              thumbnailImg.classList.add("thumbnail");
              thumbnailImg.addEventListener("click", () => {
                $(sliderContainer).slick("slickGoTo", $(thumbnailImg).index());
              });
              thumbnailContainer.appendChild(thumbnailImg);

              colorsAdded.add(color); // Add color to the set
            }
          }
        });

        // Initialize slick slider for the thumbnails
        // Calculate the number of thumbnails to show dynamically

        $(thumbnailContainer).slick({
          slidesToShow: 4,
          slidesToScroll: 1,
          asNavFor: ".slider",
          dots: false,
          centerMode: true,
          focusOnSelect: true,
        });

        productContainer.appendChild(sliderContainer);
        // ------------------------------------------end---------------------------------------------

        const titleElement = document.createElement("h2");
        titleElement.textContent = product.title;
        productContainer.appendChild(titleElement);

        const priceElement = document.createElement("h4");
        priceElement.textContent = `Rs: ${product.variants[0].price}`; // Displaying the price of the first variant
        productContainer.appendChild(priceElement);

        productInfo.appendChild(productContainer);
        productContainer.appendChild(thumbnailContainer);
      });
    } else {
      const noDataMessage = document.createElement("p");
      noDataMessage.textContent =
        "No products found for the selected size and color.";
      productInfo.appendChild(noDataMessage);
    }
  } catch (error) {
    productInfo.innerHTML =
      "<p>An error occurred while fetching product data.</p>";
    console.error("Error fetching product data:", error);
  }
}

const sizesContainer = document.getElementById("sizesList");
const colorsContainer = document.getElementById("colorsList");
const priceOptions = document.querySelectorAll(".priceOption");

let selectedSize = null;
let selectedColor = null;
let selectedPriceOption = null;

function updateSelection(element, container, fetchData) {
  const selectedClass = "selected";
  const deselectedClass = "deselected";

  if (element.classList.contains(selectedClass)) {
    element.classList.remove(selectedClass);
    element.classList.add(deselectedClass);

    if (container.id === "sizesList") {
      selectedSize = null;
    } else if (container.id === "colorsList") {
      selectedColor = null;
    }
  } else {
    const selectedElement = container.querySelector(`.${selectedClass}`);

    if (selectedElement) {
      selectedElement.classList.remove(selectedClass);
      selectedElement.classList.add(deselectedClass);
    }

    element.classList.add(selectedClass);
    element.classList.remove(deselectedClass);

    if (container.id === "sizesList") {
      selectedSize = element.textContent;
    } else if (container.id === "colorsList") {
      selectedColor = element.textContent;
    }
  }

  fetchData(selectedSize, selectedColor);
}

function updateSelectedOptions() {
  const selectedOptionsDiv = document.getElementById("selectedOptions");
  if (!selectedOptionsDiv) return;

  let selectedOptionsText = "Selected options: ";
  if (selectedSize) {
    selectedOptionsText += `Size: ${selectedSize}, `;
  }
  if (selectedColor) {
    selectedOptionsText += `Color: ${selectedColor}, `;
  }
  if (selectedPriceOption) {
    const minPrice = selectedPriceOption.dataset.min;
    const maxPrice = selectedPriceOption.dataset.max;
    selectedOptionsText += `Price: ${minPrice} - ${maxPrice}, `;
  }

  selectedOptionsText = selectedOptionsText.slice(0, -2);

  selectedOptionsDiv.textContent = selectedOptionsText;
}

sizesContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("sizeElement")) {
    updateSelection(event.target, sizesContainer, fetchAndDisplayProducts);
  }
});

colorsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("colorElement")) {
    updateSelection(event.target, colorsContainer, fetchAndDisplayProducts);
  }
});

priceOptions.forEach((option) => {
  option.addEventListener("click", async () => {
    const selectedOption = document.querySelector(".selectedPriceOption");
    if (selectedOption) {
      selectedOption.classList.remove("selectedPriceOption");
    }
    option.classList.add("selectedPriceOption");
    selectedPriceOption = option;
    const size = selectedSize;
    const color = selectedColor;
    await fetchAndDisplayProducts(size, color);
  });
});
const clearColorButton = document.getElementById("clearColorButton");
if (clearColorButton) {
  clearColorButton.addEventListener("click", async () => {
    const selectedColorElement = document.querySelector(".selectedColor");
    if (selectedColorElement) {
      selectedColorElement.classList.remove("selectedColor");
      selectedColorElement.classList.add("deselected"); // Add deselected class
    }
    selectedColor = null;
    const size = selectedSize;
    await fetchAndDisplayProducts(size, null);
  });
}

function displayProducts(data) {
  sizesContainer.innerHTML = "";
  colorsContainer.innerHTML = "";

  if (!data || !data.products || data.products.edges.length === 0) {
    const noDataMessage = document.createElement("p");
    noDataMessage.textContent = "No data available.";
    sizesContainer.appendChild(noDataMessage);
    return;
  }

  const sizesSet = new Set();
  const colorsSet = new Set();

  data.products.edges.forEach((productEdge) => {
    productEdge.node.variants.edges.forEach((variantEdge) => {
      variantEdge.node.selectedOptions.forEach((option) => {
        if (option.name.toLowerCase() === "size") {
          sizesSet.add(option.value.toUpperCase());
        }
        if (option.name.toLowerCase() === "color") {
          colorsSet.add(option.value.toUpperCase());
        }
      });
    });
  });

  const sizesArray = Array.from(sizesSet).sort();
  const colorsArray = Array.from(colorsSet).sort();

  if (sizesArray.length > 0) {
    sizesArray.forEach((size) => {
      const sizeElement = document.createElement("div");
      sizeElement.classList.add("sizeElement");
      sizeElement.textContent = size;
      sizeElement.addEventListener("click", async () => {
        const selectedSize = document.querySelector(".selectedSize");
        if (selectedSize) {
          selectedSize.classList.remove("selectedSize");
          selectedSize.classList.add("deselected"); // Add deselected class
        }
        sizeElement.classList.add("selectedSize");
        sizeElement.classList.remove("deselected"); // Remove deselected class
        const selectedColor = document.querySelector(".selectedColor");
        const color = selectedColor ? selectedColor.textContent : null;
        await fetchAndDisplayProducts(size, color);
      });
      sizesContainer.appendChild(sizeElement);
    });
  } else {
    const noSizesMessage = document.createElement("p");
    noSizesMessage.textContent = "No sizes available.";
    sizesContainer.appendChild(noSizesMessage);
  }

  if (colorsArray.length > 0) {
    colorsArray.forEach((color) => {
      const colorElement = document.createElement("div");
      colorElement.classList.add("colorElement");
      colorElement.textContent = color;
      colorElement.addEventListener("click", async () => {
        const selectedColor = document.querySelector(".selectedColor");
        if (selectedColor) {
          selectedColor.classList.remove("selectedColor");
          selectedColor.classList.add("deselected"); // Add deselected class
        }
        colorElement.classList.add("selectedColor");
        colorElement.classList.remove("deselected"); // Remove deselected class
        const selectedSize = document.querySelector(".selectedSize");
        const size = selectedSize ? selectedSize.textContent : null;
        await fetchAndDisplayProducts(size, color);
      });
      colorsContainer.appendChild(colorElement);
    });
  } else {
    const noColorsMessage = document.createElement("p");
    noColorsMessage.textContent = "No colors available.";
    colorsContainer.appendChild(noColorsMessage);
  }
}
