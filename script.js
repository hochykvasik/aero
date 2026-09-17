// ============================================
//  ЗВУКИ
// ============================================
const popSoundSmall = document.getElementById('popSoundSmall');
const popSoundFallback = document.getElementById('popSoundFallback');
[popSoundSmall, popSoundFallback].forEach(s => s.volume = 0.45);

function playPopSound(radius, volumeOverride = null) {
    let sound, rate;
    if (radius < 25) { sound = popSoundSmall; rate = 1.2; }
    else { sound = popSoundFallback; rate = 0.9; }
    const clone = sound.cloneNode();
    clone.volume = volumeOverride !== null ? volumeOverride : sound.volume;
    clone.playbackRate = rate;
    clone.play().catch(() => {});
}

const clickSounds = [
    document.getElementById('clickSound1'),
    document.getElementById('clickSound2'),
    document.getElementById('clickSound3')
];
const clickFallback = document.getElementById('clickFallback');
clickSounds.forEach(s => s.volume = 0.45);
clickFallback.volume = 0.45;

function playClickSound() {
    const sound = clickSounds[Math.floor(Math.random() * clickSounds.length)];
    const source = (sound && sound.src && sound.src !== '') ? sound : clickFallback;
    const clone = source.cloneNode();
    clone.volume = source.volume;
    clone.playbackRate = 0.9 + Math.random() * 0.3;
    clone.play().catch(() => {});
}

const menuSound = document.getElementById('menuSound');
const menuFallback = document.getElementById('menuFallback');
menuSound.volume = 0.5;
menuFallback.volume = 0.5;

function playMenuSound() {
    const source = (menuSound && menuSound.src && menuSound.src !== '') ? menuSound : menuFallback;
    const clone = source.cloneNode();
    clone.volume = source.volume;
    clone.playbackRate = 0.95 + Math.random() * 0.15;
    clone.play().catch(() => {});
}

const catSound = document.getElementById('catSound');
const catSound2 = document.getElementById('catSound2');
if (catSound) catSound.volume = 0.25;
if (catSound2) catSound2.volume = 0.25;

function playCatSound() {
    const sounds = [catSound, catSound2].filter(s => s && s.src);
    if (sounds.length === 0) return;
    const source = sounds[Math.floor(Math.random() * sounds.length)];
    const clone = source.cloneNode();
    clone.volume = source.volume;
    clone.playbackRate = 0.9 + Math.random() * 0.2;
    clone.play().catch(() => {});
}

const memeSounds = [
    document.getElementById('memeSound1'),
    document.getElementById('memeSound2'),
    document.getElementById('memeSound3'),
    document.getElementById('memeSound4'),
    document.getElementById('memeSound5')
];
memeSounds.forEach(s => s.volume = 0.5);

function playMemeSound() {
    const sound = memeSounds[Math.floor(Math.random() * memeSounds.length)];
    if (!sound || !sound.src) return;
    const clone = sound.cloneNode();
    clone.volume = sound.volume;
    clone.playbackRate = 0.95 + Math.random() * 0.15;
    clone.play().catch(() => {});
}

const adOpenSound = document.getElementById('adOpenSound');
const adCloseSound = document.getElementById('adCloseSound');
const virusWinSound = document.getElementById('virusWinSound');
const virusLoseSound = document.getElementById('virusLoseSound');
[adOpenSound, adCloseSound, virusWinSound, virusLoseSound].forEach(s => s.volume = 0.5);

function playSimpleSound(sound) {
    if (!sound || !sound.src) return;
    const clone = sound.cloneNode();
    clone.volume = sound.volume;
    clone.play().catch(() => {});
}

const icebreak1 = document.getElementById('icebreak1');
const icebreak2 = document.getElementById('icebreak2');
const freezeSound = document.getElementById('freezeSound');
if (icebreak1) icebreak1.volume = 0.5;
if (icebreak2) icebreak2.volume = 0.5;
if (freezeSound) freezeSound.volume = 0.4;

function playIceBreakSound() {
    const sounds = [icebreak1, icebreak2].filter(s => s && s.src);
    if (sounds.length === 0) {
        playPopSound(20, 0.3);
        return;
    }
    const source = sounds[Math.floor(Math.random() * sounds.length)];
    const clone = source.cloneNode();
    clone.volume = source.volume;
    clone.playbackRate = 0.95 + Math.random() * 0.15;
    clone.play().catch(() => {});
}

function playFreezeSound() {
    if (!freezeSound || !freezeSound.src) return;
    const clone = freezeSound.cloneNode();
    clone.volume = freezeSound.volume;
    clone.play().catch(() => {});
}

// ============================================
//  ФОНОВАЯ МУЗЫКА
// ============================================
const ambientMusic = document.getElementById('ambientMusic');
ambientMusic.volume = 0.15;
let musicStarted = false;

function startMusicOnce() {
    if (musicStarted) return;
    musicStarted = true;
    ambientMusic.pause();
    ambientMusic.currentTime = 0;
    ambientMusic.play().catch(() => { musicStarted = false; });
}

['click', 'touchstart', 'keydown'].forEach(evt => {
    window.addEventListener(evt, startMusicOnce, { once: true });
});

// ============================================
//  МОБИЛЬНОЕ ОПРЕДЕЛЕНИЕ
// ============================================
const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// ============================================
//  ПЕРЕКЛЮЧАТЕЛЬ ИГР
// ============================================
const modeBubbles = document.getElementById('modeBubbles');
const modeWindows = document.getElementById('modeWindows');
const modeBrowser = document.getElementById('modeBrowser');
const bubblesGame = document.getElementById('bubblesGame');
const windowsGame = document.getElementById('windowsGame');
const browserGame = document.getElementById('browserGame');
const popAllBtn = document.getElementById('popAllBtn');
const bubblesScore = document.querySelector('.bubbles-score');

let currentMode = 'bubbles';

function switchMode(mode) {
    if (mode === currentMode) return;
    playMenuSound();
    currentMode = mode;
    
    modeBubbles.classList.toggle('active', mode === 'bubbles');
    modeWindows.classList.toggle('active', mode === 'windows');
    modeBrowser.classList.toggle('active', mode === 'browser');
    bubblesGame.classList.toggle('active', mode === 'bubbles');
    windowsGame.classList.toggle('active', mode === 'windows');
    browserGame.classList.toggle('active', mode === 'browser');
    
    if (mode === 'windows') {
        clearAllWindows();
        setTimeout(spawnWindows, 300);
        startXpBackgroundMotion();
        initBgBubbles();
    } else {
        clearAllWindows();
        stopXpBackgroundMotion();
        if (isRaining) stopRain();
    }
    
    if (mode === 'browser') {
        if (!browserRunning) {
            startBrowserGame();
        } else {
            browserPaused = false;
        }
    } else {
        if (browserRunning) {
            browserPaused = true;
        }
    }
}

modeBubbles.addEventListener('click', () => switchMode('bubbles'));
modeWindows.addEventListener('click', () => switchMode('windows'));
modeBrowser.addEventListener('click', () => switchMode('browser'));

// ============================================
//  ИГРА 1: ПУЗЫРИ
// ============================================
const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

const BUBBLE_COUNT = isMobile ? 22 : 45;
const TINY_BUBBLE_COUNT = isMobile ? 15 : 35;
const MIN_RADIUS = 20;
const MAX_RADIUS = 80;
const TINY_MIN = 4;
const TINY_MAX = 12;
const MOUSE_RADIUS = isMobile ? 60 : 90;
const MOUSE_FORCE = 0.3;
const FRICTION = 0.985;
const MAX_SPEED = 2.5;
const WALL_BOUNCE = 0.85;

const particles = [];
const popParticles = [];
const trailBubbles = [];
const waterWaves = [];

let isFrozen = false;
let frozenTimer = null;
let popAllClicks = [];
let frozenBreakCount = 0;
let FREEZE_BREAK_NEEDED = 20 + Math.floor(Math.random() * 11);
let freezeTargetClicks = 5 + Math.floor(Math.random() * 6);
let iceVisualIntensity = 0;

const pointer = {
    x: -1000, y: -1000,
    prevX: -1000, prevY: -1000,
    isDown: false
};

const BUBBLE_COLORS = [
    'rgba(180, 240, 220, 0.5)',
    'rgba(190, 245, 200, 0.5)',
    'rgba(170, 235, 240, 0.5)',
    'rgba(200, 250, 210, 0.5)',
    'rgba(160, 230, 235, 0.5)',
    'rgba(190, 245, 215, 0.5)'
];
const HIGHLIGHT_COLORS = [
    'rgba(255, 255, 255, 0.95)',
    'rgba(240, 255, 250, 0.95)',
    'rgba(255, 255, 255, 0.9)'
];

class Bubble {
    constructor(tiny = false) { 
        this.tiny = tiny;
        this.reset(true); 
    }
    reset(randomPos = false) {
        if (this.tiny) {
            this.radius = Math.random() * (TINY_MAX - TINY_MIN) + TINY_MIN;
        } else {
            this.radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
        }
        this.x = Math.random() * canvas.width;
        this.y = randomPos ? Math.random() * canvas.height : canvas.height + this.radius;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
        this.highlightColor = HIGHLIGHT_COLORS[Math.floor(Math.random() * HIGHLIGHT_COLORS.length)];
        this.isPopping = false;
        this.isIce = false;
        this.wobble = Math.random() * Math.PI * 2;
        this.iridescentAngle = Math.random() * Math.PI * 2;
        this.iridescentSpeed = (Math.random() - 0.5) * 0.01;
        this.highlightAngle = Math.random() * Math.PI * 2;
        this.highlightRadius = 0.3;
        this.highlightSpeed = (Math.random() - 0.5) * 0.02;
        this.stuckTo = null;
        this.stuckOffsetX = 0;
        this.stuckOffsetY = 0;
        this.crackSeed = Math.random() * 1000;
    }
    
    update() {
        if (this.isPopping) {
            this.radius -= this.radius * 0.15;
            if (this.radius < 0.5) this.reset(true);
            return;
        }
        this.highlightAngle += this.highlightSpeed;
        const speedFactor = Math.min(Math.sqrt(this.vx * this.vx + this.vy * this.vy) * 0.3, 0.5);
        this.highlightRadius = 0.25 + speedFactor * 0.3;
        if (this.stuckTo) {
            this.x = this.stuckTo.x + this.stuckOffsetX;
            this.y = this.stuckTo.y + this.stuckOffsetY;
            return;
        }
        this.wobble += 0.02;
        this.iridescentAngle += this.iridescentSpeed;
        this.x += Math.sin(this.wobble) * 0.15;
        this.y += Math.cos(this.wobble * 0.8) * 0.15;
        this.x += this.vx;
        this.y += this.vy;
        
        const dx = this.x - pointer.x;
        const dy = this.y - pointer.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MOUSE_RADIUS + this.radius && dist > 0) {
            const force = (MOUSE_RADIUS + this.radius - dist) / (MOUSE_RADIUS + this.radius);
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * MOUSE_FORCE;
            this.vy += Math.sin(angle) * force * MOUSE_FORCE;
        }
        this.vx *= FRICTION;
        this.vy *= FRICTION;
        const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
        if (speed > MAX_SPEED) {
            this.vx = (this.vx / speed) * MAX_SPEED;
            this.vy = (this.vy / speed) * MAX_SPEED;
        }
        if (this.x - this.radius < 0) { this.x = this.radius; this.vx = Math.abs(this.vx) * WALL_BOUNCE; }
        if (this.x + this.radius > canvas.width) { this.x = canvas.width - this.radius; this.vx = -Math.abs(this.vx) * WALL_BOUNCE; }
        if (this.y - this.radius < 0) { this.y = this.radius; this.vy = Math.abs(this.vy) * WALL_BOUNCE; }
        if (this.y + this.radius > canvas.height) { this.y = canvas.height - this.radius; this.vy = -Math.abs(this.vy) * WALL_BOUNCE; }
    }
    
    draw() {
        const shadowOffsetX = 30 + this.vx * 8;
        const shadowOffsetY = 45 + this.vy * 8;
        
        const shadowGradient = ctx.createRadialGradient(
            this.x + shadowOffsetX, this.y + shadowOffsetY, 0,
            this.x + shadowOffsetX, this.y + shadowOffsetY, this.radius * 1.6
        );
        shadowGradient.addColorStop(0, 'rgba(10, 30, 60, 0.35)');
        shadowGradient.addColorStop(0.5, 'rgba(10, 30, 60, 0.15)');
        shadowGradient.addColorStop(1, 'rgba(10, 30, 60, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = shadowGradient;
        ctx.ellipse(this.x + shadowOffsetX, this.y + shadowOffsetY, this.radius * 1.4, this.radius * 1.0, 0, 0, Math.PI * 2);
        ctx.fill();
        
        const innerGradient = ctx.createRadialGradient(
            this.x, this.y, this.radius * 0.2,
            this.x, this.y, this.radius * 0.95
        );
        innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
        innerGradient.addColorStop(0.7, 'rgba(200, 240, 255, 0.06)');
        innerGradient.addColorStop(1, 'rgba(180, 220, 240, 0.12)');
        
        ctx.beginPath();
        ctx.fillStyle = innerGradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        const rainbowGradient = ctx.createConicGradient(this.iridescentAngle, this.x, this.y);
        rainbowGradient.addColorStop(0.0, 'rgba(255, 100, 150, 0.10)');
        rainbowGradient.addColorStop(0.15, 'rgba(255, 200, 100, 0.10)');
        rainbowGradient.addColorStop(0.3, 'rgba(255, 255, 150, 0.10)');
        rainbowGradient.addColorStop(0.45, 'rgba(150, 255, 150, 0.10)');
        rainbowGradient.addColorStop(0.6, 'rgba(100, 200, 255, 0.10)');
        rainbowGradient.addColorStop(0.75, 'rgba(150, 100, 255, 0.10)');
        rainbowGradient.addColorStop(0.9, 'rgba(255, 100, 200, 0.10)');
        rainbowGradient.addColorStop(1.0, 'rgba(255, 100, 150, 0.10)');
        
        ctx.beginPath();
        ctx.fillStyle = rainbowGradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        const hue1 = (this.iridescentAngle * 180 / Math.PI) % 360;
        const hue2 = (hue1 + 120) % 360;
        const hue3 = (hue1 + 240) % 360;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.98, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue1}, 90%, 75%, 0.5)`;
        ctx.lineWidth = Math.max(1.5, this.radius * 0.05);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.93, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue2}, 85%, 80%, 0.4)`;
        ctx.lineWidth = Math.max(1, this.radius * 0.035);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.88, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue3}, 80%, 82%, 0.3)`;
        ctx.lineWidth = Math.max(1, this.radius * 0.025);
        ctx.stroke();
        
        // Лёд — плавно через iceVisualIntensity
        if (iceVisualIntensity > 0.01) {
            const iceGradient = ctx.createRadialGradient(
                this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0,
                this.x, this.y, this.radius
            );
            iceGradient.addColorStop(0, `rgba(220, 240, 255, ${0.85 * iceVisualIntensity})`);
            iceGradient.addColorStop(0.5, `rgba(160, 210, 240, ${0.85 * iceVisualIntensity})`);
            iceGradient.addColorStop(1, `rgba(100, 160, 210, ${0.9 * iceVisualIntensity})`);
            
            ctx.beginPath();
            ctx.fillStyle = iceGradient;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Трещины
            ctx.save();
            ctx.globalAlpha = 0.7 * iceVisualIntensity;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 1.3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            function rand(s) {
                const x = Math.sin(s * 12.9898) * 43758.5453;
                return x - Math.floor(x);
            }
            
            const seed = this.crackSeed;
            const cracksCount = 6 + Math.floor(rand(seed) * 4);
            
            for (let c = 0; c < cracksCount; c++) {
                const startAngle = rand(seed + c * 13) * Math.PI * 2;
                const startR = this.radius * (0.1 + rand(seed + c * 7) * 0.3);
                const endR = this.radius * (0.75 + rand(seed + c * 47) * 0.22);
                const segments = 3 + Math.floor(rand(seed + c * 31) * 3);
                
                ctx.beginPath();
                let prevX = this.x + Math.cos(startAngle) * startR;
                let prevY = this.y + Math.sin(startAngle) * startR;
                ctx.moveTo(prevX, prevY);
                
                for (let s = 1; s <= segments; s++) {
                    const t = s / segments;
                    const angle = startAngle + (rand(seed + c * 11 + s) - 0.5) * 1.2;
                    const r = startR + (endR - startR) * t;
                    const jitter = (rand(seed + c * 100 + s * 7) - 0.5) * this.radius * 0.18;
                    const x = this.x + Math.cos(angle) * r + jitter;
                    const y = this.y + Math.sin(angle) * r + jitter;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
                
                if (rand(seed + c * 53) > 0.4) {
                    const branchAngle = startAngle + (rand(seed + c * 71) - 0.5) * 1.5;
                    const branchR = startR + (endR - startR) * (0.4 + rand(seed + c * 83) * 0.3);
                    const bx = this.x + Math.cos(branchAngle) * branchR;
                    const by = this.y + Math.sin(branchAngle) * branchR;
                    const branchEnd = branchAngle + (rand(seed + c * 89) - 0.5) * 1.8;
                    const branchLen = this.radius * (0.15 + rand(seed + c * 97) * 0.2);
                    
                    ctx.beginPath();
                    ctx.moveTo(bx, by);
                    ctx.lineTo(bx + Math.cos(branchEnd) * branchLen, by + Math.sin(branchEnd) * branchLen);
                    ctx.stroke();
                }
            }
            ctx.restore();
            
            // Блики льда
            const bigIceHx = this.x - this.radius * 0.35;
            const bigIceHy = this.y - this.radius * 0.4;
            const bigIceGrad = ctx.createRadialGradient(bigIceHx, bigIceHy, 0, bigIceHx, bigIceHy, this.radius * 0.4);
            bigIceGrad.addColorStop(0, `rgba(255, 255, 255, ${iceVisualIntensity})`);
            bigIceGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.4 * iceVisualIntensity})`);
            bigIceGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.beginPath();
            ctx.fillStyle = bigIceGrad;
            ctx.arc(bigIceHx, bigIceHy, this.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.save();
            ctx.globalAlpha = 0.95 * iceVisualIntensity;
            for (let i = 0; i < 5; i++) {
                const sx = this.x + (rand(seed + i * 77) - 0.5) * this.radius * 1.6;
                const sy = this.y + (rand(seed + i * 99) - 0.5) * this.radius * 1.6;
                const distSq = (sx - this.x) ** 2 + (sy - this.y) ** 2;
                if (distSq < this.radius * this.radius * 0.8) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${iceVisualIntensity})`;
                    ctx.beginPath();
                    ctx.arc(sx, sy, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();
            
            ctx.beginPath();
            ctx.strokeStyle = `rgba(220, 240, 255, ${iceVisualIntensity})`;
            ctx.lineWidth = 3;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.strokeStyle = `rgba(180, 220, 255, ${0.6 * iceVisualIntensity})`;
            ctx.lineWidth = 6;
            ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Тонкий контур
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Блики
        const bigSoftHx = this.x + Math.cos(this.highlightAngle * 0.6) * this.radius * 0.3;
        const bigSoftHy = this.y + Math.sin(this.highlightAngle * 0.6) * this.radius * 0.3;
        const bigSoftGradient = ctx.createRadialGradient(bigSoftHx, bigSoftHy, 0, bigSoftHx, bigSoftHy, this.radius * 0.55);
        bigSoftGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        bigSoftGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        bigSoftGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.beginPath();
        ctx.fillStyle = bigSoftGradient;
        ctx.arc(bigSoftHx, bigSoftHy, this.radius * 0.55, 0, Math.PI * 2);
        ctx.fill();
        
        const bigHx = this.x - this.radius * 0.35;
        const bigHy = this.y - this.radius * 0.4;
        const bigGradient = ctx.createRadialGradient(bigHx, bigHy, 0, bigHx, bigHy, this.radius * 0.3);
        bigGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        bigGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
        bigGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.beginPath();
        ctx.fillStyle = bigGradient;
        ctx.arc(bigHx, bigHy, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        const smallHx = this.x + Math.cos(this.highlightAngle) * this.radius * this.highlightRadius;
        const smallHy = this.y + Math.sin(this.highlightAngle) * this.radius * this.highlightRadius;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.arc(smallHx, smallHy, Math.max(2, this.radius * 0.09), 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.arc(this.x + this.radius * 0.25, this.y + this.radius * 0.35, Math.max(1, this.radius * 0.05), 0, Math.PI * 2);
        ctx.fill();
    }
}

class TrailBubble {
    constructor(x, y) {
        this.x = x; this.y = y;
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
        this.vx *= 0.95; this.vy *= 0.95;
        this.life -= this.decay;
        this.radius *= 0.99;
    }
    draw() {
        if (this.life <= 0) return;
        ctx.beginPath();
        ctx.globalAlpha = this.life * 0.7;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(200, 255, 230, 0.7)';
        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.6, 'rgba(200, 250, 230, 0.6)');
        gradient.addColorStop(1, 'rgba(200, 240, 255, 0.2)');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
}

class PopParticle {
    constructor(x, y, color, isIce = false) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.size = isIce ? Math.random() * 8 + 8 : Math.random() * 3 + 1;
        this.color = color;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.015;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
        this.isIce = isIce;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15;
        this.vx *= 0.97;
        this.vy *= 0.97;
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
        if (this.isIce) this.size *= 0.995;
    }
    draw() {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.isIce) {
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size * 0.7, 0);
            ctx.lineTo(0, this.size);
            ctx.lineTo(-this.size * 0.7, 0);
            ctx.closePath();
            const grad = ctx.createLinearGradient(-this.size, -this.size, this.size, this.size);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            grad.addColorStop(0.5, this.color);
            grad.addColorStop(1, 'rgba(150, 200, 240, 0.7)');
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

class WaterWave {
    constructor(x, y, strong = false) {
        this.x = x; this.y = y;
        this.radius = 5;
        this.maxRadius = strong ? Math.random() * 80 + 70 : Math.random() * 60 + 50;
        this.life = 1.0;
        this.decay = Math.random() * 0.01 + 0.008;
        this.color = Math.random() > 0.5 ? 'rgba(255,255,255,0.7)' : 'rgba(180,240,255,0.7)';
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
        ctx.globalAlpha = this.life * 0.6;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = this.life * 0.35;
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
}

function initBubbles() {
    particles.length = 0;
    for (let i = 0; i < BUBBLE_COUNT; i++) particles.push(new Bubble(false));
    for (let i = 0; i < TINY_BUBBLE_COUNT; i++) particles.push(new Bubble(true));
}

let scoreBubbles = 0;
function updateScoreBubbles(n) {
    scoreBubbles += n;
    document.getElementById('scoreBubbles').textContent = scoreBubbles;
}

function popBubble(b) {
    if (b.isPopping) return;
    b.isPopping = true;
    
    if (b.isIce || isFrozen) {
        playIceBreakSound();
        for (let i = 0; i < 16; i++) {
            const p = new PopParticle(b.x, b.y, 'rgba(200, 240, 255, 0.95)', true);
            popParticles.push(p);
        }
        frozenBreakCount++;
        
        if (frozenBreakCount >= FREEZE_BREAK_NEEDED) {
            setTimeout(unfreezeWater, 500);
        }
    } else {
        if (!b.tiny) playPopSound(b.radius);
        for (let i = 0; i < 15; i++) popParticles.push(new PopParticle(b.x, b.y, b.highlightColor));
        updateScoreBubbles(1);
        waterWaves.push(new WaterWave(b.x, b.y, b.tiny));
    }
    
    particles.forEach(other => {
        if (other.stuckTo === b) other.stuckTo = null;
    });
}

function handleBubbleClick(x, y) {
    if (currentMode !== 'bubbles') return;
    particles.forEach(b => {
        const dx = x - b.x, dy = y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < b.radius) popBubble(b);
    });
}

function triggerFreeze() {
    if (isFrozen) return;
    isFrozen = true;
    frozenBreakCount = 0;
    FREEZE_BREAK_NEEDED = 20 + Math.floor(Math.random() * 11);
    freezeTargetClicks = 5 + Math.floor(Math.random() * 6);
    playFreezeSound();
    
    particles.forEach(b => {
        if (!b.isPopping) b.isIce = true;
    });
    
    document.body.classList.add('frozen');
    if (window.iceEffect) window.iceEffect.activate();
    
    frozenTimer = setTimeout(() => {
        unfreezeWater();
    }, 30000);
}

function unfreezeWater() {
    if (!isFrozen) return;
    isFrozen = false;
    clearTimeout(frozenTimer);
    freezeTargetClicks = 5 + Math.floor(Math.random() * 6);
    
    document.body.classList.remove('frozen');
    if (window.iceEffect) window.iceEffect.deactivate();
    
    particles.forEach(b => {
        if (b.isIce && !b.isPopping) b.isIce = false;
    });
}

window.addEventListener('mousedown', e => {
    pointer.x = e.clientX; pointer.y = e.clientY;
    pointer.isDown = true;
    if (currentMode === 'bubbles' && !isFrozen) {
        waterWaves.push(new WaterWave(e.clientX, e.clientY, true));
    }
    handleBubbleClick(e.clientX, e.clientY);
});
window.addEventListener('mousemove', e => {
    pointer.x = e.clientX; pointer.y = e.clientY;
});
window.addEventListener('mouseup', () => { pointer.isDown = false; });
window.addEventListener('mouseleave', () => {
    pointer.x = -1000; pointer.y = -1000;
    pointer.prevX = -1000; pointer.prevY = -1000;
});

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    pointer.x = t.clientX; pointer.y = t.clientY;
    pointer.prevX = t.clientX;
    pointer.prevY = t.clientY;
    pointer.isDown = true;
    if (currentMode === 'bubbles' && !isFrozen) {
        waterWaves.push(new WaterWave(t.clientX, t.clientY, true));
    }
    handleBubbleClick(t.clientX, t.clientY);
}, { passive: false });

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = e.touches[0];
    pointer.x = t.clientX; pointer.y = t.clientY;
}, { passive: false });

canvas.addEventListener('touchend', e => {
    e.preventDefault();
    pointer.x = -1000; pointer.y = -1000;
    pointer.prevX = -1000; pointer.prevY = -1000;
    pointer.isDown = false;
}, { passive: false });

let popAllInProgress = false;

popAllBtn.addEventListener('click', () => {
    if (popAllInProgress) return;
    
    const now = Date.now();
    popAllClicks.push(now);
    if (popAllClicks.length > 20) popAllClicks.shift();
    
    if (!isFrozen && popAllClicks.length >= freezeTargetClicks) {
        triggerFreeze();
        popAllClicks = [];
        return;
    }
    
    if (isFrozen) {
        popAllInProgress = true;
        playMenuSound();
        particles.forEach(b => {
            if (!b.isPopping) popBubble(b);
        });
        setTimeout(() => { popAllInProgress = false; }, 1000);
        return;
    }
    
    popAllInProgress = true;
    playMenuSound();
    const alive = particles.filter(b => !b.isPopping);
    alive.sort((a, b) => b.radius - a.radius);
    let index = 0;
    const totalTime = 1200;
    const interval = alive.length > 0 ? totalTime / alive.length : 50;
    
    function popNext() {
        if (index >= alive.length) {
            popAllInProgress = false;
            return;
        }
        const b = alive[index];
        if (!b.isPopping) {
            b.isPopping = true;
            if (!b.tiny) playPopSound(b.radius, 0.15 + Math.random() * 0.1);
            for (let i = 0; i < 12; i++) popParticles.push(new PopParticle(b.x, b.y, b.highlightColor));
            waterWaves.push(new WaterWave(b.x, b.y, b.tiny));
        }
        index++;
        setTimeout(popNext, interval);
    }
    popNext();
});

function checkBubbleCollisions() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            if (a.isPopping || b.isPopping) continue;
            if (a.stuckTo || b.stuckTo) continue;
            if (a.tiny !== b.tiny) continue;
            if (a.isIce || b.isIce) continue;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const minDist = a.radius + b.radius;
            if (dist < minDist && dist > 0 && Math.random() < 0.05) {
                b.stuckTo = a;
                b.stuckOffsetX = b.x - a.x;
                b.stuckOffsetY = b.y - a.y;
                a.vx += b.vx * 0.3;
                a.vy += b.vy * 0.3;
                b.vx = 0;
                b.vy = 0;
            }
        }
    }
}

// ============================================
//  ЖИВОЙ ФОН ДЛЯ ОКОН
// ============================================
let xpMotionActive = false;
let xpMotionHandler = null;
let xpOrientationHandler = null;

function startXpBackgroundMotion() {
    if (xpMotionActive) return;
    xpMotionActive = true;
    
    const clouds = document.querySelector('.xp-clouds');
    const clouds2 = document.querySelector('.xp-clouds-2');
    const hill = document.querySelector('.xp-hill');
    const hillBack = document.querySelector('.xp-hill-back');
    const sky = document.querySelector('.xp-sky');
    const sun = document.querySelector('.xp-sun');
    const cloudShadows = document.querySelector('.xp-cloud-shadows');
    
    if (!clouds || !hill || !sky) return;
    
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, currentX2 = 0, currentY2 = 0;
    
    xpMotionHandler = (e) => {
        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        const nx = Math.max(-0.8, Math.min(0.8, (clientX / window.innerWidth - 0.5) * 2));
        const ny = Math.max(-0.8, Math.min(0.8, (clientY / window.innerHeight - 0.5) * 2));
        targetX = nx;
        targetY = ny;
         // След курсора
    spawnCursorTrail(clientX, clientY);
    };
    
    window.addEventListener('mousemove', xpMotionHandler);
    window.addEventListener('touchmove', xpMotionHandler, { passive: true });
    
    xpOrientationHandler = (e) => {
        if (e.gamma === null || e.beta === null) return;
        targetX = Math.max(-0.8, Math.min(0.8, e.gamma / 45));
        targetY = Math.max(-0.8, Math.min(0.8, (e.beta - 45) / 45));
    };
    window.addEventListener('deviceorientation', xpOrientationHandler);
    
    function animateXp() {
        if (!xpMotionActive) return;
        
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;
        currentX2 += (targetX - currentX2) * 0.015;
        currentY2 += (targetY - currentY2) * 0.015;
        
        sky.style.transform = `translate(${-currentX * 8}px, ${-currentY * 4}px)`;
        clouds.style.marginLeft = `${-currentX * 35}px`;
        clouds.style.marginTop = `${-currentY * 15}px`;
        clouds2.style.marginLeft = `${-currentX2 * 20}px`;
        clouds2.style.marginTop = `${-currentY2 * 8}px`;
        
        if (cloudShadows) {
            cloudShadows.style.marginLeft = `${-currentX2 * 25}px`;
        }
        
        hillBack.style.transform = `scaleX(1.3) scaleY(1.0) rotate(${currentX * 0.4}deg)`;
        hill.style.transform = `scaleX(1.3) scaleY(1.0) rotate(${currentX * 0.7}deg)`;
        
        if (sun) {
            sun.style.transform = `translate(${currentX * 30}px, ${currentY * 15}px)`;
        }
        
        requestAnimationFrame(animateXp);
    }
    animateXp();
}

function stopXpBackgroundMotion() {
    xpMotionActive = false;
    if (xpMotionHandler) {
        window.removeEventListener('mousemove', xpMotionHandler);
        window.removeEventListener('touchmove', xpMotionHandler);
        xpMotionHandler = null;
    }
    if (xpOrientationHandler) {
        window.removeEventListener('deviceorientation', xpOrientationHandler);
        xpOrientationHandler = null;
    }
    
    const clouds = document.querySelector('.xp-clouds');
    const clouds2 = document.querySelector('.xp-clouds-2');
    const hill = document.querySelector('.xp-hill');
    const hillBack = document.querySelector('.xp-hill-back');
    const sky = document.querySelector('.xp-sky');
    const sun = document.querySelector('.xp-sun');
    const cloudShadows = document.querySelector('.xp-cloud-shadows');
    
    if (clouds) { clouds.style.marginLeft = ''; clouds.style.marginTop = ''; }
    if (clouds2) { clouds2.style.marginLeft = ''; clouds2.style.marginTop = ''; }
    if (hill) hill.style.transform = '';
    if (hillBack) hillBack.style.transform = '';
    if (sky) sky.style.transform = '';
    if (sun) sun.style.transform = '';
    if (cloudShadows) cloudShadows.style.marginLeft = '';
}

// ============================================
//  ИГРА 2: ОКНА
// ============================================
const MESSAGES = [
    { icon: '❌', type: 'error', title: 'Error', text: 'fix me' },
    { icon: '❌', type: 'error', title: 'Error', text: 'OWW' },
    { icon: '❌', type: 'error', title: 'ERROR', text: 'Keyboard has stopped working. Press any key to continue.' },
    { icon: '⚠️', type: 'warning', title: 'warning', text: 'the internet was deleted' },
    { icon: '⚠️', type: 'warning', title: 'Uh Oh', text: "You're screwed." },
    { icon: '❌', type: 'error', title: 'Error', text: 'Brain.exe has stopped responding.' },
    { icon: '⚠️', type: 'warning', title: 'Warning', text: 'Choice is an illusion.' },
    { icon: '❌', type: 'error', title: 'Error!', text: 'Random Error just to annoy you.' },
    { icon: '❌', type: 'error', title: 'Ошибка', text: 'Задача успешно провалена.' },
    { icon: '⚠️', type: 'warning', title: 'Warning', text: 'Your computer has a virus and needs to be hit several times.' },
    { icon: 'ℹ️', type: 'info', title: 'Windows XP', text: 'Task failed successfully.' },
    { icon: '⚠️', type: 'warning', title: 'Внимание', text: 'Обнаружено 42 вируса. Нажмите ОК, чтобы игнорировать.' },
    { icon: '❌', type: 'error', title: 'Критическая ошибка', text: 'Система работает. Это ненормально.' },
    { icon: 'ℹ️', type: 'info', title: 'Совет дня', text: 'Никогда не нажимайте эту кнопку.' },
    { icon: '⚠️', type: 'warning', title: 'Обновление', text: 'Windows 7 требует перезагрузки. И ещё одной.' },
    { icon: 'ℹ️', type: 'info', title: 'Info', text: 'Loading... Loading... Loading...' },
    { icon: '❌', type: 'error', title: 'Error 404', text: 'Смысл не найден. Попробуйте позже.' },
    { icon: '⚠️', type: 'warning', title: 'Warning', text: 'Ваш кот ходит по клавиатуре.' },
    { icon: 'ℹ️', type: 'info', title: 'Windows', text: 'Вы уверены, что хотите уверены?' },
    { icon: '❌', type: 'error', title: 'Fatal Error', text: 'Шутка. Всё в порядке.' },
    { icon: '⚠️', type: 'warning', title: 'Бэкап', text: 'Резервная копия создана в другом измерении.' },
    { icon: 'ℹ️', type: 'info', title: 'Hello', text: 'Привет! Ты нашёл пасхалку 🎉' },
    { icon: '⚠️', type: 'warning', title: 'Warning', text: 'Car' },
    { icon: '❌', type: 'error', title: 'Error', text: 'This is fine.' },
    { icon: 'ℹ️', type: 'info', title: 'Question', text: 'Are you sure? Yes / OK' },
    { icon: '⚠️', type: 'warning', title: 'Warning', text: 'Low battery. Please charge in microwave.' },
    { icon: '❌', type: 'error', title: 'Error', text: 'User not found. Am I a joke to you?' },
    { icon: 'ℹ️', type: 'info', title: 'Loading', text: '99% complete... for 30 years.' },
    { icon: '⚠️', type: 'warning', title: 'Warning', text: 'Cat detected in the system.' },
    { icon: '❌', type: 'error', title: 'Error', text: '404: Sleep not found.' }
];

const windowsContainer = document.getElementById('windowsGame');
const openWindows = [];
const MAX_WINDOWS = isMobile ? 8 : 14;
let scoreWindows = 0;
let windowSpawnTimer = null;

const bubblesCanvas = document.getElementById('windowsBubblesCanvas');
const bubblesCtx = bubblesCanvas ? bubblesCanvas.getContext('2d') : null;
const backgroundBubbles = [];
const MAX_BG_BUBBLES = isMobile ? 10 : 20;
let bgBubbleCount = 0;
let rainTriggerTarget = 40 + Math.floor(Math.random() * 11);
let isRaining = false;
let windowsClosedDuringRain = 0;
let rainEndTarget = 20 + Math.floor(Math.random() * 11);

function resizeBubblesCanvas() {
    if (!bubblesCanvas) return;
    bubblesCanvas.width = window.innerWidth;
    bubblesCanvas.height = window.innerHeight;
}

class BgBubble {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        // Было: radius * 8 + 5 (5-13px). Стало: 12-28px — крупнее в 2 раза
        this.radius = Math.random() * 16 + 12;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.wobble = Math.random() * Math.PI * 2;
        // Более прозрачные цвета (альфа 0.25-0.4)
        this.hue = 180 + Math.random() * 40;
        this.color = `hsla(${this.hue}, 80%, 75%, 0.3)`;
        this.highlightColor = `hsla(${this.hue}, 90%, 90%, 0.7)`;
    }
    update() {
        this.wobble += 0.02;
        this.x += this.vx + Math.sin(this.wobble) * 0.2;
        this.y += this.vy + Math.cos(this.wobble * 0.8) * 0.2;
        if (this.x - this.radius < 0) { this.x = this.radius; this.vx = Math.abs(this.vx); }
        if (this.x + this.radius > window.innerWidth) { this.x = window.innerWidth - this.radius; this.vx = -Math.abs(this.vx); }
        if (this.y - this.radius < 0) { this.y = this.radius; this.vy = Math.abs(this.vy); }
        if (this.y + this.radius > window.innerHeight) { this.y = window.innerHeight - this.radius; this.vy = -Math.abs(this.vy); }
    }
    draw() {
        if (!bubblesCtx) return;
        
        // 1. Внутреннее заполнение — почти прозрачное
        const innerGradient = bubblesCtx.createRadialGradient(
            this.x, this.y, this.radius * 0.2,
            this.x, this.y, this.radius
        );
        innerGradient.addColorStop(0, `hsla(${this.hue}, 80%, 95%, 0.15)`);
        innerGradient.addColorStop(0.6, `hsla(${this.hue}, 70%, 85%, 0.1)`);
        innerGradient.addColorStop(1, `hsla(${this.hue}, 70%, 75%, 0.25)`);
        
        bubblesCtx.beginPath();
        bubblesCtx.fillStyle = innerGradient;
        bubblesCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        bubblesCtx.fill();
        
        // 2. Тонкая светлая обводка
        bubblesCtx.beginPath();
        bubblesCtx.strokeStyle = `hsla(${this.hue}, 90%, 90%, 0.6)`;
        bubblesCtx.lineWidth = 1.5;
        bubblesCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        bubblesCtx.stroke();
        
        // 3. Радужный оттенок по краю
        bubblesCtx.beginPath();
        bubblesCtx.strokeStyle = `hsla(${this.hue + 40}, 80%, 80%, 0.3)`;
        bubblesCtx.lineWidth = 1;
        bubblesCtx.arc(this.x, this.y, this.radius * 0.95, 0, Math.PI * 2);
        bubblesCtx.stroke();
        
        // 4. Большой мягкий блик сверху слева
        const hlX = this.x - this.radius * 0.35;
        const hlY = this.y - this.radius * 0.4;
        const hlGrad = bubblesCtx.createRadialGradient(
            hlX, hlY, 0,
            hlX, hlY, this.radius * 0.4
        );
        hlGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        hlGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
        hlGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        bubblesCtx.beginPath();
        bubblesCtx.fillStyle = hlGrad;
        bubblesCtx.arc(hlX, hlY, this.radius * 0.4, 0, Math.PI * 2);
        bubblesCtx.fill();
        
        // 5. Маленький яркий блик
        bubblesCtx.beginPath();
        bubblesCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        bubblesCtx.arc(
            this.x + this.radius * 0.25,
            this.y + this.radius * 0.3,
            Math.max(2, this.radius * 0.08),
            0, Math.PI * 2
        );
        bubblesCtx.fill();
    }
}

function spawnBgBubble() {
    if (backgroundBubbles.length >= MAX_BG_BUBBLES) return;
    backgroundBubbles.push(new BgBubble());
}

function initBgBubbles() {
    backgroundBubbles.length = 0;
    resizeBubblesCanvas();
    for (let i = 0; i < MAX_BG_BUBBLES; i++) spawnBgBubble();
}

function handleBgBubbleClick(x, y) {
    if (currentMode !== 'windows') return;
    for (let i = backgroundBubbles.length - 1; i >= 0; i--) {
        const b = backgroundBubbles[i];
        const dx = x - b.x;
        const dy = y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < b.radius + 8) {
            backgroundBubbles.splice(i, 1);
            bgBubbleCount++;
            playPopSound(b.radius);
            setTimeout(spawnBgBubble, 1500);
            
            if (!isRaining && bgBubbleCount >= rainTriggerTarget) {
                console.log('🌧️ Триггер дождя: лопнуто', bgBubbleCount, 'пузырей');
                startRain();
            }
            return;
        }
    }
}

function startRain() {
    if (isRaining) return;
    isRaining = true;
    windowsClosedDuringRain = 0;
    rainEndTarget = 20 + Math.floor(Math.random() * 11);
    document.body.classList.add('rain-active');
    console.log('🌧️ Дождь начался. Окон до конца:', rainEndTarget);
}

function stopRain() {
    if (!isRaining) return;
    isRaining = false;
    document.body.classList.remove('rain-active');
    bgBubbleCount = 0;
    rainTriggerTarget = 40 + Math.floor(Math.random() * 11);
    console.log('☀️ Дождь закончился');
}

function updateBgBubbles() {
    if (currentMode !== 'windows') return;
    if (!bubblesCtx) return;
    bubblesCtx.clearRect(0, 0, bubblesCanvas.width, bubblesCanvas.height);
    backgroundBubbles.forEach(b => {
        b.update();
        b.draw();
    });
}

windowsGame.addEventListener('click', (e) => {
    if (currentMode !== 'windows') return;
    handleBgBubbleClick(e.clientX, e.clientY);
});
windowsGame.addEventListener('touchstart', (e) => {
    if (currentMode !== 'windows') return;
    const t = e.touches[0];
    handleBgBubbleClick(t.clientX, t.clientY);
}, { passive: true });

function updateScoreWindows(n) {
    scoreWindows += n;
    document.getElementById('scoreWindows').textContent = scoreWindows;
}

function restartSpawnTimer() {
    if (windowSpawnTimer) clearInterval(windowSpawnTimer);
    const interval = isMobile ? 1800 : 1200;
    windowSpawnTimer = setInterval(() => {
        if (currentMode === 'windows' && openWindows.length < MAX_WINDOWS) {
            createWindow();
        }
    }, interval);
}

function createWindow() {
    if (openWindows.length >= MAX_WINDOWS) return;
    if (scoreWindows >= 100 && Math.random() < 0.05) {
        createCatWindow();
        return;
    }
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    const win = document.createElement('div');
    win.className = 'win7-window';
    const winWidth = isMobile ? 240 : 320;
    const winHeight = isMobile ? 180 : 220;
    const maxX = window.innerWidth - winWidth;
    const maxY = window.innerHeight - winHeight;
    win.style.left = Math.max(10, Math.random() * maxX) + 'px';
    win.style.top = Math.max(10, Math.random() * maxY) + 'px';
    win.innerHTML = `
        <div class="win7-titlebar">
            <span class="win7-title">${msg.title}</span>
            <button class="win7-close">✕</button>
        </div>
        <div class="win7-body">
            <div class="win7-icon ${msg.type}">${msg.icon}</div>
            <div class="win7-message">${msg.text}</div>
        </div>
        <div class="win7-buttons"><button class="win7-ok">OK</button></div>
    `;
    makeDraggable(win);
    win.querySelector('.win7-ok').addEventListener('click', () => closeWindow(win));
    win.querySelector('.win7-close').addEventListener('click', () => closeWindow(win));
    windowsContainer.appendChild(win);
    openWindows.push(win);
}

function createCatWindow() {
    const win = document.createElement('div');
    win.className = 'win7-window';
    const winWidth = isMobile ? 240 : 320;
    const winHeight = isMobile ? 260 : 320;
    const maxX = window.innerWidth - winWidth;
    const maxY = window.innerHeight - winHeight;
    win.style.left = Math.max(10, Math.random() * maxX) + 'px';
    win.style.top = Math.max(10, Math.random() * maxY) + 'px';
    win.innerHTML = `
        <div class="win7-titlebar">
            <span class="win7-title">Warning</span>
            <button class="win7-close">✕</button>
        </div>
        <div class="win7-body with-cat">
            <div class="win7-message">Car</div>
            <img class="win7-cat-image" src="images/car.png" alt="Cat" onerror="this.style.display='none'; this.parentElement.querySelector('.win7-message').innerHTML += '<br><small style=color:#999>(фото не найдено)</small>';">
        </div>
        <div class="win7-buttons">
            <button class="win7-ok">Ok</button>
            <button class="win7-ok">Ok</button>
            <button class="win7-ok">Don't</button>
        </div>
    `;
    makeDraggable(win);
    playCatSound();
    win.querySelectorAll('.win7-ok').forEach(btn => {
        btn.addEventListener('click', () => closeWindow(win));
    });
    win.querySelector('.win7-close').addEventListener('click', () => closeWindow(win));
    windowsContainer.appendChild(win);
    openWindows.push(win);
}

function makeDraggable(win) {
    const titlebar = win.querySelector('.win7-titlebar');
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    function startDrag(clientX, clientY) {
        isDragging = true;
        offsetX = clientX - win.offsetLeft;
        offsetY = clientY - win.offsetTop;
        win.style.zIndex = 1000 + openWindows.length;
    }
    function moveDrag(clientX, clientY) {
        if (!isDragging) return;
        let newX = clientX - offsetX;
        let newY = clientY - offsetY;
        newX = Math.max(0, Math.min(window.innerWidth - win.offsetWidth, newX));
        newY = Math.max(0, Math.min(window.innerHeight - 40, newY));
        win.style.left = newX + 'px';
        win.style.top = newY + 'px';
    }
    function endDrag() { isDragging = false; }
    titlebar.addEventListener('mousedown', e => {
        startDrag(e.clientX, e.clientY);
        e.preventDefault();
    });
    window.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', endDrag);
    titlebar.addEventListener('touchstart', e => {
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
        e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchmove', e => {
        if (isDragging) {
            const t = e.touches[0];
            moveDrag(t.clientX, t.clientY);
            e.preventDefault();
        }
    }, { passive: false });
    window.addEventListener('touchend', endDrag);
}

function closeWindow(win) {
    if (win.classList.contains('closing')) return;
    playClickSound();
    updateScoreWindows(1);
    win.classList.add('closing');
    setTimeout(() => {
        if (win.parentNode) win.parentNode.removeChild(win);
        const idx = openWindows.indexOf(win);
        if (idx !== -1) openWindows.splice(idx, 1);
    }, 600);
    
    if (isRaining) {
        windowsClosedDuringRain++;
        if (windowsClosedDuringRain >= rainEndTarget) stopRain();
    }
    
    if (scoreWindows >= 50 && Math.random() < 0.004) {
        setTimeout(showFunnyBSOD, 400);
    }
}

function showFunnyBSOD() {
    const bsod = document.createElement('div');
    bsod.className = 'funny-bsod';
    bsod.innerHTML = `
        <div class="funny-bsod-content">
            <div class="funny-bsod-smiley">:(</div>
            <div class="funny-bsod-text">
                Windows 7 столкнулась с ошибкой,<br>
                но решила вас не расстраивать.
            </div>
            <div class="funny-bsod-hint">
                Нажмите любую клавишу... или не нажимайте.
            </div>
        </div>
    `;
    document.body.appendChild(bsod);
    setTimeout(() => bsod.classList.add('active'), 50);
    setTimeout(() => {
        bsod.classList.remove('active');
        setTimeout(() => bsod.remove(), 500);
    }, 3500);
}

function clearAllWindows() {
    openWindows.forEach(w => w.remove());
    openWindows.length = 0;
}

function spawnWindows() {
    if (windowSpawnTimer) clearInterval(windowSpawnTimer);
    const initialCount = isMobile ? 3 : 5;
    for (let i = 0; i < initialCount; i++) {
        setTimeout(() => createWindow(), i * 250);
    }
    restartSpawnTimer();
}

// ============================================
//  ИГРА 3: БРАУЗЕР
// ============================================
const browserPage = document.getElementById('browserPage');
const memeScoreEl = document.getElementById('memeScore');
const paintTabBtn = document.getElementById('paintTabBtn');

let memeScore = 0;
let browserRunning = false;
let browserPaused = false;
let paintThreshold = 100;

const memeCatchTimestamps = [];

function getMemeSpawnInterval() {
    const now = Date.now();
    while (memeCatchTimestamps.length > 0 && now - memeCatchTimestamps[0] > 3000) {
        memeCatchTimestamps.shift();
    }
    const rate = memeCatchTimestamps.length;
    if (rate >= 10) return 400;
    if (rate >= 7)  return 600;
    if (rate >= 5)  return 800;
    if (rate >= 3)  return 1100;
    if (rate >= 1)  return 1400;
    return 1800;
}

document.getElementById('btnBack').addEventListener('click', playClickSound);
document.getElementById('btnForward').addEventListener('click', playClickSound);
document.getElementById('btnRefresh').addEventListener('click', () => {
    playClickSound();
    if (browserPage) browserPage.innerHTML = '';
});

const MEME_COLORS = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#e91e63', '#ff5722', '#00bcd4', '#8bc34a'
];

function createMemeButton() {
    if (browserPaused || !browserRunning) return;
    
    const btn = document.createElement('button');
    btn.className = 'meme-btn';
    btn.textContent = 'MEME';
    const color = MEME_COLORS[Math.floor(Math.random() * MEME_COLORS.length)];
    btn.style.background = color;
    
    const size = isMobile ? 70 : 90;
    const maxX = browserPage.clientWidth - size - 20;
    const maxY = browserPage.clientHeight - size - 20;
    const pos = {
        x: Math.max(10, Math.random() * maxX),
        y: Math.max(10, Math.random() * maxY)
    };
    btn.style.left = pos.x + 'px';
    btn.style.top = pos.y + 'px';
    
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.add('clicked');
        playMemeSound();
        memeScore++;
        memeScoreEl.textContent = memeScore;
        memeCatchTimestamps.push(Date.now());
        checkSecretUnlock();
        setTimeout(() => btn.remove(), 400);
    });
    
    browserPage.appendChild(btn);
    
    setTimeout(() => {
        if (btn.parentNode && !btn.classList.contains('clicked')) {
            btn.classList.add('expiring');
            setTimeout(() => btn.remove(), 500);
        }
    }, 2000);
}

function createCatMeme() {
    if (browserPaused || !browserRunning) return;
    
    const catIndex = Math.floor(Math.random() * 10) + 1;
    const div = document.createElement('div');
    div.className = 'cat-meme';
    div.innerHTML = `<img src="images/memes/cat${catIndex}.png" alt="Meme" onerror="this.parentElement.remove()">`;
    
    div.style.visibility = 'hidden';
    browserPage.appendChild(div);
    
    const img = div.querySelector('img');
    
    function positionCat() {
        const w = div.offsetWidth || 160;
        const h = div.offsetHeight || 160;
        const maxX = browserPage.clientWidth - w - 20;
        const maxY = browserPage.clientHeight - h - 20;
        const pos = {
            x: Math.max(10, Math.random() * maxX),
            y: Math.max(10, Math.random() * maxY)
        };
        div.style.left = pos.x + 'px';
        div.style.top = pos.y + 'px';
        div.style.visibility = 'visible';
    }
    
    if (img && !img.complete) {
        img.addEventListener('load', positionCat);
        img.addEventListener('error', () => div.remove());
    } else {
        positionCat();
    }
    
    div.addEventListener('click', (e) => {
        e.stopPropagation();
        div.classList.add('clicked');
        playCatSound();
        memeScore += 5;
        memeScoreEl.textContent = memeScore;
        memeCatchTimestamps.push(Date.now());
        checkSecretUnlock();
        setTimeout(() => div.remove(), 400);
    });
    
    setTimeout(() => {
        if (div.parentNode && !div.classList.contains('clicked')) {
            div.classList.add('expiring');
            setTimeout(() => div.remove(), 500);
        }
    }, 3000);
}

function createAd() {
    if (browserPaused || !browserRunning) return;
    
    const ad = document.createElement('div');
    ad.className = 'ad-banner';
    
    const ads = [
        'ВЫ 1000-Й ПОСЕТИТЕЛЬ!',
        'СКАЧАЙ БЕСПЛАТНО!',
        'ЗАРАБОТОК ДОМА!',
        'ВИРУСЫ УДАЛЕНЫ!',
        'ВАШ ПК ЗАМЕДЛЕН!',
        'ГОРЯЧИЕ КОТЫ!',
        'КЛИКНИ СЮДА!'
    ];
    ad.textContent = ads[Math.floor(Math.random() * ads.length)];
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ad-close';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        ad.classList.add('clicked');
        playSimpleSound(adCloseSound);
        setTimeout(() => ad.remove(), 400);
    });
    ad.appendChild(closeBtn);
    
    ad.addEventListener('click', () => {
        playSimpleSound(adOpenSound);
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createAd(), i * 150);
        }
    });
    
    const w = isMobile ? 200 : 240;
    const h = isMobile ? 55 : 60;
    const maxX = browserPage.clientWidth - w - 20;
    const maxY = browserPage.clientHeight - h - 20;
    ad.style.left = Math.max(10, Math.random() * maxX) + 'px';
    ad.style.top = Math.max(10, Math.random() * maxY) + 'px';
    
    browserPage.appendChild(ad);
}

const VIRUS_VARIANTS = [
    {
        text: '⚠️ СКАЧАТЬ ВИРУСЫ<br>ОНЛАЙН БЕЗ MINECRAFT',
        sub: '(нажми, если осмелишься)',
        bg: 'linear-gradient(to bottom, #ffcc00 0%, #ff6600 100%)',
        shadow: 'rgba(255,102,0,0.7)'
    },
    {
        text: '🦠 СКАЧАТЬ ВИРУСЫ<br>ОНЛАЙН БЕЗ РЕГИСТРАЦИИ',
        sub: '(100% бесплатно)',
        bg: 'linear-gradient(to bottom, #a0e020 0%, #4a8a10 100%)',
        shadow: 'rgba(100,180,20,0.7)'
    },
    {
        text: '💰 ВЗЛОМ НА<br>БЕСКОНЕЧНЫЕ ДЕНЬГИ<br>СБЕРБАНК',
        sub: '(работает 100%)',
        bg: 'linear-gradient(to bottom, #20e0a0 0%, #0a8060 100%)',
        shadow: 'rgba(20,200,140,0.7)'
    },
    {
        text: '☣️ БЕСПЛАТНЫЙ<br>ПРОВИРУС!',
        sub: '(без СМС и регистрации)',
        bg: 'linear-gradient(to bottom, #e02060 0%, #800a30 100%)',
        shadow: 'rgba(220,30,100,0.7)'
    },
    {
        text: '⚡ УСКОРИТЬ<br>КОМПЬЮТЕР<br>В 100 РАЗ',
        sub: '(всего за 1 клик)',
        bg: 'linear-gradient(to bottom, #6040e0 0%, #301880 100%)',
        shadow: 'rgba(100,60,220,0.7)'
    }
];

function createVirusButton() {
    if (browserPaused || !browserRunning) return;
    
    const variant = VIRUS_VARIANTS[Math.floor(Math.random() * VIRUS_VARIANTS.length)];
    
    const btn = document.createElement('button');
    btn.className = 'virus-btn';
    btn.style.background = variant.bg;
    btn.style.boxShadow = `0 0 20px ${variant.shadow}`;
    btn.innerHTML = `${variant.text}<small>${variant.sub}</small>`;
    
    const w = isMobile ? 200 : 240;
    const h = isMobile ? 95 : 110;
    const maxX = browserPage.clientWidth - w - 20;
    const maxY = browserPage.clientHeight - h - 20;
    btn.style.left = Math.max(10, Math.random() * maxX) + 'px';
    btn.style.top = Math.max(10, Math.random() * maxY) + 'px';
    
    btn.addEventListener('click', () => {
        playSimpleSound(virusLoseSound);
        showBSOD();
    });
    
    browserPage.appendChild(btn);
    
    setTimeout(() => {
        if (btn.parentNode) btn.remove();
    }, 9000);
}

function checkSecretUnlock() {
    if (memeScore >= paintThreshold && !secretUnlocked) {
        secretUnlocked = true;
        paintTabBtn.style.display = 'block';
        playClickSound();
        showPaintNotification();
    }
}

function showPaintNotification() {
    const notif = document.getElementById('paintNotification');
    if (!notif) return;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
}

let secretUnlocked = false;
let adSpawnTimer = null;
let virusSpawnTimer = null;

function startBrowserGame() {
    if (browserRunning) return;
    browserRunning = true;
    browserPaused = false;
    
    browserPage.innerHTML = '';
    memeScore = 0;
    memeScoreEl.textContent = '0';
    secretUnlocked = false;
    paintTabBtn.style.display = 'none';
    memeCatchTimestamps.length = 0;
    
    paintThreshold = 100 + Math.floor(Math.random() * 15);
    
    function scheduleMemeSpawn() {
        if (!browserRunning) return;
        if (!browserPaused) {
            if (Math.random() < 0.25) createCatMeme();
            else createMemeButton();
        }
        setTimeout(scheduleMemeSpawn, getMemeSpawnInterval());
    }
    scheduleMemeSpawn();
    
    adSpawnTimer = setInterval(() => {
        if (!browserRunning || browserPaused) return;
        if (Math.random() < 0.5) createAd();
    }, 5000);
    
    virusSpawnTimer = setInterval(() => {
        if (!browserRunning || browserPaused) return;
        if (Math.random() < 0.7) createVirusButton();
    }, 5000);
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            if (browserPaused || !browserRunning) return;
            if (Math.random() < 0.3) createCatMeme();
            else createMemeButton();
        }, i * 400);
    }
}

function stopBrowserGame(forceReset = false) {
    browserRunning = false;
    browserPaused = false;
    if (adSpawnTimer) clearInterval(adSpawnTimer);
    if (virusSpawnTimer) clearInterval(virusSpawnTimer);
    adSpawnTimer = null;
    virusSpawnTimer = null;
    
    if (forceReset) {
        browserPage.innerHTML = '';
        memeScore = 0;
        memeScoreEl.textContent = '0';
        secretUnlocked = false;
        paintTabBtn.style.display = 'none';
        memeCatchTimestamps.length = 0;
    }
    
    document.getElementById('bsod').classList.remove('active');
}

function showBSOD() {
    const bsod = document.getElementById('bsod');
    const progress = document.getElementById('bsodProgress');
    bsod.classList.add('active');
    progress.style.width = '0%';
    
    setTimeout(() => { progress.style.width = '100%'; }, 100);
    
    setTimeout(() => {
        bsod.classList.remove('active');
        browserPaused = false;
        stopBrowserGame(true);
        
        memeScore = 0;
        memeScoreEl.textContent = '0';
        secretUnlocked = false;
        paintTabBtn.style.display = 'none';
        memeCatchTimestamps.length = 0;
        
        if (currentMode === 'browser') {
            startBrowserGame();
        }
    }, 3000);
}

// ============================================
//  PAINT
// ============================================
const paintModal = document.getElementById('paintModal');
const paintCanvas = document.getElementById('paintCanvas');
const paintCtx = paintCanvas.getContext('2d');
let paintColor = '#000000';
let paintSize = 2;
let isPainting = false;

const PAINT_COLORS = [
    '#000000', '#ffffff', '#ff0000', '#00ff00',
    '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ff8800', '#8800ff', '#008800', '#884400'
];

const paintColorsContainer = document.getElementById('paintColors');
PAINT_COLORS.forEach(color => {
    const btn = document.createElement('button');
    btn.className = 'paint-color-btn';
    btn.style.background = color;
    if (color === '#000000') btn.classList.add('active');
    btn.addEventListener('click', () => {
        paintColor = color;
        document.querySelectorAll('.paint-color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
    paintColorsContainer.appendChild(btn);
});

document.querySelectorAll('.paint-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        paintSize = parseInt(btn.dataset.size);
        document.querySelectorAll('.paint-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

document.getElementById('paintClear').addEventListener('click', () => {
    paintCtx.fillStyle = '#ffffff';
    paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
    playClickSound();
});

function getPaintCoords(e) {
    const rect = paintCanvas.getBoundingClientRect();
    const scaleX = paintCanvas.width / rect.width;
    const scaleY = paintCanvas.height / rect.height;
    if (e.touches) {
        return {
            x: (e.touches[0].clientX - rect.left) * scaleX,
            y: (e.touches[0].clientY - rect.top) * scaleY
        };
    }
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

paintCanvas.addEventListener('mousedown', e => {
    isPainting = true;
    const p = getPaintCoords(e);
    paintCtx.beginPath();
    paintCtx.moveTo(p.x, p.y);
});

paintCanvas.addEventListener('mousemove', e => {
    if (!isPainting) return;
    const p = getPaintCoords(e);
    paintCtx.strokeStyle = paintColor;
    paintCtx.lineWidth = paintSize;
    paintCtx.lineCap = 'round';
    paintCtx.lineJoin = 'round';
    paintCtx.lineTo(p.x, p.y);
    paintCtx.stroke();
});

paintCanvas.addEventListener('mouseup', () => { isPainting = false; });
paintCanvas.addEventListener('mouseleave', () => { isPainting = false; });

paintCanvas.addEventListener('touchstart', e => {
    e.preventDefault();
    isPainting = true;
    const p = getPaintCoords(e);
    paintCtx.beginPath();
    paintCtx.moveTo(p.x, p.y);
}, { passive: false });

paintCanvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!isPainting) return;
    const p = getPaintCoords(e);
    paintCtx.strokeStyle = paintColor;
    paintCtx.lineWidth = paintSize;
    paintCtx.lineCap = 'round';
    paintCtx.lineJoin = 'round';
    paintCtx.lineTo(p.x, p.y);
    paintCtx.stroke();
}, { passive: false });

paintCanvas.addEventListener('touchend', e => {
    e.preventDefault();
    isPainting = false;
}, { passive: false });

paintTabBtn.addEventListener('click', () => {
    paintModal.classList.add('active');
    playClickSound();
    browserPaused = true;
    paintCtx.fillStyle = '#ffffff';
    paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
});

document.getElementById('paintClose').addEventListener('click', () => {
    paintModal.classList.remove('active');
    browserPaused = false;
});

// ============================================
//  ПЕРЕКЛЮЧАТЕЛЬ ДЕНЬ / НОЧЬ
// ============================================
const dayNightBtn = document.getElementById('dayNightToggle');
let isNightMode = false;

if (localStorage.getItem('nightMode') === 'true') {
    isNightMode = true;
    document.body.classList.add('night-mode');
    if (dayNightBtn) dayNightBtn.textContent = '☾';
}

if (dayNightBtn) {
    dayNightBtn.addEventListener('click', () => {
        isNightMode = !isNightMode;
        playMenuSound();
        
        if (isNightMode) {
            document.body.classList.add('night-mode');
            dayNightBtn.textContent = '☾';
        } else {
            document.body.classList.remove('night-mode');
            dayNightBtn.textContent = '☀';
        }
        
        localStorage.setItem('nightMode', isNightMode);
    });
}

// ============================================
//  ГЛАВНЫЙ ЦИКЛ
// ============================================
let time = 0;

function animate() {
    const targetIce = isFrozen ? 1 : 0;
    iceVisualIntensity += (targetIce - iceVisualIntensity) * 0.05;
    if (Math.abs(iceVisualIntensity - targetIce) < 0.01) {
        iceVisualIntensity = targetIce;
    }
    
    if (currentMode === 'bubbles') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 1;
        
        if (pointer.x > 0 && pointer.y > 0 && pointer.prevX > 0 && pointer.prevY > 0) {
            const speed = Math.sqrt(
                Math.pow(pointer.x - pointer.prevX, 2) + 
                Math.pow(pointer.y - pointer.prevY, 2)
            );
            const threshold = isMobile ? 1 : 3;
            if (speed > threshold) {
                const count = Math.min(Math.floor(speed / threshold) + 1, isMobile ? 4 : 3);
                for (let i = 0; i < count; i++) {
                    trailBubbles.push(new TrailBubble(
                        pointer.x + (Math.random() - 0.5) * 25,
                        pointer.y + (Math.random() - 0.5) * 25
                    ));
                }
            }
            const waveChance = isMobile ? 0.3 : 0.15;
            const waveThreshold = isMobile ? 1 : 5;
            if (Math.random() < waveChance && speed > waveThreshold && !isFrozen) {
                waterWaves.push(new WaterWave(pointer.x, pointer.y, true));
            }
        }
        
        pointer.prevX = pointer.x;
        pointer.prevY = pointer.y;

        if (!isFrozen) checkBubbleCollisions();

        for (let i = waterWaves.length - 1; i >= 0; i--) {
            const w = waterWaves[i];
            w.update();
            w.draw();
            particles.forEach(bubble => {
                if (bubble.stuckTo) return;
                const dx = bubble.x - w.x;
                const dy = bubble.y - w.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ringWidth = 25;
                if (Math.abs(dist - w.radius) < ringWidth && w.life > 0.3) {
                    const angle = Math.atan2(dy, dx);
                    const force = w.life * 0.6;
                    bubble.vx += Math.cos(angle) * force;
                    bubble.vy += Math.sin(angle) * force;
                }
            });
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
    }
    
    if (currentMode === 'windows') {
        updateBgBubbles();
    }
    
    requestAnimationFrame(animate);
}

// ============================================
//  СТАРТ
// ============================================
initBubbles();
animate();

window.addEventListener('resize', () => {
    resizeCanvas();
    resizeBubblesCanvas();
    initBubbles();
});

popAllBtn.style.display = 'block';
bubblesScore.style.display = 'block';


// ============================================
//  НАСТРОЙКИ — МОДАЛЬНОЕ ОКНО
// ============================================
const settingsModal = document.getElementById('settingsModal');
const settingsToggle = document.getElementById('settingsToggle');
const settingsClose = document.getElementById('settingsClose');
const musicVolumeSlider = document.getElementById('musicVolume');
const musicVolumeValue = document.getElementById('musicVolumeValue');
const cursorOptions = document.querySelectorAll('.settings-option');

// Открытие/закрытие
if (settingsToggle && settingsModal) {
    settingsToggle.addEventListener('click', () => {
        playClickSound();
        settingsModal.classList.add('active');
        // Загружаем сохранённые настройки
        loadSettings();
    });
}
if (settingsClose && settingsModal) {
    settingsClose.addEventListener('click', () => {
        playClickSound();
        settingsModal.classList.remove('active');
    });
}
if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });
}

// ===== ГРОМКОСТЬ МУЗЫКИ =====
function updateMusicVolume(value) {
    const vol = value / 100;
    ambientMusic.volume = vol;
    if (musicVolumeValue) musicVolumeValue.textContent = value + '%';
    localStorage.setItem('musicVolume', value);
}

if (musicVolumeSlider) {
    musicVolumeSlider.addEventListener('input', (e) => {
        updateMusicVolume(parseInt(e.target.value));
    });
}

// ===== ВЫБОР КУРСОРА =====
let cursorMode = 'waves'; // 'waves' или 'bubbles'

function setCursorMode(mode) {
    cursorMode = mode;
    cursorOptions.forEach(opt => {
        opt.classList.toggle('active', opt.dataset.cursor === mode);
    });
    localStorage.setItem('cursorMode', mode);
}

cursorOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        playClickSound();
        setCursorMode(opt.dataset.cursor);
    });
});

// ===== ЗАГРУЗКА СОХРАНЁННЫХ НАСТРОЕК =====
function loadSettings() {
    // Громкость
    const savedVolume = localStorage.getItem('musicVolume');
    if (savedVolume !== null) {
        const vol = parseInt(savedVolume);
        if (musicVolumeSlider) musicVolumeSlider.value = vol;
        updateMusicVolume(vol);
    } else {
        updateMusicVolume(15); // дефолт — тихо
    }
    
    // Курсор
    const savedCursor = localStorage.getItem('cursorMode');
    if (savedCursor) {
        setCursorMode(savedCursor);
    } else {
        setCursorMode('waves'); // дефолт — только волны
    }
}

// Загружаем при старте
loadSettings();

// ============================================
//  СЛЕД КУРСОРА (для «Окон» и «Браузера»)
// ============================================
const cursorTrailContainer = document.createElement('div');
cursorTrailContainer.id = 'cursorTrail';
cursorTrailContainer.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 9998;
    overflow: hidden;
`;
document.body.appendChild(cursorTrailContainer);

let lastTrailTime = 0;

function spawnCursorTrail(x, y) {
    if (currentMode === 'bubbles') return; // в пузырях свой след
    const now = Date.now();
    if (now - lastTrailTime < 30) return; // ограничение частоты
    lastTrailTime = now;
    
    // Волны — всегда
    const wave = document.createElement('div');
    wave.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(200, 240, 255, 0.7);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0.3);
        animation: cursorWaveExpand 0.9s ease-out forwards;
        pointer-events: none;
    `;
    cursorTrailContainer.appendChild(wave);
    setTimeout(() => wave.remove(), 900);
    
    // Пузырьки — только если выбрано
    if (cursorMode === 'bubbles') {
        for (let i = 0; i < 2; i++) {
            const bubble = document.createElement('div');
            const size = 4 + Math.random() * 6;
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            bubble.style.cssText = `
                position: absolute;
                left: ${x + offsetX}px;
                top: ${y + offsetY}px;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(200, 240, 255, 0.5), transparent);
                border: 1px solid rgba(255, 255, 255, 0.7);
                transform: translate(-50%, -50%);
                animation: cursorBubbleFloat 1s ease-out forwards;
                pointer-events: none;
            `;
            cursorTrailContainer.appendChild(bubble);
            setTimeout(() => bubble.remove(), 1000);
        }
    }
}

// CSS для анимаций — добавим через JS, чтобы не править style.css
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    @keyframes cursorWaveExpand {
        0% { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
    }
    @keyframes cursorBubbleFloat {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -80%) scale(0.3); opacity: 0; }
    }
`;
document.head.appendChild(cursorStyle);


// След курсора в браузере
document.getElementById('browserGame').addEventListener('mousemove', (e) => {
    if (currentMode !== 'browser') return;
    spawnCursorTrail(e.clientX, e.clientY);
});
document.getElementById('browserGame').addEventListener('touchmove', (e) => {
    if (currentMode !== 'browser') return;
    const t = e.touches[0];
    spawnCursorTrail(t.clientX, t.clientY);
}, { passive: true });