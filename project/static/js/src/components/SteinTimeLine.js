import anime from 'animejs';
import DraggableImage from '../util/draggableImage.js'

export default class SteinTimeLine {

    constructor(frame, coord, stein, geschichte, fundort, geologie, startAt) {
        this.coord = coord;
        this.stein = stein;
        this.geschichte = geschichte;
        this.fundort = fundort;
        this.geologie = geologie;
        this.frame = frame;
        this.draggable = null;
        this.startAt = startAt;
        this.current = startAt;
        this.fundort_rect = null;
        this.closeFundort = document.querySelector('#rs-closeFundort');
        this.closeAll = document.querySelector('#rs-closeAll');
        this.startTimelineAt();
    }

    async goTo (target) {
        if (this.current == 'stein'){
            this.frame.navigate('full');
        }
        else if (this.current == 'fundort'){
            this.closeFundort.style.display = 'none';
            await this.draggableImage.animateDown();
            this.geschichte.style.width = "auto";
            this.fundort.classList.remove('active');
            this.closeAll.style.display = 'block';
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
            this.closeAll.style.display = 'none';
            if (this.current != 'geschichte')
                await this.panTo('-100vw');
            await this.initFundort();
            this.current = 'fundort';
        }

        else if (target == 'geologie'){
            await this.panTo('-200vw');
            this.current = 'geologie';
        }
        return true;
    }

    async initFundort() {
        await this.rotate(this.fundort, [-10, 0]);
        this.geschichte.style.width = "200vw";

        this.draggableImage = new DraggableImage(this.fundort);
        let waitInit = this.draggableImage.init();
        waitInit.then(() => {
            this.fundort.classList.add('active');
            this.closeFundort.style.display = 'block';
        })
        return waitInit;
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

    startPanAt (vw) {
        anime({
            targets: '.rs-content>*',
            translateX: vw,
            translateZ: 0,
            duration: 0,
            easing: "linear"
        }).finished.then(() => {
            document.querySelector('.rs-content').style.opacity = 1;
        });   
    }

    rotate(target, deg) {
        return anime({
            targets: target,
            rotate: deg,
            duration: 500,
            easing: 'linear'
        }).finished;
    }

    startTimelineAt() {
        let targets = [];
        let fun = () => {};
        if(this.startAt == 'stein'){
            targets = [this.coord, this.stein, ".rs-svg"];
            fun = () => {this.startPanAt('0vw');};
        } else if (this.startAt == 'geschichte'){
            targets = [this.geschichte, this.fundort, ".rs-svg"];
            fun = () => {this.startPanAt('-100vw');};
        } else if (this.startAt == 'fundort'){
            targets = [this.geschichte, this.fundort, ".rs-svg"];
            fun = () => {
                this.startPanAt('-100vw');
                this.initFundort();
            }
        } else if (this.startAt == 'geologie') {
            targets = [this.geologie, ".rs-svg"];
            fun = () => {this.startPanAt('-200vw')};
        }

        this.startAnimation(targets, fun);
    }

    startAnimation (targets, fun) {
        anime({
            targets: targets,
            opacity: [0, 1],
            duration: 1000,
            easing: "easeInOutQuad",
            delay: 1000,
            changeBegin: fun
        });
    }
};