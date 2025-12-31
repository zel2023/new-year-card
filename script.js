// 2026马年新年贺卡交互脚本

// ========== 全局变量 ==========
let particlesCanvas, particlesCtx;
let fireworksCanvas, fireworksCtx;
let particles = [];
let fireworks = [];
let musicPlaying = false;
let currentBlessingIndex = 0;

// 祝福语库
const blessings = [
    "新的一年，祝你马到成功，心想事成！",
    "愿你在2026年一马当先，勇往直前！",
    "龙马精神，万事如意，新年快乐！",
    "祝你马上有钱，马上有房，马上有对象！",
    "一马平川，前程似锦，步步高升！",
    "马不停蹄，事业腾飞，财源广进！",
    "快马加鞭，梦想成真，幸福美满！",
    "天马行空，自由自在，健康快乐！"
];

// 运势库
const luckList = [
    { title: "大吉", description: "马到成功，诸事顺利！", emoji: "🎉" },
    { title: "中吉", description: "稳步前进，渐入佳境！", emoji: "🌟" },
    { title: "吉", description: "小有收获，持续努力！", emoji: "✨" },
    { title: "上上签", description: "万事如意，福星高照！", emoji: "🎊" },
    { title: "福运", description: "好运连连，笑口常开！", emoji: "🍀" }
];

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    initCanvases();
    initParticles();
    initEventListeners();
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

// ========== Canvas 初始化 ==========
function initCanvases() {
    // 粒子画布
    particlesCanvas = document.getElementById('particlesCanvas');
    particlesCtx = particlesCanvas.getContext('2d');

    // 烟花画布
    fireworksCanvas = document.getElementById('fireworksCanvas');
    fireworksCtx = fireworksCanvas.getContext('2d');

    // 设置画布尺寸
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
}

function resizeCanvases() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
}

// ========== 粒子系统 ==========
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height - particlesCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
        // 马年配色：金色、橙色、红色
        const colors = ['#FFB300', '#FF6F00', '#D32F2F', '#FFD54F'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y > particlesCanvas.height) {
            this.reset();
        }
    }

    draw() {
        particlesCtx.fillStyle = this.color;
        particlesCtx.globalAlpha = this.opacity;
        particlesCtx.beginPath();
        particlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particlesCtx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    animateParticles();
}

function animateParticles() {
    particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    particlesCtx.globalAlpha = 1;

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

// ========== 烟花系统 ==========
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.createParticles();
    }

    createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 3 + 2;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                color: `hsl(${Math.random() * 60 + 20}, 100%, ${Math.random() * 20 + 60}%)`
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // 重力
            p.life -= 0.01;
        });
        this.particles = this.particles.filter(p => p.life > 0);
    }

    draw() {
        this.particles.forEach(p => {
            fireworksCtx.globalAlpha = p.life;
            fireworksCtx.fillStyle = p.color;
            fireworksCtx.beginPath();
            fireworksCtx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            fireworksCtx.fill();
        });
    }

    isDead() {
        return this.particles.length === 0;
    }
}

function launchFirework(x, y) {
    fireworks.push(new Firework(x, y));
}

function animateFireworks() {
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    fireworksCtx.globalAlpha = 1;

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.isDead()) {
            fireworks.splice(index, 1);
        }
    });

    requestAnimationFrame(animateFireworks);
}

animateFireworks();

// ========== 事件监听 ==========
function initEventListeners() {
    // 打开贺卡
    document.getElementById('openCard').addEventListener('click', () => {
        document.getElementById('coverPage').style.display = 'none';
        document.getElementById('cardContent').classList.remove('hidden');
        // 开场烟花
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * fireworksCanvas.width;
                const y = Math.random() * fireworksCanvas.height * 0.5;
                launchFirework(x, y);
            }, i * 300);
        }
    });

    // 祝福语切换
    document.getElementById('nextBlessing').addEventListener('click', () => {
        currentBlessingIndex = (currentBlessingIndex + 1) % blessings.length;
        const blessingText = document.getElementById('blessingText');
        blessingText.style.opacity = '0';
        setTimeout(() => {
            blessingText.textContent = blessings[currentBlessingIndex];
            blessingText.style.opacity = '1';
        }, 300);
    });

    // 抽签
    document.getElementById('drawLucky').addEventListener('click', () => {
        const luckyResult = document.getElementById('luckyResult');
        luckyResult.style.opacity = '0';

        setTimeout(() => {
            const luck = luckList[Math.floor(Math.random() * luckList.length)];
            luckyResult.innerHTML = `${luck.emoji} ${luck.title}<br><small>${luck.description}</small>`;
            luckyResult.style.opacity = '1';
        }, 300);
    });

    // 烟花按钮
    document.getElementById('launchFireworks').addEventListener('click', () => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const x = Math.random() * fireworksCanvas.width;
                const y = Math.random() * fireworksCanvas.height * 0.5;
                launchFirework(x, y);
            }, i * 200);
        }
    });

    // 点击屏幕放烟花（监听整个文档，避免被其他元素遮挡）
    document.addEventListener('click', (e) => {
        // 排除按钮点击
        if (e.target.tagName !== 'BUTTON') {
            launchFirework(e.clientX, e.clientY);
        }
    });

    // 音乐控制
    const bgMusic = document.getElementById('bgMusic');
    const toggleMusicBtn = document.getElementById('toggleMusic');

    toggleMusicBtn.addEventListener('click', () => {
        if (musicPlaying) {
            bgMusic.pause();
            toggleMusicBtn.textContent = '播放音乐';
            musicPlaying = false;
        } else {
            bgMusic.play().catch(err => {
                console.log('音乐播放需要用户交互:', err);
                alert('请确保已添加音乐文件到 assets/new-year-music.mp3');
            });
            toggleMusicBtn.textContent = '暂停音乐';
            musicPlaying = true;
        }
    });
}

// ========== 倒计时功能 ==========
function updateCountdown() {
    // 2026年春节日期：2026年1月29日
    const newYear = new Date('2026-01-29T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = newYear - now;

    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    } else {
        document.querySelector('.countdown-title').textContent = '🐴 马年已到！新年快乐！🐴';
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// ========== 样式过渡增强 ==========
const blessingText = document.getElementById('blessingText');
if (blessingText) {
    blessingText.style.transition = 'opacity 0.3s ease';
}
