import anime from 'animejs';
import DraggableImage from '../util/draggableImage.js'

export default class SteinTimeLine {

    constructor(frame, coord, stein, geschichte, fundort, geologie) {
        this.coord = coord;
        this.stein = stein;
        this.geschichte = geschichte;
        this.fundort = fundort;
        this.geologie = geologie;
        this.frame = frame;

        this.current = 'stein';
        this.fundort_rect = null;
        this.startAnimationCoords();
    }

    async goTo (target) {
        if (this.current == 'stein'){
            this.frame.navigate('full');
        }
        else if (this.current == 'fundort'){
            await this.draggableImage.animateDown();
            this.geschichte.style.width = "auto";
            this.fundort.classList.remove('active');
        }

        if (target == 'stein'){
            await this.panTo('0vw');
            await this.frame.navigate('offset');
            this.current = 'stein';
        }

        else if (target == 'geschichte'){
            await this.panTo('-100vw');
            this.current = 'geschichte';
        }
        
        else if (target == 'fundort'){
            if (this.current != 'geschichte')
                await this.panTo('-100vw');

            await this.rotate(this.fundort, [-10, 0]);
            this.geschichte.style.width = "200vw";

            this.draggableImage = new DraggableImage(this.fundort);
            await this.draggableImage.init();

            this.fundort.classList.add('active');
            this.current = 'fundort';
        }

        else if (target == 'geologie'){
            await this.panTo('-200vw');
            this.current = 'geologie';
        }
        return true;
    }

    panTo (vw) {
        return anime({
            targets: '.rs-content>*',
            translateX: vw,
            translateZ: 0,
            duration: 1500,
            easing: "easeInOutQuad"
        }).finished;
    }

    rotate(target, deg) {
        return anime({
            targets: target,
            rotate: deg,
            duration: 500,
            easing: 'linear'
        }).finished;
    }

    startAnimationCoords () {
        anime({
            targets: [this.coord, this.stein, ".rs-svg"],
            opacity: [0, 1],
            duration: 1000,
            easing: "easeInOutQuad",
            delay: 1000,
            changeBegin: () => {
                this.coord.style.opacity = 1;
            }
        });
    }
};