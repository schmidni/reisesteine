import m from 'mithril';
import debounce from '../util/debounce.js';
import anime from 'animejs';

export default class About {

    constructor(ctrl) {
        this.myMap = ctrl.attrs.map;
        this.frame = ctrl.attrs.frame;
        this.media = window.matchMedia("(max-width: 1025px)")
        
        document.querySelector('#rs-nav-background').classList.add('active');
        window.addEventListener('resize', this.keepMarkerCentered);
        document.getElementById('rs-small-de').href = '/de/uber-uns';
        document.getElementById('rs-small-en').href = '/en/about';
        document.querySelector('#rs-close').addEventListener('click', () => {
            window.location.href = '/';
        })
        anime({
            targets: '#rs-about-wrapper>*',
            opacity: [0, 1],
            duration: 1000,
            delay: 1000,
            easing: 'linear'
        })
    }

    oncreate (ctrl) {
        let frameDone = new Promise(res => {return res()});

        // Zoom in
        if( this.media.matches)
            frameDone = this.frame.navigate('mobile');
        else
            frameDone = this.frame.navigate('offset');

        this.keepMarkerCentered();
        this.myMap.addMarker([47.378600, 8.547214]);
        document.addEventListener('touchmove', () => {
            this.frame.navigate('mobilefull');
        })
    }
    
    onremove(ctrl) {
        document.querySelector('#rs-nav-background').classList.remove('active');
        window.removeEventListener('resize', this.keepMarkerCentered);
        document.querySelector('#rs-alternating').remove();
    }

    keepMarkerCentered = debounce(() => {
        let h = - (this.myMap.map.getSize().y/2) + (this.myMap.map.getSize().y*0.2) + (this.myMap.map.getSize().x * 0.09);
        if( this.media.matches)
            this.myMap.flyToOffset([47.378600, 8.547214], [0, -this.myMap.map.getSize().y*0.275], 18);
        else
            this.myMap.flyToOffset([47.378600, 8.547214], [this.myMap.map.getSize().x*0.2, h], 18);
    }, 500);

    view() {
        return (
            <div>
            </div>
        );
    }
}
