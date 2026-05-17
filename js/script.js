document.addEventListener('DOMContentLoaded', () => {

    // ================= HEADER =================

    function scrollHeader() {
        const header = document.getElementById('header');

        if (!header) return;

        if (window.scrollY >= 80) {
            header.classList.add('scroll-header');
        } else {
            header.classList.remove('scroll-header');
        }
    }

    window.addEventListener('scroll', scrollHeader);



    // ================= SUITE ELEMENTS =================

    const suiteList = document.querySelector('.suite__list');
    const suiteItems = document.querySelectorAll('.suite__item');
    const suiteCardWrap = document.querySelector('.suite__card-wrap');
    const suiteCard = document.querySelector('.suite__card');

    const cardTag = document.querySelector('.suite__card-tag');
    const cardTitle = document.querySelector('.suite__card-title');
    const cardText = document.querySelector('.suite__card-text');
    const noise = document.querySelector('.suite__card-noise');

    const hasSuite =
        suiteList &&
        suiteItems.length &&
        suiteCardWrap &&
        suiteCard;



    // ================= GSAP =================

    if (typeof gsap !== 'undefined') {

        gsap.registerPlugin(
            ScrambleTextPlugin,
            TextPlugin,
            ScrollTrigger
        );

        // hero timeline

        const subtitle = document.querySelector('.hero__subtitle');

        const tl = gsap.timeline();

        tl.to('.animation_overplay', {
            y: '-100vh',
            duration: 1.5,
            ease: 'power2.out'
        });

        tl.from('.hero__title', {
            y: 50,
            opacity: 0,
            duration: 1.5,
            delay: 0.7,
            ease: 'power2.out'
        }, '<');

        tl.from(subtitle, {
            y: 50,
            opacity: 0,
            duration: 1.5,
            delay: 0.7,
            ease: 'power2.out'
        }, '<');


        // section titles

        gsap.utils.toArray('.section-title').forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                y: 50,
                opacity: 0,
                duration: 1.1,
                ease: 'power2.out'
            });
        });


        // lead cards

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


        // trusted cards

        gsap.from('.trusted__card', {
            scrollTrigger: {
                trigger: '.trusted__inner',
                start: 'top 50%',
                toggleActions: 'play none none none',
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


        // move money

        gsap.from('.move-money-text', {
            scrollTrigger: {
                trigger: '.move-money',
                start: 'top 40%',
                toggleActions: 'play none none none',
            },
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out'
        });


        // footer

        gsap.from('.footer__col, .footer__desc', {
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 50%',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 1.1,
            stagger: 0.1,
            ease: 'power2.out'
        });

    }



    // ================= SUITE BLOCK =================

    if (hasSuite && typeof gsap !== 'undefined') {

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


        let hideTimeout = null;
        let isActive = false;
        let currentTimeline = null;


        // mouse follow

        if (window.innerWidth > 768) {

            let mouseX = 0;
            let mouseY = 0;

            let currentX = 0;
            let currentY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            function animateSuiteCard() {

                currentX += (mouseX - currentX) * 0.12;
                currentY += (mouseY - currentY) * 0.12;

                if (isActive) {

                    const cardW = suiteCard.offsetWidth || 463;
                    const cardH = suiteCard.offsetHeight || 716;

                    const margin = 16;
                    const offsetX = 40;

                    const spaceRight =
                        window.innerWidth - currentX - offsetX;

                    const x = spaceRight >= cardW + margin
                        ? currentX + offsetX
                        : currentX - cardW - offsetX;

                    const clampedY = Math.min(
                        Math.max(currentY - cardH / 2, margin),
                        window.innerHeight - cardH - margin
                    );

                    suiteCardWrap.style.transform =
                        `translate(${x}px, ${clampedY}px)`;
                }

                requestAnimationFrame(animateSuiteCard);
            }

            animateSuiteCard();
        }


        // animate card

        function animateCard(data) {

            if (currentTimeline) {
                currentTimeline.kill();
            }

            const tl = gsap.timeline();

            currentTimeline = tl;

            tl.to(suiteCard, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.25,
                ease: 'power2.out'
            }, 0);

            tl.set(noise, {
                opacity: 0.3
            }, 0);

            tl.to([cardTag, cardTitle, cardText], {
                opacity: 0,
                y: 10,
                duration: 0.15,
                stagger: 0.03
            }, 0);

            tl.add(() => {
                cardTag.textContent = data.tag;
                cardTitle.textContent = data.title;
                cardText.textContent = data.text;
            });

            tl.fromTo(
                [cardTag, cardTitle, cardText],
                {
                    opacity: 0,
                    y: 10
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    stagger: 0.04
                }
            );

            tl.to(noise, {
                opacity: 0,
                duration: 0.3
            }, '-=0.2');
        }


        // hover

        suiteItems.forEach(item => {

            item.addEventListener('mouseenter', () => {

                clearTimeout(hideTimeout);

                isActive = true;

                const data = suiteCards[item.dataset.key];

                if (!data) return;

                suiteList.classList.add('suite__list--hovered');

                suiteItems.forEach(i => {
                    i.classList.remove('suite__item--hovered');
                });

                item.classList.add('suite__item--hovered');

                gsap.killTweensOf(suiteCardWrap);

                gsap.to(suiteCardWrap, {
                    opacity: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                });

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


        // leave

        suiteList.addEventListener('mouseleave', () => {

            hideTimeout = setTimeout(() => {

                isActive = false;

                suiteList.classList.remove('suite__list--hovered');

                suiteItems.forEach(i => {
                    i.classList.remove('suite__item--hovered');
                });

                gsap.to(suiteItems, {
                    opacity: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                if (currentTimeline) {
                    currentTimeline.kill();
                }

                gsap.to([suiteCardWrap, suiteCard], {
                    opacity: 0,
                    duration: 0.1
                });

            }, 120);
        });


        // mobile

        if ('ontouchstart' in window || window.innerWidth <= 768) {

            suiteItems.forEach(item => {

                item.addEventListener('click', (e) => {

                    e.preventDefault();

                    const data = suiteCards[item.dataset.key];

                    if (!data) return;

                    const isAlreadyActive =
                        item.classList.contains('suite__item--hovered');

                    suiteItems.forEach(i => {
                        i.classList.remove('suite__item--hovered');
                    });

                    suiteList.classList.remove('suite__list--hovered');

                    if (isAlreadyActive) {
                        suiteCardWrap.classList.remove('mobile-visible');
                        return;
                    }

                    item.classList.add('suite__item--hovered');

                    suiteList.classList.add('suite__list--hovered');

                    cardTag.textContent = data.tag;
                    cardTitle.textContent = data.title;
                    cardText.textContent = data.text;

                    suiteCardWrap.classList.add('mobile-visible');

                    suiteCard.style.opacity = '1';
                    suiteCard.style.transform = 'none';

                    setTimeout(() => {
                        suiteCardWrap.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }, 100);
                });
            });


            document.addEventListener('click', (e) => {

                if (
                    !e.target.closest('.suite__list') &&
                    !e.target.closest('.suite__card-wrap')
                ) {

                    suiteItems.forEach(i => {
                        i.classList.remove('suite__item--hovered');
                    });

                    suiteList.classList.remove('suite__list--hovered');

                    suiteCardWrap.classList.remove('mobile-visible');
                }
            });
        }


        // suite animation

        gsap.utils.toArray('.suite__list li').forEach((li, index) => {

            gsap.from(li, {
                scrollTrigger: {
                    trigger: '.suite__list',
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },

                opacity: 0,
                x: -30,
                duration: 1.7,
                delay: 0.4 * index,
                ease: 'power2.out',
            });
        });


        // noise

        if (noise) {

            gsap.to(noise, {
                x: '+=80',
                y: '+=80',
                duration: 6,
                ease: 'power2.out',
                repeat: -1
            });
        }
    }



    // ================= CUSTOM CURSOR =================

    if (window.innerWidth > 768) {

        const cursor = document.querySelector('.custom-cursor');

        if (cursor) {

            let mouseX = 0;
            let mouseY = 0;

            let posX = 0;
            let posY = 0;

            const speed = 0.15;

            window.addEventListener('mousemove', e => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            document.querySelectorAll('a, button, li').forEach(el => {

                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('hover');
                });

                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('hover');
                });
            });

            function animateCursor() {

                posX += (mouseX - posX) * speed;
                posY += (mouseY - posY) * speed;

                cursor.style.transform =
                    `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;

                requestAnimationFrame(animateCursor);
            }

            animateCursor();
        }
    }



    // ================= OVERLAY FIX =================

    const animOverlay = document.querySelector('.animation_overplay');

    if (animOverlay) {

        setTimeout(() => {
            animOverlay.style.pointerEvents = 'none';
        }, 1600);
    }

});



// ================= SMOOTH SCROLL =================

(function () {

    const ease = 0.05;

    let currentY = window.scrollY;
    let targetY = currentY;

    let ticking = false;

    function getHeroHeight() {

        const lead = document.querySelector('.lead');

        if (lead) {
            return lead.offsetTop;
        }

        return window.innerHeight;
    }

    window.addEventListener('wheel', e => {

        e.preventDefault();

        const heroEnd = getHeroHeight();

        if (e.deltaY > 0 && currentY < heroEnd - 10) {
            targetY = heroEnd;
        } else {
            targetY += e.deltaY;
        }

        targetY = Math.max(
            0,
            Math.min(
                targetY,
                document.body.scrollHeight - window.innerHeight
            )
        );

        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }

    }, {
        passive: false
    });

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



// ================= BURGER =================

(function () {

    const burger = document.querySelector('.burger');
    const overlay = document.querySelector('.nav-overlay');
    const backdrop = document.querySelector('.nav-backdrop');
    const closeBtn = document.querySelector('.nav-overlay__close');

    if (!burger || !overlay) return;

    function openMenu() {

        burger.classList.add('is-active');

        overlay.classList.add('is-open');

        if (backdrop) {
            backdrop.classList.add('is-open');
        }

        burger.setAttribute('aria-expanded', 'true');

        document.body.classList.add('nav-is-open');
    }

    function closeMenu() {

        burger.classList.remove('is-active');

        overlay.classList.remove('is-open');

        if (backdrop) {
            backdrop.classList.remove('is-open');
        }

        burger.setAttribute('aria-expanded', 'false');

        document.body.classList.remove('nav-is-open');
    }

    burger.addEventListener('click', () => {

        const isOpen =
            overlay.classList.contains('is-open');

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeMenu);
    }

    document.querySelectorAll(
        '.menu__link, .nav-overlay__link'
    ).forEach(link => {

        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {

        if (e.key === 'Escape') {
            closeMenu();
        }
    });

})();
