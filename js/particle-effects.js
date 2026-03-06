class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x > this.canvas.width || particle.x < 0) particle.speedX *= -1;
            if (particle.y > this.canvas.height || particle.y < 0) particle.speedY *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        this.connectParticles();
        requestAnimationFrame(() => this.animate());
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - (distance / 150) * 0.2})`;
                    this.ctx.stroke();
                }
            }
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

class CanvasGraphics {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.cssText = 'position: fixed; top: 0; left: 0; z-index: -1; pointer-events: none;';
        document.body.appendChild(this.canvas);
        
        this.particleSystem = new ParticleSystem(this.canvas);
        
        window.addEventListener('resize', () => this.particleSystem.resize());
    }

    createExplosion(x, y, color) {
        const particles = [];
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: x,
                y: y,
                size: Math.random() * 10 + 5,
                speedX: Math.random() * 10 - 5,
                speedY: Math.random() * 10 - 5,
                color: color,
                opacity: 1
            });
        }
        
        const animateExplosion = () => {
            this.particleSystem.ctx.clearRect(0, 0, this.particleSystem.canvas.width, this.particleSystem.canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.speedY += 0.2;
                particle.opacity -= 0.02;
                
                this.particleSystem.ctx.beginPath();
                this.particleSystem.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.particleSystem.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
                this.particleSystem.ctx.fill();
            });
            
            if (particles.some(p => p.opacity > 0)) {
                requestAnimationFrame(animateExplosion);
            }
        };
        
        animateExplosion();
    }

    createRipple(x, y, color) {
        const radius = 0;
        const maxRadius = 100;
        const speed = 2;
        
        const animateRipple = () => {
            this.particleSystem.ctx.beginPath();
            this.particleSystem.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.particleSystem.ctx.strokeStyle = `rgba(${color}, ${1 - radius / maxRadius})`;
            this.particleSystem.ctx.lineWidth = 3;
            this.particleSystem.ctx.stroke();
            
            if (radius < maxRadius) {
                requestAnimationFrame(animateRipple);
                radius += speed;
            }
        };
        
        animateRipple();
    }
}

class InteractiveCanvas {
    constructor() {
        this.canvasGraphics = new CanvasGraphics();
        this.initInteractions();
    }

    initInteractions() {
        document.addEventListener('click', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            const color = `${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}`;
            
            this.canvasGraphics.createExplosion(x, y, color);
            this.canvasGraphics.createRipple(x, y, color);
        });

        document.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.95) {
                const x = e.clientX + (Math.random() - 0.5) * 50;
                const y = e.clientY + (Math.random() - 0.5) * 50;
                const color = '255, 255, 255';
                
                this.canvasGraphics.createRipple(x, y, color);
            }
        });
    }
}

const interactiveCanvas = new InteractiveCanvas();