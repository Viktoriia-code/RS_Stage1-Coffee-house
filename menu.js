import products from './products.json' assert { type: 'json' };
//console.log(products);

let currentCategory = "coffee";

// Create cards for each product
function displayCards(category) {
  document.getElementById(`${currentCategory}-category`).classList.remove('active');
  document.getElementById(`${category}-category`).classList.add('active');

  // Update the current category
  currentCategory = category;

  const filteredProducts = products.filter(product => product.category === category);
  //console.log(filteredProducts);
  // Render the cards in the container
  let cardsContainer = document.getElementById('preview-wrapper');
  cardsContainer.innerHTML = '';
  filteredProducts.forEach((product, index) => {
    const card = document.createElement('div');
    card.classList.add('preview-card');

    card.innerHTML = `
      <div class="preview-img">
        <img src="assets/images/${product.category}-${index+1}.png" alt="">
      </div>
      <div class="preview-description">
        <div class="preview-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>
        <h3 class="product-price">$${product.price}</h3>
      </div>
    `;

    // Add click event to each card
    card.addEventListener('click', function () {
        openModal(this);
    });

    // Append card to the container
    cardsContainer.appendChild(card);
  });
}

// Function to load more products
function loadMore() {
  // Show hidden cards
  const hiddenCards = document.querySelectorAll('.preview-card');
  
  // Display all cards
  hiddenCards.forEach(card => card.style.display = 'block');

  // Hide the "Load More" button
  const loadMoreBtn = document.getElementById('load-more');
  // Check the current screen width to determine whether to show or hide the button
  loadMoreBtn.style.display = 'none';
}

// Add event listeners for each category button
document.getElementById('coffee-category').addEventListener('click', () => displayCards('coffee'));
document.getElementById('tea-category').addEventListener('click', () => displayCards('tea'));
document.getElementById('dessert-category').addEventListener('click', () => displayCards('dessert'));

// Add event listener for the "Load More" button
document.getElementById('load-more').addEventListener('click', loadMore);

// Initial render
displayCards(currentCategory);

function openModal(clickedCard) {
  //console.log(clickedCard);
  // Extract data from the clicked card name
  const productName = clickedCard.querySelector('.preview-info h3').innerText;
  const clickedProduct = products.find(product => product.name === productName);
  const img = clickedCard.querySelector('.preview-img img').src;

  // Create modal container
  const modalContainer = document.getElementById('modalContainer');

  // Create modal
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
      <div class="preview-img">
        <img src="${img}" alt="">
      </div>
      <div class="modal-description">
        <div class="modal-title">
          <h3 id="modal-name">${clickedProduct.name}</h3>
          <p>${clickedProduct.description}</p>
        </div>
        <div class="modal-desc">
          <p>Size:</p>
          <div class="modal-desc-wrapper">
          <input type="radio" id="sizeS" class="size-button-input" name="size" value="S" checked>
          <label for="sizeS" class="size-button">
            <div class="size-icon">S</div>
            <span>${clickedProduct.sizes.s.size}</span>
          </label>
          <input type="radio" id="sizeM" class="size-button-input" name="size" value="M">
          <label for="sizeM" class="size-button">
            <div class="size-icon">M</div>
            <span>${clickedProduct.sizes.m.size}</span>
          </label>
          <input type="radio" id="sizeL" class="size-button-input" name="size" value="L">
          <label for="sizeL" class="size-button">
            <div class="size-icon">L</div>
            <span>${clickedProduct.sizes.l.size}</span>
          </label>
          </div>
        </div>
        <div class="modal-desc">
          <p>Additives:</p>
          <div class="modal-desc-wrapper">
            <input type="checkbox" id="additive1" class="size-button-input">
            <label for="additive1" class="size-button">
              <div class="size-icon">1</div>
              <span>${clickedProduct.additives[0].name}</span>
            </label>
            <input type="checkbox" id="additive2" class="size-button-input">
            <label for="additive2" class="size-button">
              <div class="size-icon">2</div>
              <span>${clickedProduct.additives[1].name}</span>
            </label>
            <input type="checkbox" id="additive3" class="size-button-input">
            <label for="additive3" class="size-button">
              <div class="size-icon">3</div>
              <span>${clickedProduct.additives[2].name}</span>
            </label>
          </div>
        </div>
        <div class="total-wrapper">
          <h3>Total:</h3> 
          <h3 id="finalPrice">$${clickedProduct.price}</h3>
        </div>
        <div class="alert-wrapper">
          <img src="assets/icons/info.svg" alt="">
          <p>The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>
        </div>
        <div class="close-modal">Close</div>
      </div>
  `;

  // Append modal to container
  modalContainer.innerHTML = '';
  modalContainer.appendChild(modal);

  // Add click event to the close button
  const closeButton = document.querySelector('.close-modal');
  closeButton.addEventListener('click', closeModal);

  // Add event listener to close modal on clicks outside of it
  function outsideClickListener(event) {
    const isClickInsideModal = modal.contains(event.target);

    if (!isClickInsideModal) {
      closeModal();
      window.removeEventListener('mousedown', outsideClickListener);
    }
  }

  // Check if the modal is not already open before adding the listener
  if (!modal.style.display || modal.style.display === 'none') {
    // Add the outsideClickListener to window
    window.addEventListener('mousedown', outsideClickListener);
  }

  // Add click event to update the price
  document.getElementById('sizeS').addEventListener('change', updatePrice);
  document.getElementById('sizeM').addEventListener('change', updatePrice);
  document.getElementById('sizeL').addEventListener('change', updatePrice);

  document.getElementById('additive1').addEventListener('change', updatePrice);
  document.getElementById('additive2').addEventListener('change', updatePrice);
  document.getElementById('additive3').addEventListener('change', updatePrice);

  // Display modal
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Disable vertical scroll
  modalContainer.style.display = 'flex';
}

function closeModal() {
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.innerHTML = '';
  modalContainer.style.display = 'none';
  document.body.style.overflow = 'auto'; // Enable vertical scroll
}

// Function to update the price in the modal
function updatePrice() {

  const productName = document.getElementById('modal-name').innerText;
  const choosedProduct = products.find(product => product.name === productName);

  let basePrice = parseFloat(choosedProduct.price);
  const finalPriceElement = document.getElementById('finalPrice');
  const sizeButtons = document.querySelectorAll('input[name="size"]:checked');

  const additive1 = document.getElementById('additive1');
  const additive2 = document.getElementById('additive2');
  const additive3 = document.getElementById('additive3');

  // Update price based on size
  if (sizeButtons.length > 0) {
    const selectedSize = sizeButtons[0].value;
    switch (selectedSize) {
      case 'S':
        break;
      case 'M':
        basePrice += parseFloat(choosedProduct.sizes.m['add-price']);
        break;
      case 'L':
        basePrice += parseFloat(choosedProduct.sizes.l['add-price']);
        break;
      }
  }

  // Update price based on additives
  if (additive1.checked) {
    basePrice += parseFloat(choosedProduct.additives[0]['add-price']);
  }

  if (additive2.checked) {
    basePrice += parseFloat(choosedProduct.additives[1]['add-price']);
  }

  if (additive3.checked) {
    basePrice += parseFloat(choosedProduct.additives[2]['add-price']);
  }

  // Display the updated price
  finalPriceElement.innerText = `$${basePrice.toFixed(2)}`
}

