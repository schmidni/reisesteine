import m from 'mithril';
import L from 'leaflet';
import SteinMain from './SteinMain.js';
import {convertDMS} from '../util/convertCoords.js';

export default class worldMap {
    constructor(el, frame, data) {
        this.data = data;
        this.style = 'schmidni/ckambjp2k3d9t1il6ylrcbgor';
        if (document.documentElement.lang == 'en')
            this.style = 'schmidni/ckb3jm18c0nuu1iqshgkbocey';
        this.map = this.init(el);
        this.frame = frame;
        this.popup = L.popup();
        this.coordinates = [];
        this.marker = [];
        this.redIcon = new L.Icon({
            iconUrl: '/static/img/marker.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        this.mapCoordinates();
    }

    mapCoordinates = async () => {
        this.data.forEach(el => {
            let el_coord = [el[1], el[2]];
            let marker = L.marker(el_coord, {icon: this.redIcon})
                            .addTo(this.map)
                            .on('click', () => m.mount(document.getElementById('rs-body'), {view: () => 
                                m(SteinMain, {'id': el[0], 'map':this, 'frame':this.frame, 'pushState': true})
                            }));
            if (!this.media.matches){
                marker.bindTooltip(
                    `<div>
                    ${convertDMS(el[1], null)} <br>
                        ${convertDMS(null, el[2])} <br>
                        ${el[3]} <br>
                        <span>${el[4]}<span>
                        </div>`
                    , {direction:'top', offset:[0,-40], className:'rs-tooltip'});
            }

            this.marker.push(marker);
        });
    }

    addMarker = (el_coord) => {
        return L.marker(el_coord, {icon: this.redIcon})
                            .addTo(this.map)
    }

    flyToOffset = (coords, pos, zoom=8) => {
        var targetPoint = this.map.project(coords, zoom).subtract(pos);
        var targetLatLng = this.map.unproject(targetPoint, zoom);
        this.map.flyTo(targetLatLng, zoom, {duration: 2});
    }

    init = (el) => {
        this.media = window.matchMedia("(max-width: 1025px)")
        var mymap = L.map(el, {zoomSnap: 0.1, zoomControl: !this.media.matches}).setView([30,0], 3).setMaxBounds([[-90, -180],[90, 180]]);
        if(!this.media.matches)
            mymap.zoomControl.setPosition('bottomleft');
        this.initMap(mymap);
        return mymap;
    }

    initMap = (mymap) => {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            minZoom: 3,
            id: this.style,
            tileSize: 512,
            zoomOffset: -1,
            bounds: [
                [-90, -220],
                [90, 220]
            ],
            accessToken: 'pk.eyJ1Ijoic2NobWlkbmkiLCJhIjoiY2thODNqaWZhMDk1cTMycXdpbTdtMXMwZSJ9.kWgF03PRqN68LpUFC7UAdw'
        }).addTo(mymap);
    }
}