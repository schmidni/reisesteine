import m from 'mithril';
import SteinMain from './SteinMain.js';
import IndexView from './IndexView.js';
import 'mdn-polyfills/element.prototype.closest';

export default class GeologieIndex {
    constructor (ctrl) {
        this.frame = ctrl.attrs.frame;
        this.map = ctrl.attrs.map;
        this.IndexView = null;
        this.titles = [];
        if(ctrl.attrs.pushState){
            if (document.documentElement.lang == 'de')
                history.pushState('geologie', 'Geologie - Reisesteine', `/de/geologie`);
            else
                history.pushState('geologie', 'Geology - Travelstones', `/en/geology`);
        }
    }

    oncreate (ctrl) {
        ctrl.attrs.frame.navigate('fullFast')
        .then(() => {
            document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('rect'));
            document.querySelector('#rs-closeAll').style.display = "block";
        });

        m.request({
            method: "GET",
            url: `/de/geologie/all`,
        })
        .then(result => {
            this.titles = result;
        });
    }
    
    onupdate() {
        // init Index View with default measurements
        this.IndexView = new IndexView('.rs-index', '.rs-geologie-link', this.onGeoClick)
    }

    onGeoClick = async (e) => {
        const id = e.target.closest('a').getAttribute('data-id');

        await this.IndexView.onClickEffect(e);

        document.querySelector('#rs-closeAll').style.display = "none";

        // replace overlay
        this.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', this.frame.calculatePath('full'));

        // load Stein component
        m.mount(document.getElementById('rs-body'), {
            view: () => m(SteinMain, {'id': id, 'map':this.map, 'frame':this.frame, 'pushState': true, 'goTo': 'geologie'}
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
                        <a data-id={val[0]} class="rs-geologie-link"><b>{val[1]}</b><br/>{val[2]}, {val[3]}</a>
                    </div>
                )) : "" }

            </div>
        )
    }
}