import m from 'mithril';
import svgFrame from './components/SVGFrame.js';
import worldMap from './components/WorldMap.js';
import SteinIndex from './components/SteinIndex.js';
import SteinMain from './components/SteinMain.js';
import debounce from './util/debounce.js';
import Menu from './components/menu.js';

// SVG Frame and Map init ************************************************************************************************************
var frame = new svgFrame(document.querySelector('#map'));
var myMap = new worldMap(document.querySelector('#map'), onMarker, frame);
var menu = new Menu();

function onMarker(map, frame, id) {
    m.mount(document.getElementById('rs-body'), {view: () => m(SteinMain, {'id': id, 'map':map, 'frame':frame, 'pushState': true})});
}


// NAVIGATION *************************************************************************************************************************
// Close Icon
document.querySelector('.rs-close').addEventListener('click', () => {
    closeAll();
    history.pushState('home', 'Reisesteine', '/' + document.documentElement.lang);
});

// Stein Index
// document.getElementById('rs-reisesteine').addEventListener('click', () => {
//     document.getElementById('rs-navigation').classList.remove('active');
//     m.render(document.getElementById('rs-body'), null);
//     m.mount(document.getElementById('rs-body'), {view: () => m(SteinIndex, {'map': myMap, 'frame':frame, 'pushState': true})});
// });


// HISTORY ***************************************************************************************************************************
var id = document.getElementById('rs-body').getAttribute('data-stein');

// check if stone should be rendered
if (id)
    if (id == 'steine')
        m.mount(document.getElementById('rs-body'), {view: () => m(SteinIndex, {'map': myMap, 'frame':frame, 'pushState': false})});
    else
        m.mount(document.getElementById('rs-body'), {view: () => m(SteinMain, {'id': id, 'map':myMap, 'frame':frame, 'pushState': false})});

// POPSTATE: listener
window.addEventListener('popstate', debounce((e) => {
    try {
        navBack(e);
    } catch {
        setTimeout(() => navBack(e), 1000);
    }
}, 1000));

// POPSTATE: router
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


// RESPONSIVE ***************************************************************************************************************************
var breakpoint = 960; // reload site at breakpoint
var lastSize = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
window.addEventListener('resize', debounce(() => { 
    let newSize = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if ((lastSize > breakpoint &&  newSize < breakpoint) || lastSize < breakpoint && newSize > breakpoint){
        window.location.reload(); 
    }
    lastSize = newSize;
},100));


// UTILITY ******************************************************************************************************************************
var closeAll = () => {
    m.render(document.getElementById('rs-body'), null);
    let frameDone = frame.navigate('initial');
    document.querySelector('.rs-close').style.display = "none";
    document.title = 'Home - Reisesteine';
    return frameDone;
}