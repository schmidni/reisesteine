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