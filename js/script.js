document.addEventListener('DOMContentLoaded', () => {
    console.log("Strona załadowana - start skryptów...");
    let currentLang = 'pl';

    // --- 1. TŁUMACZENIA ---
    function setLanguage(lang) {
        currentLang = lang;
        const data = translations[lang];
        if (!data) return;

        // Teksty
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (data[key]) el.textContent = data[key];
        });

        // Placeholdery
        const nameInp = document.getElementById('f-name');
        const msgInp = document.getElementById('f-msg');
        if (nameInp) nameInp.placeholder = (lang === 'de') ? "Name" : "Imię";
        if (msgInp) msgInp.placeholder = (lang === 'de') ? "Nachricht" : "Wiadomość";

        // Aktywny przycisk
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
    });

    setLanguage('pl'); // Start PL

// --- 1. GŁÓWNY SLIDER (SWIPER) ---
    const swiper = new Swiper(".myHeroSwiper", {
        loop: true,
        effect: "fade", // Ładne przenikanie zamiast przesuwania
        fadeEffect: { crossFade: true },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    // --- 3. LICZNIKI (STATS) ---
    const statsSection = document.querySelector('#stats');
    let started = false;

    if (statsSection) {
        window.addEventListener('scroll', () => {
            const rect = statsSection.getBoundingClientRect();
            // Jeśli sekcja jest widoczna i licznik jeszcze nie ruszył
            if (rect.top < window.innerHeight - 100 && !started) {
                document.querySelectorAll('.stat-number').forEach(el => {
                    const target = +el.getAttribute('data-target');
                    let count = 0;
                    const inc = target / 50; 
                    const updateCount = () => {
                        count += inc;
                        if (count < target) {
                            el.textContent = Math.ceil(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            el.textContent = target + "+";
                        }
                    };
                    updateCount();
                });
                started = true;
            }
        });
    }

    // --- 4. FAQ ---
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            item.classList.toggle('active');
        });
    });

    // --- 5. FORMULARZ ---
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('f-btn');
            const status = document.getElementById('form-status');
            
            btn.disabled = true;
            btn.textContent = translations[currentLang]['form_sending'];

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    status.textContent = translations[currentLang]['form_success'];
                    status.className = "success";
                    status.style.display = "block";
                    form.reset();
                } else { throw new Error(); }
            } catch (err) {
                status.textContent = translations[currentLang]['form_error'];
                status.className = "error";
                status.style.display = "block";
            } finally {
                btn.disabled = false;
                btn.textContent = translations[currentLang]['form_send'];
            }
        });
    }
});

// --- 6. SCROLL SPY (Poza DOMContentLoaded) ---
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section, .hero');
    const navLinks = document.querySelectorAll('nav ul li a');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});