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

export default MiniGame;