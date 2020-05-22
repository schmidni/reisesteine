import debounce from '../util/debounce.js';
import anime from 'animejs';

export default class svgFrame {
    constructor(el) {
        this.DOM = {};
        this.DOM.el = el;
        this.settings = {
            animation: {
                shape: {
                    duration: 1000,
                    easing: {in: 'easeOutQuint', out: 'easeOutQuad'}
                }
            },
            frameFill: 'rgba(4, 20, 40, 0.8)'
        }
        this.init();
    }

    init = () => {
        this.createFrame();

        window.addEventListener('resize', debounce(() => {
            this.rect = this.DOM.el.getBoundingClientRect();
            this.updateFrame();
        }, 20));
    }

    createFrame = () => {
        this.rect = this.DOM.el.getBoundingClientRect();
        this.frameSize = this.rect.width/12;
        this.paths = {
            initial: this.calculatePath('initial'),
            final: this.calculatePath('final'),
            offset: this.calculatePath('offset')
        };
        this.DOM.svg = document.querySelector('#svg')
        this.DOM.shape = this.DOM.svg.querySelector('path');

        this.DOM.svg.setAttribute('viewbox',`0 0 ${this.rect.width} ${this.rect.height}`);
        this.DOM.shape.setAttribute('fill', this.settings.frameFill);
        this.DOM.shape.setAttribute('d', this.paths.initial);
    }

    updateFrame =() => {
        this.paths.initial = this.calculatePath('initial');
        this.paths.final = this.calculatePath('offset');
        this.DOM.svg.setAttribute('viewbox',`0 0 ${this.rect.width} ${this.rect.height}`);
        this.DOM.shape.setAttribute('d', this.isZoomed ? this.paths.final : this.paths.initial);
    }
    calculatePath =(path = 'initial') => {
        const r = Math.sqrt(Math.pow(this.rect.height,2) + Math.pow(this.rect.width,2));
        const rInitialOuter = r;
        const rInitialInner = r;
        const rFinalOuter = r;
        const rFinalInner = this.rect.width*0.075;
        let p = '';

        if (path === 'initial')
            p = `M ${this.rect.width/2}, ${this.rect.height/2} m 0 ${-rInitialOuter} a ${rInitialOuter} ${rInitialOuter} 0 1 0 1 0 z m -1 ${rInitialOuter-rInitialInner} a ${rInitialInner} ${rInitialInner} 0 1 1 -1 0 Z`;
        else if(path === 'final')
            p = `M ${this.rect.width/2}, ${this.rect.height/2} m 0 ${-rFinalOuter} a ${rFinalOuter} ${rFinalOuter} 0 1 0 1 0 z m -1 ${rFinalOuter-rFinalInner} a ${rFinalInner} ${rFinalInner} 0 1 1 -1 0 Z`;
        else if(path === 'offset')
            p = `M ${this.rect.width/2+this.rect.width*0.2}, ${this.rect.height/2-this.rect.width*0.05} m 0 ${-rFinalOuter} a ${rFinalOuter} ${rFinalOuter} 0 1 0 1 0 z m -1 ${rFinalOuter-rFinalInner} a ${rFinalInner} ${rFinalInner} 0 1 1 -1 0 Z`;
        else if (path === 'full')
            p = `M ${this.rect.width/2}, ${this.rect.height/2} m 0 ${-rFinalOuter} a ${rFinalOuter} ${rFinalOuter} 0 1 0 1 0 z m -1 ${rFinalOuter-0.001} a ${0.001} ${0.001} 0 1 1 -1 0 Z`;
        return p;        
    }

    navigate(dir = 'zoom') {

        if ( this.isAnimating ) return false;
        this.isAnimating = true;
        this.isZoomed = true;

        this.DOM.svg.style.display = 'block';

        let animateShape = null;

        if (dir === 'zoom') {
            animateShape = anime({
                targets: this.DOM.shape,
                duration: this.settings.animation.shape.duration,
                easing: this.settings.animation.shape.easing.in,
                d: this.calculatePath('final')
            }).finished.then(this.isAnimating = false);
        }
        if (dir === 'offset') {
            animateShape = anime({
                targets: this.DOM.shape,
                duration: this.settings.animation.shape.duration,
                easing: this.settings.animation.shape.easing.out,
                d: this.calculatePath('offset')
            }).finished.then(this.isAnimating = false);
        }

        if (dir === 'full') {
            animateShape = anime({
                targets: this.DOM.shape,
                duration: this.settings.animation.shape.duration,
                easing: this.settings.animation.shape.easing.out,
                d: this.calculatePath('full')
            }).finished.then(this.isAnimating = false);
        }

        if (dir === 'initial'){
            animateShape = anime({
                targets: this.DOM.shape,
                duration: this.settings.animation.shape.duration,
                easing: this.settings.animation.shape.easing.out,
                d: this.paths.initial,
                complete: () => {
                    this.isAnimating = false
                    this.DOM.svg.style.display = 'none';
                }
            });
        }
    }
};