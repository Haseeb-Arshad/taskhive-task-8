class Navigation {
    constructor() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.sections = document.querySelectorAll('section');
        this.currentSection = 0;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupMobileMenu();
    }

    setupNavigation() {
        this.navItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(index);
            });

            item.addEventListener('mouseenter', () => {
                this.animateNavItem(item, 'enter');
            });

            item.addEventListener('mouseleave', () => {
                this.animateNavItem(item, 'leave');
            });
        });
    }

    navigateToSection(index) {
        const targetSection = this.sections[index];
        const targetPosition = targetSection.offsetTop;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        this.updateActiveNavItem(index);
        this.currentSection = index;
    }

    updateActiveNavItem(index) {
        this.navItems.forEach(item => item.classList.remove('active'));
        this.navItems[index].classList.add('active');
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            this.sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionBottom = section.offsetTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                    if (this.currentSection !== index) {
                        this.updateActiveNavItem(index);
                        this.currentSection = index;
                    }
                }
            });
        });
    }

    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');

        menuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });

        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                menuToggle.classList.remove('active');
            });
        });
    }

    animateNavItem(item, type) {
        const originalText = item.textContent;
        const funnyTexts = [
            '🚀',
            '🎉',
            '✨',
            '💥',
            '🌈'
        ];

        if (type === 'enter') {
            const randomIndex = Math.floor(Math.random() * funnyTexts.length);
            item.textContent = funnyTexts[randomIndex];
            
            setTimeout(() => {
                item.textContent = originalText;
            }, 300);
        }
    }
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});