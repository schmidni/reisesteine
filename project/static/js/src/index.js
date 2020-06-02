import m from 'mithril';
import svgFrame from './components/SVGFrame.js';
import worldMap from './components/WorldMap.js';
import reisesteine from './components/reisesteine.js';
import Stein from './components/stein.js';

// SVG Frame and Map init
var frame = new svgFrame(document.querySelector('#map'));
var myMap = new worldMap(document.querySelector('#map'), onMarker, frame);

// Stein info
function onMarker(coords, map, frame, id) {
    document.getElementById('rs-navigation').classList.add('active');
    m.mount(document.getElementById('rs-body'), {view: () => m(Stein, {'id': id, 'map':map, 'frame':frame})});
}

window.addEventListener('popstate', function(e) {
    closeAll();
    if ( e.state != null ) {
        m.mount(document.getElementById('rs-body'), {view: () => m(Stein, {'id': e.state, 'map':myMap, 'frame':frame})});
    }
});

// Close icon
document.querySelector('.rs-close').addEventListener('click', () => {
    closeAll();
    history.pushState(null, 'Reisesteine', '/');
})

// Reisesteine navigation
document.getElementById('rs-reisesteine').addEventListener('click', () => {
    document.getElementById('rs-navigation').classList.remove('active');
    m.render(document.getElementById('rs-body'), null);
    m.mount(document.getElementById('rs-body'), {view: () => m(reisesteine, {'map': myMap, 'frame':frame})});
});

// reload on resize at breakpoint since possibly state is broken
var breakpoint = 960;
var lastSize = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
window.addEventListener('resize', function () { 
    let newSize = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if ((lastSize > breakpoint &&  newSize < breakpoint) || lastSize < breakpoint && newSize > breakpoint){
        window.location.reload(); 
    }
    lastSize = newSize;
});

var closeAll = () => {
    m.render(document.getElementById('rs-body'), null);
    frame.navigate('initial');
    document.getElementById('rs-navigation').classList.remove('active');
    document.querySelector('.rs-close').style.display = "none";
    document.getElementById('rs-reisesteine').style.pointerEvents = 'auto';
    document.getElementById('rs-navigation').style.pointerEvents = 'auto';
}