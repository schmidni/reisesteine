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
        });

        m.request({
            method: "GET",
            url: "steine/images/all",
        })
        .then(result => {
            this.imgs = result;
        });
    }

    onupdate (ctrl) {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        const ratio = vw / vh;

        let target = document.querySelector('.rs-reisesteine');
        
        let len = target.children.length;

        let len_w = Math.round(Math.sqrt(len*ratio))
        let width =  len_w * 500 + 100;
        let height = Math.ceil(len / len_w) * 500 + 100;

        target.style.width = width + 'px';

        const position = { x: -(width-vw) / 2, y: -(height-vh) / 2 }

        target.style.transform = `translate(${position.x}px, ${position.y}px)`;

        interact('.rs-reisesteine').draggable({
            listeners: {
                move (event) {

                if ((position.x + event.dx) < 200 && (position.x + event.dx) > -(width - vw + 200)){
                    position.x += event.dx
                }
                if ((position.y + event.dy) < 200 && (position.y + event.dy) > -(height - vh + 200)){
                    position.y += event.dy
                }

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

                const siblings = [...e.target.parentNode.parentNode.children].filter(child => child !== e.target.parentNode);
                const id = e.target.getAttribute('data-id');
                anime({
                    targets: siblings,
                    duration: 500,
                    opacity: [1, 0],
                    easing: 'linear'
                });

                const bb = e.target.getBoundingClientRect();
                const tt = vh*0.23;
                const th = vw*0.15;
                const tw = bb.width*th/bb.height;
                const tl = vw*0.2 + ((vw*0.3 - tw)/2);

                document.body.appendChild(e.target);
                e.target.style.position = 'absolute';
                e.target.style.top = bb.top + 'px';
                e.target.style.left = bb.left + 'px';
                e.target.style.height = bb.height + 'px';
                e.target.style.filter = 'drop-shadow(5px 5px 5px #222)';
                e.target.style.zIndex = 3;
                
                document.querySelector('#rs-content').appendChild(e.target);

                m.mount(document.getElementById('rs-content'), {
                    view: () => m(Stein, {  'id': id, 
                                            'map':ctrl.attrs.map, 
                                            'frame':ctrl.attrs.frame,
                                            'zoomTo': 'offset',
                                            'remove': e.target
                    })}
                );
                
                anime({
                    targets: e.target,
                    translateX: tl - bb.left,
                    translateY: tt - bb.top,
                    height: th,
                    width: tw,
                    duration: 1000,
                    easing: 'easeInOutQuad'
                }).finished.then(() => {
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

    onbeforeremove (ctrl) {
        document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('full'));
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