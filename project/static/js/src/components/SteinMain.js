import m from 'mithril';
import SteinView from './SteinView.js';
import SteinIndex from './SteinIndex.js';
import GeschichteIndex from './GeschichteIndex.js';
import GeologieIndex from './GeologieIndex.js';
import FundortIndex from './FundortIndex.js';

export default class SteinMain {

    constructor(ctrl) {
        this.myMap = ctrl.attrs.map;
        this.frame = ctrl.attrs.frame;
        this.info = null;
        this.media = window.matchMedia("(max-width: 960px)")
        this.refOverview = ctrl.attrs.overview ? ctrl.attrs.overview : null;

        // frontend navigate, request data
        if (!ctrl.attrs.data){
            // API: Rock Info
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

        
        if (this.refOverview) {
            // insert back to overview
            var overview = document.createElement('a');
            overview.id = 'rs-small-uebersicht';
            overview.href = "#";
            overview.innerHTML = `<a id="rs-small-uebersicht" href="#" >
                                    <img src="/static/img/uebersicht_button.svg"/>
                                </a>`
            document.getElementById('rs-small-navigation').appendChild(overview);
            let func = (e) => {return null};

            if (this.refOverview == 'steine') {
                func = (e) => {
                    e.preventDefault();
                    m.render(document.getElementById('rs-body'), null);
                    m.mount(document.getElementById('rs-body'), {view: () => m(SteinIndex, {'map': this.myMap, 'frame':this.frame, 'pushState': true})});
                }
            }
            else if (this.refOverview == 'fundorte'){
                func = (e) => {
                    e.preventDefault();
                    m.render(document.getElementById('rs-body'), null);
                    m.mount(document.getElementById('rs-body'), {view: () => m(FundortIndex, {'map': this.myMap, 'frame':this.frame, 'pushState': true})});
                }
            }
            else if (this.refOverview == 'geologie'){
                func = (e) => {
                    e.preventDefault();
                    m.render(document.getElementById('rs-body'), null);
                    m.mount(document.getElementById('rs-body'), {view: () => m(GeologieIndex, {'map': this.myMap, 'frame':this.frame, 'pushState': true})});
                }
            }
            else if (this.refOverview == 'geschichte'){
                func = (e) => {
                    e.preventDefault();
                    m.render(document.getElementById('rs-body'), null);
                    m.mount(document.getElementById('rs-body'), {view: () => m(GeschichteIndex, {'map': this.myMap, 'frame':this.frame, 'pushState': true})});
                }
            }
            document.getElementById('rs-small-uebersicht').addEventListener('click', func);

        }
    }

    onupdate (ctrl) {
        if(!this.info)
            return;

        // PUSHSTATE
        if(ctrl.attrs.pushState)
            history.pushState(this.info.id, this.info.gestein + ' - Reisesteine', `/${document.documentElement.lang}/stein/${this.info.id}`);
        document.title = this.info.gestein + ' - Reisesteine';

        // keep Close and Navigation disabled during animation
        let frameDone = new Promise(res => {return res()});

        // Zoom in
        if( this.media.matches) {
            frameDone = this.frame.navigate('mobile');
            this.myMap.flyToOffset([this.info.latitude, this.info.longitude], [0, -this.myMap.map.getSize().y*0.275]);
        } else {
            frameDone = this.frame.navigate('offset');
            this.myMap.flyToOffset([this.info.latitude, this.info.longitude], [this.myMap.map.getSize().x*0.2, -this.myMap.map.getSize().x*0.05]);
        }

        // CONTENT
        m.render(document.getElementById('rs-info'), m(SteinView, {fadeIn: true, info: this.info, frame: this.frame, overview: this.refOverview}));

        // enable CLOSE and NAVIGATION
        frameDone.then(() => {
            document.querySelector('.rs-close').style.display = "block";  
        });
    }

    onremove(ctrl) {
        if(ctrl.attrs.remove)
            ctrl.attrs.remove.remove();

        document.querySelector('#rs-nav-background').classList.remove('active');

        try {
            document.querySelector('#rs-small-uebersicht').remove();
         } catch {};
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
