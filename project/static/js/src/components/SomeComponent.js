import m from 'mithril'

export default function() {
    var count = 0; // added a variable

    function ctrl(param) {
        return param;
    }

    return {
        view: function(ctrl) {
            return m('main', [
                m('h1', {
                    class: 'title',
                }, 'My first component'),
            
                // changed the next line
                m('button', {
                    onclick: function() {
                        count++;
                    },
                }, count + ' clicks'),
            ]);
        },
    };
}

var someFunc = function() {
    return {        
        view() {
            return (
                <div id="rs-coordinates">
                    <h3>56.124940 °N</h3>
                    <h3>12.315705°E</h3>
                    <h2>Gilleleje, Dänemark</h2>
                    {/* <SampleComponent test="Hello World"/> */}
                    {/* {m(UserList, {test: 'helloWorld'})} */}
                    <UserList test="Hello World"/>
                </div>
            );
        },
    };
}