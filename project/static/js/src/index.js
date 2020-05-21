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
    myMap.map.flyTo([56.124940,12.315705], 8, {duration: 1});
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
                translateY: myMap.map.getSize().x*0.015,
                duration: 1000,
                easing: "easeInOutQuad",
                delay: anime.stagger(200, {start: 600})
            });
            animatein.finished.then( () => {
                let offset = myMap.map.getSize().x*0.2;
                myMap.map.panBy([-offset, myMap.map.getSize().x*0.05], {duration: 1});
                frame.navigate('offset');
                anime({
                    targets: ctrl.dom,
                    translateX: offset,
                    translateY: -myMap.map.getSize().x*0.05,
                    duration: 1000,
                    easing: "easeOutQuad"
                }).finished.then(() => {
                    m.render(document.getElementById('rs-content'), m(someFunc2));
                    m.render(document.getElementById('rs-footer'), m(someFunc3));
                }); 
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

var someFunc2 = function() {
    return {   
        oncreate: (ctrl) => {
            let offset = myMap.map.getSize().x*0.15;
            anime({
                targets: ctrl.dom,
                opacity: [0, 1],
                duration: 2000,
                easing: "easeInOutQuad"
            });
        },
        view() {
            return (
                <div class="rs-content">
                    <img src="/static/img/steine/Beispiel_1a_Steinaufnahme.png" />
                    <h1>Schwarzes Glitzern</h1>
                </div>
            )
        }
    }
}


var someFunc3 = function () {
    return{
        oncreate: (ctrl) => {
            anime({
                targets: ctrl.dom.querySelector('.rs-path'),
                duration: 2000,
                easing: 'easeInQuad',
                d: 'M0 5 l2000 0'
            })
        },
        view() {
            return(
                <div class="rs-footer">
                    <div> 
                       <svg width="60%" height="10" viewbox="0 0 2000 10" preserveAspectRatio="none">
                           <path class="rs-path" width="100%" height="100%" stroke="#FFF" stroke-width="2" d="m 0 5 L0 0" />
                       </svg>
                       
                       &nbsp;&nbsp;&nbsp;&nbsp;

                    </div> 

                    <div>
                    <svg height="50" width="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path fill="#FFF" d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"/>
                        </svg>
                    </div>

                    <div>

                        <h4 class="active">Stein</h4> <h4>Fundort</h4> <h4>Geschichte</h4> <h4>Geologie</h4>
                    </div>
                </div>
            )
        }
    }
}

// let myVar = new UserList()

// m.mount(document.getElementById('test'), UserList);

// m.render(document.querySelector('.test2'), m('div', [m('button', {onclick: () => {User.deleteLast(); m.redraw()}}, 'Delete'),
// m('button', {onclick:() => history.pushState(null, null, 'hello')}, 'Push'),
// m('button', {onclick:() => m.mount(document.querySelector('#test'), null)}, 'Unmount'),
// ]));
