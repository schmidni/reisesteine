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
    myMap.map.flyTo([51.5,-0.09], 13);
    frame.navigate('next');
    // let f = () => {
    //     mymap.panBy([-400,-400]);
    //     mymap.off('moveend', f);
    // }
    // mymap.on('moveend', f);
});


import SampleComponent from './components/SomeComponent';

var someFunc = function() {
    return {        
        view() {
            return (
                <div>
                    <h2>Congratulations, you made it!</h2>
                    <p>You've spun up your very first Mithril app :-)</p>
                    <SampleComponent test="Hello World"/>
                    {/* {m(UserList, {test: 'helloWorld'})} */}
                    <UserList test="Hello World"/>
                </div>
            );
        },
    };
}

// let myVar = new UserList()

m.mount(document.getElementById('test'), UserList);

m.render(document.querySelector('.test2'), m('div', [m('button', {onclick: () => {User.deleteLast(); m.redraw()}}, 'Delete'),
m('button', {onclick:() => history.pushState(null, null, 'hello')}, 'Push'),
m('button', {onclick:() => m.mount(document.querySelector('#test'), null)}, 'Unmount'),
]));
