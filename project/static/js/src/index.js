import m from 'mithril';
import svgFrame from './components/SVGFrame.js';
import worldMap from './components/WorldMap.js';
import SteinIndex from './components/SteinIndex.js';
import SteinMain from './components/SteinMain.js';
import debounce from './util/debounce.js';

// SVG Frame and Map init
var frame = new svgFrame(document.querySelector('#map'));
var myMap = new worldMap(document.querySelector('#map'), onMarker, frame);
var id = document.getElementById('rs-body').getAttribute('data-stein');

// check if stone should be rendered
if (id)
    if (id == 'steine')
        m.mount(document.getElementById('rs-body'), {view: () => m(SteinIndex, {'map': myMap, 'frame':frame, 'pushState': false})});
    else
        m.mount(document.getElementById('rs-body'), {view: () => m(SteinMain, {'id': id, 'map':myMap, 'frame':frame, 'pushState': false})});

// Close icon
document.querySelector('.rs-close').addEventListener('click', () => {
    closeAll();
    history.pushState('home', 'Reisesteine', '/'+document.documentElement.lang);
})

// Reisesteine navigation
document.getElementById('rs-reisesteine').addEventListener('click', () => {
    document.getElementById('rs-navigation').classList.remove('active');
    m.render(document.getElementById('rs-body'), null);
    m.mount(document.getElementById('rs-body'), {view: () => m(SteinIndex, {'map': myMap, 'frame':frame, 'pushState': true})});
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

// navigation event listener
window.addEventListener('popstate', debounce((e) => {
    try {
        navBack(e);
    } catch {
        setTimeout(() => navBack(e), 1000);
    }
}, 1000));

var closeAll = () => {
    m.render(document.getElementById('rs-body'), null);
    let frameDone = frame.navigate('initial');
    document.getElementById('rs-navigation').classList.remove('active');
    document.querySelector('.rs-close').style.display = "none";
    document.getElementById('rs-reisesteine').style.pointerEvents = 'auto';
    document.getElementById('rs-navigation').style.pointerEvents = 'auto';
    document.title = 'Home - Reisesteine';
    return frameDone;
}

// Stein info
function onMarker(map, frame, id) {
    document.getElementById('rs-navigation').classList.add('active');
    m.mount(document.getElementById('rs-body'), {view: () => m(SteinMain, {'id': id, 'map':map, 'frame':frame, 'pushState': true})});
}

function navBack(e) {
    closeAll().then(() => {
        // site was home
        if (e.state == 'home')
            return;
        else if ( e.state == 'steine' || id == 'steine')
            m.mount(document.getElementById('rs-body'), {view: () => m(SteinIndex, {'map': myMap, 'frame':frame, 'pushState': false})});
        // render rock state there is any
        else if ( e.state != null )
           m.mount(document.getElementById('rs-body'), {view: () => m(SteinMain, {'id': e.state, 'map':myMap, 'frame':frame, 'pushState': false})});
        // check id on body node
        else if (id)
            m.mount(document.getElementById('rs-body'), {view: () => m(SteinMain, {'id': id, 'map':myMap, 'frame':frame, 'pushState': false})});
    });
}