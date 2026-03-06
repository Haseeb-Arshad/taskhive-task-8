class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.clickSound = null;
        this.hoverSound = null;
        this.init();
    }

    init() {
        if (!this.isWebAudioSupported()) {
            console.log('Web Audio API is not supported in this browser');
            return;
        }

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.createSounds();
        this.initEventListeners();
    }

    isWebAudioSupported() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }

    createSounds() {
        this.clickSound = () => this.playClickSound();
        this.hoverSound = () => this.playHoverSound();
    }

    playClickSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    playHoverSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    initEventListeners() {
        document.addEventListener('click', () => {
            this.clickSound();
        });

        document.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.95) {
                this.hoverSound();
            }
        });

        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.hoverSound();
            });
        });
    }

    createBackgroundMusic() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = 220;
        gainNode.gain.value = 0.05;

        oscillator.start();

        return oscillator;
    }

    stopBackgroundMusic(oscillator) {
        if (!oscillator) return;

        oscillator.stop();
    }
}

class AudioController {
    constructor() {
        this.soundEffects = new SoundEffects();
        this.backgroundMusic = null;
        this.isMuted = false;
        this.initMuteToggle();
    }

    initMuteToggle() {
        const muteButton = document.createElement('button');
        muteButton.id = 'mute-toggle';
        muteButton.textContent = '🔊 Mute';
        muteButton.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000; padding: 10px 20px; font-size: 16px; cursor: pointer;';
        document.body.appendChild(muteButton);

        muteButton.addEventListener('click', () => {
            this.toggleMute();
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const muteButton = document.getElementById('mute-toggle');

        if (this.isMuted) {
            this.soundEffects.stopBackgroundMusic(this.backgroundMusic);
            muteButton.textContent = '🔈 Unmute';
        } else {
            this.backgroundMusic = this.soundEffects.createBackgroundMusic();
            muteButton.textContent = '🔊 Mute';
        }
    }
}

const audioController = new AudioController();