document.addEventListener('DOMContentLoaded', async function() {
    const fetchButton = document.querySelector('.fetchProductButton');
    const productInfo = document.querySelector('.productInfo');
    
    if (fetchButton && productInfo) {
      fetchButton.addEventListener('click', async function() {
        try {
          const response = await fetch(`apps/proxies/collections?sizes=S`);
          const data = await response.json();
          console.log("data",data)
          productInfo.innerHTML = '';
          
          data.products.forEach(product => {
            const productContainer = document.createElement('div');
            productContainer.classList.add('productContainer');
            
            const titleElement = document.createElement('h2');
            titleElement.textContent = product.title;
            productContainer.appendChild(titleElement);
            
            const variantsContainer = document.createElement('div');
            variantsContainer.classList.add('variantsContainer');
            product.variants.forEach(variant => {
              const variantElement = document.createElement('p');
              variantElement.textContent = `${product.title} - Variant: ${variant.title}, Price: ${variant.price}`;
              variantsContainer.appendChild(variantElement);
            });
            productContainer.appendChild(variantsContainer);
            
            productInfo.appendChild(productContainer);
          });
        } catch (error) {
          productInfo.innerHTML = '<p>Error fetching product data</p>';
          console.error('Error fetching product data:', error);
        }
      });
      
      // Programmatically trigger the click event
      fetchButton.click();
    } else {
      console.error('Fetch button or product info element not found.');
    }
  });
  