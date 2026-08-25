document.addEventListener('DOMContentLoaded', function() {
    console.log("System Initialized!");

    const videoGate = document.getElementById('video-gate-container');
    const gateVideo = document.getElementById('gate-video');
    const mainContent = document.getElementById('main-content');
    const secondVideo = document.getElementById('second-video');
    const bgMusic = document.getElementById('bg-music');

    let isStarted = false;

    // 1. عند الضغط: تشغيل الصوت والفيديو الأول
    function startGateVideo() {
        if (isStarted) return;
        isStarted = true;

        if (bgMusic) {
            bgMusic.currentTime = 70;
            bgMusic.play().catch(err => console.log('Audio error:', err));
        }

        if (gateVideo) {
            let playPromise = gateVideo.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // الفيديو شغال تمام
                }).catch(err => {
                    console.log('Gate video blocked, skipping directly:', err);
                    revealMainContent();
                });
            }
        } else {
            revealMainContent();
        }
    }

    // 2. لما الفيديو الأول يخلص تماماً -> افتح الصفحة الرئيسية
    if (gateVideo) {
        gateVideo.addEventListener('ended', revealMainContent);
    }

    // 📌 ربط الكليك والـ Touch على container البوابة (ده اللي كان ناقص بردو)
    if (videoGate) {
        videoGate.addEventListener('click', startGateVideo);
        videoGate.addEventListener('touchstart', startGateVideo, { passive: true });
    }

    function revealMainContent() {
        if (videoGate) {
            videoGate.style.display = 'none';
            videoGate.classList.add('hidden');
        }

        if (mainContent) {
            mainContent.classList.remove('hidden');
        }

        // فك الـ Overflow للشاشة
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';

        if (secondVideo) {
            secondVideo.play().catch(err => console.log('Second video error:', err));
        }

        // تشغيل انيميشن الكتابة
        startTypewriter();

        // 🚀 بدء السكرول التلقائي بعد 1.5 ثانية
        setTimeout(() => {
            startAutoScroll();
        }, 1500);
    }

    function startAutoScroll() {
        setTimeout(() => {
            let isStopped = false;

            function step() {
                if (isStopped) return;

                const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                const totalHeight = Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.offsetHeight
                );
                const maxScroll = totalHeight - window.innerHeight;

                if (currentScroll >= maxScroll - 5) {
                    isStopped = true;
                    return;
                }

                window.scrollBy(0, 1.2);
                requestAnimationFrame(step);
            }

            requestAnimationFrame(step);

            const stopScroll = () => { isStopped = true; };
            window.addEventListener('touchmove', stopScroll, { passive: true, once: true });
            window.addEventListener('wheel', stopScroll, { passive: true, once: true });
        }, 300);
    }

    // 3. TYPEWRITER LOGIC
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

// 4. COUNTDOWN TIMER LOGIC
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