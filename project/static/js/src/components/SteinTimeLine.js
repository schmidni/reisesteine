import anime from 'animejs';

export default class SteinTimeLine {

    constructor(coord, stein, geschichte, fundort, geologie) {
        this.coord = coord;
        this.stein = stein;
        this.geschichte = geschichte;
        this.fundort = fundort;
        this.geologie = geologie;

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
        });
        anime({
            targets: this.stein,
            opacity: [0, 1],
            duration: 1000,
            easing: "easeInQuad",
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
    
        // Geschichte ********************************
        this.tl.add({
            targets: [this.coord, this.stein],
            opacity: [1, 0],
            duration: 1000,
            changeComplete: (el) => {
                console.log('0');
                el.animatables.forEach(item => item.target.style.zIndex = -1);
            }
        })
        .add({
            targets: this.geschichte,
            opacity: [0,1],
            duration: 1000,
            changeBegin: (el) => {
                el.animatables[0].target.style.zIndex = 3;
                console.log('1');
            },
            changeComplete: () => {
                this.checkStop('geschichte');
                console.log('2');
            }
        }, 1000);
    
        // Fundort **************************************
        this.tl.add({
            targets: this.geschichte,
            opacity: [1, 0],
            duration: 1000,
            changeComplete: (el) => {
                el.animatables.forEach(item => item.target.style.zIndex = -1);
                console.log('3');
            }
        }, 2000)
        .add({
            targets: this.fundort,
            opacity: [0,1],
            duration: 1000,
            changeBegin: (el) => {
                el.animatables.forEach(item => item.target.style.zIndex = 3); 
                console.log('4');
            },
            changeComplete: () => {
                this.checkStop('fundort');
                console.log('5');
            }
        }, 3000);
    
        // Geologie **************************************
        this.tl.add({
            targets: this.fundort,
            opacity: [1, 0],
            duration: 1000,
            changeComplete: (el) => {
                el.animatables.forEach(item => item.target.style.zIndex = -1); 
                console.log('6');
            }
        }, 4000)
        .add({
            targets: this.geologie,
            opacity: [0,1],
            duration: 1000,
            changeBegin: (el) => {
                el.animatables.forEach(item => item.target.style.zIndex = 3); 
                console.log('7');
            },
            changeComplete: () => {
                console.log('8');
                this.checkStop('geologie');
            }
        }, 5000);
    
        // Stein **************************************
        this.tl.add({
            targets: this.geologie,
            opacity: [1, 0],
            duration: 1000,
            changeComplete: (el) => {
                console.log('9');
                el.animatables.forEach(item => item.target.style.zIndex = -1); 
            }
        }, 6000)
        .add({
            targets: [this.stein, this.coord],
            opacity: [0,1],
            duration: 1000,
            changeBegin: (el) => {
                el.animatables.forEach(item => item.target.style.zIndex = 3); 
                console.log('10');
            },
            changeComplete: () => {
                this.checkStop('stein');
                console.log('11');
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

