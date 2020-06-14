import m from 'mithril';
import SteinMain from './SteinMain.js';
import IndexView from './IndexView.js';

export default class GeologieIndex {
    constructor (ctrl) {
        this.frame = ctrl.attrs.frame;
        this.map = ctrl.attrs.map;

        this.titles = [];
        if(ctrl.attrs.pushState)
            history.pushState('geologie', 'Geologie - Reisesteine', `/${document.documentElement.lang}/geologie`);
    }

    oncreate (ctrl) {
        ctrl.attrs.frame.navigate('full')
        .then(() => {
            document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('rect'));
            document.querySelector('.rs-close').style.display = "block";
        });

        m.request({
            method: "GET",
            url: `/${document.documentElement.lang}/geologie/all`,
        })
        .then(result => {
            this.titles = result;
        });
    }
    
    onupdate() {
        // init Index View with default measurements
        this.IndexView = new IndexView('.rs-index', '.rs-geologie-link', this.onGeoClick)
    }

    onGeoClick = (e) => {
        const id = e.target.getAttribute('data-id');

        document.querySelector('.rs-close').style.display = "none";

        // replace overlay
        this.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', this.frame.calculatePath('full'));

        // load Stein component
        m.mount(document.getElementById('rs-body'), {
            view: () => m(SteinMain, {'id': id, 'map':this.map, 'frame':this.frame, 'pushState': true}
            )}
        );

    }

    onremove () {
        // replace overlay
        this.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', this.frame.calculatePath('full'));
        // tidy up listeners
        this.IndexView.removeMouseMoveMethod();
        this.IndexView.removeListeners();
        this.IndexView.removeStyle();
    }

    view () {
        return(
            <div class="rs-index rs-index-geologie">
                { this.titles ? this.titles.map((val, idx) => (
                    <div key={"img"+idx}>
                        <a data-id={val[0]} class="rs-geologie-link">'{val[1]},<br/>{val[2]}'</a>
                    </div>
                )) : "" }

            </div>
        )
    }
}