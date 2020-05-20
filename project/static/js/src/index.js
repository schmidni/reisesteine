import m from 'mithril';
import L from 'leaflet';
import anime from 'animejs';
import svgFrame from './components/SVGFrame.js';
import worldMap from './components/WorldMap.js';
import UserList from './components/UserList.js';
import * as User from './models/User.js';

var myMap = new worldMap(document.querySelector('#map'));
var frame = new svgFrame(document.querySelector('#map'));

myMap.marker.on('click', function(){
    document.getElementById('rs-navigation').classList.add('active');
    myMap.map.flyTo([56.124940,12.315705], 10, {duration: 1});
    frame.navigate('zoom');
    m.render(document.getElementById('rs-coordinates'), m(someFunc));
});

var someFunc = function() {
    return {        
        oncreate: (ctrl) => {
            const animatein = anime({
                targets: ctrl.dom.children,
                opacity: [0,1],
                translateX: [40,0],
                duration: 1000,
                easing: "easeInOutQuad",
                delay: anime.stagger(200, {start: 600})
            });
            animatein.finished.then( () => {
                let offset = myMap.map.getSize().x*0.15;
                myMap.map.panBy([-offset, offset*0.1], {duration: 1});
                anime({
                    targets: ctrl.dom,
                    translateX: offset,
                    duration: 1000,
                    easing: "easeInOutQuad"
                });
                frame.navigate('offset')
            });
        },
        view() {
            return (
                <div class="rs-coordinates">
                    <h3>56.124940 °N</h3>
                    <h3>12.315705 °E</h3>
                    <h2>Gilleleje, Dänemark</h2>
                </div>
            );
        },
    };
}



// let myVar = new UserList()

// m.mount(document.getElementById('test'), UserList);

// m.render(document.querySelector('.test2'), m('div', [m('button', {onclick: () => {User.deleteLast(); m.redraw()}}, 'Delete'),
// m('button', {onclick:() => history.pushState(null, null, 'hello')}, 'Push'),
// m('button', {onclick:() => m.mount(document.querySelector('#test'), null)}, 'Unmount'),
// ]));
