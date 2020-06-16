import anime from 'animejs';
import m from 'mithril';
import {convertDMS} from '../util/convertCoords.js';
import SteinNavigation from './SteinNavigation.js';
import {setUpImage} from '../util/draggableImage.js'
import imagesLoaded from 'imagesloaded';
import SteinTimeLine from './SteinTimeLine';


export default class SteinView {
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
                // frame.navigate('rightin');
                // frame.navigate('leftout');
            }
          });
    }

    oncreate(ctrl) {
        this.bild = ctrl.dom.querySelector('.rs-bild');
        this.fundort = ctrl.dom.querySelector('.rs-fundort');
        this.geschichte = ctrl.dom.querySelector('.rs-geschichte');
        this.geologie = ctrl.dom.querySelector('.rs-geologie');
        this.coordinates = ctrl.dom.querySelector('.rs-coordinates');

        if (!this.media.matches) {
            this.SteinLine = new SteinTimeLine(ctrl.attrs.frame, this.coordinates, this.bild, this.geschichte, this.fundort, this.geologie);

            m.render(document.getElementById('rs-rocknav'), m(SteinNavigation, { SteinLine: this.SteinLine}));
            // imagesLoaded(this.fundort, () => setUpImage(this.fundort));

            // this.drawDashedLine(ctrl.dom.querySelector('.rs-stein-path-in'), ctrl.attrs.frame);
        }
    }

    view(ctrl) {
        return (
        <div class="rs-content">
            <div class="rs-coordinates">
                <h3>{convertDMS(ctrl.attrs.info.latitude, null)}</h3>
                <h3>{convertDMS(null, ctrl.attrs.info.longitude)}</h3>
                <h2>{ctrl.attrs.info.herkunft}</h2>
            </div>
            <img class="rs-bild" src={"/static/img/steine/" + ctrl.attrs.info.bild_stein} />
            <div class="rs-geschichte rs-text">            
                <img class="rs-fundort" src={"/static/img/steine/" + ctrl.attrs.info.bild_herkunft} />
                <h1>{ctrl.attrs.info.titel}</h1>
                <p>{ctrl.attrs.info.pers_geschichte}</p>
            </div>
            <div class="rs-geologie rs-text">
                <h1>{ctrl.attrs.info.gestein}</h1>
                <h3>{ctrl.attrs.info.herkunft}</h3>
                <p>{ctrl.attrs.info.geo_geschichte}</p>
                <img class="rs-geologie-bild" src={"/static/img/steine/" + ctrl.attrs.info.bild_stein} />
            </div>

            {/* <svg class="rs-content-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                <path class="rs-path rs-stein-path-in" d="M865.33,815.86C777,950.1,497.76,939.45,355,856.33c-111.58-65-252-268.74-174-498.79C224.71,228.55,191.65-9.83.17,3"/>
                <path class="rs-path rs-stein-path-in" d="M852,808.75a15,15,0,1,1,5.15,20.63A15,15,0,0,1,852,808.75Z"/>
                <path class="rs-path rs-stein-path-out" d="M1429,1.61c-151.3,180-422.09,327.44-515,364.53C666,465.14,241.86,170.73,2,480.8"/>
            </svg> */}
            
            
            {/* <svg class="rs-content-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                <path class="rs-path rs-geschichte-path" d="M1.51,690.13q3.81-4.54,7.53-9.07l2.49-3c189.07-231.34,202-433.63,425.89-523.17l7.3-2.85q5.44-2.08,11.06-4.07t11.13-3.89l3.71-1.28c562-192.37,896.4,84.33,843.78,229.88l-3,7.25a88.9,88.9,0,0,1-5.68,10.32q-3.13,4.9-6.34,10l-2.11,3.35c-99.7,158.57-246.8,439.69-204.54,644.73l1.69,7.74c.89,3.85,5.17,19.59,6.2,23.38"/>
                <path class="rs-path rs-path-green" d="M1482.86,805.33c.32,1,.68,2,1.09,3.11l3.33,8.06c14.55,31.75,58.9,92.36,188.62,110.91l4.32.6q6,.79,12.14,1.47t12.14,1.08l8.65.47c75,3,131.58-23,190.28-33.52l4.26-.74q6-1,12.07-1.76"/><path class="b" d="M1474,808.26a9.4,9.4,0,1,1,11.55,6.57A9.4,9.4,0,0,1,1474,808.26Z"/>

            </svg>
            <svg class="rs-content-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                <path class="rs-path rs-fundort-path" d="M1785.22,1078.54c64-109.43-158.12-276.27,134.76-272.75"/>
                <path class="rs-path rs-path-green" d="M-.5,896.55c3.8-.48,14.36-1.25,18.14-1.53l7.14-.43c69.21-4.16,126.88,38.7,180.13,77.09,48.32,34.83,95.9,70.23,142.48,107.34"/>
            </svg> */}
            {/* <svg class="rs-content-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                <path class="rs-path rs-geologie-path" d="M0,821.12q5.85.07,11.64.27l3.79.15c251.54,10.72,425.4,206.24,636,209.72l7.59,0q5.79,0,11.64-.27t11.51-.54l3.66-.22c150.72-9.23,227.67-64,320.11-147.43l5.45-4.93q4.23-3.84,8.51-7.76c2.69-2.46,5.58-5.12,8.65-7.95l2.87-2.64c112.77-104,458.9-431.22,625.9-510.32l7.08-3.25q5.56-2.48,10.83-4.54,5.52-2.16,11-4.16l3.64-1.32c83.31-29.94,154.44-32.74,210.67-33.73l7.75-.13,11.72-.19"/>
                <path class="rs-path rs-path-blue" d="M1310.47,1.7c45,108.81,52.84,226.37,7.16,329.22"/>
                <path class="rs-path rs-path-blue" d="M1309.25,326.58a9.4,9.4,0,1,0,12.46-4.65A9.4,9.4,0,0,0,1309.25,326.58Z"/>
            </svg> */}
        </div>
        )
    }
}