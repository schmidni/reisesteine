import m from 'mithril'
import * as User from '../models/User.js'

export default class UserList {
    constructor(){
        User.loadList();
    }

    view() {
        return (
            <div className="div-list">
                { User.all().map((user) => (
                    <div className="user-list-item"> 
                        {user.firstName + " " + user.lastName}
                    </div>

                ))}
                <button onclick={User.deleteLast}>Delete</button>
                <button onclick={() => history.pushState(null, null, 'hello')}>Push</button>
            </div>
        )
    }
}
