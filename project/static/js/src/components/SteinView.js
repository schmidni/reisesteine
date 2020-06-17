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
            this.SteinLine = new SteinTimeLine(ctrl.attrs.frame, this.coordinates, this.bild, this.geschichte, this.fundort, this.geologie);
            m.render(document.getElementById('rs-rocknav'), m(SteinNavigation, { SteinLine: this.SteinLine}));
        } else {
            document.querySelector('.rs-content').addEventListener('touchmove', () => {
                console.log('scroll');
                ctrl.attrs.frame.navigate('mobilefull');
            })
        }
    }

    view(ctrl) {
        return (
        <div class="rs-content">
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
                <img class="rs-fundort" src={"/static/img/steine/" + ctrl.attrs.info.bild_herkunft} />
            </div>
            <div class="rs-geologie rs-text">
                <div class="rs-text">
                    <h1>{ctrl.attrs.info.gestein}</h1>
                    <h3>{ctrl.attrs.info.herkunft}</h3>
                    <p>{ctrl.attrs.info.geo_geschichte}</p>
                </div>
                <img class="rs-geologie-bild" src={"/static/img/steine/" + ctrl.attrs.info.bild_stein} />
            </div>

            <svg class="rs-svg rs-stein-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                <path class="rs-path" d="M682.48,926.89a125.49,125.49,0,0,1-7.87,12.76"/>
                <path class="rs-path" d="M668.47,947.71c-77,93.33-284,83.27-391.75,20.52-87.46-50.92-197.53-210.65-136.39-391C173,480.84,151,306.43,18.67,299.2"/>
                <path class="rs-path" d="M13.6,299c-4.86-.11-9.85,0-15,.35"/>
            </svg>
            
            <svg class="rs-svg rs-stein-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                <path class="rs-path" d="M1913.51,703q-4.8,5.72-9.79,11.36"/>
                <path class="rs-path" d="M1897,721.91C1776.1,854.33,1579.39,961,1509.84,988.77c-190.07,75.87-512.13-143.07-702.12,74.36"/>
                <path class="rs-path" d="M804.42,1067q-4.78,5.64-9.44,11.66"/>
            </svg>

            <svg class="rs-svg rs-stein-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                <path class="rs-path rs-path-green" d="M1462.23,279.1c.92-3.9,2.14-8.8,3.68-14.54"/>
                <path class="rs-path rs-path-green" d="M1468.76,254.38c16.83-58.14,60.35-174.5,152.41-241.54"/>
                <path class="rs-path rs-path-green" d="M1625.48,9.76Q1631.6,5.49,1638,1.5"/>
                <path class="rs-path-dot rs-path-green" d="M1473.39,281a11.28,11.28,0,1,1-8.56-13.46A11.27,11.27,0,0,1,1473.39,281Z"/>
            </svg>

            <svg class="rs-svg rs-geschichte-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">    
                <path class="rs-path" d="M1919.94,769.35q-7.61,0-15,.19"/>
                <path class="rs-path" d="M1895,769.88c-178.35,7.61-264,95-480,96.53-204.77,1.42-187.29-213.6-111.51-462.64,48.38-159-254.83-452.34-848.52-241.88C214.77,247,205.32,451.5,14.17,687.19"/>
                <path class="rs-path" d="M11,691.06q-4.71,5.76-9.57,11.54"/>
            </svg>

            <svg class="rs-svg rs-geschichte-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">    
                <path class="rs-path rs-path-brown" d="M1401.14,307.59c-.25-4-.5-9.12-.63-15"/>
                <path class="rs-path rs-path-brown" d="M1400.41,282.73c.13-38.34,6-99,38.14-137.23,45.62-54.31,92.56-60.52,102.33-125.88"/>
                <path class="rs-path rs-path-brown" d="M1541.53,14.71q.81-7,1.07-15"/>
                <path class="rs-path-dot rs-path-brown" d="M1412.43,306.16a11.28,11.28,0,1,1-12.11-10.39A11.29,11.29,0,0,1,1412.43,306.16Z"/>
            </svg>

            <svg class="rs-svg rs-geologie-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">    
                <path class="rs-path" d="M1920.28,286.18l-15,.22"/>
                <path class="rs-path" d="M1895.2,286.55c-58.19.93-130.48,4-217.37,38C1513.18,389,1123.76,760.46,1021.6,854s-180.91,154.39-349.73,161.12c-218.4,8.7-392.71-244.24-651.52-256.87"/>
                <path class="rs-path" d="M15.31,758q-7.46-.27-15-.27"/>
            </svg>

            <svg class="rs-svg rs-geologie-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">    
                <path class="rs-path rs-path-blue" d="M1464.85,1067.51q-5.62-5.07-10.88-10.33"/>
                <path class="rs-path rs-path-blue" d="M1447,1050c-51.62-55.53-74-126-74.63-216.73"/>
                <path class="rs-path rs-path-blue" d="M1372.38,828.26q0-7.41.21-15"/>
                <path class="rs-path-dot rs-path-blue" d="M1383.94,814.12a11.28,11.28,0,1,0-11.57,11A11.27,11.27,0,0,0,1383.94,814.12Z"/>
            </svg>
        </div>
        )
    }
}