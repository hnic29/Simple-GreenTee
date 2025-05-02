/**
 * BlackCard Golf Premium Golf Accessories
 * Main JavaScript File
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initCart();
    loadProducts();
    initSmoothScrolling();
    initNewsletterForm();
});

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/**
 * Cart Functionality
 */
function initCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart');
    const overlay = document.querySelector('.overlay');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Open cart sidebar
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close cart sidebar
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeCart);
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.items.length === 0) {
                alert('Your cart is empty. Add some products first!');
                return;
            }
            
            alert('Thank you for your order! This is where the checkout process would begin.');
            // In a real application, this would redirect to a checkout page
        });
    }
    
    function closeCart() {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Cart Object
 */
const cart = {
    items: [],
    
    // Add item to cart
    addItem: function(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartUI();
    },
    
    // Remove item from cart
    removeItem: function(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    },
    
    // Update item quantity
    updateQuantity: function(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            item.quantity = quantity;
            
            if (item.quantity <= 0) {
                this.removeItem(productId);
                return;
            }
        }
        
        this.saveCart();
        this.updateCartUI();
    },
    
    // Calculate total price
    calculateTotal: function() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },
    
    // Save cart to localStorage
    saveCart: function() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    // Load cart from localStorage
    loadCart: function() {
        const savedCart = localStorage.getItem('cart');
        
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartUI();
        }
    },
    
    // Update cart UI
    updateCartUI: function() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const cartTotal = document.querySelector('.cart-total span');
        
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            
            if (this.items.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            } else {
                this.items.forEach(item => {
                    const cartItemElement = document.createElement('div');
                    cartItemElement.classList.add('cart-item');
                    
                    cartItemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h3 class="cart-item-title">${item.name}</h3>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            </div>
                            <p class="remove-item" data-id="${item.id}">Remove</p>
                        </div>
                    `;
                    
                    cartItemsContainer.appendChild(cartItemElement);
                });
                
                // Add event listeners to quantity buttons and remove buttons
                const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
                const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
                const removeButtons = document.querySelectorAll('.remove-item');
                
                decreaseButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const productId = this.getAttribute('data-id');
                        const item = cart.items.find(item => item.id === productId);
                        
                        if (item) {
                            cart.updateQuantity(productId, item.quantity - 1);
                        }
                    });
                });
                
                increaseButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const productId = this.getAttribute('data-id');
                        const item = cart.items.find(item => item.id === productId);
                        
                        if (item) {
                            cart.updateQuantity(productId, item.quantity + 1);
                        }
                    });
                });
                
                removeButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const productId = this.getAttribute('data-id');
                        cart.removeItem(productId);
                    });
                });
            }
        }
        
        // Update cart count
        if (cartCount) {
            const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
        
        // Update cart total
        if (cartTotal) {
            cartTotal.textContent = `$${this.calculateTotal().toFixed(2)}`;
        }
    }
};

/**
 * Product Data
 * In a real application, this would come from an API or database
 */
const products = [
    {
        id: 'p1',
        name: 'Pro Series Golf Rangefinder',
        category: 'Performance Tech',
        price: 299.99,
        rating: 4.8,
        ratingCount: 124,
        image: 'https://images.unsplash.com/photo-1583552188819-4cab6d9c0a09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Advanced laser rangefinder with slope compensation and pin-seeking technology.'
    },
    {
        id: 'p2',
        name: 'Premium Golf Glove',
        category: 'Course Essentials',
        price: 49.99,
        rating: 4.6,
        ratingCount: 89,
        image: 'https://images.unsplash.com/photo-1632150229890-0d503b7bdff2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Premium leather golf glove designed for comfort and grip in all weather conditions.'
    },
    {
        id: 'p3',
        name: 'Smart Golf Swing Analyzer',
        category: 'Training Aids',
        price: 199.99,
        rating: 4.7,
        ratingCount: 56,
        image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'AI-powered swing analyzer that provides real-time feedback and improvement suggestions.'
    },
    {
        id: 'p4',
        name: 'Luxury Golf Bag',
        category: 'Course Essentials',
        price: 349.99,
        rating: 4.9,
        ratingCount: 42,
        image: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Premium leather golf bag with 14-way divider and multiple storage pockets.'
    },
    {
        id: 'p5',
        name: 'GPS Golf Watch',
        category: 'Performance Tech',
        price: 249.99,
        rating: 4.5,
        ratingCount: 78,
        image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Advanced GPS golf watch with course mapping and shot tracking capabilities.'
    },
    {
        id: 'p6',
        name: 'Premium Golf Balls (12-Pack)',
        category: 'Course Essentials',
        price: 59.99,
        rating: 4.7,
        ratingCount: 112,
        image: 'https://images.unsplash.com/photo-1591491634026-77c8ba921eb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Tour-level golf balls designed for maximum distance and control around the greens.'
    }
];

/**
 * Load Products
 */
function loadProducts() {
    const productsGrid = document.querySelector('.products-grid');
    
    if (productsGrid) {
        // Clear existing products
        productsGrid.innerHTML = '';
        
        // Load products from the products array
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            
            // Generate star rating HTML
            const stars = generateStarRating(product.rating);
            
            productCard.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.rating >= 4.7 ? '<div class="product-badge">Best Seller</div>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <div class="product-actions">
                        <button class="btn primary-btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Add event listeners to Add to Cart buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    cart.addItem(product);
                    
                    // Show a confirmation message
                    const confirmationMessage = document.createElement('div');
                    confirmationMessage.classList.add('confirmation-message');
                    confirmationMessage.textContent = `${product.name} added to cart!`;
                    document.body.appendChild(confirmationMessage);
                    
                    // Remove the confirmation message after 3 seconds
                    setTimeout(() => {
                        confirmationMessage.remove();
                    }, 3000);
                }
            });
        });
        
        // Add event listeners to Quick View buttons
        const quickViewButtons = document.querySelectorAll('.quick-view');
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    showQuickView(product);
                }
            });
        });
    }
    
    // Load cart from localStorage
    cart.loadCart();
}

/**
 * Generate Star Rating HTML
 */
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

/**
 * Show Quick View Modal
 */
function showQuickView(product) {
    // Create modal element
    const modal = document.createElement('div');
    modal.classList.add('quick-view-modal');
    
    // Generate star rating HTML
    const stars = generateStarRating(product.rating);
    
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-modal"><i class="fas fa-times"></i></button>
            <div class="quick-view-grid">
                <div class="quick-view-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-details">
                    <p class="product-category">${product.category}</p>
                    <h2 class="product-title">${product.name}</h2>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <div class="product-rating">
                        <div class="stars">${stars}</div>
                        <span class="rating-count">(${product.ratingCount})</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="btn primary-btn add-to-cart-modal" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the DOM
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add overlay
    const overlay = document.querySelector('.overlay');
    overlay.classList.add('active');
    
    // Close modal when clicking the close button
    const closeModalBtn = modal.querySelector('.close-modal');
    closeModalBtn.addEventListener('click', function() {
        modal.remove();
        document.body.style.overflow = 'auto';
        overlay.classList.remove('active');
    });
    
    // Close modal when clicking the overlay
    overlay.addEventListener('click', function() {
        modal.remove();
        document.body.style.overflow = 'auto';
        overlay.classList.remove('active');
    });
    
    // Add to cart from modal
    const addToCartBtn = modal.querySelector('.add-to-cart-modal');
    addToCartBtn.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const product = products.find(p => p.id === productId);
        
        if (product) {
            cart.addItem(product);
            
            // Close modal
            modal.remove();
            document.body.style.overflow = 'auto';
            overlay.classList.remove('active');
            
            // Show a confirmation message
            const confirmationMessage = document.createElement('div');
            confirmationMessage.classList.add('confirmation-message');
            confirmationMessage.textContent = `${product.name} added to cart!`;
            document.body.appendChild(confirmationMessage);
            
            // Remove the confirmation message after 3 seconds
            setTimeout(() => {
                confirmationMessage.remove();
            }, 3000);
        }
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Newsletter Form Submission
 */
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email === '') {
                alert('Please enter your email address.');
                return;
            }
            
            // In a real application, this would send the email to a server
            alert(`Thank you for subscribing with ${email}! You will now receive our newsletter.`);
            
            // Clear the input
            emailInput.value = '';
        });
    }
}

/**
 * Add CSS for elements created by JavaScript
 */
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    /* Quick View Modal */
    .quick-view-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 1000px;
        max-height: 90vh;
        background-color: var(--white);
        border-radius: var(--radius-md);
        z-index: 1200;
        overflow-y: auto;
    }
    
    .quick-view-content {
        position: relative;
        padding: var(--spacing-md);
    }
    
    .close-modal {
        position: absolute;
        top: var(--spacing-sm);
        right: var(--spacing-sm);
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--text-medium);
        transition: color 0.3s ease;
        z-index: 10;
    }
    
    .close-modal:hover {
        color: var(--text-dark);
    }
    
    .quick-view-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-lg);
    }
    
    .quick-view-img img {
        width: 100%;
        height: auto;
        border-radius: var(--radius-sm);
    }
    
    .product-description {
        margin-bottom: var(--spacing-md);
        color: var(--text-medium);
    }
    
    /* Confirmation Message */
    .confirmation-message {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: var(--white);
        padding: 10px 20px;
        border-radius: var(--radius-sm);
        box-shadow: var(--shadow-md);
        z-index: 1000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    /* Empty Cart */
    .empty-cart {
        text-align: center;
        color: var(--text-medium);
        padding: var(--spacing-md) 0;
    }
    
    /* Responsive Quick View */
    @media (max-width: 768px) {
        .quick-view-grid {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(dynamicStyles);
