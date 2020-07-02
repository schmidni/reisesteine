import anime from 'animejs';
import m from 'mithril';
import SteinIndex from './SteinIndex.js';
import GeschichteIndex from './GeschichteIndex.js';
import GeologieIndex from './GeologieIndex.js';
import FundortIndex from './FundortIndex.js';
import 'mdn-polyfills/element.prototype.closest';

export default class Menu {
    constructor(map, frame, id) {
        this.map = map;
        this.frame = frame;

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
        
        if (id && id != undefined) {
            document.addEventListener('click', this.checkForClickTitle);
            document.addEventListener('touchstart', this.checkForClickTitle);
            document.querySelector('#rs-title').style.display = 'block';
        }
        else
            document.querySelector('#rs-title').style.display = 'none';

        this.settings = {};
    }

    openMenu = (e) => {
        e.preventDefault();
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        this.smallNav.style.display = 'none';
        this.navBackground.classList.add('open');

        anime({
            targets: this.navBackground,
            translateX: [0, -300],
            height: vh*1.2 + 'px',
            width: '800px',
            easing: 'easeInQuad',
            duration: 500,
            changeBegin: (anim) => {
                this.settings.height = anim.animations[1].currentValue;
                this.settings.width = anim.animations[2].currentValue;
            }
        }).finished.then(() => {
            anime({
                targets:this.navBackground,
                translateX: [-300, -150],
                duration: 500,
                easing: 'easeOutQuad',
            });
            anime({
                targets: this.nav,
                translateX: [0, 600],
                duration: 500,
                easing: 'easeOutQuad'
            }).finished.then(() => {
                document.addEventListener('click', this.checkForClickMenu);
                document.addEventListener('keydown', this.checkForEscape);
            });
        })
    }

    checkForClickMenu = (e) => {
        if(e.target.closest('#rs-nav') == null)
            this.closeMenu(e);
    }
    checkForEscape = (e) => {
        if (event.key == "Escape")
            this.closeMenu(e);
    }

    checkForClickTitle = (e) => {
        if(e.target.closest('#rs-title') == null){
            anime({
                targets: '#rs-title',
                opacity: [1, 0],
                duration: 1000,
                easing: 'easeOutQuad'
            }).finished.then( () => {
                document.querySelector('#rs-title').style.display = 'none';
            })
            document.removeEventListener('click', this.checkForClickTitle)
            document.removeEventListener('touchstart', this.checkForClickTitle)
        }
    }

    closeMenu = (e) => {
        e.preventDefault();
        document.removeEventListener('click', this.checkForClickMenu);
        document.removeEventListener('keydown', this.checkForEscape);
        anime({
            targets: this.navBackground,
            translateX: 0,
            translateY: 0,
            height: this.settings.height,
            width: this.settings.width,
            easing: 'easeOutQuad',
            duration: 750,
            delay: 500
        }).finished.then(() => {
            this.navBackground.classList.remove('open');
        });
        anime({
            targets: this.nav,
            translateX: [600, 0],
            duration: 500,
            easing: 'easeInQuad'
        }).finished.then(() => {
            this.smallNav.style.display = 'flex';
        });
    }

    initListeners() {
        this.menuButton.addEventListener('click', this.openMenu);
        this.menuClose.addEventListener('click', this.closeMenu);

        // Stein Index
        this.steine.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeMenu(e)
            m.render(document.getElementById('rs-body'), null);
            m.mount(document.getElementById('rs-body'), {view: () => m(SteinIndex, {'map': this.map, 'frame':this.frame, 'pushState': true})});
        });

        // Geschichten Index
        this.geschichten.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeMenu(e)
            m.render(document.getElementById('rs-body'), null);
            m.mount(document.getElementById('rs-body'), {view: () => m(GeschichteIndex, {'map': this.map, 'frame':this.frame, 'pushState': true})});
        });

        // Geologie Index
        this.geologie.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeMenu(e)
            m.render(document.getElementById('rs-body'), null);
            m.mount(document.getElementById('rs-body'), {view: () => m(GeologieIndex, {'map': this.map, 'frame':this.frame, 'pushState': true})});
        });

        // Geologie Index
        this.fundorte.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeMenu(e)
            m.render(document.getElementById('rs-body'), null);
            m.mount(document.getElementById('rs-body'), {view: () => m(FundortIndex, {'map': this.map, 'frame':this.frame, 'pushState': true})});
        });
    }
}