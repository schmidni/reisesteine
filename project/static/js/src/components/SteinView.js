import m from 'mithril';
import anime from 'animejs';
import {convertDMS} from '../util/convertCoords.js';
import SteinNavigation from './SteinNavigation.js';
import SteinTimeLine from './SteinTimeLine';
import GLightbox from 'glightbox';


export default class SteinView {
    constructor () {
        this.media = window.matchMedia("(max-width: 1025px)")
    }

    oncreate(ctrl) {
        this.bild = ctrl.dom.querySelector('.rs-bild');
        this.fundort = ctrl.dom.querySelector('.rs-fundort');
        this.geschichte = ctrl.dom.querySelector('.rs-geschichte');
        this.geologie = ctrl.dom.querySelector('.rs-geologie');
        this.coordinates = ctrl.dom.querySelector('.rs-coordinates');
        this.frame = ctrl.attrs.frame;

        if (!this.media.matches) {
            this.SteinLine = new SteinTimeLine(ctrl.attrs.frame, this.coordinates, this.bild, this.geschichte, this.fundort, this.geologie, ctrl.attrs.goTo);
            m.render(document.getElementById('rs-rocknav'), m(SteinNavigation, { SteinLine: this.SteinLine, startAt: ctrl.attrs.goTo}));
        } else {
            let content = ctrl.dom;
            anime({
                targets: content.children,
                opacity: [0, 1],
                duration: 1000,
                easing: "easeInOutQuad",
                delay: 1000,
                begin: () => {content.style.opacity = 1}
            });

            const lightbox = GLightbox({
                selector: '.rs-bild-lightbox',
                touchNavigation: true
            });
            const lightbox2 = GLightbox({
                selector: '.rs-fundort-lightbox',
                touchNavigation: true
            });
        }
    }

    onremove(ctrl) {
        document.removeEventListener('touchmove', this.frameMobileFull)
    }

    view(ctrl) {
        return (
        <div class="rs-content" style="opacity: 0">
            <div class="rs-coordinates">
                <h3>{convertDMS(ctrl.attrs.info.latitude, null)}</h3>
                <h3>{convertDMS(null, ctrl.attrs.info.longitude)}</h3>
                <h2>{ctrl.attrs.info.herkunft}, <br></br>{ctrl.attrs.info.land}</h2>
            </div>
            <div class="rs-bild-wrapper">
                {!this.media.matches ? 
                    <img class="rs-bild" src={"/static/img/steine/" + ctrl.attrs.info.bild_stein} />
                    :
                    <a href={"/static/img/steine/" + ctrl.attrs.info.bild_stein} class="rs-bild-lightbox">
                        <img class="rs-bild" src={"/static/img/steine/" + ctrl.attrs.info.bild_stein} /> 
                    </a>
                }
            </div>
            <div class="rs-geschichte">    
                <div class="rs-text">        
                    <h1>{ctrl.attrs.info.titel}</h1>
                    <p>{ctrl.attrs.info.pers_geschichte}</p>
                    <p>{ctrl.attrs.info.absender}, {ctrl.attrs.info.wohnort}</p>
                </div>
                {!this.media.matches ? 
                    <img style="will-change: transform, width, height" class="rs-fundort" src={"/static/img/steine/" + ctrl.attrs.info.bild_herkunft} />
                :
                    <a href={"/static/img/steine/" + ctrl.attrs.info.bild_herkunft} class="rs-fundort-lightbox">
                        <img style="will-change: transform, width, height" class="rs-fundort" src={"/static/img/steine/" + ctrl.attrs.info.bild_herkunft} />
                    </a>
                }
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
                <path class="rs-path" d="M326.07,755.48c-5.13.71-10.1,1.16-14.94,1.37"/>
                <path class="rs-path" d="M301.33,756.94c-98.6-2.46-133-108.85-145.69-168.24-17.87-83.42-10.77-183.87-136-193.25"/>
                <path class="rs-path" d="M14.71,395.13q-7.22-.39-15-.39"/>
                <path class="rs-path-dot" d="M323.67,744.42a11.28,11.28,0,1,1-9.28,13A11.28,11.28,0,0,1,323.67,744.42Z"/>
            </svg>
            
            <svg class="rs-svg rs-stein-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1000" preserveAspectRatio="none">
                <path class="rs-path" d="M961.61,883.24c20.8,55.85,203.16,104.48,387,72.46,201-35,275.73-147.12,368-258,89.61-107.68,114,69,202.26-20.15"/>
                <path class="rs-path-dot" d="M950.75,886A11.28,11.28,0,1,1,964,894.84,11.29,11.29,0,0,1,950.75,886Z"/>
            </svg>

            <svg class="rs-svg rs-stein-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1000" preserveAspectRatio="none">
                <path class="rs-path rs-path-green" d="M739.82,1.94c64.26,27.66,84.71,81.8,58.21,165.6"/>
                <path class="rs-path-dot rs-path-green" d="M787.37,163.51a11.28,11.28,0,1,0,14.2-7.27A11.27,11.27,0,0,0,787.37,163.51Z"/>
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