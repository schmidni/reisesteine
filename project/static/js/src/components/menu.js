import anime from 'animejs';

export default class Menu {
    constructor() {
        this.menuButton = document.getElementById("rs-small-menu");
        this.steine = document.getElementById("rs-nav-steine");
        this.geschichten = document.getElementById("rs-nav-geschichten");
        this.fundorte = document.getElementById("rs-nav-fundorte");
        this.geologie = document.getElementById("rs-nav-geologie");
        this.menuClose = document.getElementById("rs-nav-close");
        this.smallNav = document.getElementById("rs-small-navigation");
        this.nav = document.getElementById("rs-nav");
        this.navBackground = document.getElementById("rs-nav-background");
        this.initListeners();
    }

    openMenu = (e) => {
        e.preventDefault();
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        this.smallNav.style.display = 'none';
        
        anime({
            targets: this.navBackground,
            translateY: [0, -vh * 0.25 + 100],
            translateX: [0, -300],
            height: vh + 'px',
            width: '800px',
            paddingTop: 0.25*vh + 'px',
            paddingBottom: 0.25*vh + 'px',
            easing: 'easeInQuad',
            duration: 500
        }).finished.then(() => {
            anime({
                targets:this.navBackground,
                translateX: [-300, -250],
                duration: 500,
                easing: 'easeOutQuad',
            });
            anime({
                targets: this.nav,
                translateX: [0, 850],
                duration: 500,
                easing: 'easeOutQuad'
            });
        })
    }

    closeMenu = (e) => {
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        e.preventDefault();
        anime({
            targets: this.navBackground,
            translateX: 0,
            translateY: 0,
            height: '230px',
            width: '230px',
            paddingTop: '30px',
            paddingBottom: '30px',
            easing: 'easeOutQuad',
            duration: 750,
            delay: 500
        });
        anime({
            targets: this.nav,
            translateX: [850, 0],
            duration: 500,
            easing: 'easeInQuad'
        }).finished.then(() => {
            this.smallNav.style.display = 'flex';
        });
    }

    initListeners() {
        this.menuButton.addEventListener('click', this.openMenu);
        this.menuClose.addEventListener('click', this.closeMenu);
    }
}