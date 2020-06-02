import m from 'mithril';
import anime from 'animejs';
import svgFrame from './components/SVGFrame.js';
import worldMap from './components/WorldMap.js';
import reisesteine from './components/reisesteine.js';
import Stein from './components/stein.js';

var frame = new svgFrame(document.querySelector('#map'));
var myMap = new worldMap(document.querySelector('#map'), onMarker, frame);

function onMarker(coords, map, frame, id) {
    document.getElementById('rs-navigation').classList.add('active');
    m.mount(document.getElementById('rs-body'), {view: () => m(Stein, {'id': id, 'map':map, 'frame':frame})});
}

document.querySelector('.rs-close').addEventListener('click', () => {
    m.render(document.getElementById('rs-body'), null);
    frame.navigate('initial');
    document.getElementById('rs-navigation').classList.remove('active');
    document.querySelector('.rs-close').style.display = "none";
})

document.getElementById('rs-reisesteine').addEventListener('click', () => {
    m.render(document.getElementById('rs-body'), null);
    m.mount(document.getElementById('rs-body'), {view: () => m(reisesteine, {'map': myMap, 'frame':frame})});
});
