import m from 'mithril';
import SteinView from './SteinView.js';
import debounce from '../util/debounce.js';
// import SteinIndex from './SteinIndex.js';
// import GeschichteIndex from './GeschichteIndex.js';
// import GeologieIndex from './GeologieIndex.js';
// import FundortIndex from './FundortIndex.js';

export default class SteinMain {

    constructor(ctrl) {
        this.myMap = ctrl.attrs.map;
        this.frame = ctrl.attrs.frame;
        this.info = null;
        this.media = window.matchMedia("(max-width: 1025px)")
        this.refOverview = ctrl.attrs.overview ? ctrl.attrs.overview : null;

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

    oncreate (ctrl) {
        // direct navigation, data is already in dom
        if (ctrl.attrs.data) {
            this.info = ctrl.attrs.data;
            this.onupdate(ctrl);
        }
        
        // if (this.refOverview) {
        //     // insert back to overview
        //     var overview = document.createElement('a');
        //     overview.id = 'rs-small-uebersicht';
        //     overview.href = "#";
        //     overview.innerHTML = `<a id="rs-small-uebersicht" href="#" >
        //                             <img src="/static/img/uebersicht_button.svg"/>
        //                         </a>`
        //     document.getElementById('rs-small-navigation').appendChild(overview);
        //     let func = (e) => {return null};

        //     if (this.refOverview == 'steine') {
        //         func = (e) => {
        //             e.preventDefault();
        //             m.render(document.getElementById('rs-body'), null);
        //             m.mount(document.getElementById('rs-body'), {view: () => m(SteinIndex, {'map': this.myMap, 'frame':this.frame, 'pushState': true})});
        //         }
        //     }
        //     else if (this.refOverview == 'fundorte'){
        //         func = (e) => {
        //             e.preventDefault();
        //             m.render(document.getElementById('rs-body'), null);
        //             m.mount(document.getElementById('rs-body'), {view: () => m(FundortIndex, {'map': this.myMap, 'frame':this.frame, 'pushState': true})});
        //         }
        //     }
        //     else if (this.refOverview == 'geologie'){
        //         func = (e) => {
        //             e.preventDefault();
        //             m.render(document.getElementById('rs-body'), null);
        //             m.mount(document.getElementById('rs-body'), {view: () => m(GeologieIndex, {'map': this.myMap, 'frame':this.frame, 'pushState': true})});
        //         }
        //     }
        //     else if (this.refOverview == 'geschichte'){
        //         func = (e) => {
        //             e.preventDefault();
        //             m.render(document.getElementById('rs-body'), null);
        //             m.mount(document.getElementById('rs-body'), {view: () => m(GeschichteIndex, {'map': this.myMap, 'frame':this.frame, 'pushState': true})});
        //         }
        //     }
        //     document.getElementById('rs-small-uebersicht').addEventListener('click', func);
        // }
    }

    // keep marker zoomed to center of circle when resizing
    keepMarkerCentered = debounce(() => {
            let h = - (this.myMap.map.getSize().y/2) + (this.myMap.map.getSize().y*0.2) + (this.myMap.map.getSize().x * 0.09);
            if( this.media.matches)
                this.myMap.flyToOffset([this.info.latitude, this.info.longitude], [0, -this.myMap.map.getSize().y*0.275]);
            else
                this.myMap.flyToOffset([this.info.latitude, this.info.longitude], [this.myMap.map.getSize().x*0.2, h]);
        }, 100);

        
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
        let frameDone = new Promise(res => {return res()});
        if( this.media.matches)
            frameDone = this.frame.navigate('mobile');
        else
            frameDone = this.frame.navigate('offset');
        
        // zoom in
        this.keepMarkerCentered();
        window.addEventListener('resize', this.keepMarkerCentered);

        // CONTENT
        m.render(document.getElementById('rs-info'), m(SteinView, {fadeIn: true, info: this.info, frame: this.frame, overview: this.refOverview, done: frameDone}));

        // enable CLOSE
        frameDone.then(() => {document.querySelector('.rs-close').style.display = "block"});
    }

    onremove(ctrl) {
        if(ctrl.attrs.remove)
            ctrl.attrs.remove.remove();

        document.querySelector('#rs-nav-background').classList.remove('active');
        window.removeEventListener('resize', this.keepMarkerCentered);
        
        document.querySelector("meta[name='description']").setAttribute('content', 'Entdecken Sie in der Ausstellung unsere Steinsammlung, ihre Fundorte und lernen Sie die damit verbundenen persönlichen und geologischen Geschichten kennen.');

        // try {
        //     document.querySelector('#rs-small-uebersicht').remove();
        //  } catch {};
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
