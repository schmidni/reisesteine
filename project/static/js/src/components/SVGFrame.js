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
            frameFill: 'rgba(256, 256, 256, 0.7)'
        }
        this.init();
        this.animateShape = () => {
            return new Promise( (res, rej) => {
                return res();
            });
        }
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
            current: 'initial'
        };
        this.DOM.svg = document.querySelector('#svg')
        this.DOM.shape = this.DOM.svg.querySelector('path');

        this.DOM.svg.setAttribute('viewbox',`0 0 ${this.rect.width} ${this.rect.height}`);
        this.DOM.shape.setAttribute('fill', this.settings.frameFill);
        this.DOM.shape.setAttribute('d', this.calculatePath());
    }

    updateFrame =() => {
        this.DOM.svg.setAttribute('viewbox',`0 0 ${this.rect.width} ${this.rect.height}`);
        this.DOM.shape.setAttribute('d', this.calculatePath(this.paths.current));
    }
    calculatePath = (path = 'initial') => {
        const r = Math.sqrt(Math.pow(this.rect.height,2) + Math.pow(this.rect.width,2))+this.rect.width*0.1;
        const rInitialOuter = r;
        const rInitialInner = r;
        const rFinalOuter = r;
        const rFinalInner = this.rect.width*0.1;
        const rFinalInnerMobile = this.rect.height*0.15;
        let p = '';

        if (path === 'initial')
            p = `M ${this.rect.width/2}, ${this.rect.height/2} m 0 ${-rInitialOuter} a ${rInitialOuter} ${rInitialOuter} 0 1 0 1 0 z m -1 ${rInitialOuter-rInitialInner} a ${rInitialInner} ${rInitialInner} 0 1 1 -1 0 Z`;
        else if(path === 'mobile')
            p = `M ${this.rect.width/2}, ${this.rect.height*0.2} m 0 ${-rFinalOuter} a ${rFinalOuter} ${rFinalOuter} 0 1 0 1 0 z m -1 ${rFinalOuter-rFinalInnerMobile} a ${rFinalInnerMobile} ${rFinalInnerMobile} 0 1 1 -1 0 Z`;
        else if(path === 'offset')
            p = `M ${this.rect.width*0.7}, ${this.rect.height/2-this.rect.width*0.05} m 0 ${-rFinalOuter} a ${rFinalOuter} ${rFinalOuter} 0 1 0 1 0 z m -1 ${rFinalOuter-rFinalInner} a ${rFinalInner} ${rFinalInner} 0 1 1 -1 0 Z`;
        else if (path === 'full')
            p = `M ${this.rect.width/2}, ${this.rect.height/2} m 0 ${-rFinalOuter} a ${rFinalOuter} ${rFinalOuter} 0 1 0 1 0 z m -1 ${rFinalOuter-0.001} a ${0.001} ${0.001} 0 1 1 -1 0 Z`;
        else if (path ==='rect')
            p = `M 0 0 H ${this.rect.width} V ${this.rect.height} H 0 Z`;
        else if (path === 'leftout')
            p = `M ${-rFinalInner}, ${this.rect.height/2-this.rect.width*0.05} m 0 ${-rFinalOuter} a ${rFinalOuter} ${rFinalOuter} 0 1 0 1 0 z m -1 ${rFinalOuter-rFinalInner} a ${rFinalInner} ${rFinalInner} 0 1 1 -1 0 Z`;
        else if (path === 'rightout')
            p = `M ${this.rect.width + rFinalInner}, ${this.rect.height/2-this.rect.width*0.05} m 0 ${-rFinalOuter} a ${rFinalOuter} ${rFinalOuter} 0 1 0 1 0 z m -1 ${rFinalOuter-rFinalInner} a ${rFinalInner} ${rFinalInner} 0 1 1 -1 0 Z`;
        return p;        
    }

    navigate(dir = 'initial') {

        if ( this.isAnimating ) return false;
            
        if ( this.paths.current == dir)
            return new Promise( (res, rej) => {
                return res();
            });

        this.isAnimating = true;
        this.DOM.svg.style.display = 'block';

        if (dir === 'mobile') {
            this.animateShape = anime({
                targets: this.DOM.shape,
                duration: this.settings.animation.shape.duration,
                easing: this.settings.animation.shape.easing.in,
                d: this.calculatePath('mobile')
            }).finished.then( () => {
                this.isAnimating = false
                this.paths.current = 'mobile';
            });
        }
        else if (dir === 'offset') {
            this.animateShape = anime({
                targets: this.DOM.shape,
                duration: this.settings.animation.shape.duration,
                easing: this.settings.animation.shape.easing.out,
                d: this.calculatePath('offset')
            }).finished.then( () => {
                this.isAnimating = false
                this.paths.current = 'offset';
            });
        }
        else if (dir === 'full') {
            this.animateShape = anime({
                targets: this.DOM.shape,
                duration: this.settings.animation.shape.duration,
                easing: this.settings.animation.shape.easing.out,
                d: this.calculatePath('full')
            }).finished.then( () => {
                this.isAnimating = false
                this.paths.current = 'full';
            });
        }
        else if (dir === 'leftout') {
            this.animateShape = anime({
                targets: this.DOM.shape,
                duration: this.settings.animation.shape.duration,
                easing: this.settings.animation.shape.easing.out,
                d: this.calculatePath('leftout')
            }).finished.then( () => {
                this.isAnimating = false
                this.paths.current = 'leftout';
            });
        }
        else if (dir === 'rightin') {
            this.DOM.shape.setAttribute('d', this.calculatePath('rightout'));
            this.animateShape = anime({
                targets: this.DOM.shape,
                duration: this.settings.animation.shape.duration,
                easing: this.settings.animation.shape.easing.out,
                d: this.calculatePath('offset')
            }).finished.then( () => {
                this.isAnimating = false
                this.paths.current = 'offset';
            });
        }
        else if (dir === 'initial'){
            this.animateShape = anime({
                targets: this.DOM.shape,
                duration: this.settings.animation.shape.duration,
                easing: this.settings.animation.shape.easing.out,
                d: this.calculatePath('initial')
            }).finished.then( () => {
                this.isAnimating = false
                this.DOM.svg.style.display = 'none';
                this.paths.current = 'initial';
            });
        }

        return this.animateShape;
    }
};