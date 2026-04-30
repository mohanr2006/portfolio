document.addEventListener('DOMContentLoaded', () => {
    /* ===== DARK MODE TOGGLE ===== */
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const darkIcon = darkModeToggle.querySelector('.dark-icon');
    const lightIcon = darkModeToggle.querySelector('.light-icon');

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    darkModeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark');
            body.classList.remove('light');
            darkIcon.style.display = 'none';
            lightIcon.style.display = 'block';
        } else {
            body.classList.add('light');
            body.classList.remove('dark');
            darkIcon.style.display = 'block';
            lightIcon.style.display = 'none';
        }
        localStorage.setItem('theme', theme);
    }

    /* ===== MOBILE MENU ===== */
    const menuToggle = document.getElementById('menuToggle');
    const navLinksList = document.getElementById('navLinks');
    const navLinks = document.querySelectorAll('.nav-links a');

    menuToggle.addEventListener('click', () => {
        navLinksList.classList.toggle('open');
        // Hamburger animation
        const spans = menuToggle.querySelectorAll('span');
        menuToggle.classList.toggle('active');
        if (menuToggle.classList.contains('active')) {
            spans[0].style.transform = 'translateY(7px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksList.classList.remove('open');
            menuToggle.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    /* ===== REVEAL ON SCROLL ===== */
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // If the element contains skill bars, animate them
                const skillFills = entry.target.querySelectorAll('.skill-fill');
                if (skillFills.length > 0) {
                    skillFills.forEach(fill => {
                        fill.style.width = fill.getAttribute('data-width');
                    });
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    /* ===== NAVBAR SCROLL EFFECT ===== */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = 'var(--shadow)';
        } else {
            navbar.style.padding = '0';
            navbar.style.boxShadow = 'none';
        }

        // Active Link Highlighting
        let current = "";
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    /* ===== TYPEWRITER EFFECT ===== */
    const textElement = document.getElementById('typewriter');
    const roles = ["Engineering Student", "Full Stack Developer", "UI/UX Designer", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            textElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            textElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 1500; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();

    /* ===== EMAILJS INIT ===== */
    // Replace these three values after setting up EmailJS (see instructions below)
    const EMAILJS_PUBLIC_KEY = 'Y98TXBcI1QT4ap7Se';   // step 1
    const EMAILJS_SERVICE_ID = 'service_n5gl99r';   // step 2
    const EMAILJS_TEMPLATE_ID = 'template_6mbpy55';  // step 3

    emailjs.init(EMAILJS_PUBLIC_KEY);

    /* ===== CONTACT FORM HANDLING ===== */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';

            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                to_email: 'kalvimohan03@gmail.com'
            };

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(() => {
                    // Success
                    formStatus.innerHTML = '✅ Message sent successfully! I\'ll reply soon. ✨';
                    formStatus.style.color = '#22c55e';
                    formStatus.style.display = 'block';
                    contactForm.reset();
                })
                .catch((error) => {
                    // Error
                    console.error('EmailJS error:', error);
                    formStatus.innerHTML = '❌ Something went wrong. Please try emailing me directly at <strong>kalvimohan03@gmail.com</strong>';
                    formStatus.style.color = '#ef4444';
                    formStatus.style.display = 'block';
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 7000);
                });
        });
    }

    /* ===== SMOOTH SCROLL FOR BUTTONS ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });
});
