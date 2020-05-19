import m from 'mithril'
import anime from 'animejs'
import * as User from '../models/User.js'

export default class UserList {
    constructor(params){
        User.loadList();
        // console.log(params.attrs.test)
    }

    deleteEntry = () => {
        User.deleteLast();
    }

    onbeforeremove() {
        return new Promise(function(resolve) {
            const animateout = anime({
                targets: '#test',
                opacity: 0,
                duration: 1000
            });
            animateout.finished.then(resolve);
        })
    }

    view(params) {
        return (
            <div className="div-list">
                { User.all().map((user) => (
                    <div className="user-list-item"> 
                        {user.firstName + " " + user.lastName}
                    </div>

                ))}
            </div>
        )
    }
}
