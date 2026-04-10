document.addEventListener('DOMContentLoaded', () => {

    // ================= HEADER =================
    function scrollHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        if (window.scrollY >= 80) header.classList.add('scroll-header');
        else header.classList.remove('scroll-header');
    }
    window.addEventListener('scroll', scrollHeader);


    // ================= ELEMENTS =================
    const suiteList = document.querySelector('.suite__list');
    const suiteItems = document.querySelectorAll('.suite__item');
    const suiteCardWrap = document.querySelector('.suite__card-wrap');
    const suiteCard = document.querySelector('.suite__card');

    const cardTag = document.querySelector('.suite__card-tag');
    const cardTitle = document.querySelector('.suite__card-title');
    const cardText = document.querySelector('.suite__card-text');
    const noise = document.querySelector('.suite__card-noise');

    // SAFE CHECK
    if (!suiteList || !suiteItems.length || !suiteCardWrap || !suiteCard) {
        console.warn('Suite elements not found');
        return;
    }

    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded');
        return;
    }

    // ================= DATA =================
    const suiteCards = {
        'E-Commerce': {
            tag: 'Payments',
            title: 'Accept crypto payments globally',
            text: 'Enable your e-commerce store to accept stablecoin payments from 560M+ crypto users worldwide.'
        },
        'Travel & Hospitality': {
            tag: 'Payments',
            title: 'Seamless travel payments',
            text: 'Accept stablecoin payments for hotels, flights and experiences without currency conversion hassle.'
        },
        'Gaming': {
            tag: 'In-Game',
            title: 'Power in-game purchases',
            text: 'Let players buy items and upgrades instantly with stablecoins across any platform.'
        },
        'Professional Services': {
            tag: 'Payouts',
            title: 'Send stablecoin payouts globally',
            text: 'Let customers pay with stablecoins at checkout and tap into 560M+ digital currency users.'
        },
        'Trading Platforms': {
            tag: 'Settlement',
            title: 'Instant stablecoin settlement',
            text: 'Settle trades instantly with stablecoins and reduce counterparty risk across markets.'
        },
        'Creator Economy': {
            tag: 'Payouts',
            title: 'Pay creators instantly',
            text: 'Send instant stablecoin payouts to creators and influencers anywhere in the world.'
        },
        'Store-Value': {
            tag: 'Rewards',
            title: 'Unlock more with stablecoins',
            text: 'Build loyalty programs and rewards systems powered by stablecoin infrastructure.'
        }
    };

    // ================= STATE =================
    let hideTimeout = null;
    let isActive = false;
    let currentTimeline = null;

    // ================= MOUSE FOLLOW =================
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;

        if (isActive) {
            const cardW = suiteCard.offsetWidth || 463;
            const cardH = suiteCard.offsetHeight || 716;
            const margin = 16;
            const offsetX = 40;
            // по горизонтали — карточка справа от курсора, если не влезает — слева
            const spaceRight = window.innerWidth - currentX - offsetX;
            const x = spaceRight >= cardW + margin ?
                currentX + offsetX :
                currentX - cardW - offsetX;
            // по вертикали — центрируем относительно курсора, с зажимом
            const clampedY = Math.min(Math.max(currentY - cardH / 2, margin), window.innerHeight - cardH - margin);
            suiteCardWrap.style.transform = `translate(${x}px, ${clampedY}px)`;
        }

        requestAnimationFrame(animate);
    }
    animate();


    // ================= CARD ANIMATION =================
    function animateCard(data) {
        if (currentTimeline) currentTimeline.kill();

        const tl = gsap.timeline();
        currentTimeline = tl;

        tl
        // показать карточку
            .to(suiteCard, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.25,
            ease: 'power2.out'
        }, 0)

        // noise
        .set(noise, { opacity: 0.3 }, 0)

        // скрыть старый текст
        .to([cardTag, cardTitle, cardText], {
            opacity: 0,
            y: 10,
            duration: 0.15,
            stagger: 0.03
        }, 0)

        // смена контента
        .add(() => {
            cardTag.textContent = data.tag;
            cardTitle.textContent = data.title;
            cardText.textContent = data.text;
        })

        // показать новый
        .fromTo([cardTag, cardTitle, cardText], { opacity: 0, y: 10 }, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.04
        })

        // убрать noise
        .to(noise, {
            opacity: 0,
            duration: 0.3
        }, "-=0.2");
    }


    // ================= HOVER =================
    suiteItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
            isActive = true;

            const data = suiteCards[item.dataset.key];
            if (!data) return;

            suiteList.classList.add('suite__list--hovered');
            suiteItems.forEach(i => i.classList.remove('suite__item--hovered'));
            item.classList.add('suite__item--hovered');

            // показать wrapper
            gsap.killTweensOf(suiteCardWrap);
            gsap.to(suiteCardWrap, {
                opacity: 1,
                duration: 0.2,
                ease: 'power2.out'
            });

            // подсветка остальных
            gsap.to(suiteItems, {
                opacity: 0.4,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(item, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });

            animateCard(data);
        });
    });


    // ================= LEAVE =================
    suiteList.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(() => {
            isActive = false;

            suiteList.classList.remove('suite__list--hovered');
            suiteItems.forEach(i => i.classList.remove('suite__item--hovered'));

            // вернуть opacity всем
            gsap.to(suiteItems, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });

            if (currentTimeline) currentTimeline.kill();

            gsap.to([suiteCardWrap, suiteCard], {
                opacity: 0,
                duration: 0.1
            });

        }, 120);
    });


    // ================= NOISE LOOP =================
    if (noise) {
        gsap.to(noise, {
            x: '+=80',
            y: '+=80',
            duration: 6,
            ease: 'power2.out',
            repeat: -1
        });
    }

});


// scroll
(function() {
    const ease = 0.05;
    let currentY = window.scrollY;
    let targetY = currentY;
    let ticking = false;

    function getHeroHeight() {
        const hero = document.querySelector('.hero, spline-viewer');
        // берём высоту hero-секции, fallback — 100vh
        const lead = document.querySelector('.lead');
        if (lead) return lead.offsetTop;
        return window.innerHeight;
    }

    window.addEventListener('wheel', e => {
        e.preventDefault();

        const heroEnd = getHeroHeight();

        // Если скролл вниз и мы ещё в пределах hero — прыгаем к lead
        if (e.deltaY > 0 && currentY < heroEnd - 10) {
            targetY = heroEnd;
        } else {
            targetY += e.deltaY;
        }

        targetY = Math.max(0, Math.min(targetY, document.body.scrollHeight - window.innerHeight));

        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: false });

    function update() {
        currentY += (targetY - currentY) * ease;

        if (Math.abs(targetY - currentY) < 0.5) {
            currentY = targetY;
            ticking = false;
        } else {
            requestAnimationFrame(update);
        }

        window.scrollTo(0, currentY);
    }
})();


document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    let mouseX = 0,
        mouseY = 0;
    let posX = 0,
        posY = 0;
    const speed = 0.15;

    const hoverTargets = Array.from(document.querySelectorAll('a, button, li'));
    let lastHoverEl = null;
    let hoverTimeout = null;

    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        posX += (mouseX - posX) * speed;
        posY += (mouseY - posY) * speed;
        cursor.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;

        const hoverEl = hoverTargets.find(el => {
            const rect = el.getBoundingClientRect();
            return mouseX >= rect.left &&
                mouseX <= rect.right &&
                mouseY >= rect.top &&
                mouseY <= rect.bottom;
        });

        if (hoverEl && hoverEl !== lastHoverEl) {
            // Сбрасываем hover визуально
            cursor.classList.remove('hover');
            cursor.classList.add('resetting');

            if (hoverTimeout) clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                cursor.classList.remove('resetting');
                cursor.classList.add('hover');
                hoverTimeout = null;
            }, 20);

            lastHoverEl = hoverEl;
        } else if (!hoverEl) {
            if (hoverTimeout) clearTimeout(hoverTimeout);
            cursor.classList.remove('hover', 'resetting');
            lastHoverEl = null;
        }

        requestAnimationFrame(animate);
    }

    animate();





    // мой гсап

    gsap.registerPlugin(ScrambleTextPlugin, TextPlugin, ScrollTrigger);



    // Получаем элементы
    const titleSpans = document.querySelectorAll('.hero__title span');
    const globally = document.querySelector('.globally');
    const subtitle = document.querySelector('.hero__subtitle');




    //  timeline
    const tl = gsap.timeline();

    tl.to('.animation_overplay', {
        y: '-100vh',
        duration: 1.5,
        ease: 'power2.out'
    })

    // появление хедер
/*    .from('#header', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 0.5,
        ease: 'power2.out'
    }, "<")*/


    // 2. Заголовок хиро
    tl.from('.hero__title', {
        y: 50,
        opacity: 0,

        duration: 1.5,
        delay: 0.7,
        ease: 'power2.out'
    }, "<")


    // 3. subtitle
    tl.from(subtitle, {
        y: 50,
        opacity: 0,


        duration: 1.5,
        delay: 0.7,
        ease: 'power2.out'
    }, "<")



    gsap.to('.hero__content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom 60%',
            scrub: 1,
        },

        opacity: 0,
        y: -80,
        scale: 0.94,
        // rotateX: 10,
        // filter: 'blur(10px)',
        transformOrigin: 'center top',
        ease: 'power2.out'
    });

    // Затухание контента в hero
    gsap.to('.hero__content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom 60%',
            scrub: 1,
        },

        opacity: 0,
        y: -80,

        scale: 0.94,
        // rotateX: 10,
        // filter: 'blur(10px)',
        transformOrigin: 'center top',
        ease: 'power2.out'
    });

    // Затухание iframe в hero 
    gsap.to('.hero iframe', {
        scrollTrigger: {
            trigger: '.hero',
            start: '20% top',
            end: 'bottom 30%',

            scrub: 0.8,
        },

        opacity: 0,
        scale: 1.12,
        y: -80,
        // filter: 'blur(12px)',
        ease: 'power2.out'
    });


    // все заголовки
    gsap.utils.toArray('.section-title').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 50,
            opacity: 0,
            // letterSpacing: '0.04em',
            duration: 1.1,
            ease: 'power2.out'
        });
    });

    // 2й блок с каточками

    gsap.from('.lead__card', {
        scrollTrigger: {
            trigger: '.lead__grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        y: 60,
        opacity: 0,

        duration: 1.1,
        stagger: {
            each: 0.3,
            from: 'start',

            grid: 'auto',
            axis: 'x'
        },
        ease: 'power2.out'
    });



    // 3й блок анимация скрола для блока One Suite
    gsap.utils.toArray(".suite__list li").forEach((li, index) => {
        gsap.from(li, {
            scrollTrigger: {
                trigger: '.suite__list',
                start: "top 90%",
                toggleActions: "play none none none",
            },
            opacity: 0,
            x: -30,
            duration: 1.7,
            delay: 0.4 * index, 
            ease: "power2.out",
        });
    });

    // 4й блок с карточками trusted__card
    gsap.from('.trusted__card', {
        scrollTrigger: {
            trigger: '.trusted__inner',
            start: 'top 50%',
            toggleActions: 'play none none none',
            // markers: true,
        },
        y: 60,
        opacity: 0,
        scale: 0.96,
        duration: 1.1,
        stagger: {
            each: 0.12,
            from: 'start',
            grid: 'auto',
            axis: 'x'
        },
        ease: 'power2.out'
    });


    // Move money тест
    gsap.from('.move-money-text', {
        scrollTrigger: {
            trigger: '.move-money',
            start: 'top 40%',
            toggleActions: 'play none none none',
            // markers: true,
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out'
    });


    // Footer 
    gsap.from('.footer__col, .footer__desc', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 50%',
            toggleActions: 'play none none none',
            // markers: true,
        },
        y: 30,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: 'power2.out'

    });

});