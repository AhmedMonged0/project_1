// Advanced Effects and Animations

// Custom Cursor
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .product-card, .category-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Particle System
function initParticleSystem() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 3 + 5; // 5-8 seconds
        const delay = Math.random() * 2;
        
        particle.style.left = startX + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, (duration + delay) * 1000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 300);
}

// Magnetic Button Effect
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn');
    
    magneticButtons.forEach(button => {
        button.classList.add('btn-magnetic');
        
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// Parallax Scroll Effect
function initParallaxScroll() {
    const parallaxElements = document.querySelectorAll('.hero-shapes .shape, .floating-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.2;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add different animations based on element type
                if (element.classList.contains('category-card')) {
                    element.classList.add('bounce-in');
                } else if (element.classList.contains('product-card')) {
                    element.classList.add('slide-in-up');
                } else if (element.classList.contains('section-title')) {
                    element.classList.add('text-reveal');
                } else {
                    element.classList.add('fade-in-up');
                }
                
                // Add staggered animation for grid items
                if (element.parentElement.classList.contains('categories-grid') || 
                    element.parentElement.classList.contains('products-grid')) {
                    const siblings = Array.from(element.parentElement.children);
                    const index = siblings.indexOf(element);
                    element.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.category-card, .product-card, .section-title, .deal-card, .newsletter-content'
    );
    
    elementsToAnimate.forEach(el => observer.observe(el));
}

// 3D Tilt Effect
function init3DTilt() {
    const tiltElements = document.querySelectorAll('.product-card, .category-card');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Ripple Effect
function initRippleEffect() {
    const rippleElements = document.querySelectorAll('.btn, .product-card');
    
    rippleElements.forEach(element => {
        element.classList.add('ripple');
        
        element.addEventListener('click', (e) => {
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
            `;
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation keyframes
    if (!document.getElementById('ripple-styles')) {
        const rippleStyles = document.createElement('style');
        rippleStyles.id = 'ripple-styles';
        rippleStyles.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyles);
    }
}

// Typewriter Effect for Hero Title
function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.hero-title .title-line');
    
    typewriterElements.forEach((element, index) => {
        const text = element.textContent;
        element.textContent = '';
        element.classList.add('typewriter');
        
        setTimeout(() => {
            let i = 0;
            const timer = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                if (i > text.length) {
                    clearInterval(timer);
                    element.classList.remove('typewriter');
                }
            }, 100);
        }, index * 2000);
    });
}

// Morphing Shapes
function initMorphingShapes() {
    const heroShapes = document.querySelectorAll('.hero-shapes .shape');
    
    heroShapes.forEach(shape => {
        shape.classList.add('morphing-shape');
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Floating Action Button
function initFloatingActionButton() {
    const fab = document.createElement('div');
    fab.className = 'fab';
    fab.innerHTML = '<i class="fas fa-comments"></i>';
    fab.title = 'تحدث معنا';
    document.body.appendChild(fab);
    
    fab.addEventListener('click', () => {
        showNotification('مرحباً! كيف يمكننا مساعدتك؟', 'info');
    });
}

// Advanced Loading Animation
function initAdvancedLoader() {
    const loader = document.querySelector('.loader-circle');
    if (loader) {
        loader.innerHTML = `
            <div class="spinner-dots">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        `;
    }
}

// Glitch Effect for Special Elements
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.deal-badge');
    
    glitchElements.forEach(element => {
        element.classList.add('glitch');
        element.setAttribute('data-text', element.textContent);
        
        // Random glitch activation
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance
                element.style.animation = 'none';
                setTimeout(() => {
                    element.style.animation = '';
                }, 100);
            }
        }, 2000);
    });
}

// Mouse Trail Effect
function initMouseTrail() {
    const trail = [];
    const trailLength = 10;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i / trailLength};
            transition: all 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        let x = mouseX;
        let y = mouseY;
        
        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || trail[0];
            
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            
            if (nextDot) {
                x += (parseFloat(nextDot.style.left) - x) * 0.3;
                y += (parseFloat(nextDot.style.top) - y) * 0.3;
            }
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Text Scramble Effect
function initTextScramble() {
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += char;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }
    
    // Apply to specific elements
    const scrambleElements = document.querySelectorAll('.hero-title .highlight');
    scrambleElements.forEach(el => {
        const fx = new TextScramble(el);
        const originalText = el.textContent;
        
        // Scramble on hover
        el.addEventListener('mouseenter', () => {
            fx.setText(originalText);
        });
    });
}

// Initialize all advanced effects
function initAdvancedEffects() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        initCustomCursor();
        initParticleSystem();
        initMagneticButtons();
        initParallaxScroll();
        init3DTilt();
        initRippleEffect();
        initTypewriterEffect();
        initMorphingShapes();
        initGlitchEffect();
        initMouseTrail();
        initTextScramble();
    }
    
    // These effects are always enabled
    initScrollAnimations();
    initScrollToTop();
    initFloatingActionButton();
    initAdvancedLoader();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization to ensure all elements are ready
    setTimeout(initAdvancedEffects, 100);
});

// Performance monitoring
function monitorPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function countFrames() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // If FPS is too low, disable some effects
            if (fps < 30) {
                console.warn('Low FPS detected, disabling some effects');
                document.body.classList.add('low-performance');
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(countFrames);
    }
    
    requestAnimationFrame(countFrames);
}

// Start performance monitoring
monitorPerformance();

// Add low performance styles
const lowPerfStyles = document.createElement('style');
lowPerfStyles.textContent = `
    .low-performance * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
    }
    
    .low-performance .particles,
    .low-performance .custom-cursor,
    .low-performance .trail-dot {
        display: none !important;
    }
`;
document.head.appendChild(lowPerfStyles);

console.log('🎨 Advanced effects initialized!');
console.log('✨ Enjoy the magical experience!');

