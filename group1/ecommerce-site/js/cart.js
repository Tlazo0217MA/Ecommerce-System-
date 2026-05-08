// Cart functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    alert('Added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCart();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            displayCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function displayCart() {
    const container = document.getElementById('cart-items');
    if (container) {
        container.innerHTML = '';
        cart.forEach(item => {
            const averageRating = getAverageRating(item.id);
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 50px;">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <div class="product-rating">
                        <span class="stars">${renderStars(averageRating)}</span>
                        <span class="rating-text">(${averageRating.toFixed(1)})</span>
                    </div>
                </div>
                <span>M${item.price}</span>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
                <button onclick="removeFromCart(${item.id})">Remove</button>
            `;
            container.appendChild(div);
        });
        document.getElementById('cart-total').textContent = `Total: M${getCartTotal().toFixed(2)}`;
    }
}

function getAverageRating(productId) {
    const reviews = getReviews(productId);
    const userRatings = getUserRatings(productId);
    
    const allRatings = [...reviews.map(r => r.rating), ...userRatings];
    
    if (allRatings.length === 0) return 0;
    const sum = allRatings.reduce((acc, rating) => acc + rating, 0);
    return sum / allRatings.length;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

function getReviews(productId) {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '{}');
    return allReviews[productId] || [];
}

function getUserRatings(productId) {
    const allUserRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
    return allUserRatings[productId] || [];
}