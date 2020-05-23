import m from 'mithril';
import L from 'leaflet';
import anime from 'animejs';
import svgFrame from './components/SVGFrame.js';
import worldMap from './components/WorldMap.js';
import UserList from './components/UserList.js';
import * as User from './models/User.js';
import interact from 'interactjs';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var myMap = new worldMap(document.querySelector('#map'));
var frame = new svgFrame(document.querySelector('#map'));

myMap.marker.on('click', function(){
    document.getElementById('rs-navigation').classList.add('active');
    document.querySelector('.rs-close').style.display = "block";
    myMap.map.flyTo([56.124940,12.315705], 8, {duration: 1});
    frame.navigate('zoom');
    m.render(document.getElementById('rs-coordinates'), m(someFunc));
});

document.querySelector('.rs-close').addEventListener('click', () => {
    frame.navigate('initial');
    m.render(document.getElementById('rs-content'), null);
    m.render(document.getElementById('rs-coordinates'),null);
    m.render(document.getElementById('rs-footer'), null);
    m.render(document.getElementById('rs-scroll'), null);
    document.getElementById('rs-navigation').classList.remove('active');
})

var someFunc = function() {
    return {        
        oncreate: (ctrl) => {
            const animatein = anime({
                targets: ctrl.dom.children,
                opacity: [0,1],
                translateX: [40,0],
                translateY: myMap.map.getSize().x*0.015,
                duration: 1000,
                easing: "easeInOutQuad",
                delay: anime.stagger(200, {start: 600})
            });
            animatein.finished.then( () => sleep(500).then(() => {
                let offset = myMap.map.getSize().x*0.2;
                myMap.map.panBy([-offset, myMap.map.getSize().x*0.05], {duration: 1});
                frame.navigate('offset');
                anime({
                    targets: ctrl.dom,
                    translateX: offset,
                    translateY: -myMap.map.getSize().x*0.05,
                    duration: 1000,
                    easing: "easeOutQuad"
                }).finished.then(() => {
                    m.render(document.getElementById('rs-content'), m(someFunc2, {fadeIn: true}));
                    m.render(document.getElementById('rs-footer'), m(someFunc3));
                }); 
            }));
        },
        view() {
            return (
                <div class="rs-coordinates">
                    <h3>56.124940 °N</h3>
                    <h3>12.315705 °E</h3>
                    <h2>Gilleleje, Dänemark</h2>
                </div>
            );
        },
    };
}

var someFunc2 = function() {
    return {   
        oncreate: (ctrl) => {
            if (ctrl.attrs.fadeIn){
                anime({
                    targets: ctrl.dom.querySelector('.slide1'),
                    opacity: [0, 1],
                    duration: 2000,
                    easing: "easeInOutQuad"
                });
            }
        },
        onremove: (ctrl) => {
            if (ctrl.attrs.remove) {
                ctrl.attrs.remove.remove();
            }
        },
        view() {
            return (
            <div class="rs-content">
                <div class="slide1">
                    <img src="/static/img/steine/Beispiel_1a_Steinaufnahme.png" />
                    <h1>Schwarzes Glitzern</h1>
                </div>
                <div class="slide2">
                    <img src="/static/img/steine/Beispiel_1b_Naturaufnahme.jpg" />
                </div>
                <div class="slide3">
                    Der Stein ist von einem Strand in Dänemark, aus Gilleleje, ganz im Norden von Seeland, wo ich sehr gerne bin. Ich liebe es, am Strand Steine zu sammeln. Ich suche nach schönen Steinen oder solchen, die eine Form haben, die mich an etwas erinnert: Ein Tier, ein Herz, ein Haus, ganz egal. Damit gestalte ich Bilder, fülle eine Vase oder lege sie einfach aus zum Ansehen.
                </div>
                <div class="slide4">
                Granatamphibolit
                Gilleleje
                Die Amphibole im Granatamphibolit lassen ihn sehr schwarz aussehen und im Licht glitzern. Die kleinen roten Einschlüsse sind Granate. Er stammt ursprünglich nicht aus Dänemark, sondern kommt wahrscheinlich aus Südschweden, wo diese Gesteine unter sehr hohen Temperaturen und Drucken vor vielen Millionen Jahren im Innern der Erde entstanden sind. Während der letzten Eiszeit wurde er dann mit einem Gletscher ins heutige Dänemark transportiert. Durch Abrieb im Gletscher- und Meereswasser erhielt er seine runde Form. 
                </div>
            </div>
            )
        }
    }
}

var removeall = () => {
    document.querySelector('.rs-menu-stein').classList.remove('active');
    document.querySelector('.rs-menu-fundort').classList.remove('active');
    document.querySelector('.rs-menu-geschichte').classList.remove('active');
    document.querySelector('.rs-menu-geologie').classList.remove('active');
}

var someFunc3 = function () {
    return{
        oncreate: (ctrl) => {
            anime({
                targets: ctrl.dom.querySelector('.rs-path'),
                duration: 2000,
                easing: 'easeInQuad',
                d: 'M0 5 l2000 0'
            })
        },
        view() {
            return(
                <div class="rs-footer">
                    <div> 
                       <svg width="60%" height="10" viewbox="0 0 2000 10" preserveAspectRatio="none">
                           <path class="rs-path" width="100%" height="100%" stroke="#FFF" stroke-width="2" d="m 0 5 L0 0" />
                       </svg>
                       
                       &nbsp;&nbsp;&nbsp;&nbsp;

                    </div> 

                    <div>
                    <svg height="50" width="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path fill="#FFF" d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"/>
                        </svg>
                    </div>

                    <div>

                        <h4 class="active rs-menu-stein">Stein</h4> <h4 class="rs-menu-fundort">Fundort</h4> 
                        <h4 class="rs-menu-geschichte">Geschichte</h4> <h4 class="rs-menu-geologie">Geologie</h4>
                    </div>
                </div>
            )
        }
    }
}

// let myVar = new UserList()

// m.mount(document.getElementById('test'), UserList);

// m.render(document.querySelector('.test2'), m('div', [m('button', {onclick: () => {User.deleteLast(); m.redraw()}}, 'Delete'),
// m('button', {onclick:() => history.pushState(null, null, 'hello')}, 'Push'),
// m('button', {onclick:() => m.mount(document.querySelector('#test'), null)}, 'Unmount'),
// ]));



document.getElementById('rs-reisesteine').addEventListener('click', () => {
    m.render(document.getElementById('rs-content'), null);
    m.render(document.getElementById('rs-coordinates'),null);
    m.render(document.getElementById('rs-footer'), null);
    m.render(document.getElementById('rs-scroll'), null);
    document.getElementById('rs-navigation').classList.add('active');
    document.querySelector('.rs-close').style.display = "block";
    frame.navigate('full');
    m.render(document.getElementById('rs-content'), m(someFunc4));
});

var someFunc4 = function () {
    return{
        oncreate: (ctrl) => {
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
                    smoothEndDuration: 500
                },
                allowFrom: '#svg, #svg-path, .rs-reisesteine'
            })
            
            document.querySelector('.rs-1a').addEventListener('click', (e) => {

                const siblings = [...e.target.parentNode.parentNode.children].filter(child => child !== e.target.parentNode);

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


                anime({
                    targets: e.target,
                    translateX: tl - bb.left,
                    translateY: tt - bb.top,
                    height: th,
                    width: tw,
                    duration: 1000,
                    easing: 'easeInOutQuad'
                }).finished.then(() => {
                    m.render(document.getElementById('rs-content'), m(someFunc2, {remove: e.target}));
                    document.querySelector('#rs-content').appendChild(e.target);
                    anime({
                        targets: e.target,
                        opacity: [1, 0],
                        duration: 3000,
                        delay: 1000
                    }).finished.then(() => {
                        e.target.remove();
                    });
                });

                frame.navigate('offset');
                myMap.map.flyTo([56.124940,12.315705], 8, {duration: 1});
                setTimeout(() => {myMap.map.panBy([-myMap.map.getSize().x*0.2, myMap.map.getSize().x*0.05], {duration: 1})}, 1500);
                m.render(document.getElementById('rs-footer'), m(someFunc3));
            })
        },
        view() {
            return(
                <div class="rs-reisesteine">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div style="background-color: rgba(0,0,0,0)!important;"><img class="rs-1a" src="/static/img/steine/Beispiel_1a_Steinaufnahme.png"></img></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            )
        }
    }
};