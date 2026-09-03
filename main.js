document.addEventListener('DOMContentLoaded', function() {
    console.log("System Initialized!");

    const videoGate = document.getElementById('video-gate-container');
    const gateVideo = document.getElementById('gate-video');
    const mainContent = document.getElementById('main-content');
    const secondVideo = document.getElementById('second-video');
    const bgMusic = document.getElementById('bg-music');
    const openBtn = document.getElementById('open-gate-btn');

    let isStarted = false;

    // دالة بدء الدعوة وتشغيل الصوت والفيديو
    function startInvitation(e) {
        if (isStarted) return;
        isStarted = true;

        if (openBtn) {
            openBtn.style.display = 'none';
        }

        if (bgMusic) {
            bgMusic.currentTime = 70;
            bgMusic.play().catch(err => console.log('Audio error:', err));
        }

        if (gateVideo) {
            gateVideo.currentTime = 0;
            let playPromise = gateVideo.play();

            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.log('Gate video blocked, skipping directly:', err);
                    revealMainContent();
                });
            }
        } else {
            revealMainContent();
        }
    }

    // ربط زرار الفتح والـ container
    if (openBtn) {
        openBtn.addEventListener('click', startInvitation);
    }
    if (videoGate) {
        videoGate.addEventListener('click', startInvitation);
    }

    // لما الفيديو الأول يخلص
    if (gateVideo) {
        gateVideo.addEventListener('ended', revealMainContent);
    }

    function revealMainContent() {
        if (videoGate) {
            videoGate.style.display = 'none';
            videoGate.classList.add('hidden');
        }

        if (mainContent) {
            mainContent.classList.remove('hidden');
        }

        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';

        if (secondVideo) {
            secondVideo.play().catch(err => console.log('Second video error:', err));
        }

        startTypewriter();

        setTimeout(() => {
            requestAnimationFrame(() => {
                startAutoScroll();
            });
        }, 500);
    }

    function startAutoScroll() {
        let stopped = false;
        let animationId;

        function scrollStep() {
            if (stopped) return;

            const currentScroll = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

            if (currentScroll >= maxScroll - 2) {
                stopped = true;
                return;
            }

            window.scrollTo(0, currentScroll + 1.5);
            animationId = requestAnimationFrame(scrollStep);
        }

        setTimeout(() => {
            requestAnimationFrame(() => {
                scrollStep();
            });
        }, 1000);

        function stopScroll() {
            stopped = true;
            cancelAnimationFrame(animationId);
        }

        window.addEventListener('touchstart', stopScroll, { passive: true, once: true });
        window.addEventListener('wheel', stopScroll, { passive: true, once: true });
    }

    // Typewriter Effect
    function startTypewriter() {
        const elements = document.querySelectorAll('.typewriter-text');
        
        elements.forEach((element, index) => {
            const textToType = element.getAttribute('data-text');
            if (!textToType) return;
            
            element.textContent = '';
            
            setTimeout(() => {
                typeCharacter(element, textToType, 0);
            }, index * 700);
        });
    }

    function typeCharacter(element, text, i) {
        if (i <= text.length) {
            element.textContent = text.slice(0, i);
            setTimeout(() => typeCharacter(element, text, i + 1), 50);
        } else {
            element.classList.add('finished');
        }
    }
});

// Countdown Timer Logic
const targetDate = new Date('September 12, 2026 00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.textContent = days < 10 ? '0' + days : days;
        hoursEl.textContent = hours < 10 ? '0' + hours : hours;
        minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    } else {
        const container = document.querySelector('.countdown-container');
        if (container) container.innerHTML = "<h3>The Big Day Has Arrived!</h3>";
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();