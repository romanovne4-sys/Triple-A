document.addEventListener('DOMContentLoaded', () => {

    // ================= HEADER =================
    function scrollHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        if (window.scrollY >= 80) header.classList.add('scroll-header');
        else header.classList.remove('scroll-header');
    }
    window.addEventListener('scroll', scrollHeader);



    gsap.registerPlugin(ScrollTrigger);



    const tl = gsap.timeline();

    // header
    tl.from('#header', {
        y: -50,
        opacity: 0,
        duration: 1.1,
        ease: 'power2.out'
    });

    // title
    tl.from('.login__title', {
        y: 20,
        opacity: 0,
        scale: 0.90,
        stagger: 0.25,
        duration: 1.1,
        ease: "power2.out"
    }, "-=0.4");

    // форма
    tl.from('.form', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, "-=0.4");



    const inputs = document.querySelectorAll('.form__input');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.02,
                duration: 0.2,
                ease: 'power2.out'
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
    });


    // ================= BUTTON HOVER =================
    // const btn = document.querySelector('.btn');

    // if (btn) {
    //     btn.addEventListener('mouseenter', () => {
    //         gsap.to(btn, {
    //             scale: 1.04,
    //             duration: 0.2,
    //             ease: 'power2.out'
    //         });
    //     });

    //     btn.addEventListener('mouseleave', () => {
    //         gsap.to(btn, {
    //             scale: 1,
    //             duration: 0.2,
    //             ease: 'power2.out'
    //         });
    //     });
    // }

    // ================= CUSTOM CURSOR =================
    const cursor = document.querySelector('.custom-cursor');

    if (cursor) {
        let mouseX = 0,
            mouseY = 0;
        let posX = 0,
            posY = 0;
        const speed = 0.15;

        const hoverTargets = Array.from(document.querySelectorAll('a, button, li, input'));
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
    }

});