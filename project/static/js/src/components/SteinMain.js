import m from 'mithril';
import SteinView from './SteinView.js';

export default class SteinMain {

    constructor(ctrl) {
        this.myMap = ctrl.attrs.map;
        this.frame = ctrl.attrs.frame;
        this.info = null;
        this.media = window.matchMedia("(max-width: 960px)")
        
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
        m.render(document.getElementById('rs-info'), m(SteinView, {fadeIn: true, info: this.info, frame: this.frame}));

        // enable CLOSE and NAVIGATION
        frameDone.then(() => {
            document.querySelector('.rs-close').style.display = "block";  
        });
    }

    onremove(ctrl) {
        if(ctrl.attrs.remove)
            ctrl.attrs.remove.remove();

        document.querySelector('#rs-nav-background').classList.remove('active');
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
