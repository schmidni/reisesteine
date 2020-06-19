import m from 'mithril';
import SteinMain from './SteinMain.js';
import IndexView from './IndexView.js';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';


export default class FundortIndex {
    constructor (ctrl) {
        this.frame = ctrl.attrs.frame;
        this.map = ctrl.attrs.map;

        this.titles = [];
        if(ctrl.attrs.pushState)
            history.pushState('fundorte', 'Fundorte - Reisesteine', `/${document.documentElement.lang}/fundorte`);
    }

    oncreate (ctrl) {
        ctrl.attrs.frame.navigate('full')
        .then(() => {
            document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('rect'));
            document.querySelector('.rs-close').style.display = "block";
        });

        m.request({
            method: "GET",
            url: `/${document.documentElement.lang}/fundorte/images/all`,
        })
        .then(result => {
            this.titles = result;
        });
    }
    
    onupdate() {
        // init Index View
        this.IndexView = new IndexView('.rs-index', '.rs-fundort-link', this.onPlaceClick, false, this.msnry);

        this.msnry = new Masonry( document.querySelector('.rs-index-fundort'), {
            itemSelector: '.rs-fundort-grid',
            gutter: 0
        });
        imagesLoaded('.rs-fundort-grid').on('progress', (imgLoad, img) => {
            img.img.parentNode.parentNode.classList.remove('is-loading');
            this.msnry.layout();
        });
    }

    onPlaceClick = async (e) => {
        const id = e.target.getAttribute('data-id');

        await this.IndexView.onClickEffect(e);

        document.querySelector('.rs-close').style.display = "none";

        // replace overlay
        this.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', this.frame.calculatePath('full'));

        // load Stein component
        m.mount(document.getElementById('rs-body'), {
            view: () => m(SteinMain, {'id': id, 'map':this.map, 'frame':this.frame, 'pushState': true, 'overview': 'fundorte'}
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
    }

    view () {
        return(
            <div class="rs-index rs-index-fundort">
                { this.titles ? this.titles.map((val, idx) => (
                    <div class="rs-fundort-grid is-loading" key={"img"+idx}>
                        <a class="rs-fundort-link">
                            <img class="rs-fundort" data-id={val[0]} src={'/static/img/steine/' + val[1]}></img>
                        </a>
                    </div>
                )) : "" }

            </div>
        )
    }
}