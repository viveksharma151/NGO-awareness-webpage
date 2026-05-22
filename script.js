document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                menuToggle.classList.remove('active');
                
                // Update active link state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    /* ==========================================================================
       LIGHT / DARK THEME TOGGLE
       ========================================================================== */
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        root.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    /* ==========================================================================
       PROJECT FILTERING SYSTEM
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('fade-out');
                    // Brief delay to allow transitions to work
                    setTimeout(() => {
                        card.style.display = 'flex';
                    }, 50);
                } else {
                    card.classList.add('fade-out');
                    // Hide after animation fades out
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* ==========================================================================
       PROJECT DETAIL COLLAPSIBLE (LEARN MORE)
       ========================================================================== */
    const detailToggles = document.querySelectorAll('.toggle-project-details');

    detailToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            const detailPanel = card.querySelector('.project-details-expanded');
            const isExpanded = detailPanel.classList.contains('show');

            if (isExpanded) {
                detailPanel.classList.remove('show');
                toggle.innerHTML = 'Learn More <span class="arrow">&rarr;</span>';
            } else {
                detailPanel.classList.add('show');
                toggle.innerHTML = 'Show Less <span class="arrow">&uarr;</span>';
            }
        });
    });

    /* ==========================================================================
       TESTIMONIAL SLIDER
       ========================================================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentSlide = 0;
    let autoplayInterval;

    function showSlide(index) {
        if (slides.length === 0) return;

        // Boundary safety
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Reset elements
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Activate new ones
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Set up listeners
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                showSlide(index);
                resetAutoplay();
            });
        });
    }

    // Autoplay functions
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 6000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Initialize autoplay
    startAutoplay();

    /* ==========================================================================
       INTERSECTION OBSERVER - SCROLL REVEAL & STATS COUNTER
       ========================================================================== */
    
    // 1. Scroll Reveal elements
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => revealObserver.observe(element));

    // 2. Stats Number Counter Animation
    const counterNumbers = document.querySelectorAll('.counter-number');
    let countersStarted = false;

    function runCounters() {
        counterNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / (target / 50)), 15);
            let current = 0;
            const increment = Math.ceil(target / (duration / stepTime));

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format commas and symbol additions
                if (target >= 1000) {
                    counter.innerText = current.toLocaleString() + '+';
                } else {
                    counter.innerText = current + '+';
                }
            }, stepTime);
        });
    }

    const statsSection = document.getElementById('impact');
    if (statsSection && counterNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                runCounters();
                statsObserver.unobserve(statsSection);
            }
        }, {
            threshold: 0.25
        });

        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       VOLUNTEER SIGNUP FORM VALIDATION
       ========================================================================== */
    const volunteerForm = document.getElementById('volunteerForm');
    const formView = document.getElementById('volunteerFormView');
    const successView = document.getElementById('volunteerSuccessView');

    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate all inputs
            const isNameValid = validateField('fullName', 'nameError', val => val.trim().length > 2);
            const isEmailValid = validateField('emailAddr', 'emailError', val => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(val);
            });
            const isPhoneValid = validateField('phoneNum', 'phoneError', val => {
                const cleanVal = val.replace(/\D/g, '');
                return cleanVal.length === 10;
            });
            const isProjectValid = validateField('projectInterest', 'projectError', val => val !== "");
            const isTermsValid = validateCheckbox('termsCheck', 'termsError');

            const isFormValid = isNameValid && isEmailValid && isPhoneValid && isProjectValid && isTermsValid;

            if (isFormValid) {
                submitForm();
            }
        });

        // Add real-time input listeners to remove errors on typing
        setupRealtimeValidation('fullName', 'nameError', val => val.trim().length > 2);
        setupRealtimeValidation('emailAddr', 'emailError', val => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(val);
        });
        setupRealtimeValidation('phoneNum', 'phoneError', val => {
            const cleanVal = val.replace(/\D/g, '');
            return cleanVal.length === 10;
        });
        setupRealtimeValidation('projectInterest', 'projectError', val => val !== "");
        
        const termsCheck = document.getElementById('termsCheck');
        if (termsCheck) {
            termsCheck.addEventListener('change', () => {
                const container = termsCheck.closest('.form-checkbox');
                if (termsCheck.checked) {
                    container.classList.remove('invalid');
                }
            });
        }
    }

    function validateField(inputId, errorId, validationFn) {
        const input = document.getElementById(inputId);
        const parent = input.closest('.form-group');
        const isValid = validationFn(input.value);

        if (!isValid) {
            parent.classList.add('invalid');
        } else {
            parent.classList.remove('invalid');
        }
        return isValid;
    }

    function validateCheckbox(inputId, errorId) {
        const checkbox = document.getElementById(inputId);
        const parent = checkbox.closest('.form-checkbox');
        const isValid = checkbox.checked;

        if (!isValid) {
            parent.classList.add('invalid');
        } else {
            parent.classList.remove('invalid');
        }
        return isValid;
    }

    function setupRealtimeValidation(inputId, errorId, validationFn) {
        const input = document.getElementById(inputId);
        if (!input) return;

        const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
        
        input.addEventListener(eventType, () => {
            const parent = input.closest('.form-group');
            if (validationFn(input.value)) {
                parent.classList.remove('invalid');
            }
        });
    }

    function submitForm() {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // TODO: Replace this simulated 1.5s delay with a real fetch/axios POST request once backend endpoint is ready
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            // Gather values for summary page
            const nameVal = document.getElementById('fullName').value;
            const projectSelect = document.getElementById('projectInterest');
            const projectText = projectSelect.options[projectSelect.selectedIndex].text;

            document.getElementById('summaryName').innerText = nameVal;
            document.getElementById('summaryProject').innerText = projectText;
            
            // Generate a random registration code
            const randomCode = 'IAM-' + Math.floor(10000 + Math.random() * 90000);
            document.getElementById('refCode').innerText = randomCode;

            // Switch views
            formView.classList.add('hide');
            successView.classList.remove('hide');
        }, 1500);
    }

    // Reset Form button action
    const resetBtn = document.getElementById('resetFormBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            volunteerForm.reset();
            formView.classList.remove('hide');
            successView.classList.add('hide');
        });
    }
});
