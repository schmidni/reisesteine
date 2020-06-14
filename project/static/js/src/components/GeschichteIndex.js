import m from 'mithril';
import SteinMain from './SteinMain.js';
import IndexView from './IndexView.js';

export default class GeschichteIndex {
    constructor (ctrl) {
        this.frame = ctrl.attrs.frame;
        this.map = ctrl.attrs.map;

        this.titles = [];
        if(ctrl.attrs.pushState)
            history.pushState('geschichten', 'Geschichten - Reisesteine', `/${document.documentElement.lang}/geschichten`);
    }

    oncreate (ctrl) {
        ctrl.attrs.frame.navigate('full')
        .then(() => {
            document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('rect'));
            document.querySelector('.rs-close').style.display = "block";
        });

        m.request({
            method: "GET",
            url: `/${document.documentElement.lang}/geschichten/all`,
        })
        .then(result => {
            this.titles = result;
        });
    }
    
    onupdate() {
        // init Index View with default measurements
        this.IndexView = new IndexView('.rs-index', '.rs-geschichten-link', this.onStoryClick)
        
    }

    onStoryClick = (e) => {
        const id = e.target.getAttribute('data-id');

        document.querySelector('.rs-close').style.display = "none";

        // replace overlay
        this.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', this.frame.calculatePath('full'));

        // load Stein component
        m.mount(document.getElementById('rs-body'), {
            view: () => m(SteinMain, {  'id': id, 
                                    'map':this.map, 
                                    'frame':this.frame,
                                    'pushState': true
            })}
        );

    }

    onremove () {
        // replace overlay
        this.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', this.frame.calculatePath('full'));
        // tidy up listeners
        this.IndexView.removeMouseMoveMethod();
        this.IndexView.removeListeners();
    }

    view () {
        return(
            <div class="rs-index rs-index-geschichten">
                { this.titles ? this.titles.map((val, idx) => (
                    <div key={"img"+idx}>
                        <a data-id={val[0]} class="rs-geschichten-link">'{val[1]}'</a>
                    </div>
                )) : "" }

            </div>
        )
    }
}