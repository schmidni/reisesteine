import m from 'mithril';

let list = [];

export let all = function() {
    return list
  }

export let loadList = function() {
    return m.request({
        method: "GET",
        url: "https://rem-rest-api.herokuapp.com/api/users",
        withCredentials: true,
    })
    .then(function(result) {
        list = result.data
    })
}

export let deleteLast = function() {
    list.pop();
}