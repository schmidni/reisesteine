import m from 'mithril';
import SteinView from './SteinView.js';
import debounce from '../util/debounce.js';

export default class SteinMain {

    constructor(ctrl) {
        this.myMap = ctrl.attrs.map;
        this.frame = ctrl.attrs.frame;
        this.info = null;
        this.media = window.matchMedia("(max-width: 1025px)");
        this.goTo = ctrl.attrs.goTo ? ctrl.attrs.goTo : 'stein';

        // request data
        if (!ctrl.attrs.data){
            m.request({
                method: "GET",
                url: `/${document.documentElement.lang}/steine/${ctrl.attrs.id}`,
            })
            .then(result => {
                this.info = result;
            });
        }

        document.querySelector('#rs-nav-background').classList.add('active');
    }

    frameMobileFull = () => {
        let close = document.getElementById('rs-closeAll');
        close.style.display = 'none';
        this.frame.navigate('mobilefull').then(() => {close.style.display='block'});
        document.removeEventListener('touchmove', this.frameMobileFull);
        document.getElementById('rs-body').removeEventListener('scroll', this.frameMobileFull);
    }

    oncreate (ctrl) {
        // direct navigation, data is already in dom
        if (ctrl.attrs.data) {
            this.info = ctrl.attrs.data;
            this.onupdate(ctrl);
        }
    }

    // keep marker zoomed to center of circle when resizing
    keepMarkerCentered = debounce(() => {
        this.flyTo(0.2);
    }, 100);

    flyTo = (duration) => {
        let h = - (this.myMap.map.getSize().y/2) + (this.myMap.map.getSize().y*0.19) + (this.myMap.map.getSize().x * 0.09);
        if( this.media.matches)
            this.myMap.flyToOffset([this.info.latitude, this.info.longitude], [0, -this.myMap.map.getSize().y*0.275], 8, duration);
        else
            this.myMap.flyToOffset([this.info.latitude, this.info.longitude], [this.myMap.map.getSize().x*0.23, h], 8, duration);
    }

        
    onupdate (ctrl) {
        if(!this.info)
            return;

        // PUSHSTATE
        if(ctrl.attrs.pushState){
            if (document.documentElement.lang == 'de')
                history.pushState(this.info.id, this.info.gestein + ' - Reisesteine', `/de/stein/${this.info.id}`);
            else
                history.pushState(this.info.id, this.info.gestein + ' - Reisesteine', `/en/stone/${this.info.id}`);
        }
        if (document.documentElement.lang == 'de')
            document.title = this.info.gestein + ' - Reisesteine';
        else
            document.title = this.info.gestein + ' - Travelstones';
        

        document.querySelector("meta[name='description']").setAttribute('content', this.info.description);

        // keep Close and Navigation disabled during animation
        let frameDone = new Promise((res, rej) => {return res()});
        if (this.media.matches) {
            frameDone = this.frame.navigate('mobile');
            document.addEventListener('touchmove', this.frameMobileFull);
            document.getElementById('rs-body').addEventListener('scroll', this.frameMobileFull);
        }
        else if (this.goTo == 'stein')
            frameDone = this.frame.navigate('offset');
        
        // zoom in
        this.flyTo(2);
        window.addEventListener('resize', this.keepMarkerCentered);

        // CONTENT
        m.render(document.getElementById('rs-info'), m(SteinView, {fadeIn: true, info: this.info, frame: this.frame, goTo: this.goTo}));

        // enable CLOSE
        if (this.goTo != 'fundort')
            frameDone.then(() => {document.querySelector('#rs-closeAll').style.display = "block"});
    }

    onremove(ctrl) {
        document.querySelector('#rs-nav-background').classList.remove('active');
        window.removeEventListener('resize', this.keepMarkerCentered);
        
        document.querySelector("meta[name='description']").setAttribute('content', 'Entdecken Sie in der Ausstellung unsere Steinsammlung, ihre Fundorte und lernen Sie die damit verbundenen persönlichen und geologischen Geschichten kennen.');

        document.querySelector('#rs-closeFundort').style.display = 'none';

        document.removeEventListener('touchmove', this.frameMobileFull);
        document.getElementById('rs-body').removeEventListener('scroll', this.frameMobileFull);
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
