class Storytelling {
    constructor() {
        this.storyContainer = document.querySelector('.story-container');
        this.storyText = document.querySelector('.story-text');
        this.choicesContainer = document.querySelector('.choices-container');
        this.currentStoryIndex = 0;
        this.storyData = [
            {
                text: "You find yourself in a mysterious forest. Strange sounds echo around you. What do you do?",
                choices: [
                    { text: "Explore the forest", nextIndex: 1, action: this.exploreForest },
                    { text: "Climb a tree to get a better view", nextIndex: 2, action: this.climbTree }
                ]
            },
            {
                text: "As you explore, you discover a hidden cave. Do you enter?",
                choices: [
                    { text: "Enter the cave", nextIndex: 3, action: this.enterCave },
                    { text: "Keep exploring the forest", nextIndex: 4, action: this.keepExploring }
                ]
            },
            {
                text: "From the top of the tree, you spot a glowing object in the distance. What now?",
                choices: [
                    { text: "Head towards the glowing object", nextIndex: 5, action: this.headToGlow },
                    { text: "Climb down and continue exploring", nextIndex: 1, action: this.exploreForest }
                ]
            }
        ];
        this.init();
    }

    init() {
        this.displayStory();
        this.setupChoiceListeners();
        this.setupKeyboardNavigation();
    }

    displayStory() {
        const currentStory = this.storyData[this.currentStoryIndex];
        this.storyText.textContent = currentStory.text;
        this.displayChoices(currentStory.choices);
        this.animateStory();
    }

    displayChoices(choices) {
        this.choicesContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const choiceButton = document.createElement('button');
            choiceButton.className = 'choice-button';
            choiceButton.textContent = choice.text;
            choiceButton.dataset.choiceIndex = index;
            
            choiceButton.addEventListener('click', (e) => {
                this.makeChoice(parseInt(e.target.dataset.choiceIndex));
            });
            
            this.choicesContainer.appendChild(choiceButton);
        });
    }

    makeChoice(choiceIndex) {
        const currentStory = this.storyData[this.currentStoryIndex];
        const selectedChoice = currentStory.choices[choiceIndex];
        
        if (selectedChoice.action) {
            selectedChoice.action.call(this);
        }
        
        this.currentStoryIndex = selectedChoice.nextIndex;
        this.displayStory();
    }

    animateStory() {
        this.storyContainer.style.opacity = '0';
        this.storyContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.storyContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            this.storyContainer.style.opacity = '1';
            this.storyContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    setupChoiceListeners() {
        const choiceButtons = this.choicesContainer.querySelectorAll('.choice-button');
        
        choiceButtons.forEach((button, index) => {
            button.addEventListener('mouseenter', () => {
                this.animateChoiceButton(button, 'enter');
            });
            
            button.addEventListener('mouseleave', () => {
                this.animateChoiceButton(button, 'leave');
            });
        });
    }

    animateChoiceButton(button, type) {
        if (type === 'enter') {
            button.style.transform = 'scale(1.1) rotate(5deg)';
            button.style.transition = 'transform 0.3s ease';
        } else {
            button.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                const choiceIndex = parseInt(e.key) - 1;
                const currentStory = this.storyData[this.currentStoryIndex];
                
                if (choiceIndex < currentStory.choices.length) {
                    this.makeChoice(choiceIndex);
                }
            }
        });
    }

    // Story actions
    exploreForest() {
        this.createParticleEffect('leaf');
        this.playSound('forest');
    }

    climbTree() {
        this.createParticleEffect('sparkle');
        this.playSound('climb');
    }

    enterCave() {
        this.createParticleEffect('cave');
        this.playSound('echo');
    }

    keepExploring() {
        this.createParticleEffect('question');
        this.playSound('wonder');
    }

    headToGlow() {
        this.createParticleEffect('glow');
        this.playSound('mystery');
    }

    createParticleEffect(type) {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 1 + 's';
            
            this.storyContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }

    playSound(soundType) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(soundType) {
            case 'forest':
                oscillator.frequency.value = 200;
                gainNode.gain.value = 0.1;
                break;
            case 'climb':
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.05;
                break;
            case 'echo':
                oscillator.frequency.value = 150;
                gainNode.gain.value = 0.08;
                break;
            case 'wonder':
                oscillator.frequency.value = 300;
                gainNode.gain.value = 0.03;
                break;
            case 'mystery':
                oscillator.frequency.value = 100;
                gainNode.gain.value = 0.1;
                break;
        }
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// Initialize storytelling
document.addEventListener('DOMContentLoaded', () => {
    new Storytelling();
});