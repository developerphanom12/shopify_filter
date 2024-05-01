document.addEventListener('DOMContentLoaded', async function() {
  const fetchButton = document.querySelector('.fetchProductButton');
  const productInfo = document.querySelector('.productInfo');

  if (fetchButton && productInfo) {
      fetchButton.addEventListener('click', async function() {
          try {
              const shopName = getCookie('shopName');
              console.log('Shop Name:', shopName);

              // Rest of your code goes here
          } catch (error) {
              // Handle errors
          }
      });
  } else {
      console.error('Fetch button or product info element not found.');
  }
});

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}
