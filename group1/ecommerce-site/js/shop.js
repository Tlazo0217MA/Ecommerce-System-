// Display products, filter
let currentProducts = products;

function displayProducts(productsToDisplay) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    productsToDisplay.forEach(product => {
        const averageRating = getAverageRating(product.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
            <div class="product-rating">
                <span class="stars">${renderStars(averageRating)}</span>
                <span class="rating-text">(${averageRating.toFixed(1)})</span>
            </div>
            <p>M${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
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

function filterProducts() {
    const category = document.getElementById('category').value;
    const searchTerm = document.getElementById('search').value.toLowerCase();
    currentProducts = products.filter(product => {
        const matchesCategory = category === 'All' || product.category === category;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
    displayProducts(currentProducts);
}

document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    document.getElementById('category').addEventListener('change', filterProducts);
    document.getElementById('search').addEventListener('input', filterProducts);
});