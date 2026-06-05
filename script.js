const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('primary-nav');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));

const setMenuExpanded = (expanded) => {
    if (!mobileMenu || !navMenu) {
        return;
    }

    mobileMenu.classList.toggle('active', expanded);
    navMenu.classList.toggle('active', expanded);
    document.body.classList.toggle('menu-open', expanded);
    mobileMenu.setAttribute('aria-expanded', String(expanded));
};

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
        setMenuExpanded(!navMenu.classList.contains('active'));
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => setMenuExpanded(false));
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-container')) {
            setMenuExpanded(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuExpanded(false);
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const targetId = anchor.getAttribute('href');
        const target = targetId ? document.querySelector(targetId) : null;

        if (!target) {
            return;
        }

        event.preventDefault();
        const headerOffset = 84;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
            top: Math.max(targetTop, 0),
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
    });
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const activeLink = navLinks.find((link) => link.getAttribute('href') === `#${entry.target.id}`);

        if (entry.isIntersecting && activeLink) {
            navLinks.forEach((link) => link.classList.remove('active'));
            activeLink.classList.add('active');
        }
    });
}, {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
});

document.querySelectorAll('main section[id]').forEach((section) => {
    sectionObserver.observe(section);
});

const canvas = document.getElementById('neural-field');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (canvas) {
    const context = canvas.getContext('2d', { alpha: true });
    const pointer = { x: null, y: null };
    let nodes = [];
    let animationId = null;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const randomBetween = (min, max) => Math.random() * (max - min) + min;

    const createNodes = () => {
        const area = width * height;
        const count = Math.min(86, Math.max(38, Math.floor(area / 24000)));

        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: randomBetween(-0.12, 0.12),
            vy: randomBetween(-0.1, 0.1),
            radius: randomBetween(0.8, 1.8)
        }));
    };

    const resizeCanvas = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        createNodes();
    };

    const updateNodes = () => {
        nodes.forEach((node) => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < -20) node.x = width + 20;
            if (node.x > width + 20) node.x = -20;
            if (node.y < -20) node.y = height + 20;
            if (node.y > height + 20) node.y = -20;

            if (pointer.x !== null && pointer.y !== null) {
                const dx = pointer.x - node.x;
                const dy = pointer.y - node.y;
                const distance = Math.hypot(dx, dy);

                if (distance < 150 && distance > 0) {
                    node.x -= (dx / distance) * 0.08;
                    node.y -= (dy / distance) * 0.08;
                }
            }
        });
    };

    const draw = () => {
        context.clearRect(0, 0, width, height);

        for (let i = 0; i < nodes.length; i += 1) {
            for (let j = i + 1; j < nodes.length; j += 1) {
                const a = nodes[i];
                const b = nodes[j];
                const distance = Math.hypot(a.x - b.x, a.y - b.y);
                const maxDistance = 145;

                if (distance < maxDistance) {
                    const alpha = (1 - distance / maxDistance) * 0.16;
                    context.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    context.lineWidth = 0.65;
                    context.beginPath();
                    context.moveTo(a.x, a.y);
                    context.lineTo(b.x, b.y);
                    context.stroke();
                }
            }
        }

        nodes.forEach((node) => {
            context.fillStyle = 'rgba(255, 255, 255, 0.38)';
            context.beginPath();
            context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            context.fill();
        });
    };

    const animate = () => {
        updateNodes();
        draw();
        animationId = window.requestAnimationFrame(animate);
    };

    const start = () => {
        if (animationId) {
            window.cancelAnimationFrame(animationId);
            animationId = null;
        }

        draw();

        if (!reducedMotionQuery.matches) {
            animationId = window.requestAnimationFrame(animate);
        }
    };

    resizeCanvas();
    start();

    window.addEventListener('resize', () => {
        resizeCanvas();
        start();
    });

    window.addEventListener('pointermove', (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
    });

    window.addEventListener('pointerleave', () => {
        pointer.x = null;
        pointer.y = null;
    });

    if (typeof reducedMotionQuery.addEventListener === 'function') {
        reducedMotionQuery.addEventListener('change', start);
    } else if (typeof reducedMotionQuery.addListener === 'function') {
        reducedMotionQuery.addListener(start);
    }
}
