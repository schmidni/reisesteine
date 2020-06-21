import m from 'mithril';
import svgFrame from './components/SVGFrame.js';
import worldMap from './components/WorldMap.js';
import SteinIndex from './components/SteinIndex.js';
import GeschichteIndex from './components/GeschichteIndex.js';
import GeologieIndex from './components/GeologieIndex.js';
import FundortIndex from './components/FundortIndex.js';
import SteinMain from './components/SteinMain.js';
import debounce from './util/debounce.js';
import Menu from './components/menu.js';
import About from './components/About.js';

// SVG Frame and Map init ************************************************************************************************************
var frame = new svgFrame(document.querySelector('#map'));
var myMap = new worldMap(document.querySelector('#map'), frame, data_index);

// NAVIGATION *************************************************************************************************************************
// Close Icon
document.querySelector('.rs-close').addEventListener('click', () => {
    closeAll();
    history.pushState('home', 'Reisesteine', '/' + document.documentElement.lang);
});


// HISTORY ***************************************************************************************************************************
var id = document.getElementById('rs-body').getAttribute('data-stein');
let showTitle = id ? false : true;

var menu = new Menu(myMap, frame, showTitle);

// check if stone should be rendered
if (id)
    if (id == 'steine')
        m.mount(document.getElementById('rs-body'), {view: () => m(SteinIndex, {'map': myMap, 'frame':frame, 'pushState': false})});
    else if (id == 'geschichten')
        m.mount(document.getElementById('rs-body'), {view: () => m(GeschichteIndex, {'map': myMap, 'frame':frame, 'pushState': false})});
    else if (id == 'geologie')
        m.mount(document.getElementById('rs-body'), {view: () => m(GeologieIndex, {'map': myMap, 'frame':frame, 'pushState': false})});
    else if (id == 'fundorte')
        m.mount(document.getElementById('rs-body'), {view: () => m(FundortIndex, {'map': myMap, 'frame':frame, 'pushState': false})});
    else if (id == 'about')
        m.mount(document.getElementById('rs-body'), {view: () => m(About, {'map': myMap, 'frame':frame})})
    else
        m.mount(document.getElementById('rs-body'), {view: () => m(SteinMain, {'id': id, 'map':myMap, 'frame':frame, 'data': data_stein, 'pushState': false})});

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
        console.log(e.state);
        console.log(e.state != null);
        // site was home
        if (e.state == 'home')
            return;
        else if ( e.state == 'steine' || (e.state == null && id == 'steine'))
            m.mount(document.getElementById('rs-body'), {view: () => m(SteinIndex, {'map': myMap, 'frame':frame, 'pushState': false})});
        else if ( e.state == 'geschichten' ||(e.state == null && id == 'geschichten'))
            m.mount(document.getElementById('rs-body'), {view: () => m(GeschichteIndex, {'map': myMap, 'frame':frame, 'pushState': false})});
        else if ( e.state == 'fundorte' || (e.state == null && id == 'fundorte'))
            m.mount(document.getElementById('rs-body'), {view: () => m(FundortIndex, {'map': myMap, 'frame':frame, 'pushState': false})});
        else if ( e.state == 'geologie' || (e.state == null && id == 'geologie'))
            m.mount(document.getElementById('rs-body'), {view: () => m(GeologieIndex, {'map': myMap, 'frame':frame, 'pushState': false})});
        // render rock state there is any
        else if ( e.state != null )
            m.mount(document.getElementById('rs-body'), {view: () => m(SteinMain, {'id': e.state, 'map':myMap, 'frame':frame, 'pushState': false})});
        // check id on body node
        else if (id)
            m.mount(document.getElementById('rs-body'), {view: () => m(SteinMain, {'id': id, 'map':myMap, 'frame':frame, 'pushState': false})});
    });
}


// RESPONSIVE ***************************************************************************************************************************
var breakpoint = 1025; // reload site at breakpoint
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