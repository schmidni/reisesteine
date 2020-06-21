import m from 'mithril';
import anime from 'animejs';
import SteinMain from './SteinMain.js';
import IndexView from './IndexView.js';

export default class SteinIndex {
    constructor (ctrl) {
        this.frame = ctrl.attrs.frame;
        this.map = ctrl.attrs.map;

        this.imgs = [];
        this.media = window.matchMedia("(max-width: 960px)")

        if(ctrl.attrs.pushState) {
            if (document.documentElement.lang == 'de')
                history.pushState('steine', 'Steine - Reisesteine', `/de/steine`);
            else
                history.pushState('steine', 'Stones - Travelstones', `/en/stones`);
        }
    }

    oncreate (ctrl) {
        ctrl.attrs.frame.navigate('full')
        .then(() => {
            document.getElementById('svg-path').setAttribute('d', ctrl.attrs.frame.calculatePath('rect'));
            document.querySelector('.rs-close').style.display = "block";
        });

        m.request({
            method: "GET",
            url: `/de/steine/images/all`,
        })
        .then(result => {
            this.imgs = result;
        });
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

    onupdate () {
        // init Index View with default measurements
        this.IndexView = new IndexView('.rs-index', '.rs-stein-link', this.onRockClick)
    }


    onRockClick = async (e) => {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        // rock id
        const id = e.target.getAttribute('data-id');

        await this.IndexView.onClickEffect(e);

        // stop navigation
        document.querySelector('.rs-close').style.display = "none";

        // replace overlay
        this.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', this.frame.calculatePath('full'));

        // load Stein component
        m.mount(document.getElementById('rs-body'), {
            view: () => m(SteinMain, {  'id': id, 
                                    'map':this.map, 
                                    'frame':this.frame,
                                    // 'remove': e.target,
                                    'pushState': true,
                                    'overview': 'steine'
            })}
        );
    }


    view () {
        return(
            <div class="rs-index rs-index-reisesteine">

                { this.imgs ? this.imgs.map((val, idx) => (
                    <div key={"img"+idx}>
                        <a class="rs-stein-link"><img class="rs-stein" data-id={val[0]} src={'/static/img/steine/' + val[1]}></img></a>
                    </div>
                )) : "" }

            </div>
        )
    }
}