import interact from 'interactjs';
import m from 'mithril';
import anime from 'animejs';

export class SteinNavigation {
    constructor() {
        this.active = 0;
        this.fundortSetup = false;
        this.menu = [];
        this.slides = [];    
    }

    switchIt = (target_in, e) => {
        this.menu[this.active].classList.remove('active');
        this.menu[target_in].classList.add('active');

        if(this.fundortSetup == false && target_in == 2)
            this.fundortSetup = setUpImage();

        anime({
            targets: this.slides[this.active],
            duration: 500,
            opacity: [1, 0],
            easing: 'easeOutQuad',
            complete: (el) => {
                el.animatables[0].target.style.zIndex = -1;
                anime({
                    targets: this.slides[target_in],
                    duration: 500,
                    opacity: [0, 1],
                    easing: 'easeInQuad',
                    begin: (el) => {
                        el.animatables[0].target.style.zIndex = 3;
                    }
                });
            }
        });
        this.active = target_in;
    };

    oncreate(ctrl) {

        this.menu = [   ctrl.dom.querySelector('.rs-menu-stein'),
                        ctrl.dom.querySelector('.rs-menu-geschichte'),
                        ctrl.dom.querySelector('.rs-menu-fundort'),
                        ctrl.dom.querySelector('.rs-menu-geologie')];
        this.slides = [ ctrl.attrs.stein,
                        ctrl.attrs.geschichte,
                        ctrl.attrs.fundort,
                        ctrl.attrs.geologie];

        this.menu.forEach((item, idx) => {
            item.addEventListener('click', (e) => {
                this.switchIt(idx, e);
            })
        })

        ctrl.dom.querySelector('.rs-menu-next').addEventListener('click', (e) => {
            let next = this.active + 1 < this.menu.length ? this.active + 1 : 0;
            this.switchIt(next, e); 
        });
    };

    view() {
        return(
            <div class="rs-footer">
                <div class="rs-menu-next" style="cursor: pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" preserveAspectRatio="none">
                        <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/>
                    </svg>
                </div>
                <h4 class="active rs-menu-stein">Stein</h4> 
                <h4 class="rs-menu-geschichte">Geschichte</h4> 
                <h4 class="rs-menu-fundort">Fundort</h4> 
                <h4 class="rs-menu-geologie">Geologie</h4>
            </div>
        )
    };
}



// ********** helper function to make fundort image cover fullscreen ************************
var setUpImage = function() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    // make the image fill the whole viewport
    let slide = document.querySelector('.rs-fundort');
    slide.style.width = vw*1.05 + "px";
    let slide_rect = slide.getBoundingClientRect();
    if(slide_rect.height < vh){
        slide.style.width = 'auto';
        slide.style.height = vh*1.05 + "px";
        slide_rect = slide.getBoundingClientRect();
    }

    // set up draggable
    const position = { x: -(slide_rect.width - vw) / 2, y: -(slide_rect.height - vh) / 2 }
    slide.style.transform = `translate(${position.x}px, ${position.y}px)`;
    interact('.rs-fundort').draggable({
        listeners: {
            move (event) {
                position.x += event.dx
                position.y += event.dy

                // clamp position
                position.x = Math.min(Math.max(position.x, vw-slide_rect.width), 0);
                position.y = Math.min(Math.max(position.y, vh-slide_rect.height), 0);

                event.target.style.transform =
                    `translate(${position.x}px, ${position.y}px)`;

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
    })
    return true;
}