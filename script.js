/* ===============================================
   BRAR PET SHOP - JAVASCRIPT
   Interactive Features & Functionality
   =============================================== */

// ===============================================
// Initialize on DOM Content Loaded
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===============================================
// Main Initialization Function
// ===============================================

function initializeApp() {
    // Initialize features
    initializeDarkMode();
    initializeScrollSpy();
    initializeScrollEffects();
    initializeCounterAnimation();
    initializeAOS();
    initializeTooltips();
    initializeFormValidation();
    initializeCartButtons();
    initializeSearchFunctionality();
    initializeBackToTopButton();
    initializeGalleryModal();
    initializeNewsletterForm();
    
    // Hide loading spinner
    setTimeout(() => {
        hideLoadingSpinner();
    }, 2500);
}

// ===============================================
// Loading Spinner
// ===============================================

function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.opacity = '0';
        spinner.style.pointerEvents = 'none';
    }
}

// ===============================================
// Dark Mode Toggle
// ===============================================

function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check if dark mode is saved in localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        updateDarkModeIcon();
    }
    
    // Toggle dark mode on button click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isNowDark = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isNowDark);
            updateDarkModeIcon();
        });
    }
}

function updateDarkModeIcon() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        if (isDarkMode) {
            icon.classList.remove('bi-moon-fill');
            icon.classList.add('bi-sun-fill');
        } else {
            icon.classList.remove('bi-sun-fill');
            icon.classList.add('bi-moon-fill');
        }
    }
}

// ===============================================
// ScrollSpy - Highlight Active Navigation Links
// ===============================================

function initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Call on load
}

// ===============================================
// Scroll Effects - Navbar Shadow on Scroll
// ===============================================

function initializeScrollEffects() {
    const navbar = document.getElementById('mainNavbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scroll-shadow');
        } else {
            navbar.classList.remove('scroll-shadow');
        }
    });
}

// ===============================================
// Counter Animation
// ===============================================

function initializeCounterAnimation() {
    const counters = document.querySelectorAll('.counter-number');
    const speed = 200; // Speed of animation
    
    function runCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / speed;
        
        let current = 0;
        
        const updateCount = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(updateCount);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 10);
    }
    
    // Trigger counter animation when section is in view
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                runCounter(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ===============================================
// AOS (Animate On Scroll) Initialization
// ===============================================

function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// ===============================================
// Bootstrap Tooltips
// ===============================================

function initializeTooltips() {
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// ===============================================
// Form Validation
// ===============================================

function initializeFormValidation() {
    const forms = document.querySelectorAll('form[novalidate]');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (!form.checkValidity()) {
                event.stopPropagation();
            } else {
                // Form is valid - handle submission
                handleFormSubmit(form);
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

function handleFormSubmit(form) {
    const formId = form.id;
    
    if (formId === 'contactForm') {
        // Handle contact form
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        
        alert(`Thank you, ${fullName}! Your message has been received. We'll contact you at ${email} soon.`);
        form.reset();
        form.classList.remove('was-validated');
    } else if (formId === 'newsletterForm') {
        // Handle newsletter form
        const email = form.querySelector('input[type="email"]').value;
        alert(`Thank you! You've been subscribed with ${email}`);
        form.reset();
    }
}

// ===============================================
// Cart Functionality Demo
// ===============================================

function initializeCartButtons() {
    const cartButtons = document.querySelectorAll('.add-to-cart');
    const cartBadge = document.getElementById('cartBadge');
    const cartBtn = document.getElementById('cartBtn');
    
    let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
    updateCartBadge();
    
    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add animation
            const card = this.closest('.card');
            const petName = card.querySelector('.card-title').textContent;
            
            cartCount++;
            localStorage.setItem('cartCount', cartCount);
            updateCartBadge();
            
            // Show success message
            showToast(`${petName} added to cart!`);
            
            // Button animation
            this.innerHTML = '<i class="bi bi-check-circle"></i> Added';
            this.disabled = true;
            setTimeout(() => {
                this.innerHTML = 'Add to Cart';
                this.disabled = false;
            }, 2000);
        });
    });
    
    // Cart button click
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            alert(`You have ${cartCount} items in your cart!`);
        });
    }
}

function updateCartBadge() {
    const cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
    }
}

// Toast Notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast position-fixed bottom-0 end-0 m-3';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="toast-body bg-success text-white rounded">
            <i class="bi bi-check-circle me-2"></i>${message}
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===============================================
// Search Functionality
// ===============================================

function initializeSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const petCards = document.querySelectorAll('.pet-card');
    
    function filterPets(searchTerm) {
        const term = searchTerm.toLowerCase();
        
        petCards.forEach(card => {
            const petName = card.querySelector('.card-title').textContent.toLowerCase();
            const petDescription = card.querySelector('.card-text').textContent.toLowerCase();
            
            if (petName.includes(term) || petDescription.includes(term) || term === '') {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterPets(this.value);
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value;
            if (searchTerm) {
                document.getElementById('pets').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ===============================================
// Back To Top Button
// ===============================================

function initializeBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===============================================
// Gallery Modal
// ===============================================

function initializeGalleryModal() {
    const galleryModal = document.getElementById('galleryModal');
    const galleryModalImage = document.getElementById('galleryModalImage');
    
    if (galleryModal) {
        galleryModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const imageUrl = button.getAttribute('data-image');
            
            if (galleryModalImage && imageUrl) {
                galleryModalImage.src = imageUrl;
                galleryModalImage.style.animation = 'fadeIn 0.3s ease';
            }
        });
    }
}

// ===============================================
// Newsletter Form
// ===============================================

function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                showToast(`Subscribed with ${email}!`);
                this.reset();
            }
        });
    }
}

// ===============================================
// Smooth Scrolling for Navigation Links
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just '#'
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Close offcanvas if open
                const offcanvasElement = document.querySelector('.offcanvas.show');
                if (offcanvasElement) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                    if (bsOffcanvas) {
                        bsOffcanvas.hide();
                    }
                }
                
                // Close navbar if open
                const navbarCollapse = document.querySelector('.navbar-collapse.show');
                if (navbarCollapse) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
                
                // Scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===============================================
// Phone Number Validation
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Allow only numbers and basic phone format characters
            this.value = this.value.replace(/[^0-9+\-\s]/g, '');
        });
    }
});

// ===============================================
// Email Validation Helper
// ===============================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===============================================
// Utility: Get Element by ID
// ===============================================

function getElement(id) {
    return document.getElementById(id);
}

function getElements(selector) {
    return document.querySelectorAll(selector);
}

// ===============================================
// Utility: Add Event Listener
// ===============================================

function addEvent(element, event, callback) {
    if (element) {
        element.addEventListener(event, callback);
    }
}

function addEvents(selector, event, callback) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.addEventListener(event, callback);
    });
}

// ===============================================
// Utility: Has Class
// ===============================================

function hasClass(element, className) {
    return element.classList.contains(className);
}

// ===============================================
// Utility: Toggle Class
// ===============================================

function toggleClass(element, className) {
    element.classList.toggle(className);
}

// ===============================================
// Keyboard Shortcuts
// ===============================================

document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + / for search focus
    if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape key to close modals
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });
    }
});

// ===============================================
// Performance: Lazy Loading Images
// ===============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ===============================================
// Prevent Multiple Form Submissions
// ===============================================

document.addEventListener('submit', function(e) {
    const button = e.target.querySelector('button[type="submit"]');
    if (button) {
        button.disabled = true;
        setTimeout(() => {
            button.disabled = false;
        }, 1000);
    }
});

// ===============================================
// Console Welcome Message
// ===============================================

console.log('%cBrar Pet Shop', 'font-size: 24px; font-weight: bold; color: #0d6efd;');
console.log('%cYour Trusted Partner for Happy Pets', 'font-size: 16px; color: #666;');
console.log('%cThank you for visiting our website!', 'font-size: 14px; color: #999;');
