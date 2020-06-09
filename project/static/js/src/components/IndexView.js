import interact from 'interactjs';

export default class IndexView {
    constructor(targetSelector, dimensions, linkSelector, linkMethod){
        this.targetSelector = targetSelector;
        this.dimensions = dimensions;
        this.linkSelector = linkSelector;
        this.linkMethod = linkMethod;

        this.target = document.querySelector(this.targetSelector);

        this.oldx = 0;
        this.oldy = 0;
        this.position = {};

        this.init(linkMethod);
        document.addEventListener('mousemove', this.mousemovemethod);
    }

    mousemovemethod = (e) => {
        this.position.x += (e.pageX-this.oldx)*0.05;
        this.position.y += (e.pageY-this.oldy)*0.05;
        
        this.oldx = e.pageX;
        this.oldy = e.pageY;

        this.target.style.transform =
        `translate(${this.position.x}px, ${this.position.y}px)`
    }

    removeMouseMoveMethod() {
        document.removeEventListener('mousemove', this.mousemovemethod);
    }

    init (linkMethod) {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        // center start position of screen
        this.position = { x: -(this.dimensions.x-vw) / 2, y: -(this.dimensions.y-vh) / 2 }
        this.target.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        let position = this.position;
        let dimensions = this.dimensions;

        interact(this.targetSelector).draggable({
            listeners: {
                move (event) {
                    position.x += event.dx
                    position.y += event.dy

                    // clamp position
                    position.x = Math.min(Math.max(position.x, vw - dimensions.x), 0);
                    position.y = Math.min(Math.max(position.y, vh - dimensions.y), 0);

                event.target.style.transform =
                    `translate(${position.x}px, ${position.y}px)`
                }
            },
            inertia: {
                resistance: 5,
                minSpeed: 10,
                smoothEndDuration: 500
            },
            allowFrom: '.rs-reisesteine',
            cursorChecker () {
                return null
            }
        });

        interact('.rs-stein-link').on('tap', (e) => {
            e.preventDefault();
            linkMethod(e);
        });
    }


}