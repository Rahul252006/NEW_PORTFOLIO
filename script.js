/**
 * Rahul Simhadri - Storytelling Portfolio Interactivity
 * Focus: High Performance, Zero Lag, Native Browser API Orchestration
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeInversion();
    initScrollReveal();
    initChapterNavigation();
    initScrollProgressBar();
    initContactForm();
});

/**
 * Theme Inversion Controller
 * Swaps monochrome background and foreground variables, preserving user selection in localStorage.
 */
function initThemeInversion() {
    const toggleBtn = document.getElementById('theme-toggle');
    const overlay = document.querySelector('.color-transition-overlay');
    const toggleText = toggleBtn.querySelector('.toggle-text');
    
    // Check local storage for preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'inverted') {
        document.body.classList.add('inverted-theme');
        if (toggleText) toggleText.textContent = 'RESTORE';
    }

    toggleBtn.addEventListener('click', () => {
        // Trigger subtle transition flash effect
        if (overlay) {
            overlay.classList.add('flash');
            setTimeout(() => {
                overlay.classList.remove('flash');
            }, 200);
        }

        // Delay the swap slightly to align with the visual flash overlay
        setTimeout(() => {
            document.body.classList.toggle('inverted-theme');
            const isInverted = document.body.classList.contains('inverted-theme');
            
            localStorage.setItem('theme', isInverted ? 'inverted' : 'normal');
            if (toggleText) {
                toggleText.textContent = isInverted ? 'RESTORE' : 'INVERT';
            }
        }, 100);
    });
}

/**
 * Scroll Reveal Controller
 * Uses Intersection Observer API for GPU-accelerated element entrances.
 * Unobserves target elements after action to avoid main-thread monitoring overhead.
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class to trigger CSS transition
                entry.target.classList.add('revealed');
                // Unobserve to reclaim performance memory
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.08, // trigger when 8% of element is visible
        rootMargin: '0px 0px -50px 0px' // adjust bottom bounds
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/**
 * Chapter Active State Navigation Controller
 * Updates header chapter indicators automatically as reader scrolls through sections.
 */
function initChapterNavigation() {
    const chapters = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('.chapter-nav .nav-link');
    
    const chapterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // Map section IDs to chapter indexes
                let chapterIndex = '';
                if (activeId === 'chapter-1') chapterIndex = '1';
                else if (activeId === 'chapter-2') chapterIndex = '2';
                else if (activeId === 'chapter-3') chapterIndex = '3';
                else if (activeId === 'chapter-4') chapterIndex = '4';
                else if (activeId === 'chapter-5') chapterIndex = '5';
                
                // Update active navigation state
                navLinks.forEach(link => {
                    if (link.getAttribute('data-chapter') === chapterIndex) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        root: null,
        threshold: 0.2, // Trigger when 20% of section is visible
        rootMargin: '-20% 0px -40% 0px' // Offset viewport bounds for accurate narrative matching
    });

    chapters.forEach(chapter => {
        chapterObserver.observe(chapter);
    });
}

/**
 * Scroll Progress Bar
 * Throttled scroll percentage indicator using requestAnimationFrame to prevent lagging or layout thrashing.
 */
function initScrollProgressBar() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    let ticking = false;

    function updateProgressBar() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        progressBar.style.width = `${scrollPercentage}%`;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateProgressBar);
            ticking = true;
        }
    }, { passive: true }); // Enable passive listening to prevent scrolling jank
}

/**
 * Form Submit Handling
 * Mimics clean messaging flow without external dependencies.
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    
    if (!form || !successMsg) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Disable submit button during "sending" transition
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Sending...';

        // Simulate network API request delay (0.8s)
        setTimeout(() => {
            // Hide Form, Show Success Message smoothly
            form.style.display = 'none';
            successMsg.style.display = 'block';
            successMsg.setAttribute('aria-hidden', 'false');
            
            // Log form contents locally in console for testing
            const formData = new FormData(form);
            console.log('Form Submitted successfully:', {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            });
        }, 800);
    });
}
