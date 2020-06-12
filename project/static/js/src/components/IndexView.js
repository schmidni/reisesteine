import interact from 'interactjs';
import {outerSize} from '../util/outerSize.js';

export default class IndexView {
    constructor(targetSelector, linkSelector, linkMethod, dimensions=null){
        this.targetSelector = targetSelector;
        this.dimensions = dimensions;
        this.linkSelector = linkSelector;
        this.linkMethod = linkMethod;

        this.target = document.querySelector(this.targetSelector);

        this.oldx = 0;
        this.oldy = 0;
        this.position = {};

        this.init(linkMethod);
    }

    mousemovemethod = (e) => {
        this.position.x += (e.pageX-this.oldx)*0.05;
        this.position.y += (e.pageY-this.oldy)*0.05;

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

    init (linkMethod) {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        let width = 0, height = 0;

        // use 
        if (this.dimensions){
            width = this.dimensions.x;
            height= this.dimensions.y;
        }
        else {        
            document.addEventListener('mousemove', this.mousemovemethod);
            // amount of rocks to display
            let len = this.target.children.length;

            // amount of rocks on one row so the aspect ratio of the viewport is kept
            let len_w = Math.round(Math.sqrt(len*(vw / vh)))

            // height and width of the container: x * width of one element + safety
            width =  len_w * outerSize(this.target.children[1], 'width') + outerSize(this.target.children[1], 'width') -100;
            height = Math.ceil(len / len_w) * outerSize(this.target.children[1], 'height') + outerSize(this.target.children[1], 'width') -100;
            this.target.style.width = width + 'px';

            // Add css for alternating rows
            var styles = `
                ${this.targetSelector}>div:nth-Child(${len_w*2}n+1) { 
                    margin-left: ${outerSize(this.target.children[1], 'width')/2}px
                }
            `;
            var styleSheet = document.createElement("style");
            styleSheet.type = "text/css";
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        }
        
        if (width < vw && height < vh){
            console.log('yes')
            this.target.style.paddingLeft = (vw-width) + 'px';
            this.target.style.paddingTop =  (vh-height) + 'px';
        } else {
            console.log('no')
            // center start position of screen
            this.position = { x: -(width-vw) / 2, y: -(height-vh) / 2 };
            this.target.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
            let position = this.position;

            interact(this.targetSelector).draggable({
                listeners: {
                    move (event) {
                        position.x += event.dx;
                        position.y += event.dy;

                        // clamp position
                        position.x = Math.min(Math.max(position.x, vw - width), 0);
                        position.y = Math.min(Math.max(position.y, vh - height), 0);

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
        }
        
        interact(this.linkSelector).on('tap', (e) => {
            e.preventDefault();
            linkMethod(e);
        });
    }


}