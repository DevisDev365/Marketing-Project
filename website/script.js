/* ═══════════════════════════════════════════════════
   RED TAPE [X] ANIME COLLECTION — ANIMATIONS & EFFECTS
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════ DISCLAIMER POP-UP ═══════════════
    const disclaimerOverlay = document.getElementById('disclaimer-overlay');
    const disclaimerBtn = document.getElementById('disclaimer-btn');
    const btnText = document.getElementById('btn-text');
    const countdown = document.getElementById('countdown');
    const timerBar = document.getElementById('timer-bar');

    let timeLeft = 5;
    const totalTime = 5;
    const startTime = Date.now();

    const timerInterval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min((elapsed / totalTime) * 100, 100);
        timerBar.style.width = progress + '%';

        timeLeft = Math.max(0, Math.ceil(totalTime - elapsed));
        countdown.textContent = timeLeft;

        if (elapsed >= totalTime) {
            clearInterval(timerInterval);
            disclaimerBtn.disabled = false;
            btnText.innerHTML = 'I UNDERSTAND — ENTER SITE';
        }
    }, 100);

    disclaimerBtn.addEventListener('click', () => {
        if (!disclaimerBtn.disabled) {
            disclaimerOverlay.classList.add('hidden');
            document.body.style.overflow = '';
            // Trigger hero animations after dismissal
            setTimeout(triggerHeroAnimations, 300);
        }
    });

    // Prevent scrolling while disclaimer is up
    document.body.style.overflow = 'hidden';


    // ═══════════════ HERO ANIMATIONS ═══════════════
    function triggerHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero .anim-fade-up, .hero .anim-slide-right, .hero .anim-slide-left');
        heroElements.forEach(el => {
            const delay = parseFloat(el.dataset.delay || 0) * 1000;
            setTimeout(() => {
                el.classList.add('visible');
            }, delay);
        });
    }


    // ═══════════════ SCROLL ANIMATIONS ═══════════════
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseFloat(el.dataset.delay || 0) * 1000;
                setTimeout(() => {
                    el.classList.add('visible');
                }, delay);
                animObserver.unobserve(el);
            }
        });
    }, observerOptions);

    // Observe all animated elements EXCEPT hero ones (those trigger after disclaimer)
    document.querySelectorAll('.anim-reveal, .anim-reveal-image, .section-intro .anim-fade-up').forEach(el => {
        animObserver.observe(el);
    });


    // ═══════════════ NAVBAR SCROLL ═══════════════
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });


    // ═══════════════ NAV ACTIVE LINK ═══════════════
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });


    // ═══════════════ NUMBER COUNTER ANIMATION ═══════════════
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = Date.now();
        const startVal = 0;

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startVal + (target - startVal) * eased);
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }


    // ═══════════════ PARTICLE SYSTEM ═══════════════
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.7 ? 350 : 0; // Most red, some neutral
            this.saturation = this.hue === 350 ? 70 : 0;
            this.lightness = this.hue === 350 ? 50 : 80;
            this.life = Math.random() * 200 + 100;
            this.maxLife = this.life;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;

            if (this.life <= 0 || this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
                this.reset();
            }
        }

        draw() {
            const fadeRatio = this.life / this.maxLife;
            const currentOpacity = this.opacity * fadeRatio;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${currentOpacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(196, 30, 58, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        animationId = requestAnimationFrame(animateParticles);
    }

    animateParticles();


    // ═══════════════ PARALLAX ON PRODUCT IMAGES ═══════════════
    const productImages = document.querySelectorAll('.product-image-wrap');

    window.addEventListener('scroll', () => {
        productImages.forEach(wrap => {
            const rect = wrap.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const windowCenter = window.innerHeight / 2;
            const offset = (centerY - windowCenter) * 0.03;

            const img = wrap.querySelector('.product-image');
            if (img && Math.abs(offset) < 30) {
                img.style.transform = `translateY(${offset}px)`;
            }
        });
    }, { passive: true });


    // ═══════════════ SMOOTH SCROLL FOR NAV LINKS ═══════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ═══════════════ ANIME SPEED LINES EFFECT ON SCROLL ═══════════════
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollSpeed = Math.abs(window.pageYOffset - lastScroll);
                if (scrollSpeed > 30) {
                    document.body.style.setProperty('--scroll-speed', scrollSpeed * 0.005);
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

});
