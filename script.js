// V14 main home-screen slider
(() => {
    const slides = [...document.querySelectorAll('.home-slide')],
        dots = document.querySelector('.home-slider-dots'),
        prev = document.querySelector('.home-slider-arrow.prev'),
        next = document.querySelector('.home-slider-arrow.next'),
        hero = document.querySelector('.home-slider');

    if (!slides.length || !dots) return;

    let current = 0;
    let timer;
    let sliderStarted = false;

    // Create slider dots
    slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `स्लाइड ${i + 1}`);

        b.addEventListener('click', () => {
            show(i);
            restart();
        });

        dots.appendChild(b);
    });

    const dotButtons = [...dots.children];

    // Show selected slide
    function show(i) {
        slides[current].classList.remove('active');
        dotButtons[current]?.classList.remove('active');

        current = (i + slides.length) % slides.length;

        slides[current].classList.add('active');
        dotButtons[current]?.classList.add('active');
    }

    // Automatic slider every 2 seconds
    function restart() {
        clearInterval(timer);

        timer = setInterval(() => {
            show(current + 1);
        }, 2000);
    }

    // Previous button
    prev?.addEventListener('click', () => {
        show(current - 1);
        restart();
    });

    // Next button
    next?.addEventListener('click', () => {
        show(current + 1);
        restart();
    });

    // Mobile swipe
    let x = 0;

    hero?.addEventListener(
        'touchstart',
        e => {
            x = e.changedTouches[0].clientX;
        },
        { passive: true }
    );

    hero?.addEventListener(
        'touchend',
        e => {
            const d = e.changedTouches[0].clientX - x;

            if (Math.abs(d) > 45) {
                show(current + (d < 0 ? 1 : -1));
                restart();
            }
        },
        { passive: true }
    );

    // ALWAYS start website from first image
    show(0);

    // Get first slide image
    const firstImg = slides[0]?.querySelector('img');

    // Start slider only after first image has loaded
    function startAfterFirstImage() {

        if (sliderStarted) return;

        sliderStarted = true;

        // Keep first image visible when loading finishes
        show(0);

        // First image now stays for full 2 seconds
        // before moving to image 2
        restart();
    }

    if (firstImg) {

        // Image already loaded from browser cache
        if (firstImg.complete && firstImg.naturalWidth > 0) {

            startAfterFirstImage();

        } else {

            // Wait until image 1 is completely loaded
            firstImg.addEventListener(
                'load',
                startAfterFirstImage,
                { once: true }
            );

            // If image 1 has an error,
            // allow slider to continue instead of freezing
            firstImg.addEventListener(
                'error',
                startAfterFirstImage,
                { once: true }
            );
        }

    } else {

        startAfterFirstImage();
    }

})();