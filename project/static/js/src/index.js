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
    document.querySelector('.rs-close').style.display = "block";
    m.mount(document.getElementById('rs-content'), {view: () => m(Stein, {'id': id, 'map':map, 'frame':frame})});
}




document.querySelector('.rs-close').addEventListener('click', () => {
    frame.navigate('initial');
    m.render(document.getElementById('rs-content'), null);
    document.getElementById('rs-navigation').classList.remove('active');
    document.querySelector('.rs-close').style.display = "none";
})

var removeall = () => {
    document.querySelector('.rs-menu-stein').classList.remove('active');
    document.querySelector('.rs-menu-fundort').classList.remove('active');
    document.querySelector('.rs-menu-geschichte').classList.remove('active');
    document.querySelector('.rs-menu-geologie').classList.remove('active');
}

document.getElementById('rs-reisesteine').addEventListener('click', () => {
    m.render(document.getElementById('rs-content'), null);
    document.querySelector('.rs-close').style.display = "block";
    m.mount(document.getElementById('rs-content'), {view: () => m(reisesteine, {'map': myMap, 'frame':frame})});
});
