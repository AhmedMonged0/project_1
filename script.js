// Sample Products Data
const products = [
    {
        id: 1,
        name: "لابتوب جيمنج عالي الأداء",
        category: "electronics",
        price: 5000,
        originalPrice: 6000,
        image: "fas fa-laptop",
        rating: 4.8,
        reviews: 156,
        badge: "جديد",
        description: "لابتوب جيمنج بمعالج قوي وكارت شاشة متقدم"
    },
    {
        id: 2,
        name: "سماعات لاسلكية",
        category: "electronics",
        price: 350,
        originalPrice: 500,
        image: "fas fa-headphones",
        rating: 4.5,
        reviews: 89,
        badge: "خصم",
        description: "سماعات لاسلكية عالية الجودة مع إلغاء الضوضاء"
    },
    {
        id: 3,
        name: "ساعة ذكية",
        category: "electronics",
        price: 750,
        originalPrice: 1000,
        image: "fas fa-watch",
        rating: 4.6,
        reviews: 234,
        badge: "مميز",
        description: "ساعة ذكية مع مراقبة الصحة والرياضة"
    },
    {
        id: 4,
        name: "قميص قطني",
        category: "fashion",
        price: 120,
        originalPrice: 150,
        image: "fas fa-tshirt",
        rating: 4.3,
        reviews: 67,
        badge: "",
        description: "قميص قطني مريح ومناسب للاستخدام اليومي"
    },
    {
        id: 5,
        name: "حذاء رياضي",
        category: "sports",
        price: 300,
        originalPrice: 400,
        image: "fas fa-running",
        rating: 4.7,
        reviews: 123,
        badge: "الأكثر مبيعاً",
        description: "حذاء رياضي مريح ومناسب للجري والتمارين"
    },
    {
        id: 6,
        name: "كتاب البرمجة",
        category: "books",
        price: 80,
        originalPrice: 100,
        image: "fas fa-book",
        rating: 4.9,
        reviews: 45,
        badge: "",
        description: "كتاب شامل لتعلم البرمجة للمبتدئين"
    },
    {
        id: 7,
        name: "مجموعة أدوات المطبخ",
        category: "home",
        price: 200,
        originalPrice: 250,
        image: "fas fa-utensils",
        rating: 4.4,
        reviews: 78,
        badge: "",
        description: "مجموعة كاملة من أدوات المطبخ عالية الجودة"
    },
    {
        id: 8,
        name: "كريم مرطب للوجه",
        category: "beauty",
        price: 150,
        originalPrice: 180,
        image: "fas fa-spa",
        rating: 4.6,
        reviews: 92,
        badge: "طبيعي",
        description: "كريم مرطب طبيعي للعناية بالبشرة"
    }
];

// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentFilter = 'all';
let searchQuery = '';
let displayedProducts = 4;

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const header = document.querySelector('.header');
const searchInput = document.getElementById('search-input');
const productsGrid = document.getElementById('products-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('load-more-btn');
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');
const overlay = document.getElementById('overlay');
const productModal = document.getElementById('product-modal');
const modalClose = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const countdownTimer = document.getElementById('countdown-timer');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);

    // Initialize components
    initializeProducts();
    initializeEventListeners();
    initializeAnimations();
    initializeCountdown();
    updateCartUI();
    updateWishlistUI();
    
    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
});

// Initialize Products Display
function initializeProducts() {
    displayProducts();
}

// Display Products
function displayProducts() {
    const filteredProducts = getFilteredProducts();
    const productsToShow = filteredProducts.slice(0, displayedProducts);
    
    productsGrid.innerHTML = '';
    
    productsToShow.forEach((product, index) => {
        const productCard = createProductCard(product);
        productCard.style.animationDelay = `${index * 0.1}s`;
        productCard.classList.add('animate-fade-in-up');
        productsGrid.appendChild(productCard);
    });
    
    // Show/hide load more button
    if (filteredProducts.length > displayedProducts) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// Get Filtered Products
function getFilteredProducts() {
    let filtered = products;
    
    // Filter by category
    if (currentFilter !== 'all') {
        filtered = filtered.filter(product => product.category === currentFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    return filtered;
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    
    const isInWishlist = wishlist.some(item => item.id === product.id);
    const isInCart = cart.some(item => item.id === product.id);
    
    card.innerHTML = `
        <div class="product-image">
            <i class="${product.image}"></i>
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-actions">
                <button class="product-action-btn wishlist-btn ${isInWishlist ? 'active' : ''}" 
                        onclick="toggleWishlist(${product.id})" title="إضافة للمفضلة">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="product-action-btn quick-view-btn" 
                        onclick="openProductModal(${product.id})" title="عرض سريع">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="product-action-btn compare-btn" title="مقارنة">
                    <i class="fas fa-balance-scale"></i>
                </button>
            </div>
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">${product.price} ج.م</span>
                ${product.originalPrice > product.price ? 
                    `<span class="original-price">${product.originalPrice} ج.م</span>` : ''}
            </div>
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(product.rating)}
                </div>
                <span class="rating-count">(${product.reviews})</span>
            </div>
            <button class="add-to-cart-btn ${isInCart ? 'in-cart' : ''}" 
                    onclick="toggleCart(${product.id})">
                ${isInCart ? 'في العربة' : 'أضف للعربة'}
            </button>
        </div>
    `;
    
    return card;
}

// Generate Stars Rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star"></i>';
    }
    
    return stars;
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    // Load more button
    loadMoreBtn.addEventListener('click', loadMoreProducts);
    
    // Cart functionality
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    
    // Modal functionality
    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Mobile menu
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', handleCategoryClick);
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Hero buttons
    document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
        btn.addEventListener('click', handleHeroButtonClick);
    });
}

// Handle Search
function handleSearch(e) {
    searchQuery = e.target.value;
    displayedProducts = 4;
    displayProducts();
}

// Handle Filter
function handleFilter(e) {
    const filter = e.target.dataset.filter;
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = filter;
    displayedProducts = 4;
    displayProducts();
}

// Load More Products
function loadMoreProducts() {
    displayedProducts += 4;
    displayProducts();
}

// Toggle Cart
function toggleCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Remove from cart
        cart = cart.filter(item => item.id !== productId);
        showNotification('تم حذف المنتج من العربة', 'info');
    } else {
        // Add to cart
        cart.push({
            ...product,
            quantity: 1
        });
        showNotification('تم إضافة المنتج للعربة', 'success');
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    displayProducts(); // Refresh to update button states
}

// Toggle Wishlist
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = wishlist.find(item => item.id === productId);
    
    if (existingItem) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.id !== productId);
        showNotification('تم حذف المنتج من المفضلة', 'info');
    } else {
        // Add to wishlist
        wishlist.push(product);
        showNotification('تم إضافة المنتج للمفضلة', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
    displayProducts(); // Refresh to update button states
}

// Update Cart UI
function updateCartUI() {
    cartCount.textContent = cart.length;
    
    // Update cart items
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="${item.image}"></i>
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${item.price} ج.م</div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `${total} ج.م`;
    
    // Add cart item styles
    if (!document.getElementById('cart-styles')) {
        const cartStyles = document.createElement('style');
        cartStyles.id = 'cart-styles';
        cartStyles.textContent = `
            .cart-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 0;
                border-bottom: 1px solid var(--border);
            }
            .cart-item-image {
                width: 50px;
                height: 50px;
                background: var(--surface);
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: var(--text-secondary);
            }
            .cart-item-details {
                flex: 1;
            }
            .cart-item-details h4 {
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }
            .cart-item-price {
                font-weight: 600;
                color: var(--primary-color);
                margin-bottom: 0.5rem;
            }
            .cart-item-quantity {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .cart-item-quantity button {
                width: 25px;
                height: 25px;
                border: 1px solid var(--border);
                background: white;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .remove-item {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0.5rem;
                border-radius: var(--radius-sm);
                transition: all var(--transition-fast);
            }
            .remove-item:hover {
                color: #ef4444;
                background: rgba(239, 68, 68, 0.1);
            }
        `;
        document.head.appendChild(cartStyles);
    }
}

// Update Wishlist UI
function updateWishlistUI() {
    wishlistCount.textContent = wishlist.length;
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
        }
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    displayProducts(); // Refresh to update button states
    showNotification('تم حذف المنتج من العربة', 'info');
}

// Open Cart
function openCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
}

// Close Cart
function closeCart() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
}

// Open Product Modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    modalBody.innerHTML = `
        <div class="product-modal-content">
            <div class="product-modal-image">
                <i class="${product.image}"></i>
            </div>
            <div class="product-modal-details">
                <h2>${product.name}</h2>
                <div class="product-modal-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span>(${product.reviews} مراجعة)</span>
                </div>
                <div class="product-modal-price">
                    <span class="current-price">${product.price} ج.م</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">${product.originalPrice} ج.م</span>` : ''}
                </div>
                <p class="product-modal-description">${product.description}</p>
                <div class="product-modal-actions">
                    <button class="btn btn-primary" onclick="toggleCart(${product.id}); closeModal();">
                        أضف للعربة
                    </button>
                    <button class="btn btn-outline" onclick="toggleWishlist(${product.id})">
                        أضف للمفضلة
                    </button>
                </div>
            </div>
        </div>
    `;
    
    productModal.classList.add('open');
    
    // Add modal styles
    if (!document.getElementById('modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .product-modal-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
                max-width: 800px;
            }
            .product-modal-image {
                background: var(--surface);
                border-radius: var(--radius-lg);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8rem;
                color: var(--text-light);
                min-height: 300px;
            }
            .product-modal-details h2 {
                font-size: 1.8rem;
                margin-bottom: 1rem;
            }
            .product-modal-rating {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            .product-modal-price {
                margin-bottom: 1rem;
            }
            .product-modal-price .current-price {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--primary-color);
                margin-left: 0.5rem;
            }
            .product-modal-description {
                color: var(--text-secondary);
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            .product-modal-actions {
                display: flex;
                gap: 1rem;
            }
            @media (max-width: 768px) {
                .product-modal-content {
                    grid-template-columns: 1fr;
                    padding: 1rem;
                }
                .product-modal-image {
                    min-height: 200px;
                    font-size: 4rem;
                }
            }
        `;
        document.head.appendChild(modalStyles);
    }
}

// Close Modal
function closeModal() {
    productModal.classList.remove('open');
}

// Handle Category Click
function handleCategoryClick(e) {
    const category = e.currentTarget.dataset.category;
    
    // Update filter
    currentFilter = category;
    displayedProducts = 4;
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.querySelector(`[data-filter="${category}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    // Scroll to products section
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    
    // Display filtered products
    displayProducts();
}

// Handle Header Scroll
function handleHeaderScroll() {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    // This would typically show/hide a mobile navigation menu
    // For now, we'll just add a simple animation to the toggle button
    mobileMenuToggle.classList.toggle('active');
}

// Handle Navigation Click
function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
    }
}

// Handle Hero Button Click
function handleHeroButtonClick(e) {
    const buttonText = e.target.textContent;
    
    if (buttonText.includes('تسوق')) {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    } else if (buttonText.includes('اكتشف')) {
        document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle Newsletter Submit
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('.newsletter-input').value;
    
    if (email) {
        showNotification('تم الاشتراك بنجاح في النشرة الإخبارية!', 'success');
        e.target.querySelector('.newsletter-input').value = '';
    }
}

// Initialize Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.category-card, .section-header').forEach(el => {
        observer.observe(el);
    });
}

// Initialize Countdown Timer
function initializeCountdown() {
    // Set target date (24 hours from now)
    const targetDate = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            // Timer expired
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }
    
    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles if not already added
    if (!document.getElementById('notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: var(--radius-lg);
                box-shadow: 0 10px 25px var(--shadow-lg);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform var(--transition-normal);
                border-right: 4px solid var(--primary-color);
            }
            .notification-success {
                border-right-color: var(--accent-color);
            }
            .notification-error {
                border-right-color: #ef4444;
            }
            .notification-info {
                border-right-color: var(--secondary-color);
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    // Parallax effect for hero shapes
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const xPos = (x - 0.5) * speed * 20;
        const yPos = (y - 0.5) * speed * 20;
        shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
});

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    
    const progressStyles = document.createElement('style');
    progressStyles.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(37, 99, 235, 0.1);
            z-index: 10001;
        }
        .scroll-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    
    document.head.appendChild(progressStyles);
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.querySelector('.scroll-progress-bar').style.width = `${scrolled}%`;
    });
}

// Initialize scroll progress
addScrollProgress();

// Add some Easter eggs and fun interactions
let clickCount = 0;
document.querySelector('.logo').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        showNotification('🎉 لقد اكتشفت سر مخفي! خصم 10% على طلبك القادم!', 'success');
        clickCount = 0;
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeModal();
        closeCart();
    }
});

console.log('🛍️ متجر المنتجات جاهز للاستخدام!');
console.log('💡 نصائح:');
console.log('- اضغط Ctrl+K للبحث السريع');
console.log('- اضغط Escape لإغلاق النوافذ');
console.log('- اضغط على اللوجو 5 مرات للحصول على مفاجأة!');

