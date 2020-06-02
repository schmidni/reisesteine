import m from 'mithril';
import interact from 'interactjs';
import anime from 'animejs';
import Stein from './stein.js';

export default class Reisesteine {
    constructor () {
        this.imgs = [];
    }

    oncreate (ctrl) {

        ctrl.attrs.frame.navigate('full')
        .then(() => {
            document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('rect'));
            document.querySelector('.rs-close').style.display = "block";
        });

        m.request({
            method: "GET",
            url: "steine/images/all",
        })
        .then(result => {
            this.imgs = result;
        });
    }

    onremove (ctrl) {
        // replace overlay
        ctrl.attrs.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('full'));
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
        let width =  len_w * 500 + 400;
        let height = Math.ceil(len / len_w) * 500 + 400;
        target.style.width = width + 'px';

        // center start position of screen
        const position = { x: -(width-vw) / 2, y: -(height-vh) / 2 }
        target.style.transform = `translate(${position.x}px, ${position.y}px)`;

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
                smoothEndDuration: 400
            },
            allowFrom: '.rs-reisesteine',
            ignoreFrom: '.rs-reisesteine>div>img',
            cursorChecker () {
                return null
            }
        })
        
        ctrl.dom.querySelectorAll('.rs-stein').forEach(item => {
            item.addEventListener('click', (e) => {
                // rock id
                const id = e.target.getAttribute('data-id');

                // hide all other rocks
                const siblings = [...e.target.parentNode.parentNode.children].filter(child => child !== e.target.parentNode);
                anime({
                    targets: siblings,
                    duration: 500,
                    opacity: [1, 0],
                    easing: 'linear'
                });

                // replace overlay
                ctrl.attrs.frame.paths.current = 'full';
                document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('full'));

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
                                            'remove': e.target
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
            });
        });
    }

    view () {
        return(
            <div class="rs-reisesteine">

                { this.imgs ? this.imgs.map((val, idx) => (
                    <div key={"img"+idx} style="cursor: pointer; background-color: rgba(0,0,0,0)!important;">
                        <img class="rs-stein" data-id={val[0]} src={'/static/img/steine/' + val[1]}></img>
                    </div>
                )) : "" }

            </div>
        )
    }
}