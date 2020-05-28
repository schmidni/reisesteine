import m from 'mithril';
import anime from 'animejs';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class Stein {

    constructor(ctrl) {
        this.map = ctrl.attrs.map;
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
        console.log('update');
        if(this.info == {}){
        return;}

        m.render(ctrl.dom.querySelector('#rs-coordinates'), m(coordinates, {'animateIn': this.animateCoords, 
                                                                            'info': this.info
                                                                        }));
                                                                        
    }

    animateCoords = (target) => {
        const animatein = anime({
            targets: target.children,
            opacity: [0,1],
            translateX: [40,0],
            translateY: this.map.getSize().x*0.015,
            duration: 1000,
            easing: "easeInOutQuad",
            delay: anime.stagger(200, {start: 600})
        });
        animatein.finished.then( () => sleep(500).then(() => {
            let offset = this.map.getSize().x*0.2;
            this.map.panBy([-offset, this.map.getSize().x*0.05], {duration: 1});
            this.frame.navigate('offset');
            anime({
                targets: target,
                translateX: offset,
                translateY: -this.map.getSize().x*0.05,
                duration: 1000,
                easing: "easeOutQuad"
            }).finished.then(() => {
                m.render(document.getElementById('rs-info'), m(content, {fadeIn: true, info: this.info}));
            }); 
        }));
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
                'stein': ctrl.dom.querySelector('.slide1'),
                'fundort': ctrl.dom.querySelector('.slide2'),
                'geschichte': ctrl.dom.querySelector('.slide3'),
                'geologie': ctrl.dom.querySelector('.slide4') 
            }));

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
        view(ctrl) {
            return (
            <div class="rs-content">
                <div class="slide1">
                    <img src={"/static/img/steine/" + ctrl.attrs.info.bild_stein} />
                    <h1>Schwarzes Glitzern</h1>
                </div>
                <div class="slide2">
                    <img src={"/static/img/steine/" + ctrl.attrs.info.bild_herkunft} />
                </div>
                <div class="slide3">
                    <h2>{ctrl.attrs.info.titel}</h2>
                    <p>{ctrl.attrs.info.pers_geschichte}</p>
                </div>
                <div class="slide4">
                <h2>{ctrl.attrs.info.gestein}</h2>
                <h3>{ctrl.attrs.info.herkunft}</h3>
                <p>{ctrl.attrs.info.geo_geschichte}</p>
                </div>
            </div>
            )
        }
    }
}


var rocknav = function () {
    var active = {};
    var switchIt = (target_in, e) => {
        e.target.parentNode.querySelector('.active').classList.remove('active');
        e.target.classList.add('active')
        anime({
            targets: active,
            duration: 500,
            opacity: [1, 0],
            easing: 'easeOutQuad'
        }).finished.then(() => {
            anime({
                targets: target_in,
                duration: 500,
                opacity: [0, 1],
                easing: 'easeInQuad'
            })
        });
        active = target_in;
    };

    return{
        oncreate: (ctrl) => {
            anime({
                targets: ctrl.dom.querySelector('.rs-path'),
                duration: 2000,
                easing: 'easeInQuad',
                d: 'M0 5 l2000 0'
            });
            active = ctrl.attrs.stein;
            ctrl.dom.querySelector('.rs-menu-stein').addEventListener('click', (e) => switchIt(ctrl.attrs.stein, e));
            ctrl.dom.querySelector('.rs-menu-fundort').addEventListener('click', (e) => switchIt(ctrl.attrs.fundort, e));
            ctrl.dom.querySelector('.rs-menu-geschichte').addEventListener('click', (e) => switchIt(ctrl.attrs.geschichte, e));
            ctrl.dom.querySelector('.rs-menu-geologie').addEventListener('click', (e) => switchIt(ctrl.attrs.geologie, e));
        },
        view() {
            return(
                <div class="rs-footer">
                    <div> 
                       <svg width="60%" height="10" viewbox="0 0 2000 10" preserveAspectRatio="none">
                           <path class="rs-path" width="100%" height="100%" stroke="#000" stroke-width="2" d="m 0 5 L0 0" />
                       </svg>
                       
                       &nbsp;&nbsp;&nbsp;&nbsp;

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