import anime from 'animejs';
import {setUpImage} from '../util/draggableImage.js'

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
            await this.resetFundort(this.fundort_rect);
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
            this.fundort_rect = await setUpImage(this.fundort);
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

    resetFundort (rect) {
        return anime({
            targets: this.fundort,
            translateX: 0,
            translateY: 0,
            rotate: -10,
            width: rect.width,
            height: rect.height,
            duration: 1500,
            easing: 'easeOutQuad'
        }).finished;
    }

    startAnimationCoords () {
        anime({
            targets: this.coord.children,
            opacity: [0, 1],
            translateX: [40,0],
            translateY: [20,0],
            duration: 1000,
            easing: "easeInOutQuad",
            delay: 1000,
            changeBegin: () => {
                this.coord.style.opacity = 1;
            }
        });
        anime({
            targets: this.stein,
            opacity: [0, 1],
            duration: 1000,
            easing: "easeInQuad",
            delay: 1500
        });
    }
};