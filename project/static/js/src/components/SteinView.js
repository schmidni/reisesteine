import anime from 'animejs';
import m from 'mithril';
import {convertDMS} from '../util/convertCoords.js';
import {SteinNavigation} from './SteinNavigation.js';

export class SteinView {
    constructor () {
        this.media = window.matchMedia("(max-width: 960px)")
    }

    drawDashedLine = (target, frame) => {
        let length = target.getTotalLength();
        let dashCount = Math.ceil(length / 40);
        let newDashes = new Array(2*dashCount).join( 20 + " " );
        let dashArray = newDashes + " " + length + " 0";

        var lineDrawing = anime({
            targets: target,
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutQuad',
            duration: 1000,
            begin: function(el, i) {
                target.parentNode.style.opacity = 1;
                target.setAttribute('stroke', "#966e28");
                target.setAttribute('stroke-dasharray', dashArray)
            },
            complete: function() {
                frame.navigate('rightin');
                // frame.navigate('leftout');
            }
          });
    }

    oncreate(ctrl) {
        if (!this.media.matches) {
            if (ctrl.attrs.fadeIn){
                anime({
                    targets: ctrl.dom.querySelector('.rs-bild'),
                    opacity: [0, 1],
                    duration: 2000,
                    easing: "easeInOutQuad"
                });
            };
            m.render(document.getElementById('rs-rocknav'), m(SteinNavigation, {
                'stein': ctrl.dom.querySelector('.rs-bild'),
                'fundort': ctrl.dom.querySelector('.rs-fundort'),
                'geschichte': ctrl.dom.querySelector('.rs-geschichte'),
                'geologie': ctrl.dom.querySelector('.rs-geologie') 
            }));
            this.drawDashedLine(ctrl.dom.querySelector('.rs-geschichte-path'), ctrl.attrs.frame);
        }
    }

    view(ctrl) {
        return (
        <div class="rs-content">
            <img class="rs-bild" src={"/static/img/steine/" + ctrl.attrs.info.bild_stein} />
            <img class="rs-fundort" src={"/static/img/steine/" + ctrl.attrs.info.bild_herkunft} />
            <div class="rs-geschichte rs-text">
                <h1>{ctrl.attrs.info.titel}</h1>
                <p>{ctrl.attrs.info.pers_geschichte}</p>
            </div>
            <div class="rs-geologie rs-text">
                <h1>{ctrl.attrs.info.gestein}</h1>
                <h3>{ctrl.attrs.info.herkunft}</h3>
                <p>{ctrl.attrs.info.geo_geschichte}</p>
            </div>
            <svg class="rs-content-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                <path class="rs-path rs-geschichte-path" d="M1.51,690.13q3.81-4.54,7.53-9.07l2.49-3c189.07-231.34,202-433.63,425.89-523.17l7.3-2.85q5.44-2.08,11.06-4.07t11.13-3.89l3.71-1.28c562-192.37,896.4,84.33,843.78,229.88l-3,7.25a88.9,88.9,0,0,1-5.68,10.32q-3.13,4.9-6.34,10l-2.11,3.35c-99.7,158.57-246.8,439.69-204.54,644.73l1.69,7.74c.89,3.85,5.17,19.59,6.2,23.38"/>
                <path class="rs-path rs-path-green" d="M1482.86,805.33c.32,1,.68,2,1.09,3.11l3.33,8.06c14.55,31.75,58.9,92.36,188.62,110.91l4.32.6q6,.79,12.14,1.47t12.14,1.08l8.65.47c75,3,131.58-23,190.28-33.52l4.26-.74q6-1,12.07-1.76"/><path class="b" d="M1474,808.26a9.4,9.4,0,1,1,11.55,6.57A9.4,9.4,0,0,1,1474,808.26Z"/>

            </svg>
            <svg class="rs-content-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                <path class="rs-path rs-fundort-path" d="M1785.22,1078.54c64-109.43-158.12-276.27,134.76-272.75"/>
                <path class="rs-path rs-path-green" d="M-.5,896.55c3.8-.48,14.36-1.25,18.14-1.53l7.14-.43c69.21-4.16,126.88,38.7,180.13,77.09,48.32,34.83,95.9,70.23,142.48,107.34"/>
            </svg>
            <svg class="rs-content-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                <path class="rs-path rs-stein-path" d="M.18,637.05q6,.56,11.76,1.19l3.94.45c406.44,46.93,333.49,398.32,535.29,376.9l7.87-1q5.67-.84,11.64-2.07,5.79-1.18,11.3-2.51l3.62-.89c216.51-54.57,108.72-266.48-47.17-394.6l-5.78-4.7c-3-2.43-6-4.81-9.1-7.17s-6.26-4.88-9.36-7.36L511,592.75c-178-143.9-306.51-386-38.4-453.9l7.88-1.92q5.7-1.34,11.63-2.57t11.7-2.07l4-.53c268.44-32.93,329,563.38,518.6,781.09l5.36,6q4.05,4.43,8.17,8.63t8.46,8.24l2.91,2.67c156,141.4,530.74,158.29,854.37-214.67l5.16-6q3.83-4.47,7.64-9"/>
                <path class="rs-path rs-path-red" d="M1316.44,247.65c.16-1,.33-2.07.53-3.22l1.65-8.54c8.26-38.93,36.44-124.2,129.44-179l3.76-2.18q5.23-3,10.73-5.83T1474,43.21l8.88-4.11c29.91-13.43,62.14-23.78,95.51-32.17l4.75-1.18q6.18-1.5,12.4-2.94"/>
                <path class="rs-path rs-path-red" d="M1325.88,248.43a9.4,9.4,0,1,1-8.09-10.55A9.41,9.41,0,0,1,1325.88,248.43Z"/>
            </svg>
            <svg class="rs-content-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                <path class="rs-path rs-geologie-path" d="M0,821.12q5.85.07,11.64.27l3.79.15c251.54,10.72,425.4,206.24,636,209.72l7.59,0q5.79,0,11.64-.27t11.51-.54l3.66-.22c150.72-9.23,227.67-64,320.11-147.43l5.45-4.93q4.23-3.84,8.51-7.76c2.69-2.46,5.58-5.12,8.65-7.95l2.87-2.64c112.77-104,458.9-431.22,625.9-510.32l7.08-3.25q5.56-2.48,10.83-4.54,5.52-2.16,11-4.16l3.64-1.32c83.31-29.94,154.44-32.74,210.67-33.73l7.75-.13,11.72-.19"/>
                <path class="rs-path rs-path-blue" d="M1310.47,1.7c45,108.81,52.84,226.37,7.16,329.22"/>
                <path class="rs-path rs-path-blue" d="M1309.25,326.58a9.4,9.4,0,1,0,12.46-4.65A9.4,9.4,0,0,0,1309.25,326.58Z"/>
            </svg>
        </div>
        )
    }

}

export var Coordinates = function() {
    return {        
        oncreate: (ctrl) => {
            ctrl.attrs.animateIn(ctrl.dom);
        },
        view(ctrl) {
            return (
                <div class="rs-coordinates">
                    <h3>{convertDMS(ctrl.attrs.info.latitude, null)}</h3>
                    <h3>{convertDMS(null, ctrl.attrs.info.longitude)}</h3>
                    <h2>{ctrl.attrs.info.herkunft}</h2>
                </div>
            );
        }
    };
}