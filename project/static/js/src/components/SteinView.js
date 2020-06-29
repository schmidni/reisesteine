import m from 'mithril';
import {convertDMS} from '../util/convertCoords.js';
import SteinNavigation from './SteinNavigation.js';
import SteinTimeLine from './SteinTimeLine';


export default class SteinView {
    constructor () {
        this.media = window.matchMedia("(max-width: 960px)")
    }

    oncreate(ctrl) {
        this.bild = ctrl.dom.querySelector('.rs-bild');
        this.fundort = ctrl.dom.querySelector('.rs-fundort');
        this.geschichte = ctrl.dom.querySelector('.rs-geschichte');
        this.geologie = ctrl.dom.querySelector('.rs-geologie');
        this.coordinates = ctrl.dom.querySelector('.rs-coordinates');

        if (!this.media.matches) {
            this.SteinLine = new SteinTimeLine(ctrl.attrs.frame, this.coordinates, this.bild, this.geschichte, this.fundort, this.geologie, ctrl.attrs.goTo);
            m.render(document.getElementById('rs-rocknav'), m(SteinNavigation, { SteinLine: this.SteinLine, startAt: ctrl.attrs.goTo}));
        } else {
            document.querySelector('.rs-content').addEventListener('touchmove', () => {
                ctrl.attrs.frame.navigate('mobilefull');
            })
        }
    }

    view(ctrl) {
        return (
        <div class="rs-content" style="opacity: 0">
            <div class="rs-coordinates">
                <h3>{convertDMS(ctrl.attrs.info.latitude, null)}</h3>
                <h3>{convertDMS(null, ctrl.attrs.info.longitude)}</h3>
                <h2>{ctrl.attrs.info.herkunft}, <br></br>{ctrl.attrs.info.land}</h2>
            </div>
            <img class="rs-bild" src={"/static/img/steine/" + ctrl.attrs.info.bild_stein} />
            <div class="rs-geschichte">    
                <div class="rs-text">        
                    <h1>{ctrl.attrs.info.titel}</h1>
                    <p>{ctrl.attrs.info.pers_geschichte}</p>
                    <p>{ctrl.attrs.info.absender}, {ctrl.attrs.info.wohnort}</p>
                </div>
                <img style="will-change: transform, width, height" class="rs-fundort" src={"/static/img/steine/" + ctrl.attrs.info.bild_herkunft} />
            </div>
            <div class="rs-geologie rs-text">
                <div class="rs-text">
                    <h1>{ctrl.attrs.info.gestein}</h1>
                    <h3>{ctrl.attrs.info.herkunft}</h3>
                    <p>{ctrl.attrs.info.geo_geschichte}</p>
                </div>
                <img class="rs-geologie-bild" src={"/static/img/steine/" + ctrl.attrs.info.bild_stein} />
            </div>

            <svg class="rs-svg rs-stein-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1000" preserveAspectRatio="none">
                <path class="rs-path" d="M523.74,870.86q-5.06,5.7-10.29,10.91"/>
                <path class="rs-path" d="M506.17,888.71c-103.72,94.67-251.7,53.74-310.26,10.11-76.85-57.26-115.4-188.23-54.25-345,32.74-83.92,13.47-153.29-121.74-159.4"/>
                <path class="rs-path" d="M14.89,394.2Q7.61,394-.1,394"/>
                <path class="rs-path-dot" d="M516.27,865a9.4,9.4,0,1,1,.88,13.26A9.39,9.39,0,0,1,516.27,865Z"/>
            </svg>
            
            <svg class="rs-svg rs-stein-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1000" preserveAspectRatio="none">
                <path class="rs-path" d="M1915.84,676.18q-5.1,5.43-10.37,10.85"/>
                <path class="rs-path" d="M1898.35,694.28c-103.5,104.21-250.93,205.5-306,228.64-151.26,63.55-407-118.61-559.28,59.91"/>
                <path class="rs-path" d="M1029.81,986.72q-4.66,5.7-9.2,11.85"/>
            </svg>

            <svg class="rs-svg rs-stein-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1000" preserveAspectRatio="none">
                <path class="rs-path rs-path-green" d="M1388.27,163.8a145,145,0,0,1,2.11-14.85"/>
                <path class="rs-path rs-path-green" d="M1392.59,139.28C1403.7,96.62,1440.9,25.53,1564.93,1.94"/>
                <path class="rs-path rs-path-green" d="M1569.82,1Q1577-.24,1584.64-1.3"/>
                <path class="rs-path-dot rs-path-green" d="M1397.75,163.81a9.4,9.4,0,1,1-8.91-9.87A9.42,9.42,0,0,1,1397.75,163.81Z"/>
            </svg>

            <svg class="rs-svg rs-geschichte-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1000" preserveAspectRatio="none">    
                <path class="rs-path" d="M1919.5,667.74q-7.61,0-15,.43"/>
                <path class="rs-path" d="M1894.56,669c-178.3,17.61-264,219.9-479.83,221.41C1210,891.79,1227.5,676.84,1303.25,427.88,1351.62,268.94,1048.51-24.29,455,186.09,217.89,270.16,148.73,519.7,15.68,661.33"/>
                <path class="rs-path" d="M12.25,665Q7,670.38,1.68,675.59"/>
            </svg>

            <svg class="rs-svg rs-geschichte-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1000" preserveAspectRatio="none">    
                <path class="rs-path rs-path-brown" d="M1402.71,218.89a59.77,59.77,0,0,1,3.41-14.57"/>
                <path class="rs-path rs-path-brown" d="M1409.71,195.51c5.77-12.52,16-29,33.67-50.14C1489,91,1532,85.26,1541.08,19.85"/>
                <path class="rs-path rs-path-brown" d="M1541.66,15.1c.51-4.68.86-9.65,1-15"/>
                <path class="rs-path-dot rs-path-brown" d="M1412.16,217.85a9.4,9.4,0,1,1-10-8.81A9.4,9.4,0,0,1,1412.16,217.85Z"/>
            </svg>

            <svg class="rs-svg rs-geologie-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1000" preserveAspectRatio="none">    
                <path class="rs-path" d="M1919.69,390.05c-4.73.08-9.74.22-15,.43"/>
                <path class="rs-path" d="M1894.71,390.93c-63.91,3.29-159,15.8-246.5,50.07-164.6,64.46-473,302.46-609.73,392C922.65,908.92,751.63,966.35,582.75,962.69,272.59,956,270,679.62,20.12,665.61"/>
                <path class="rs-path" d="M15.12,665.37q-7.36-.32-15-.31"/>
            </svg>

            <svg class="rs-svg rs-geologie-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1000" preserveAspectRatio="none">    
                <path class="rs-path rs-path-blue" d="M1365.34,996.64q-3.69-6.57-6.73-13.39"/>
                <path class="rs-path rs-path-blue" d="M1354.12,972.12c-9.32-25.67-12.86-54.43-13-88.68"/>
                <path class="rs-path rs-path-blue" d="M1341.15,877.44q.06-7.34.3-15"/>
                <path class="rs-path-dot rs-path-blue" d="M1350.91,863.17a9.4,9.4,0,1,0-9.66,9.14A9.4,9.4,0,0,0,1350.91,863.17Z"/>
            </svg>
        </div>
        )
    }
}