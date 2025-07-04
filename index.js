document.addEventListener("DOMContentLoaded", () => {
    console.log('Happy developing ✨');

    const track = document.querySelector(".carousel-track");
    const slides = document.querySelectorAll(".slide");

    if (!track || slides.length === 0) {
        console.warn("Carousel elements not found.");
        return;
    }

    let index = 0;
    let slideCount = slides.length;
    let slideWidth;
    let autoSlideInterval;

    // === Auto sliding ===
    function updateSlideWidth() {
        slideWidth = slides[0].getBoundingClientRect().width;
    }

    function visibleSlides() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) return 1;
        if (screenWidth <= 768) return 2;
        if (screenWidth <= 1024) return 3;
        return 4;
    }

    function moveToSlide(i) {
        index = i;
        track.style.transition = "transform 0.5s ease";
        track.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    function moveToNextSlide() {
        index++;
        if (index > slideCount - visibleSlides()) {
            moveToSlide(index);
            setTimeout(() => {
                track.style.transition = "none";
                index = 0;
                moveToSlide(index);
            }, 500);
        } else {
            moveToSlide(index);
        }
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(moveToNextSlide, 10000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // === Touch swipe ===
    let touchStartX = 0;

    track.addEventListener("touchstart", (e) => {
        stopAutoSlide();
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) > 50) {
            if (deltaX < 0) {
                moveToNextSlide();
            } else {
                index = index > 0 ? index - 1 : 0;
                moveToSlide(index);
            }
        } else {
            moveToSlide(index);
        }

        startAutoSlide();
    });

    // === Mouse drag ===
    let isDragging = false;
    let dragStartX = 0;
    let currentX = 0;

    track.addEventListener("mousedown", (e) => {
        isDragging = true;
        stopAutoSlide();
        dragStartX = e.clientX;
        track.style.transition = "none";
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
        const delta = currentX - dragStartX;
        track.style.transform = `translateX(-${index * slideWidth - delta}px)`;
    });

    window.addEventListener("mouseup", (e) => {
        if (!isDragging) return;
        isDragging = false;
        const delta = e.clientX - dragStartX;

        if (Math.abs(delta) > 50) {
            if (delta < 0) {
                moveToNextSlide();
            } else {
                index = index > 0 ? index - 1 : 0;
                moveToSlide(index);
            }
        } else {
            moveToSlide(index);
        }

        startAutoSlide();
        track.style.transition = "transform 0.5s ease";
    });

    // Disable image dragging inside slides
    slides.forEach(slide => {
        slide.setAttribute("draggable", "false");
    });

    // Init
    updateSlideWidth();
    window.addEventListener("resize", updateSlideWidth);
    startAutoSlide();
});
