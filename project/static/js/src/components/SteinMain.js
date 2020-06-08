import m from 'mithril';
import anime from 'animejs';
import {SteinView, Coordinates} from './SteinView.js';


export default class SteinMain {

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
        m.render(ctrl.dom.querySelector('#rs-coordinates'), m(Coordinates, {'animateIn': this.animateCoords, 
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
                m.render(document.getElementById('rs-info'), m(SteinView, {fadeIn: true, info: this.info, frame: this.frame}));
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
