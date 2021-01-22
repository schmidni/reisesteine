import m from 'mithril';
import SteinMain from './SteinMain.js';
import IndexView from './IndexView.js';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import lazyload from 'lazyload';


export default class FundortIndex {
    constructor (ctrl) {
        this.frame = ctrl.attrs.frame;
        this.map = ctrl.attrs.map;

        this.titles = [];
        if(ctrl.attrs.pushState){
            if (document.documentElement.lang == 'de')
                history.pushState('fundorte', 'Fundorte - Reisesteine', `/de/fundorte`);
            else
                history.pushState('fundorte', 'Places - Travelstones', `/en/places`);
        }
        this.media = window.matchMedia("(max-width: 1025px)");
        this.img_width = 400;
        if (this.media.matches)
            this.img_width = 200;
    }

    oncreate (ctrl) {
        ctrl.attrs.frame.navigate('fullFast')
        .then(() => {
            document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('rect'));
            document.querySelector('#rs-closeAll').style.display = "block";
        });

        m.request({
            method: "GET",
            url: `/de/fundorte/images/all`,
        })
        .then(result => {
            this.titles = result;
            console.log(this.titles)
        });
    }
    
    onupdate() {
        // init Index View
        this.IndexView = new IndexView('.rs-index', '.rs-fundort-link', this.onPlaceClick, false, this.msnry);

        this.msnry = new Masonry( document.querySelector('.rs-index-fundort'), {
            itemSelector: '.rs-fundort-grid',
            gutter: 0
        });
        this.msnry.layout()
        imagesLoaded('.rs-fundort-grid').on('progress', (imgLoad, img) => {
            img.img.parentNode.parentNode.classList.remove('is-loading');
            // this.msnry.layout()
        });
        var ll = new lazyload()
    }

    onPlaceClick = async (e) => {
        const id = e.target.getAttribute('data-id');

        await this.IndexView.onClickEffect(e);

        document.querySelector('#rs-closeAll').style.display = "none";

        // replace overlay
        this.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', this.frame.calculatePath('full'));

        // load Stein component
        m.mount(document.getElementById('rs-body'), {
            view: () => m(SteinMain, {'id': id, 'map':this.map, 'frame':this.frame, 'pushState': true, 'goTo': 'fundort'}
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
        document.querySelector('#rs-nav-background').classList.remove('active');
    }

    view () {
        return(
            <div class="rs-index rs-index-fundort">
                { this.titles ? this.titles.map((val, idx) => (
                    <div class="rs-fundort-grid is-loading" style={'height: ' + val[2]*this.img_width + 'px;'} key={"img"+idx}>
                        <a class="rs-fundort-link">
                            <img class="rs-fundort lazyload" height={val[2]*this.img_width} width="400" data-id={val[0]} data-src={'/static/img/steine/' + val[1]}></img>
                        </a>
                    </div>
                )) : "" }

            </div>
        )
    }
}