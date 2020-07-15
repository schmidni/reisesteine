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
        
        document.getElementById('svg-path').style.fill = 'rgba(256, 256, 256, 0.9)';

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

        this.flyTo(2);

        this.myMarker = this.myMap.addMarker([47.378600, 8.547214]);

        document.addEventListener('touchmove', this.frameMobileFull);
        document.getElementById('rs-about-wrapper').addEventListener('scroll', this.frameMobileFull);

        frameDone.then(() => {document.querySelector('#rs-closeAll').style.display = "block"});
    }
    
    frameMobileFull = () => {
        document.getElementById('rs-closeAll').style.display = 'none';
        this.frame.navigate('mobilefull').then(() => {
            document.getElementById('rs-closeAll').style.display = 'block';
        });
        document.removeEventListener('touchmove', this.frameMobileFull);
        document.getElementById('rs-about-wrapper').removeEventListener('scroll', this.frameMobileFull);
    }

    onremove() {
        window.removeEventListener('resize', this.keepMarkerCentered);
        document.removeEventListener('touchmove', this.frameMobileFull);
        document.getElementById('rs-about-wrapper').removeEventListener('scroll', this.frameMobileFull);
        document.getElementById('rs-nav-background').classList.remove('active');
        document.getElementById('rs-about-wrapper').remove();
        document.getElementById('svg-path').style.fill = 'rgba(256, 256, 256, 0.7)';
        this.myMap.map.removeLayer(this.myMarker);
    }

    keepMarkerCentered = debounce(() => {
        this.flyTo(0.1);
    }, 500);

    flyTo = (dur) => {
        let h = - (this.myMap.map.getSize().y/2) + (this.myMap.map.getSize().y*0.19) + (this.myMap.map.getSize().x * 0.09);
        if( this.media.matches)
            this.myMap.flyToOffset([47.378600, 8.547214], [0, -this.myMap.map.getSize().y*0.275], 17, dur);
        else
            this.myMap.flyToOffset([47.378600, 8.547214], [this.myMap.map.getSize().x*0.23, h], 17, dur);
    }


    view() {
        return (
            <div>
            </div>
        );
    }
}
