import m from 'mithril';
import interact from 'interactjs';
import anime from 'animejs';
import Stein from './stein.js';


export default class Reisesteine {
    constructor (ctrl) {
        this.imgs = [];
        this.media = window.matchMedia("(max-width: 960px)")
        document.getElementById('rs-reisesteine').style.pointerEvents = 'none';

        if(ctrl.attrs.pushState)
            history.pushState('steine', 'Steine - Reisesteine', `/${document.documentElement.lang}/steine`);

        this.oldx = 0;
        this.oldy = 0;
        this.position = {}
    }

    mousemovemethod (e) {
        this.position.x += (e.pageX-this.oldx)*0.05;
        this.position.y += (e.pageY-this.oldy)*0.05;
        
        this.oldx = e.pageX;
        this.oldy = e.pageY;

        document.querySelector('.rs-reisesteine').style.transform =
        `translate(${this.position.x}px, ${this.position.y}px)`
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

        document.addEventListener('mousemove', (e) => this.mousemovemethod(e), 100);
    }

    onremove (ctrl) {
        // replace overlay
        ctrl.attrs.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('full'));
    }

    outerSize (el, dim) {
        var style = getComputedStyle(el);
        var size = 0;
        if (dim == 'width')
            size += el.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
        else if (dim == 'height')
            size += el.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
        return size;
    }

    onupdate (ctrl) {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        let target = document.querySelector('.rs-reisesteine');

        // amount of rocks to display
        let len = target.children.length;

        // amount of rocks on one row so the aspect ratio of the viewport is kept
        let len_w = Math.round(Math.sqrt(len*(vw / vh)))

        // height and width of the container: x * width of one element + safety
        let width =  len_w * this.outerSize(target.children[1], 'width') + this.outerSize(target.children[1], 'width') -100;
        let height = Math.ceil(len / len_w) * this.outerSize(target.children[1], 'height') + this.outerSize(target.children[1], 'width') -100;
        target.style.width = width + 'px';


        // Add css for alternating rows
        var styles = `
            .rs-reisesteine>div:nth-Child(${len_w*2}n+1) { 
                margin-left: 350px
            }
        `
        var styleSheet = document.createElement("style")
        styleSheet.type = "text/css"
        styleSheet.innerText = styles
        document.head.appendChild(styleSheet)

        // center start position of screen
        this.position = { x: -(width-vw) / 2, y: -(height-vh) / 2 }
        target.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        let position = this.position;

        interact('.rs-reisesteine').draggable({
            listeners: {
                move (event) {
                    position.x += event.dx
                    position.y += event.dy

                    // clamp position
                    position.x = Math.min(Math.max(position.x, vw - width), 0);
                    position.y = Math.min(Math.max(position.y, vh - height), 0);

                event.target.style.transform =
                    `translate(${position.x}px, ${position.y}px)`
                }
            },
            inertia: {
                resistance: 5,
                minSpeed: 10,
                smoothEndDuration: 500
            },
            allowFrom: '.rs-reisesteine',
            cursorChecker () {
                return null
            }
        });

        interact('.rs-stein-link').on('tap', (e) => {
            e.preventDefault();
            // rock id
            const id = e.target.getAttribute('data-id');
            document.getElementById('rs-reisesteine').style.removeProperty('pointer-events');

            document.getElementById('rs-navigation').classList.add('active');
            document.querySelector('.rs-close').style.display = "none";

            // hide all other rocks
            const siblings = [...e.target.parentNode.parentNode.parentNode.children].filter(child => child !== e.target.parentNode.parentNode);
            anime({
                targets: siblings,
                duration: 500,
                opacity: [1, 0],
                easing: 'linear'
            });

            // replace overlay
            ctrl.attrs.frame.paths.current = 'full';
            document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('full'));

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
                    view: () => m(Stein, {  'id': id, 
                                            'map':ctrl.attrs.map, 
                                            'frame':ctrl.attrs.frame,
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
        });
    }

    view () {
        return(
            <div class="rs-reisesteine">

                { this.imgs ? this.imgs.map((val, idx) => (
                    <div key={"img"+idx} style="cursor: pointer; background-color: rgba(0,0,0,0)!important;">
                        <a class="rs-stein-link"><img class="rs-stein" data-id={val[0]} src={'/static/img/steine/' + val[1]}></img></a>
                    </div>
                )) : "" }

            </div>
        )
    }
}