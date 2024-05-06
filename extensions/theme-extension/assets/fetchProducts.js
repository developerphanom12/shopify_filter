document.addEventListener('DOMContentLoaded', async function() {
    const productInfo = document.querySelector('.productInfo');
    
    try {
        const response = await fetch(`/apps/proxy/product`); // Update endpoint URL
        const data = await response.json();
        
        productInfo.innerHTML = '';
        
        // Loop through the products and display their information
        data.products.edges.forEach(productEdge => {
            const productNode = productEdge.node;
            
            const productContainer = document.createElement('div');
            productContainer.classList.add('productContainer');
            
            // Display product title
            const titleElement = document.createElement('h2');
            titleElement.textContent = productNode.title;
            productContainer.appendChild(titleElement);
            
            // Display product description
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = productNode.description || 'No description available';
            productContainer.appendChild(descriptionElement);
            
            // Display product image
            const imageNode = productNode.images.edges[0].node;
            const imageElement = document.createElement('img');
            imageElement.src = imageNode.src;
            productContainer.appendChild(imageElement);
            
            const variantsContainer = document.createElement('div');
            variantsContainer.classList.add('variantsContainer');
            productNode.variants.edges.forEach(variantEdge => {
                const variantNode = variantEdge.node;
                const variantElement = document.createElement('p');
                variantElement.textContent = `Variant ID: ${variantNode.id}, Price: ${variantNode.price}`;
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
