const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- ЗВУК ЛОПАНИЯ (через HTML <audio>, не блокируется CORS) ---
const popSoundElement = document.getElementById('popSound');
popSoundElement.volume = 0.5;

function playPopSound() {
    // Клонируем звук, чтобы можно было лопать много пузырей подряд
    const sound = popSoundElement.cloneNode();
    sound.volume = popSoundElement.volume;
    sound.play().catch(err => {
        console.log('Не удалось воспроизвести звук:', err);
    });
}

// --- НАСТРОЙКИ ---
const BUBBLE_COUNT = 35;        
const MIN_RADIUS = 15;
const MAX_RADIUS = 60;

const MOUSE_RADIUS = 80;
const MOUSE_FORCE = 0.3;
const FRICTION = 0.985;
const MAX_SPEED = 2.5;

const particles = [];
const popParticles = [];
const trailBubbles = [];
const waterWaves = [];
const backgroundWaves = [];

const mouse = {
    x: -1000,
    y: -1000,
    prevX: -1000,
    prevY: -1000
};

// --- ЦВЕТА ---
const BUBBLE_COLORS = [
    'rgba(255, 255, 255, 0.4)',
    'rgba(116, 228, 255, 0.4)',
    'rgba(12, 113, 198, 0.3)',
    'rgba(134, 231, 80, 0.3)',
    'rgba(106, 182, 63, 0.3)'
];

const HIGHLIGHT_COLORS = [
    'rgba(255, 255, 255, 0.9)',
    'rgba(116, 228, 255, 0.9)',
    'rgba(134, 231, 80, 0.8)'
];

// --- ФОНОВЫЕ ВОЛНЫ ---
class WaterLine {
    constructor(y, amplitude, speed, color) {
        this.y = y;
        this.amplitude = amplitude;
        this.speed = speed;
        this.color = color;
        this.phase = Math.random() * Math.PI * 2;
    }

    update() {
        this.phase += this.speed;
    }

    draw(time) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        
        for (let x = 0; x <= canvas.width; x += 10) {
            const y = this.y + Math.sin(x * 0.005 + this.phase + time * 0.001) * this.amplitude;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
}

// --- КЛАСС ПУЗЫРЯ ---
class Bubble {
    constructor() {
        this.reset();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        
        this.color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
        this.highlightColor = HIGHLIGHT_COLORS[Math.floor(Math.random() * HIGHLIGHT_COLORS.length)];
        
        this.isPopping = false;
        this.wobble = Math.random() * Math.PI * 2;
        
        // Радужное сияние
        this.iridescentAngle = Math.random() * Math.PI * 2;
        this.iridescentSpeed = (Math.random() - 0.5) * 0.01;
    }

    update() {
        if (this.isPopping) {
            this.radius -= this.radius * 0.15;
            if (this.radius < 0.5) {
                this.reset();
                this.isPopping = false;
            }
            return;
        }

        this.wobble += 0.02;
        this.iridescentAngle += this.iridescentSpeed;
        this.x += Math.sin(this.wobble) * 0.15;
        this.y += Math.cos(this.wobble * 0.8) * 0.15;

        this.x += this.vx;
        this.y += this.vy;

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < MOUSE_RADIUS + this.radius && dist > 0) {
            const force = (MOUSE_RADIUS + this.radius - dist) / (MOUSE_RADIUS + this.radius);
            const angle = Math.atan2(dy, dx);
            
            this.vx += Math.cos(angle) * force * MOUSE_FORCE;
            this.vy += Math.sin(angle) * force * MOUSE_FORCE;
        }

        this.vx *= FRICTION;
        this.vy *= FRICTION;

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > MAX_SPEED) {
            this.vx = (this.vx / speed) * MAX_SPEED;
            this.vy = (this.vy / speed) * MAX_SPEED;
        }

        if (this.x - this.radius < 0) { this.x = this.radius; this.vx *= -0.8; }
        if (this.x + this.radius > canvas.width) { this.x = canvas.width - this.radius; this.vx *= -0.8; }
        if (this.y - this.radius < 0) { this.y = this.radius; this.vy *= -0.8; }
        if (this.y + this.radius > canvas.height) { this.y = canvas.height - this.radius; this.vy *= -0.8; }
    }

    draw() {
        // 1. Радужное сияние
        const glowGradient = ctx.createConicGradient(
            this.iridescentAngle, 
            this.x, 
            this.y
        );
        glowGradient.addColorStop(0.0, 'rgba(255, 100, 100, 0.0)');
        glowGradient.addColorStop(0.15, 'rgba(255, 200, 100, 0.25)');
        glowGradient.addColorStop(0.3, 'rgba(255, 255, 150, 0.2)');
        glowGradient.addColorStop(0.45, 'rgba(150, 255, 150, 0.25)');
        glowGradient.addColorStop(0.6, 'rgba(100, 200, 255, 0.25)');
        glowGradient.addColorStop(0.75, 'rgba(150, 100, 255, 0.2)');
        glowGradient.addColorStop(0.9, 'rgba(255, 100, 200, 0.25)');
        glowGradient.addColorStop(1.0, 'rgba(255, 100, 100, 0.0)');
        
        // Внешнее сияние
        ctx.beginPath();
        ctx.fillStyle = glowGradient;
        ctx.globalAlpha = 0.5;
        ctx.arc(this.x, this.y, this.radius * 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        // Мягкое свечение
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(200, 240, 255, 0.6)';
        
        // 2. Основной круг пузыря
        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3, 
            this.y - this.radius * 0.3, 
            this.radius * 0.1,
            this.x, 
            this.y, 
            this.radius
        );
        
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.4, this.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // 3. Блики
        ctx.beginPath();
        ctx.fillStyle = this.highlightColor;
        ctx.globalAlpha = 0.6;
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.globalAlpha = 0.8;
        ctx.arc(this.x + this.radius * 0.2, this.y + this.radius * 0.2, this.radius * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1.0;
        
        // 4. Радужная обводка
        ctx.beginPath();
        ctx.strokeStyle = glowGradient;
        ctx.lineWidth = 2;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // 5. Белая обводка
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// --- ШЛЕЙФ ОТ МЫШИ ---
class TrailBubble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 5 + 2;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.015;
        this.wobble = Math.random() * Math.PI * 2;
    }

    update() {
        this.wobble += 0.05;
        this.x += this.vx + Math.sin(this.wobble) * 0.2;
        this.y += this.vy + Math.cos(this.wobble) * 0.2;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life -= this.decay;
        this.radius *= 0.99;
    }

    draw() {
        if (this.life <= 0) return;
        
        ctx.beginPath();
        ctx.globalAlpha = this.life * 0.6;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(200, 240, 255, 0.5)';
        
        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3, 
            this.y - this.radius * 0.3, 
            0,
            this.x, 
            this.y, 
            this.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(0.6, 'rgba(116, 228, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.globalAlpha = 1.0;
    }
}

// --- ЧАСТИЦЫ ЛОПАНИЯ ---
class PopParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.size = Math.random() * 3 + 1;
        this.color = color;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life -= this.decay;
    }

    draw() {
        if (this.life <= 0) return;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

// --- ВОЛНЫ ОТ МЫШИ ---
class WaterWave {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.maxRadius = Math.random() * 40 + 30;
        this.life = 1.0;
        this.decay = Math.random() * 0.01 + 0.008;
        this.color = Math.random() > 0.5 
            ? 'rgba(255, 255, 255, 0.6)' 
            : 'rgba(116, 228, 255, 0.6)';
    }

    update() {
        this.radius += (this.maxRadius - this.radius) * 0.05;
        this.life -= this.decay;
    }

    draw() {
        if (this.life <= 0) return;
        
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = this.life * 0.7;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = this.life * 0.4;
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.globalAlpha = 1.0;
    }
}

// --- ИНИЦИАЛИЗАЦИЯ ---
function init() {
    for (let i = 0; i < BUBBLE_COUNT; i++) {
        particles.push(new Bubble());
    }
    
    backgroundWaves.push(new WaterLine(canvas.height * 0.3, 15, 0.008, 'rgba(255, 255, 255, 0.08)'));
    backgroundWaves.push(new WaterLine(canvas.height * 0.4, 20, 0.006, 'rgba(255, 255, 255, 0.06)'));
    backgroundWaves.push(new WaterLine(canvas.height * 0.5, 18, 0.007, 'rgba(255, 255, 255, 0.05)'));
    backgroundWaves.push(new WaterLine(canvas.height * 0.6, 25, 0.005, 'rgba(134, 231, 80, 0.08)'));
    backgroundWaves.push(new WaterLine(canvas.height * 0.7, 22, 0.006, 'rgba(134, 231, 80, 0.06)'));
    backgroundWaves.push(new WaterLine(canvas.height * 0.8, 20, 0.009, 'rgba(255, 255, 255, 0.05)'));
}

// --- КЛИК ПО ПУЗЫРЮ ---
canvas.addEventListener('click', (e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    particles.forEach(bubble => {
        const dx = clickX - bubble.x;
        const dy = clickY - bubble.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < bubble.radius && !bubble.isPopping) {
            bubble.isPopping = true;
            playPopSound();
            for (let i = 0; i < 15; i++) {
                popParticles.push(new PopParticle(bubble.x, bubble.y, bubble.highlightColor));
            }
            updateScore(1);
            waterWaves.push(new WaterWave(bubble.x, bubble.y));
        }
    });
});

// --- КНОПКА "ЛОПНУТЬ ВСЕ" ---
document.getElementById('popAllBtn').addEventListener('click', () => {
    let count = 0;
    particles.forEach(bubble => {
        if (!bubble.isPopping) {
            bubble.isPopping = true;
            count++;
            playPopSound();
            for (let i = 0; i < 20; i++) {
                popParticles.push(new PopParticle(bubble.x, bubble.y, bubble.highlightColor));
            }
            waterWaves.push(new WaterWave(bubble.x, bubble.y));
        }
    });
    updateScore(count);
});

// --- СЧЕТЧИК ---
let score = 0;
function updateScore(amount) {
    score += amount;
    document.getElementById('score').textContent = score;
}

// --- МЫШЬ ---
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
    mouse.prevX = -1000;
    mouse.prevY = -1000;
});

// --- АНИМАЦИЯ ---
let time = 0;
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    time += 1;
    
    backgroundWaves.forEach(wave => {
        wave.update();
        wave.draw(time);
    });
    
    if (mouse.x > 0 && mouse.y > 0 && mouse.prevX > 0 && mouse.prevY > 0) {
        const speed = Math.sqrt(
            Math.pow(mouse.x - mouse.prevX, 2) + 
            Math.pow(mouse.y - mouse.prevY, 2)
        );
        
        const count = Math.min(Math.floor(speed / 3) + 1, 3);
        for (let i = 0; i < count; i++) {
            trailBubbles.push(new TrailBubble(
                mouse.x + (Math.random() - 0.5) * 20,
                mouse.y + (Math.random() - 0.5) * 20
            ));
        }
        
        if (Math.random() < 0.15 && speed > 5) {
            waterWaves.push(new WaterWave(mouse.x, mouse.y));
        }
    }
    
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;

    for (let i = waterWaves.length - 1; i >= 0; i--) {
        const w = waterWaves[i];
        w.update();
        w.draw();
        if (w.life <= 0) waterWaves.splice(i, 1);
    }

    for (let i = trailBubbles.length - 1; i >= 0; i--) {
        const tb = trailBubbles[i];
        tb.update();
        tb.draw();
        if (tb.life <= 0) trailBubbles.splice(i, 1);
    }
    
    particles.forEach(bubble => {
        bubble.update();
        bubble.draw();
    });
    
    for (let i = popParticles.length - 1; i >= 0; i--) {
        const p = popParticles[i];
        p.update();
        p.draw();
        if (p.life <= 0) popParticles.splice(i, 1);
    }
    
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.length = 0;
    backgroundWaves.length = 0;
    init();
});