
export default class worldMap {
    constructor(el) {
        this.map = this.init(el);
        this.popup = L.popup();
        this.marker = L.marker([51.5, -0.09])
                        .bindPopup("<b>Hello world!</b><br>I am a popup.")
                        .addTo(this.map);
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
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1Ijoic2NobWlkbmkiLCJhIjoiY2thODNqaWZhMDk1cTMycXdpbTdtMXMwZSJ9.kWgF03PRqN68LpUFC7UAdw'
        }).addTo(mymap);
    }

    onMapClick = (e) => {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
    }

    initEvents = () => {
        this.marker.on('mouseover',function(ev) {
            ev.target.openPopup();
          });
        this.marker.on('mouseout',function(ev) {
            ev.target.closePopup();
          });

        mymap.on('click', this.onMapClick);
    }
}