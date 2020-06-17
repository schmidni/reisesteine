import interact from 'interactjs';
import anime from 'animejs';
import {outerSize} from '../util/outerSize.js';

export default class IndexView {
    constructor(targetSelector, linkSelector, linkMethod, alternating=true){
        this.targetSelector = targetSelector;
        this.linkSelector = linkSelector;
        this.linkMethod = linkMethod;
        this.alternating = alternating;

        this.target = document.querySelector(this.targetSelector);

        this.oldx = 0;
        this.oldy = 0;
        this.position = {x: 0, y: 0};

        this.init(linkMethod);
        document.querySelector('#rs-nav-background').classList.add('active');
    }

    mousemovemethod = (e) => {
        this.position.x += (e.pageX-this.oldx)*0.005;
        this.position.y += (e.pageY-this.oldy)*0.005;

        this.target.style.transform =
            `translate(${this.position.x}px, ${this.position.y}px)`

        this.oldx = e.pageX;
        this.oldy = e.pageY;
    }

    removeMouseMoveMethod() {
        document.removeEventListener('mousemove', this.mousemovemethod);
    }

    removeListeners() {
        interact(this.linkSelector).unset();
        interact(this.targetSelector).unset();
    }

    removeStyle() {
        document.getElementById('rs-alternating').remove();
        document.querySelector('#rs-nav-background').classList.remove('active');
    }

    async onClickEffect (e) {
        let mydiv = e.target.closest('div');

        let siblings = [... mydiv.parentElement.children].filter(c=>c!=mydiv);
        
        anime({
            targets: siblings,
            opacity: [1, 0],
            duration: 500,
            easing: 'linear',
        });

        anime({
            targets: mydiv,
            scale: [1, 1.5],
            rotate: -10,
            duration: 500,
            easing: 'linear'
        });

        return await anime({
            targets: mydiv,
            opacity: [1,0],
            duration: 500,
            easing: 'linear'
        }).finished;
    }

    init (linkMethod) {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        let width = 0, height = 0;

      
        document.addEventListener('mousemove', this.mousemovemethod);
        // amount of rocks to display
        let len = this.target.children.length;

        // amount of rocks on one row so the aspect ratio of the viewport is kept
        let len_w = Math.round(Math.sqrt(len*(vw / vh)))

        // height and width of the container: x * width of one element + safety
        width =  len_w * outerSize(this.target.children[1], 'width') + outerSize(this.target.children[1], 'width') -100;
        height = Math.ceil(len / len_w) * outerSize(this.target.children[1], 'height') + outerSize(this.target.children[1], 'width') -100;
        this.target.style.width = width + 'px';

        if (this.alternating) {
            // Add css for alternating rows
            var styles = `
                ${this.targetSelector}>div:nth-Child(${len_w*2}n+1) { 
                    padding-left: ${outerSize(this.target.children[1], 'width')/2}px
                }
            `;
            var styleSheet = document.createElement("style");
            styleSheet.type = "text/css";
            styleSheet.id = "rs-alternating";
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);   
        }
        
        // center start position of screen
        if (outerSize(this.target,'width') < vw)
            this.position.x = 0
        else
            this.position.x = -(width-vw) / 2;

        if (outerSize(this.target,'height') < vh)
            this.position.y = 0
        else
            this.position.y = -(height-vh) / 2;

        // this.position = { x: -(width-vw) / 2, y: -(height-vh) / 2 };
        this.target.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        let position = this.position;
        let tg = this.target;

        interact(this.targetSelector).draggable({
            listeners: {
                move (event) {
                    position.x += event.dx;
                    position.y += event.dy;

                    // clamp position
                    position.x = Math.min(Math.max(position.x, vw - width - 200), 0);
                    position.y = Math.min(Math.max(position.y, vh - outerSize(tg, 'height') - 200), 0);

                event.target.style.transform =
                    `translate(${position.x}px, ${position.y}px)`;
                }
            },
            inertia: {
                resistance: 5,
                minSpeed: 10,
                smoothEndDuration: 500
            },
            allowFrom: this.targetSelector,
            cursorChecker () {
                return null
            }
        });

        
        interact(this.linkSelector).on('tap', (e) => {
            e.preventDefault();
            linkMethod(e);
        });
    }


}