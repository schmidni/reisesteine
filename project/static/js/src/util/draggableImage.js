import interact from 'interactjs';
import anime from 'animejs';

export default class DraggableImage {
    constructor(slide) {
        this.slide = slide;
        this.slide_rect = this.slide.getBoundingClientRect();

        this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        this.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        this.oldx = 0;
        this.oldy = 0;

        // Calculate start size and position
        let factor = this.vh*1.05 / this.slide_rect.height;
        let temp_w = this.slide_rect.width * factor;
    
        if (temp_w < this.vw*1.05)
            factor = this.vw*1.05 / this.slide_rect.width;
        
        this.target_w = this.slide_rect.width*factor;
        this.target_h = this.slide_rect.height*factor;
    
        this.position = { x: -(this.target_w - this.vw) / 2 - this.slide_rect.left, y: -(this.target_h - this.vh) / 2 -this.slide_rect.top}
    }

    init = async () => {
        let wait = await this.animateUp();
        this.initInteract();
        document.addEventListener('mousemove', this.mousemovemethod);
        return wait;
    }

    animateUp = () => {
        return anime({
            targets: this.slide,
            translateX: [0, this.position.x],
            translateY: [0, this.position.y],
            width: [this.slide_rect.width, this.target_w],
            height: [this.slide_rect.height, this.target_h],
            translateZ: 0,
            duration: 1500,
            easing: 'easeInQuad'
        }).finished;
    }

    animateDown = () => {
        interact(this.slide).unset();
        document.removeEventListener('mousemove', this.mousemovemethod);
        return anime({
            targets: this.slide,
            translateX: 0,
            translateY: 0,
            translateZ: 0,
            width: this.slide_rect.width,
            height: this.slide_rect.height,
            rotate: -10,
            duration: 1000,
            easing: 'easeOutQuad'
        }).finished;
    }

    initInteract = () => {
        let position = this.position;
        let vw = this.vw;
        let vh = this.vh;
        let slide_rect = this.slide_rect;
        let target_w = this.target_w;
        let target_h = this.target_h;

        interact(this.slide).draggable({
            listeners: {
                move (event) {
                    position.x += event.dx
                    position.y += event.dy
    
                    // clamp position
                    position.x = Math.min(Math.max(position.x, vw-target_w - slide_rect.left), -slide_rect.left);
                    position.y = Math.min(Math.max(position.y, vh-target_h - slide_rect.top), -slide_rect.top);
    
                    event.target.style.transform =
                        `translateX(${position.x}px) translateY(${position.y}px)`;
                }
            },
            inertia: {
                resistance: 5,
                minSpeed: 10,
                smoothEndDuration: 400
            },
            cursorChecker () {
                return null
            }
        });
    }

    mousemovemethod = (e) => {
        this.position.x += (e.pageX-this.oldx)*0.01;
        this.position.y += (e.pageY-this.oldy)*0.01;

        this.slide.style.transform =
            `translateX(${this.position.x}px) translateY(${this.position.y}px)`

        this.oldx = e.pageX;
        this.oldy = e.pageY;
    }
}