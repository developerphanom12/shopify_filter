
document.addEventListener('DOMContentLoaded', async function() {
    const fetchButton = document.querySelector('.fetchProductButton');
    const productInfo = document.querySelector('.productInfo');
    if (fetchButton && productInfo) {
        fetchButton.addEventListener('click', async function() {
            try {
                const collectionsResponse = await fetch('/api/communityData');
                const collectionsData = await collectionsResponse.json();
                console.log("ccc",collectionsData)
                console.log("Colledata:", collectionsData);
                productInfo.innerHTML = '';
                
                collectionsData.collections.edges.forEach(collectionEdge => {
                    const collectionNode = collectionEdge.node;
                    
                    const collectionContainer = document.createElement('div');
                    collectionContainer.classList.add('collectionContainer');
                    
                    const titleElement = document.createElement('h2');
                    titleElement.textContent = collectionNode.title;
                    collectionContainer.appendChild(titleElement);
                    
                    const productsCountElement = document.createElement('p');
                    productsCountElement.textContent = `Number of Products: ${collectionNode.productsCount}`;
                    collectionContainer.appendChild(productsCountElement);
                    
                    productInfo.appendChild(collectionContainer);
                });
            } catch (error) {
                productInfo.innerHTML = '<p>Error fetching collections data</p>';
                console.error('Error fetching collections data:', error);
            }
        });
    } else {
        console.error('Fetch button or product info element not found.');
    }
});
