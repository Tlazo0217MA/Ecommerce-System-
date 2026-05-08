// Product detail functionality
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);
    if (product) {
        const averageRating = getAverageRating(productId);
        const container = document.getElementById('product-detail');
        container.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="max-width: 300px;">
            <h1>${product.name}</h1>
            <div class="product-rating">
                <span class="stars">${renderStars(averageRating)}</span>
                <span class="rating-text">(${averageRating.toFixed(1)}) - ${getTotalRatingCount(productId)} ratings</span>
            </div>
            <p>${product.description}</p>
            <p>Price: M${product.price}</p>
            <p>Category: ${product.category}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        loadReviews(productId);
    } else {
        document.getElementById('product-detail').innerHTML = '<p>Product not found.</p>';
    }

    document.getElementById('review-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitReview(productId);
    });
});

function loadReviews(productId) {
    const reviews = getReviews(productId);
    const container = document.getElementById('reviews-list');
    container.innerHTML = '';
    if (reviews.length === 0) {
        container.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
    } else {
        reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review';
            reviewDiv.innerHTML = `
                <div class="review-header">
                    <span class="review-name">${review.name}</span>
                    <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                </div>
                <p class="review-text">${review.text}</p>
                <small class="review-date">${new Date(review.date).toLocaleDateString()}</small>
            `;
            container.appendChild(reviewDiv);
        });
    }
}

function submitReview(productId) {
    const rating = parseInt(document.getElementById('review-rating').value);
    const name = document.getElementById('review-name').value;
    const text = document.getElementById('review-text').value;

    const review = {
        name: name,
        rating: rating,
        text: text,
        date: new Date().toISOString()
    };

    const reviews = getReviews(productId);
    reviews.push(review);
    saveReviews(productId, reviews);

    loadReviews(productId);
    document.getElementById('review-form').reset();
    alert('Review submitted successfully!');
}

function getAverageRating(productId) {
    const reviews = getReviews(productId);
    const userRatings = getUserRatings(productId);
    
    const allRatings = [...reviews.map(r => r.rating), ...userRatings];
    
    if (allRatings.length === 0) return 0;
    const sum = allRatings.reduce((acc, rating) => acc + rating, 0);
    return sum / allRatings.length;
}

function getTotalRatingCount(productId) {
    const reviews = getReviews(productId);
    const userRatings = getUserRatings(productId);
    return reviews.length + userRatings.length;
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

function saveReviews(productId, reviews) {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '{}');
    allReviews[productId] = reviews;
    localStorage.setItem('reviews', JSON.stringify(allReviews));
}

function getUserRatings(productId) {
    const allUserRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
    return allUserRatings[productId] || [];
}



