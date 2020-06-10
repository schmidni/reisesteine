import m from 'mithril';
import anime from 'animejs';

export class SteinNavigation {
    constructor() {
        this.active = 0;
        this.menu = [];
        this.slides = [];
        this.SteinLine = null;
    }

    switchIt = (target_in) => {
        this.menu[this.active].classList.remove('active');
        this.menu[target_in].classList.add('active');

        this.SteinLine.goTo(this.stop[target_in]);

        this.active = target_in;
    };

    oncreate(ctrl) {
        this.SteinLine = ctrl.attrs.SteinLine;
        this.menu = [   ctrl.dom.querySelector('.rs-menu-stein'),
                        ctrl.dom.querySelector('.rs-menu-geschichte'),
                        ctrl.dom.querySelector('.rs-menu-fundort'),
                        ctrl.dom.querySelector('.rs-menu-geologie')];
        this.stop = [ 'stein', 'geschichte', 'fundort', 'geologie'];

        this.menu.forEach((item, idx) => {
            item.addEventListener('click', () => {
                this.switchIt(idx);
            })
        })

        ctrl.dom.querySelector('.rs-menu-next').addEventListener('click', () => {
            let next = this.active + 1 < this.menu.length ? this.active + 1 : 0;
            this.switchIt(next); 
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



