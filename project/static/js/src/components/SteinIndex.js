import m from 'mithril';
import anime from 'animejs';
import SteinMain from './SteinMain.js';
import IndexView from './IndexView.js';

export default class SteinIndex {
    constructor (ctrl) {
        this.frame = ctrl.attrs.frame;
        this.map = ctrl.attrs.map;

        this.imgs = [];
        this.media = window.matchMedia("(max-width: 960px)")

        if(ctrl.attrs.pushState)
            history.pushState('steine', 'Steine - Reisesteine', `/${document.documentElement.lang}/steine`);
    }

    oncreate (ctrl) {
        ctrl.attrs.frame.navigate('full')
        .then(() => {
            document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('rect'));
            document.querySelector('.rs-close').style.display = "block";
        });

        m.request({
            method: "GET",
            url: `/${document.documentElement.lang}/steine/images/all`,
        })
        .then(result => {
            this.imgs = result;
        });
    }

    onremove () {
        // replace overlay
        this.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', this.frame.calculatePath('full'));
        // tidy up listeners
        this.IndexView.removeMouseMoveMethod();
        this.IndexView.removeListeners();
        this.IndexView.removeStyle();
    }

    onupdate () {
        // init Index View with default measurements
        this.IndexView = new IndexView('.rs-index', '.rs-stein-link', this.onRockClick)
    }


    onRockClick = (e) => {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        // rock id
        const id = e.target.getAttribute('data-id');

        // stop navigation
        document.querySelector('.rs-close').style.display = "none";
        let parentContainer = document.querySelector('.rs-index-reisesteine');

        // hide all other rocks
        const siblings = [...parentContainer.children].filter(child => child !== e.target.parentNode.parentNode);
        anime({
            targets: siblings,
            duration: 500,
            opacity: [1, 0],
            easing: 'linear'
        });

        // replace overlay
        this.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', this.frame.calculatePath('full'));

        if( !this.media.matches) {
            // current and target measurements
            const bb = e.target.getBoundingClientRect();    // bounding box current rock
            const tt = vh*0.23;                             // target top
            const th = vh*0.40;                             // target height
            const tw = bb.width*th/bb.height;               // target width
            const tl = vw*0.25;                             // target left

            // reparent current image so it doesnt get unmounted, reassign necessary styles
            document.getElementById('rs-body').appendChild(e.target);
            e.target.style.position = 'absolute';
            e.target.style.top = bb.top + 'px';
            e.target.style.left = bb.left + 'px';
            e.target.style.height = bb.height + 'px';
            e.target.style.filter = 'drop-shadow(5px 5px 5px #222)';
            e.target.style.zIndex = 3;

            // load Stein component
            m.mount(document.getElementById('rs-body'), {
                view: () => m(SteinMain, {  'id': id, 
                                        'map':this.map, 
                                        'frame':this.frame,
                                        'remove': e.target,
                                        'pushState': true
                })}
            );

            // move image to new position
            anime({
                targets: e.target,
                translateX: tl - bb.left,
                translateY: tt - bb.top,
                height: th,
                width: tw,
                duration: 1000,
                easing: 'easeInOutQuad'
            }).finished.then(() => {
                // wait and then fade out after new image has loaded
                anime({
                    targets: e.target,
                    opacity: [1, 0],
                    duration: 3000,
                    delay: 4000
                }).finished.then(() => {
                    e.target.remove();
                });
            });
        };
    }


    view () {
        return(
            <div class="rs-index rs-index-reisesteine">

                { this.imgs ? this.imgs.map((val, idx) => (
                    <div key={"img"+idx}>
                        <a class="rs-stein-link"><img class="rs-stein" data-id={val[0]} src={'/static/img/steine/' + val[1]}></img></a>
                    </div>
                )) : "" }

            </div>
        )
    }
}