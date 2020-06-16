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

        this.tl = {};
        this.animateTo = '';
        this.stops = {'stein': 1000, 'geschichte':3000, 'fundort':5000, 'geologie':7000};

        this.startAnimation();
        this.initTimeline();
    }

    goTo (targetStop) {
        if (!(targetStop in this.stops))
            return;

        this.tl.pause();
        this.animateTo = targetStop;
        this.tl.play();
    }

    startAnimation () {
        anime({
            targets: this.coord.children,
            opacity: [0, 1],
            translateX: [40,0],
            translateY: [20,0],
            duration: 1000,
            easing: "easeInOutQuad",
            delay: 1000,
            begin: () => {
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

    checkStop(name) {
        if (this.animateTo == name)
            this.tl.pause();
    }

    initTimeline () {
        this.tl = anime.timeline({
            easing: 'linear',
            duration: 8000,
            autoplay: false,
            loop: true
        });
    
        // Stein Out ********************************
        this.tl.add({
            targets: [this.coord, this.stein],
            translateX: [0, '-100vw'],
            duration: 1000,
            changeBegin: () => {
                this.frame.navigate('leftout');
            },
            changeComplete: (el) => {
                console.log('0');
                el.animatables.forEach(item => item.target.style.zIndex = -1);
            }
        })
        // Geschichte ********************************
        this.tl.add({
            targets: this.geschichte,
            translateX: ['100vw', 0],
            duration: 1000,
            changeBegin: (el) => {
                el.animatables[0].target.style.zIndex = 3;
            }
        }, 1000)
        .add({
            targets: this.fundort,
            translateX: ['145vw', '45vw'],
            height: ['30vh', '30vh'],
            rotate: '-10deg',
            duration: 1000,
            changeBegin: (el) => {
                el.animatables.forEach(item => item.target.style.zIndex = 3);
            },
            changeComplete: () => {
                this.checkStop('geschichte');
            }
        }, 1000);

        // Fundort **************************************
        this.tl.add({
            targets: this.fundort,
            duration: 1000,
            changeBegin: (el) => {
                el.animatables[0].target.style.zIndex = 3;
                console.log('setup')
                setUpImage(this.fundort);
            },
            changeComplete: () => {
                this.checkStop('fundort');
            }
        }, 2050)
        .add({
            targets: this.fundort,
            height: '30vh',
            rotate: '-10deg',
            translate: '45vh',
            duration: 1000,
            changeBegin:() => {
                console.log('asdf')
            }
        }, 3000)

    
        // Geologie **************************************
        this.tl.add({
            targets: [this.fundort, this.geschichte],
            translateX: '-100vw',
            duration: 1000,
            changeComplete: (el) => {
                el.animatables.forEach(item => item.target.style.zIndex = -1);
            }
        }, 4000)
        .add({
            targets: this.geologie,
            translateX: ['100vw', 0],
            duration: 1000,
            changeBegin: (el) => {
                el.animatables.forEach(item => item.target.style.zIndex = 3);
            },
            changeComplete: () => {
                this.checkStop('geologie');
            }
        }, 5000);
    
        // Stein **************************************
        this.tl.add({
            targets: this.geologie,
            translateX: [0, '-100vw'],
            duration: 1000,
            changeComplete: (el) => {
                el.animatables.forEach(item => item.target.style.zIndex = -1); 
            }
        }, 6000)
        .add({
            targets: [this.stein, this.coord],
            translateX: ['100vw',0],
            duration: 1000,
            changeBegin: (el) => {
                el.animatables.forEach(item => item.target.style.zIndex = 3); 
                this.frame.navigate('rightin');
            },
            changeComplete: () => {
                this.checkStop('stein');
            }
        }, 7000);
    }
};


    // setDirection (targetTime) {
    //     let currentTime = this.tl.currentTime;
    //     let dir = 'fw';
    //     if (targetTime > currentTime){
    //         if (currentTime - targetTime + this.tl.duration < targetTime - currentTime)
    //             dir = 'bw';
    //     } else {
    //         if(targetTime - currentTime + this.tl.duration < currentTime - targetTime)
    //             dir = 'bw';
    //     }
    //     if (this.direction != dir){
    //         this.direction = dir;
    //         this.tl.reverse();
    //     }    
    // }

