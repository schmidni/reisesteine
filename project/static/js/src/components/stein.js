import m from 'mithril';
import anime from 'animejs';
import interact from 'interactjs';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function toDegreesMinutesAndSeconds(coordinate) {
    var absolute = Math.abs(coordinate);
    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = Math.round((minutesNotTruncated - minutes)*10 * 60)/10;

    return degrees + "°" + minutes + "'" + seconds + "\"";
}

function convertDMS(lat, lng) {
    let dms = '';
    let dmsCardinal = '';
    if (lat){
        dms = toDegreesMinutesAndSeconds(lat);
        dmsCardinal = lat >= 0 ? "N" : "S";
    }
    if (lng){
        dms = toDegreesMinutesAndSeconds(lng);
        dmsCardinal = lng >= 0 ? "E" : "W";
    }

    return dms + " " + dmsCardinal;
}

export default class Stein {

    constructor(ctrl) {
        this.myMap = ctrl.attrs.map;
        this.frame = ctrl.attrs.frame;
        this.show = "";
        this.info = {};
        this.media = window.matchMedia("(max-width: 960px)")

        // get rock info
        m.request({
            method: "GET",
            url: `/${document.documentElement.lang}/steine/${ctrl.attrs.id}`,
        })
        .then(result => {
            this.info = result;
        });

        // keep from navigating away while loading
        document.getElementById('rs-navigation').style.pointerEvents = 'none';
    }

    onupdate (ctrl) {
        if(this.info == {})
            return;

        if(ctrl.attrs.pushState)
            history.pushState(this.info.id, this.info.gestein + ' - Reisesteine', `/${document.documentElement.lang}/stein/${this.info.id}`);

        document.title = this.info.gestein + ' - Reisesteine';
        // zoom in on location
        if( this.media.matches) {
            this.frame.navigate('mobile');
            this.myMap.flyToOffset([this.info.latitude, this.info.longitude], [0, -this.myMap.map.getSize().y*0.275]);
        } else {
            this.frame.navigate('offset');
            this.myMap.flyToOffset([this.info.latitude, this.info.longitude], [this.myMap.map.getSize().x*0.2, -this.myMap.map.getSize().x*0.05]);
        }

        try {
        // instantiate coordinates
        m.render(ctrl.dom.querySelector('#rs-coordinates'), m(coordinates, {'animateIn': this.animateCoords, 
                                                                            'info': this.info
                                                                        }));   
        }
        catch(err) {
            console.log('Aborted component coords');
        }
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
                try {
                // instantiate content, display close icon and unlock navigation to navigate away
                m.render(document.getElementById('rs-info'), m(content, {fadeIn: true, info: this.info, frame: this.frame}));
                document.querySelector('.rs-close').style.display = "block";
                document.getElementById('rs-navigation').style.pointerEvents = 'auto';
                } catch(err) {
                    console.log('Aborted component info');
                    console.log(err);
                }
            }
        });
    }

    onremove(ctrl) {
        if(ctrl.attrs.remove)
            ctrl.attrs.remove.remove();
        document.getElementById('rs-navigation').style.pointerEvents = 'auto';
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
                    <h3>{convertDMS(ctrl.attrs.info.latitude, null)}</h3>
                    <h3>{convertDMS(null, ctrl.attrs.info.longitude)}</h3>
                    <h2>{ctrl.attrs.info.herkunft}</h2>
                </div>
            );
        }
    };
}

var content = function() {

    var media = window.matchMedia("(max-width: 960px)")

    var drawDashedLine = (target, frame) => {
        let length = target.getTotalLength();
        let dashCount = Math.ceil(length / 40);
        let newDashes = new Array(2*dashCount).join( 20 + " " );
        let dashArray = newDashes + " " + length + " 0";

        var lineDrawing = anime({
            targets: target,
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutQuad',
            duration: 1000,
            begin: function(el, i) {
                target.parentNode.style.opacity = 1;
                target.setAttribute('stroke', "#966e28");
                target.setAttribute('stroke-dasharray', dashArray)
            },
            complete: function() {
                frame.navigate('rightin');
                // frame.navigate('leftout');
            }
          });
    }

    return {   
        oncreate: (ctrl) => {
            if (!media.matches) {
                if (ctrl.attrs.fadeIn){
                    anime({
                        targets: ctrl.dom.querySelector('.rs-bild'),
                        opacity: [0, 1],
                        duration: 2000,
                        easing: "easeInOutQuad"
                    });
                };
                m.render(document.getElementById('rs-rocknav'), m(rocknav, {
                    'stein': ctrl.dom.querySelector('.rs-bild'),
                    'fundort': ctrl.dom.querySelector('.rs-fundort'),
                    'geschichte': ctrl.dom.querySelector('.rs-geschichte'),
                    'geologie': ctrl.dom.querySelector('.rs-geologie') 
                }));
                drawDashedLine(ctrl.dom.querySelector('.rs-geschichte-path'), ctrl.attrs.frame);
            }
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
                <svg class="rs-content-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                    <path class="rs-path rs-geschichte-path" d="M1.51,690.13q3.81-4.54,7.53-9.07l2.49-3c189.07-231.34,202-433.63,425.89-523.17l7.3-2.85q5.44-2.08,11.06-4.07t11.13-3.89l3.71-1.28c562-192.37,896.4,84.33,843.78,229.88l-3,7.25a88.9,88.9,0,0,1-5.68,10.32q-3.13,4.9-6.34,10l-2.11,3.35c-99.7,158.57-246.8,439.69-204.54,644.73l1.69,7.74c.89,3.85,5.17,19.59,6.2,23.38"/>
                    <path class="rs-path rs-path-green" d="M1482.86,805.33c.32,1,.68,2,1.09,3.11l3.33,8.06c14.55,31.75,58.9,92.36,188.62,110.91l4.32.6q6,.79,12.14,1.47t12.14,1.08l8.65.47c75,3,131.58-23,190.28-33.52l4.26-.74q6-1,12.07-1.76"/><path class="b" d="M1474,808.26a9.4,9.4,0,1,1,11.55,6.57A9.4,9.4,0,0,1,1474,808.26Z"/>

                </svg>
                <svg class="rs-content-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                    <path class="rs-path rs-fundort-path" d="M1785.22,1078.54c64-109.43-158.12-276.27,134.76-272.75"/>
                    <path class="rs-path rs-path-green" d="M-.5,896.55c3.8-.48,14.36-1.25,18.14-1.53l7.14-.43c69.21-4.16,126.88,38.7,180.13,77.09,48.32,34.83,95.9,70.23,142.48,107.34"/>
                </svg>
                <svg class="rs-content-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                    <path class="rs-path rs-stein-path" d="M.18,637.05q6,.56,11.76,1.19l3.94.45c406.44,46.93,333.49,398.32,535.29,376.9l7.87-1q5.67-.84,11.64-2.07,5.79-1.18,11.3-2.51l3.62-.89c216.51-54.57,108.72-266.48-47.17-394.6l-5.78-4.7c-3-2.43-6-4.81-9.1-7.17s-6.26-4.88-9.36-7.36L511,592.75c-178-143.9-306.51-386-38.4-453.9l7.88-1.92q5.7-1.34,11.63-2.57t11.7-2.07l4-.53c268.44-32.93,329,563.38,518.6,781.09l5.36,6q4.05,4.43,8.17,8.63t8.46,8.24l2.91,2.67c156,141.4,530.74,158.29,854.37-214.67l5.16-6q3.83-4.47,7.64-9"/>
                    <path class="rs-path rs-path-red" d="M1316.44,247.65c.16-1,.33-2.07.53-3.22l1.65-8.54c8.26-38.93,36.44-124.2,129.44-179l3.76-2.18q5.23-3,10.73-5.83T1474,43.21l8.88-4.11c29.91-13.43,62.14-23.78,95.51-32.17l4.75-1.18q6.18-1.5,12.4-2.94"/>
                    <path class="rs-path rs-path-red" d="M1325.88,248.43a9.4,9.4,0,1,1-8.09-10.55A9.41,9.41,0,0,1,1325.88,248.43Z"/>
                </svg>
                <svg class="rs-content-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                    <path class="rs-path rs-geologie-path" d="M0,821.12q5.85.07,11.64.27l3.79.15c251.54,10.72,425.4,206.24,636,209.72l7.59,0q5.79,0,11.64-.27t11.51-.54l3.66-.22c150.72-9.23,227.67-64,320.11-147.43l5.45-4.93q4.23-3.84,8.51-7.76c2.69-2.46,5.58-5.12,8.65-7.95l2.87-2.64c112.77-104,458.9-431.22,625.9-510.32l7.08-3.25q5.56-2.48,10.83-4.54,5.52-2.16,11-4.16l3.64-1.32c83.31-29.94,154.44-32.74,210.67-33.73l7.75-.13,11.72-.19"/>
                    <path class="rs-path rs-path-blue" d="M1310.47,1.7c45,108.81,52.84,226.37,7.16,329.22"/>
                    <path class="rs-path rs-path-blue" d="M1309.25,326.58a9.4,9.4,0,1,0,12.46-4.65A9.4,9.4,0,0,0,1309.25,326.58Z"/>
                </svg>
            </div>
            )
        }
    }
}

// helper function to make fundort image cover fullscreen
var setUpImage = function() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    
    // make the image fill the whole viewport
    let slide = document.querySelector('.rs-fundort');
    slide.style.width = vw*1.05 + "px";
    let slide_rect = slide.getBoundingClientRect();
    if(slide_rect.height < vh){
        slide.style.width = 'auto';
        slide.style.height = vh*1.05 + "px";
        slide_rect = slide.getBoundingClientRect();
    }

    // set up draggable
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
    return true;
}

var rocknav = function () {
    var active = 0;
    var fundortSetup = false;
    var menu = [];
    var slides = [];

    var switchIt = (target_in, e) => {
        menu[active].classList.remove('active');
        menu[target_in].classList.add('active');

        if(fundortSetup == false && target_in == 2)
            fundortSetup = setUpImage();

        anime({
            targets: slides[active],
            duration: 500,
            opacity: [1, 0],
            easing: 'easeOutQuad',
            complete: (el) => {
                el.animatables[0].target.style.zIndex = -1;
                anime({
                    targets: slides[target_in],
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
        oncreate: () => {

            menu = [        this.dom.querySelector('.rs-menu-stein'),
                            this.dom.querySelector('.rs-menu-geschichte'),
                            this.dom.querySelector('.rs-menu-fundort'),
                            this.dom.querySelector('.rs-menu-geologie')];
            slides = [      this.attrs.stein,
                            this.attrs.geschichte,
                            this.attrs.fundort,
                            this.attrs.geologie];

            menu.forEach((item, idx) => {
                item.addEventListener('click', (e) => {
                    switchIt(idx, e);
                })
            })

            this.dom.querySelector('.rs-menu-next').addEventListener('click', (e) => {
                let next = active + 1 < menu.length ? active + 1 : 0;
                switchIt(next, e); 
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