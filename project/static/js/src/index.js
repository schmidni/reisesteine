import m from 'mithril';
import L from 'leaflet';
import anime from 'animejs';
import svgFrame from './components/SVGFrame.js';
import worldMap from './components/WorldMap.js';
import UserList from './components/UserList.js';

var myMap = new worldMap(document.querySelector('#map'));
var frame = new svgFrame(document.querySelector('#map'));

myMap.marker.on('click', function(){
    myMap.map.flyTo([51.5,-0.09], 13);
    frame.navigate('next');
    // let f = () => {
    //     mymap.panBy([-400,-400]);
    //     mymap.off('moveend', f);
    // }
    // mymap.on('moveend', f);
});


// m.mount(document.getElementById('app'), UserList);
