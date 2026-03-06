class InteractiveSite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createFunnyCursor();
        this.setupParallax();
        this.initAnimations();
        this.initMiniGame();
    }

    setupEventListeners() {
        document.addEventListener('mousemove', this.updateFunnyCursor.bind(this));
        document.addEventListener('click', this.playClickSound.bind(this));
        window.addEventListener('scroll', this.handleScrollEffects.bind(this));
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    }

    createFunnyCursor() {
        this.cursor = document.createElement('div');
        this.cursor.id = 'funny-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #ff6b6b, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease-out;
        `;
        document.body.appendChild(this.cursor);
    }

    updateFunnyCursor(e) {
        this.cursor.style.left = e.clientX - 10 + 'px';
        this.cursor.style.top = e.clientY - 10 + 'px';
    }

    playClickSound() {
        const clickSound = new Audio('assets/sounds/click.mp3');
        clickSound.volume = 0.3;
        clickSound.play();
        this.cursor.style.transform = 'scale(1.5)';
        setTimeout(() => {
            this.cursor.style.transform = 'scale(1)';
        }, 100);
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            element.style.transform = 'translateZ(0)';
        });
    }

    handleScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    initAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    handleKeyboardShortcuts(e) {
        if (e.key === 'm') {
            this.toggleMute();
        } else if (e.key === ' ') {
            e.preventDefault();
            this.triggerSurprise();
        }
    }

    toggleMute() {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.muted = !audio.muted;
        });
    }

    triggerSurprise() {
        const surpriseElement = document.createElement('div');
        surpriseElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 24px;
            z-index: 10000;
            animation: surprise 2s ease-out forwards;
        `;
        surpriseElement.textContent = 'Surprise! 🎉';
        document.body.appendChild(surpriseElement);

        setTimeout(() => {
            surpriseElement.remove();
        }, 2000);
    }

    initMiniGame() {
        this.miniGame = new MiniGame();
    }
}

class MiniGame {
    constructor() {
        this.init();
    }

    init() {
        this.createGameUI();
        this.setupGameLogic();
    }

    createGameUI() {
        this.gameContainer = document.createElement('div');
        this.gameContainer.id = 'mini-game';
        this.gameContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            height: 200px;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 10px;
            padding: 20px;
            color: white;
            display: none;
            z-index: 1000;
        `;

        this.gameTitle = document.createElement('h2');
        this.gameTitle.textContent = 'Catch the Dot!';
        this.gameTitle.style.cssText = 'text-align: center; margin-bottom: 20px;';

        this.gameArea = document.createElement('div');
        this.gameArea.id = 'game-area';
        this.gameArea.style.cssText = `
            width: 100%;
            height: 120px;
            background: #333;
            border-radius: 5px;
            position: relative;
            cursor: crosshair;
        `;

        this.scoreElement = document.createElement('p');
        this.scoreElement.id = 'score';
        this.scoreElement.textContent = 'Score: 0';
        this.scoreElement.style.cssText = 'text-align: center; margin-top: 10px; font-weight: bold;';

        this.gameContainer.appendChild(this.gameTitle);
        this.gameContainer.appendChild(this.gameArea);
        this.gameContainer.appendChild(this.scoreElement);
        document.body.appendChild(this.gameContainer);

        this.dot = document.createElement('div');
        this.dot.id = 'dot';
        this.dot.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: #ff6b6b;
            border-radius: 50%;
            cursor: pointer;
        `;
        this.gameArea.appendChild(this.dot);

        this.startButton = document.createElement('button');
        this.startButton.id = 'start-game';
        this.startButton.textContent = 'Start Game';
        this.startButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        `;
        document.body.appendChild(this.startButton);

        this.startButton.addEventListener('click', () => {
            this.startGame();
        });

        this.dot.addEventListener('click', () => {
            this.dotClicked();
        });
    }

    setupGameLogic() {
        this.score = 0;
        this.gameActive = false;
        this.updateScore();
    }

    startGame() {
        this.gameActive = true;
        this.gameContainer.style.display = 'block';
        this.startButton.style.display = 'none';
        this.moveDot();
        this.gameLoop();
    }

    moveDot() {
        const gameArea = this.gameArea.getBoundingClientRect();
        const x = Math.random() * (gameArea.width - 20);
        const y = Math.random() * (gameArea.height - 20);
        this.dot.style.left = x + 'px';
        this.dot.style.top = y + 'px';
    }

    dotClicked() {
        if (this.gameActive) {
            this.score += 10;
            this.updateScore();
            this.moveDot();
            this.playClickSound();
        }
    }

    updateScore() {
        this.scoreElement.textContent = `Score: ${this.score}`;
    }

    gameLoop() {
        if (this.gameActive) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    playClickSound() {
        const clickSound = new Audio('assets/sounds/click.mp3');
        clickSound.volume = 0.3;
        clickSound.play();
    }
}

const interactiveSite = new InteractiveSite();