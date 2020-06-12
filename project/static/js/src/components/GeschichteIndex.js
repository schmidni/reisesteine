import m from 'mithril';
import anime from 'animejs';
import SteinMain from './SteinMain.js';
import IndexView from './IndexView.js';
import {outerSize} from '../util/outerSize.js';

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
        console.log(this.titles)
    }
    onremove () {
        // replace overlay
        this.frame.paths.current = 'full';
        document.getElementById('svg-path').setAttribute('d', this.frame.calculatePath('full'));
        // tidy up listeners
        // this.IndexView.removeMouseMoveMethod();
        // this.IndexView.removeTapListener();
    }

    view () {
        return(
            <div class="rs-index-geschichten">

                { this.titles ? this.titles.map((val, idx) => (
                    <div key={"img"+idx} style="cursor: pointer; background-color: rgba(0,0,0,0)!important;">
                    {val}
                    </div>
                )) : "" }

            </div>
        )
    }
}