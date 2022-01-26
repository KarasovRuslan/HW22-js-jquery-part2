$(document).ready(function(){
    console.log(jQuery.fn.jquery);
});

let urlAdres = "http://localhost:3000/todos";
let input = $('#textInput');
let list = $('#list');
let createBtn = $('#textBtn');


class TodoList {
    constructor() {
        list.on('click', (event) => {
            let id = event.target.closest('li').dataset.id;
            if (event.target.className === 'statusButton') {
                createLi.changeStatus(id);
            }
            else if (event.target.className === 'deleteButton') {
                createLi.removeTodo(id)
                location.reload();
            };
        });
    };

    addTodo(todo) {
        $.ajax({
            type: "POST",
            url: urlAdres,
            data: JSON.stringify({
                task: todo,
                complited: false
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
    };

    getData() {
        return $.ajax({
            url: urlAdres,
            dataType: "json",
            success: function (data) {
                console.log(data)
            }
        });
    };

    async render() {
        try {
            let data = await this.getData()
            let lis = '';
            for (let el of data) {
                if (!el) {
                    return;
                }
                let colorToDo = el.complited ? "done" : "notDone";
                lis += `<li data-id="${el.id}" class="${colorToDo}">${el.task}<button class="statusButton">Change status</button><button class="deleteButton">Delete</button></li>`;
            };
            list.html(lis);
        } catch (err) {
            console.log(err);
        };
    };

    async changeStatus(id) {
        try {
            let data = await this.getData()
            for (let el of data) {
                if (el.id == id) {
                    el.complited = !el.complited;
                    $.ajax({
                        type: "PATCH",
                        url: `${urlAdres}/${id}`,
                        data: JSON.stringify({
                            complited: el.complited
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                };
            };
            location.reload();
        } catch (err) {
            console.log(err);
        };
    };

    removeTodo(id) {
        $.ajax({
            type: "DELETE",
            url: `${urlAdres}/${id}`,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: null
        });
    };
};

let createLi = new TodoList();
createLi.render();
createBtn.on('click', function () {
    createLi.addTodo(input.val());
});