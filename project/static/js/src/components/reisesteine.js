import m from 'mithril';
import interact from 'interactjs';
import anime from 'animejs';

export default class Reisesteine {
    constructor () {
        this.imgs = [];
    }

    oncreate (ctrl) {
        m.request({
            method: "GET",
            url: "steine/images/all",
        })
        .then(result => {
            this.imgs = result;
        });
    }

    onupdate (ctrl) {
        console.log('update');
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        const ratio = vw / vh;

        let target = document.querySelector('.rs-reisesteine');
        
        let len = target.children.length;

        let len_w = Math.round(Math.sqrt(len*ratio))
        let width =  len_w * 600 + 100;
        let height = Math.ceil(len / len_w) * 600 + 100;

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
            ignoreFrom: '.rs-reisesteine>div>img'
        })
        
        // document.querySelector('.rs-1a').addEventListener('click', (e) => {

        //     const siblings = [...e.target.parentNode.parentNode.children].filter(child => child !== e.target.parentNode);

        //     anime({
        //         targets: siblings,
        //         duration: 500,
        //         opacity: [1, 0],
        //         easing: 'linear'
        //     });

        //     const bb = e.target.getBoundingClientRect();
        //     const tt = vh*0.23;
        //     const th = vw*0.15;
        //     const tw = bb.width*th/bb.height;
        //     const tl = vw*0.2 + ((vw*0.3 - tw)/2);

        //     document.body.appendChild(e.target);
        //     e.target.style.position = 'absolute';
        //     e.target.style.top = bb.top + 'px';
        //     e.target.style.left = bb.left + 'px';
        //     e.target.style.height = bb.height + 'px';
        //     e.target.style.filter = 'drop-shadow(5px 5px 5px #222)';
        //     e.target.style.zIndex = 3;


        //     anime({
        //         targets: e.target,
        //         translateX: tl - bb.left,
        //         translateY: tt - bb.top,
        //         height: th,
        //         width: tw,
        //         duration: 1000,
        //         easing: 'easeInOutQuad'
        //     }).finished.then(() => {
        //         m.render(document.getElementById('rs-content'), m(someFunc2, {remove: e.target}));
        //         document.querySelector('#rs-content').appendChild(e.target);
        //         anime({
        //             targets: e.target,
        //             opacity: [1, 0],
        //             duration: 3000,
        //             delay: 1000
        //         }).finished.then(() => {
        //             e.target.remove();
        //         });
        //     });

        //     frame.navigate('offset');
        //     myMap.map.flyTo([56.124940,12.315705], 8, {duration: 1});
        //     setTimeout(() => {myMap.map.panBy([-myMap.map.getSize().x*0.2, myMap.map.getSize().x*0.05], {duration: 1})}, 1500);
        //     m.render(document.getElementById('rs-footer'), m(someFunc3));
        // })
    }
    view () {
        return(
            <div class="rs-reisesteine">

                { this.imgs ? this.imgs.map((val, idx) => (
                    <div key={"img"+idx} style="cursor: pointer; background-color: rgba(0,0,0,0)!important;">
                        <img class="rs-1a" src={'/static/img/steine/' + val}></img>
                    </div>
                )) : "" }

            </div>
        )
    }
}