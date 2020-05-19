import debounce from '../util/debounce.js';
import anime from 'animejs';


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(minValue,maxValue,precision) {
    if ( typeof(precision) == 'undefined' ) {
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
}

export default class svgFrame {
    constructor(el) {
        this.DOM = {};
        this.DOM.el = el;
        this.settings = {
            animation: {
                slides: {
                    duration: 400,
                    easing: 'easeOutQuint'
                },
                shape: {
                    duration: 2400,
                    easing: {in: 'easeOutQuint', out: 'easeInQuad'}
                }
            },
            frameFill: 'rgba(0, 0, 0, 0.75)'
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
            final: this.calculatePath('final')
        };
        this.DOM.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.DOM.svg.setAttribute('width','100%');
        this.DOM.svg.setAttribute('height','100%');
        this.DOM.svg.setAttribute('viewbox',`0 0 ${this.rect.width} ${this.rect.height}`);
        this.DOM.svg.style.position = 'absolute';
        this.DOM.svg.style.zIndex = '2';
        this.DOM.svg.style.display = 'none';
        this.DOM.svg.innerHTML = `
                    <path fill="${this.settings.frameFill}" d="${this.paths.initial}"/>
        `;
        document.body.insertBefore(this.DOM.svg, this.DOM.el);
        this.DOM.shape = this.DOM.svg.querySelector('path');
    }

    updateFrame =() => {
        this.paths.initial = this.calculatePath('initial');
        this.paths.final = this.calculatePath('final');
        this.DOM.svg.setAttribute('viewbox',`0 0 ${this.rect.width} ${this.rect.height}`);
        this.DOM.shape.setAttribute('d', this.isAnimating ? this.paths.final : this.paths.initial);
    }
    calculatePath =(path = 'initial') => {
        const r = Math.sqrt(Math.pow(this.rect.height,2) + Math.pow(this.rect.width,2));
        const rInitialOuter = r;
        const rInitialInner = r;
        const rFinalOuter = r;
        const rFinalInner = this.rect.width*0.05;
        const getCenter = () => `${getRandomInt(rFinalInner,this.rect.width-rFinalInner)}, ${getRandomInt(rFinalInner,this.rect.height-rFinalInner)}`;
        return path === 'initial' ? 
            `M ${this.rect.width/2}, ${this.rect.height/2} m 0 ${-rInitialOuter} a ${rInitialOuter} ${rInitialOuter} 0 1 0 1 0 z m -1 ${rInitialOuter-rInitialInner} a ${rInitialInner} ${rInitialInner} 0 1 1 -1 0 Z` :
            // `M ${getCenter()} m 0 ${-rFinalOuter} a ${rFinalOuter} ${rFinalOuter} 0 1 0 1 0 z m -1 ${rFinalOuter-rFinalInner} a ${rFinalInner} ${rFinalInner} 0 1 1 -1 0 Z`;
            `M ${this.rect.width/2}, ${this.rect.height/2} m 0 ${-rFinalOuter} a ${rFinalOuter} ${rFinalOuter} 0 1 0 1 0 z m -1 ${rFinalOuter-rFinalInner} a ${rFinalInner} ${rFinalInner} 0 1 1 -1 0 Z`;
    }

    navigate(dir = 'next') {
        if ( this.isAnimating ) return false;
        this.isAnimating = true;
        
        this.DOM.svg.style.display = 'block';

        const animateShapeIn = anime({
            targets: this.DOM.shape,
            duration: this.settings.animation.shape.duration,
            easing: this.settings.animation.shape.easing.in,
            d: this.calculatePath('final')
        });

        const animateShapeOut = () => {
            anime({
                targets: this.DOM.shape,
                duration: this.settings.animation.shape.duration,
                //delay: 100,
                easing: this.settings.animation.shape.easing.out,
                d: this.paths.initial,
                complete: () => {
                    this.isAnimating = false
                    this.DOM.svg.style.display = 'none';
                }
            });
        }
        // animateShapeIn.finished.then(animateShapeOut);
    }

};