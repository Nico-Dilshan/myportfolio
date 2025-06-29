// Off-canvas menu functions (Declare globally)
function openOffCanvas() {
    const overlay = document.getElementById('offCanvasOverlay');
    const menu = document.getElementById('offCanvasMenu');
    
    if (overlay && menu) {
        overlay.classList.add('show');
        menu.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeOffCanvas() {
    const overlay = document.getElementById('offCanvasOverlay');
    const menu = document.getElementById('offCanvasMenu');
    
    if (overlay && menu) {
        overlay.classList.remove('show');
        menu.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Load header and footer
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('components/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Header not found');
            }
            return response.text();
        })
        .then(data => {
            const headerElement = document.getElementById('header');
            if (headerElement) {
                headerElement.innerHTML = data;
                setActiveNavItem();
                
                // Re-attach event listeners after header is loaded
                setTimeout(() => {
                    attachEventListeners();
                }, 100);
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
    
    // Load footer
    fetch('components/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Footer not found');
            }
            return response.text();
        })
        .then(data => {
            const footerElement = document.getElementById('footer');
            if (footerElement) {
                footerElement.innerHTML = data;
            }
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
    
    // Initialize animations and observers
    initializeAnimations();
});

// Attach event listeners
function attachEventListeners() {
    // Close off-canvas when clicking outside
    const overlay = document.getElementById('offCanvasOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeOffCanvas);
    }
    
    // Close off-canvas when clicking outside menu
    document.addEventListener('click', function(event) {
        const menu = document.getElementById('offCanvasMenu');
        const overlay = document.getElementById('offCanvasOverlay');
        const hamburger = document.querySelector('.mobile-hamburger');
        
        if (menu && overlay && hamburger && overlay.classList.contains('show')) {
            if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
                closeOffCanvas();
            }
        }
    });
    
    // Add keyboard support for accessibility
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const overlay = document.getElementById('offCanvasOverlay');
            if (overlay && overlay.classList.contains('show')) {
                closeOffCanvas();
            }
        }
    });
}

// Set active navigation item based on current page
function setActiveNavItem() {
    const currentPage = getCurrentPage();
    
    setTimeout(() => {
        // Desktop navigation
        document.querySelectorAll('.desktop-nav-item').forEach(item => {
            const page = item.getAttribute('data-page');
            if (page === currentPage) {
                item.classList.add('text-purple-400');
                item.classList.remove('text-slate-300');
            } else {
                item.classList.add('text-slate-300');
                item.classList.remove('text-purple-400');
                item.classList.add('hover:text-purple-300');
            }
        });
        
        // Mobile navigation
        document.querySelectorAll('.off-canvas-menu-item').forEach(item => {
            const page = item.getAttribute('data-page');
            if (page === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }, 100);
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    
    if (page === '' || page === 'index') return 'home';
    return page;
}

// Enhanced scroll effect for sticky navbar
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (nav) {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 50) {
            nav.style.background = 'rgba(15, 23, 42, 0.95)';
            nav.style.backdropFilter = 'blur(25px)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            nav.classList.add('scrolled');
        } else {
            nav.style.background = 'rgba(30, 41, 59, 0.8)';
            nav.style.backdropFilter = 'blur(20px)';
            nav.style.boxShadow = 'none';
            nav.classList.remove('scrolled');
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }
});

// Initialize animations and observers
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Initialize and observe cards
    setTimeout(() => {
        document.querySelectorAll('.card-hover:not(.animate-float)').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }, 200);

    // Projects scroll container enhancements
    setTimeout(() => {
        const projectsContainer = document.querySelector('.projects-scroll-container');
        const scrollHint = document.querySelector('.scroll-hint');
        
        // Hide scroll hint when user starts scrolling
        if (projectsContainer && scrollHint) {
            projectsContainer.addEventListener('scroll', function() {
                if (this.scrollTop > 10) {
                    scrollHint.style.opacity = '0';
                    scrollHint.style.transform = 'translateY(-10px)';
                } else {
                    scrollHint.style.opacity = '1';
                    scrollHint.style.transform = 'translateY(0)';
                }
            });
        }

        // Add smooth scroll behavior to project cards
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add intersection observer for project cards
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }
                });
            }, {
                root: projectsContainer,
                threshold: 0.1
            });
            
            card.style.opacity = '0';  
            card.style.transform = 'translateX(-20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });

        // Add ripple effects to buttons (exclude primary buttons)
        document.querySelectorAll('button:not(.btn-primary)').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple-animation 0.6s linear';
                ripple.style.pointerEvents = 'none';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple && ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            });
        });
    }, 300);
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Handle window resize for better responsive behavior
window.addEventListener('resize', function() {
    // Close off-canvas menu on resize to prevent issues
    if (window.innerWidth >= 768) { // md breakpoint in Tailwind
        closeOffCanvas();
    }
});

// Preload critical components for better performance
function preloadComponents() {
    const link1 = document.createElement('link');
    link1.rel = 'prefetch';
    link1.href = 'components/header.html';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'prefetch';
    link2.href = 'components/footer.html';
    document.head.appendChild(link2);
}

// Initialize preloading when DOM is loaded
document.addEventListener('DOMContentLoaded', preloadComponents);



