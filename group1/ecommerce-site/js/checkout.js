// Checkout functionality
const coupons = [
    { code: 'SAVE10', discount: 10 }, // 10% off
    { code: 'SAVE20', discount: 20 }, // 20% off
    { code: 'FREESHIP', discount: 5 } // $5 off
];

let appliedDiscount = 0;

document.addEventListener('DOMContentLoaded', () => {
    displayOrderSummary();

    document.getElementById('apply-coupon').addEventListener('click', applyCoupon);

    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Order placed successfully! (This is a simulation)');
        cart = [];
        saveCart();
        window.location.href = 'index.html';
    });
});

function displayOrderSummary() {
    const summary = document.getElementById('order-summary');
    summary.innerHTML = '';
    cart.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `${item.name} x ${item.quantity} - M${(item.price * item.quantity).toFixed(2)}`;
        summary.appendChild(div);
    });
    const subtotal = getCartTotal();
    const discountAmount = appliedDiscount > 1 ? appliedDiscount : (subtotal * appliedDiscount / 100);
    const total = subtotal - discountAmount;

    const subtotalDiv = document.createElement('div');
    subtotalDiv.innerHTML = `Subtotal: M${subtotal.toFixed(2)}`;
    summary.appendChild(subtotalDiv);

    if (appliedDiscount > 0) {
        const discountDiv = document.createElement('div');
        discountDiv.innerHTML = `Discount: -M${discountAmount.toFixed(2)}`;
        discountDiv.style.color = '#28a745';
        summary.appendChild(discountDiv);
    }

    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `<strong>Total: M${total.toFixed(2)}</strong>`;
    summary.appendChild(totalDiv);
}

function applyCoupon() {
    const couponCode = document.getElementById('coupon').value.toUpperCase();
    const coupon = coupons.find(c => c.code === couponCode);
    const message = document.getElementById('coupon-message');

    if (coupon) {
        appliedDiscount = coupon.discount;
        message.textContent = `Coupon applied! ${coupon.discount > 1 ? '$' + coupon.discount : coupon.discount + '%'} off`;
        message.style.color = '#28a745';
    } else {
        appliedDiscount = 0;
        message.textContent = 'Invalid coupon code';
        message.style.color = '#dc3545';
    }
    displayOrderSummary();
}