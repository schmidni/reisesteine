import m from 'mithril';

export default class worldMap {
    constructor(el) {
        this.map = this.init(el);
        this.popup = L.popup();
        this.coordinates = [];
        this.marker = [];
        this.redIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        this.coordinates = this.loadCoordinates(); 
        this.mapCoordinates();


        this.initEvents();
    }

    loadCoordinates = async () => {
        const result = await fetch(`steine/coordinates/all`);
        return result.json();
    }

    mapCoordinates = async () => {
        let coords = await this.coordinates;
        coords.forEach(el => {
        this.marker.push(L.marker(el, {icon: this.redIcon})
                        .addTo(this.map));
        });
    }

    init = (el) => {
        var mymap = L.map(el).setView([30,0], 3);
        this.initMap(mymap);
        return mymap;
    }

    initMap = (mymap) => {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            minZoom: 3,
            id: 'schmidni/ckambjp2k3d9t1il6ylrcbgor',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1Ijoic2NobWlkbmkiLCJhIjoiY2thODNqaWZhMDk1cTMycXdpbTdtMXMwZSJ9.kWgF03PRqN68LpUFC7UAdw'
        }).addTo(mymap);
    }

    onMapClick = (e) => {
        this.popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(this.map);
    }

    initEvents = () => {
        // this.marker.on('mouseover',function(ev) {
        //     ev.target.openPopup();
        //   });
        // this.marker.on('mouseout',function(ev) {
        //     ev.target.closePopup();
        //   });

        // this.map.on('click', this.onMapClick);
    }
}