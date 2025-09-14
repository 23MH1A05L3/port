// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeSkillBars();
    initializeTooltips();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - navbar.offsetHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        let currentSection = '';
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Scroll effects and animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger skill bar animations when skills section is visible
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                
                // Stagger animation for cards
                if (entry.target.classList.contains('stagger-container')) {
                    const items = entry.target.querySelectorAll('.stagger-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe sections and animated elements
    sections.forEach(section => {
        observer.observe(section);
    });
    
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .card-reveal, .stagger-container');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize animations
function initializeAnimations() {
    // Add animation classes to elements with delays
    const elementsWithDelay = document.querySelectorAll('[style*="animation-delay"]');
    elementsWithDelay.forEach(element => {
        // Elements already have animation-delay in inline styles
        // This ensures they animate on page load
        element.style.opacity = '0';
        element.classList.add('fade-in');
    });
    
    // Parallax effect for floating elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Add hover effects to interactive cards
    const interactiveCards = document.querySelectorAll('.glass-card, .project-card, .highlight-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.progress-bar');
    
    // Set initial width to 0
    skillBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.setAttribute('data-width', targetWidth);
        bar.style.width = '0%';
    });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.progress-bar');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        }, index * 200);
    });
}

// Initialize tooltips (if Bootstrap tooltips are needed)
function initializeTooltips() {
    // Enable Bootstrap tooltips if they exist
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    const navbar = document.getElementById('navbar');
    
    if (section) {
        const offsetTop = section.offsetTop - navbar.offsetHeight;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Social links functionality
function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Scroll indicator functionality
function initializeScrollIndicator() {
    const scrollBtn = document.querySelector('.scroll-btn');
    
    if (scrollBtn) {
        scrollBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            
            if (targetSection) {
                scrollToSection(this.getAttribute('href'));
            }
        });
        
        // Hide scroll indicator when scrolling past hero section
        window.addEventListener('scroll', function() {
            const heroSection = document.getElementById('home');
            if (heroSection) {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                
                if (window.scrollY > heroBottom - 200) {
                    scrollBtn.style.opacity = '0';
                } else {
                    scrollBtn.style.opacity = '1';
                }
            }
        });
    }
}

// Initialize additional features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSocialLinks();
    initializeScrollIndicator();
});

// Performance optimization - debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Scroll-based animations or effects that don't need to run on every scroll event
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    const initialAnimations = document.querySelectorAll('.fade-in[style*="animation-delay"]');
    initialAnimations.forEach(element => {
        element.style.opacity = '1';
    });
});

// Error handling for missing elements
function safeQuerySelector(selector, context = document) {
    try {
        return context.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

function safeQuerySelectorAll(selector, context = document) {
    try {
        return context.querySelectorAll(selector);
    } catch (error) {
        console.warn(`Elements not found: ${selector}`);
        return [];
    }
}