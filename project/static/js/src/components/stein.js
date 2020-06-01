import m from 'mithril';
import anime from 'animejs';
import interact from 'interactjs';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class Stein {

    constructor(ctrl) {
        this.myMap = ctrl.attrs.map;
        this.frame = ctrl.attrs.frame;
        this.show = "";
        this.info = {};

        m.request({
            method: "GET",
            url: `steine/`+ctrl.attrs.id,
        })
        .then(result => {
            this.info = result;
        });
    }

    onupdate (ctrl) {
        if(this.info == {})
            return;

        this.myMap.flyToOffset([this.info.longitude, this.info.latitude]);
        this.frame.navigate('offset');

        m.render(ctrl.dom.querySelector('#rs-coordinates'), m(coordinates, {'animateIn': this.animateCoords, 
                                                                            'info': this.info
                                                                        }));          
    }

    animateCoords = (target) => {
        const animatein = anime({
            targets: target.children,
            opacity: [0,1],
            translateX: [40,0],
            translateY: this.myMap.map.getSize().x*0.015,
            duration: 1000,
            easing: "easeInOutQuad",
            delay: anime.stagger(200, {start: 600}),
            complete: () => {
                m.render(document.getElementById('rs-info'), m(content, {fadeIn: true, info: this.info}));
            }
        });
    }

    onremove(ctrl) {
        if(ctrl.attrs.remove)
            ctrl.attrs.remove.remove();
    }

    view() {
        return (

            <div>
                <div id="rs-coordinates"></div>
                <div id="rs-info"></div>
                <div id="rs-rocknav"></div>
            </div>
        );
    }
}

var coordinates = function() {
    return {        
        oncreate: (ctrl) => {
            ctrl.attrs.animateIn(ctrl.dom);
        },
        view(ctrl) {
            return (
                <div class="rs-coordinates">
                    <h3>{ctrl.attrs.info.longitude}</h3>
                    <h3>{ctrl.attrs.info.latitude}</h3>
                    <h2>{ctrl.attrs.info.herkunft}</h2>
                </div>
            );
        }
    };
}

var content = function() {
    return {   
        oncreate: (ctrl) => {

            m.render(document.getElementById('rs-rocknav'), m(rocknav, {
                'stein': ctrl.dom.querySelector('.rs-bild'),
                'fundort': ctrl.dom.querySelector('.rs-fundort'),
                'geschichte': ctrl.dom.querySelector('.rs-geschichte'),
                'geologie': ctrl.dom.querySelector('.rs-geologie') 
            }));

            if (ctrl.attrs.fadeIn){
                anime({
                    targets: ctrl.dom.querySelector('.rs-bild'),
                    opacity: [0, 1],
                    duration: 2000,
                    easing: "easeInOutQuad"
                });
            };
        },
        view(ctrl) {
            return (
            <div class="rs-content">
                <img class="rs-bild" src={"/static/img/steine/" + ctrl.attrs.info.bild_stein} />
                <img class="rs-fundort" src={"/static/img/steine/" + ctrl.attrs.info.bild_herkunft} />
                <div class="rs-geschichte rs-text">
                    <h1>{ctrl.attrs.info.titel}</h1>
                    <p>{ctrl.attrs.info.pers_geschichte}</p>
                </div>
                <div class="rs-geologie rs-text">
                <h1>{ctrl.attrs.info.gestein}</h1>
                <h3>{ctrl.attrs.info.herkunft}</h3>
                <p>{ctrl.attrs.info.geo_geschichte}</p>
                </div>
            </div>
            )
        }
    }
}

var setUpImage = function() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        
    let slide = document.querySelector('.rs-fundort');
    slide.style.width = vw*1.05 + "px";
    let slide_rect = slide.getBoundingClientRect();

    const position = { x: -(slide_rect.width - vw) / 2, y: -(slide_rect.height - vh) / 2 }

    slide.style.transform = `translate(${position.x}px, ${position.y}px)`;

    interact('.rs-fundort').draggable({
        listeners: {
            move (event) {
                position.x += event.dx
                position.y += event.dy

                // clamp position
                position.x = Math.min(Math.max(position.x, vw-slide_rect.width), 0);
                position.y = Math.min(Math.max(position.y, vh-slide_rect.height), 0);

                event.target.style.transform =
                    `translate(${position.x}px, ${position.y}px)`;

            }
        },
        inertia: {
            resistance: 5,
            minSpeed: 10,
            smoothEndDuration: 400
        },
        cursorChecker () {
            return null
        }
    })
}

var rocknav = function () {
    var active = {};
    var fundortSetup = false;
    var menu = [];
    var slides = [];

    var switchIt = (target_in, e) => {
        e.target.parentNode.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');
        anime({
            targets: active,
            duration: 500,
            opacity: [1, 0],
            easing: 'easeOutQuad',
            complete: (el) => {
                el.animatables[0].target.style.zIndex = -1;
                anime({
                    targets: target_in,
                    duration: 500,
                    opacity: [0, 1],
                    easing: 'easeInQuad',
                    begin: (el) => {
                        el.animatables[0].target.style.zIndex = 3;
                    }
                });
            }
        });
        active = target_in;
    };

    return{
        oncreate: (ctrl) => {

            menu = [        this.dom.querySelector('.rs-menu-stein'),
                            this.dom.querySelector('.rs-menu-geschichte'),
                            this.dom.querySelector('.rs-menu-fundort'),
                            this.dom.querySelector('.rs-menu-geologie')];
            slides = [      this.attrs.stein,
                            this.attrs.geschichte,
                            this.attrs.fundort,
                            this.attrs.geologie];

            active = ctrl.attrs.stein;
            
            menu.forEach((item, idx) => {
                item.addEventListener('click', (e) => {
                    switchIt(slides[idx], e);
                })
            })

            menu[2].addEventListener('click', (e) => {
                fundortSetup ?  null : setUpImage();
                fundortSetup = true;
            });

        },
        view() {
            return(
                <div class="rs-footer">
                    <div class="rs-menu-next" style="cursor: pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" preserveAspectRatio="none">
                            <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/>
                        </svg>
                    </div>
                    <h4 class="active rs-menu-stein">Stein</h4> 
                    <h4 class="rs-menu-geschichte">Geschichte</h4> 
                    <h4 class="rs-menu-fundort">Fundort</h4> 
                    <h4 class="rs-menu-geologie">Geologie</h4>
                </div>
            )
        }
    }
}