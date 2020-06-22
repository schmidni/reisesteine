import m from 'mithril';

export default class SteinNavigation {
    constructor() {
        this.active = 0;
        this.menu = [];
        this.slides = [];
        this.SteinLine = null;
        this.navigating = false;
        let navStrings = document.getElementById('rs-nav-rock-strings');
        this.strings = [ 
                            navStrings.getAttribute('data-ste'),
                            navStrings.getAttribute('data-gesch'),
                            navStrings.getAttribute('data-fund'),
                            navStrings.getAttribute('data-geo'),
        ]
    }

    switchIt = async (target_in) => {
        if (this.active == target_in || this.navigating)
            return;

        this.navigating = true;
        this.menu[this.active].classList.remove('active');
        this.menu[target_in].classList.add('active');
        let d = await this.SteinLine.goTo(this.stop[target_in]);
        this.active = target_in;
        this.navigating = false;
    };

    oncreate(ctrl) {
        this.SteinLine = ctrl.attrs.SteinLine;
        this.menu = [   ctrl.dom.querySelector('.rs-menu-stein'),
                        ctrl.dom.querySelector('.rs-menu-geschichte'),
                        ctrl.dom.querySelector('.rs-menu-fundort'),
                        ctrl.dom.querySelector('.rs-menu-geologie')];
        this.stop = [ 'stein', 'geschichte', 'fundort', 'geologie'];

        // timeout so user cant navigate away too quickly
        setTimeout(() => {
            this.menu.forEach((item, idx) => {
                item.addEventListener('click', () => {
                    this.switchIt(idx);
                })
            })
    
            ctrl.dom.querySelector('.rs-menu-next').addEventListener('click', () => {
                let next = this.active + 1 < this.menu.length ? this.active + 1 : 0;
                this.switchIt(next); 
            });

            document.querySelector('.rs-geologie-bild').addEventListener('click', () => {
                this.switchIt(0);
            });

            document.querySelector('.rs-fundort').addEventListener('click', () => {
                this.switchIt(2);
            });

        }, 1000);
    };

    view() {
        return(
            <div class="rs-footer circle">
                <div class="rs-footer-content">
                    <div class="rs-menu-next" style="cursor: pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.29 60.26">
                            <line class="a" y1="30.13" x2="65.04" y2="30.13"/>
                            <line class="a" x1="65.8" y1="30.81" x2="39.38" y2="1.34"/>
                            <line class="a" x1="65.8" y1="29.45" x2="39.38" y2="58.92"/>
                        </svg>
                    </div>
                    <h4 class="active rs-menu-stein">{this.strings[0]}</h4> 
                    <h4 class="rs-menu-geschichte">{this.strings[1]}</h4> 
                    <h4 class="rs-menu-fundort">{this.strings[2]}</h4> 
                    <h4 class="rs-menu-geologie">{this.strings[3]}</h4>
                </div>
            </div>
        )
    };
}



