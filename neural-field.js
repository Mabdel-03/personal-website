// A stationary field of branching cells. Each branch brightens near the pointer
// and loses its charge more slowly than it gains it, leaving a brief wake.
(() => {
    const canvas = document.getElementById('neural-field');
    const context = canvas?.getContext('2d');
    const restingField = document.createElement('canvas');
    const restingContext = restingField.getContext('2d');
    if (!context || !restingContext) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let branches = [];
    let width = 0;
    let height = 0;
    let pointer = null;
    let glow = { x: 0, y: 0, opacity: 0 };
    let frame = 0;
    let lastFrame = 0;

    // A separate seed per grid cell keeps the tissue in place when resizing.
    function makeNeuron(column, row, spacing) {
        let seed = Math.imul(column + 17, 73856093) ^ Math.imul(row + 53, 19349663);
        function sample(min, max) {
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
            return min + (seed / 4294967296) * (max - min);
        }

        const x = (column + sample(0.1, 0.9)) * spacing;
        const y = (row + sample(0.1, 0.9)) * spacing;
        const scale = sample(0.78, 1.15);
        function branch(startX, startY, angle, length, weight, depth) {
            const bend = angle + sample(-0.58, 0.58);
            const half = length * 0.5;
            const cx = startX + Math.cos(angle) * half;
            const cy = startY + Math.sin(angle) * half;
            const endX = cx + Math.cos(bend) * half;
            const endY = cy + Math.sin(bend) * half;
            const path = new Path2D();
            path.moveTo(startX, startY);
            path.quadraticCurveTo(cx, cy, endX, endY);
            branches.push({ path, x: cx, y: cy, weight, charge: 0 });
            if (depth === 0) return;

            branch(endX, endY, bend + sample(-0.28, 0.28), length * sample(0.69, 0.88), weight * 0.76, depth - 1);
            if (sample(0, 1) < 0.78) {
                const fork = sample(0.38, 0.95) * (sample(0, 1) < 0.5 ? -1 : 1);
                branch(endX, endY, bend + fork, length * sample(0.53, 0.79), weight * 0.6, depth - 1);
            }
        }

        const roots = [];
        const arms = Math.floor(sample(4, 6));
        const rotation = sample(0, Math.PI * 2);
        for (let i = 0; i < arms; i += 1) {
            const angle = rotation + i * Math.PI * 2 / arms + sample(-0.3, 0.3);
            const rootLength = scale * sample(4, 7);
            const rootX = x + Math.cos(angle) * rootLength;
            const rootY = y + Math.sin(angle) * rootLength;
            roots.push({ x: rootX, y: rootY });
            // One longer process gives each cell an asymmetric silhouette.
            const length = (i === 0 ? sample(43, 59) : sample(23, 42)) * scale;
            branch(rootX, rootY, angle, length, sample(0.95, 1.55), i === 0 ? 3 : 2);
        }

        const soma = new Path2D();
        soma.moveTo(roots[0].x, roots[0].y);
        for (let i = 1; i <= arms; i += 1) {
            const next = roots[i % arms];
            soma.quadraticCurveTo(x, y, next.x, next.y);
        }
        soma.closePath();
        branches.push({ path: soma, x, y, weight: 0, charge: 0 });
    }

    function drawBranch(ctx, segment, gain) {
        if (segment.weight === 0) {
            ctx.fill(segment.path);
        } else {
            ctx.lineWidth = Math.max(0.48, segment.weight) + gain * 0.55;
            ctx.stroke(segment.path);
        }
    }

    function drawRestingField() {
        context.clearRect(0, 0, width, height);
        context.drawImage(restingField, 0, 0, width, height);
    }

    function rebuild() {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        if (!width || !height) return;
        const ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4000000 / (width * height)));
        canvas.width = restingField.width = Math.round(width * ratio);
        canvas.height = restingField.height = Math.round(height * ratio);
        for (const ctx of [context, restingContext]) {
            ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
            ctx.lineCap = 'round';
        }
        const spacing = Math.max(177, Math.sqrt(width * height / 72));
        branches = [];
        for (let row = -1; row <= Math.ceil(height / spacing); row += 1) {
            for (let column = -1; column <= Math.ceil(width / spacing); column += 1) {
                makeNeuron(column, row, spacing);
            }
        }
        branches = branches.filter(({ x, y }) => x > -65 && x < width + 65 && y > -65 && y < height + 65);
        restingContext.strokeStyle = 'rgba(148, 183, 180, 0.23)';
        restingContext.fillStyle = 'rgba(148, 183, 180, 0.31)';
        for (const segment of branches) drawBranch(restingContext, segment, 0);
        drawRestingField();
        if (pointer) scheduleFrame();
    }

    function animate(time) {
        frame = 0;
        const elapsed = lastFrame ? Math.min(time - lastFrame, 64) : 16;
        lastFrame = time;
        const follow = 1 - Math.exp(-elapsed / 28);
        const attack = 1 - Math.exp(-elapsed / 47);
        const decay = 1 - Math.exp(-elapsed / 155);
        if (pointer) {
            glow.x += (pointer.x - glow.x) * follow;
            glow.y += (pointer.y - glow.y) * follow;
        }
        const opacityTarget = pointer ? 1 : 0;
        glow.opacity += (opacityTarget - glow.opacity) * (pointer ? attack : decay);
        let settling = Math.abs(opacityTarget - glow.opacity) > 0.002;
        if (pointer && Math.hypot(pointer.x - glow.x, pointer.y - glow.y) > 0.15) settling = true;

        drawRestingField();
        const radius = 130;
        if (glow.opacity > 0.002) {
            const halo = context.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, radius);
            halo.addColorStop(0, 'rgba(103, 215, 194, 0.095)');
            halo.addColorStop(0.55, 'rgba(103, 215, 194, 0.032)');
            halo.addColorStop(1, 'rgba(103, 215, 194, 0)');
            context.globalAlpha = glow.opacity;
            context.fillStyle = halo;
            context.fillRect(glow.x - radius, glow.y - radius, radius * 2, radius * 2);
        }
        context.strokeStyle = context.fillStyle = '#9fe4d2';
        for (const segment of branches) {
            const dx = segment.x - glow.x;
            const dy = segment.y - glow.y;
            const proximity = pointer ? Math.max(0, 1 - (dx * dx + dy * dy) / (radius * radius)) : 0;
            const target = proximity * proximity;
            if (Math.abs(target - segment.charge) > 0.002) {
                segment.charge += (target - segment.charge) * (target > segment.charge ? attack : decay);
                settling = true;
            } else {
                segment.charge = target;
            }
            if (segment.charge > 0.002) {
                context.globalAlpha = segment.charge * 0.85;
                drawBranch(context, segment, segment.charge);
            }
        }
        context.globalAlpha = 1;
        if (settling) scheduleFrame();
        else lastFrame = 0;
    }

    function scheduleFrame() {
        if (!frame && !document.hidden && !reducedMotion.matches) frame = window.requestAnimationFrame(animate);
    }

    function track(event) {
        if (!event.isPrimary || reducedMotion.matches || document.hidden) return;
        if (!pointer && glow.opacity < 0.01) {
            glow.x = event.clientX;
            glow.y = event.clientY;
        }
        pointer = { x: event.clientX, y: event.clientY };
        scheduleFrame();
    }

    function release() {
        if (!pointer) return;
        pointer = null;
        scheduleFrame();
    }

    function reset() {
        window.cancelAnimationFrame(frame);
        frame = lastFrame = 0;
        pointer = null;
        glow.opacity = 0;
        for (const segment of branches) segment.charge = 0;
        if (width && height) drawRestingField();
    }

    rebuild();
    window.addEventListener('resize', rebuild);
    window.addEventListener('pointermove', track, { passive: true });
    window.addEventListener('pointerdown', track, { passive: true });
    window.addEventListener('pointerout', (event) => { if (!event.relatedTarget) release(); });
    window.addEventListener('pointerup', (event) => { if (event.pointerType === 'touch') release(); });
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
    document.addEventListener('visibilitychange', reset);
    reducedMotion.addEventListener('change', reset);
})();
