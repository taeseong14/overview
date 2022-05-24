const todos = document.querySelector('#todos');


function addTodo({ title, desc, completed, id, deleted, showDeleted }) {
    const li = document.createElement('li');
    li.id = id;
    li.innerHTML = `
    <div class="todo-item">
    <span class="todo-title">${title}</span>
    <span class="todo-desc">${desc}</span>
    </div>
    <div class="todo-buttons">
    ` + (deleted ? `<button class="todo-recover">복원</button>` : `
    <button class="todo-edit">수정</button>
    <button class="todo-del">x</button>
    `)
    if (completed) li.classList.add('completed');
    if (deleted) li.classList.add('deleted');
    if (showDeleted) li.classList.add('showDeleted');
    todos.prepend(li);
    const todoTitle = li.querySelector('.todo-title');
    const todoDesc = li.querySelector('.todo-desc');
    function onTodoClick(e) {
        const { parentElement } = e.target.parentElement;
        parentElement.classList.toggle('completed');
        const store = db.transaction('todo', 'readwrite').objectStore('todo');
        const getAll = store.getAll();
        getAll.onsuccess = (e) => {
            const todo = e.target.result[parentElement.id];
            store.put({
                ...todo,
                completed: !todo.completed
            }, +parentElement.id + 1);
        }
    }
    todoTitle.addEventListener('click', onTodoClick);
    todoDesc.addEventListener('click', onTodoClick);
    let timeout;
    if (deleted) {
        li.querySelector('.todo-recover').addEventListener('click', () => {
            li.classList.remove('deleted');
            const store = db.transaction('todo', 'readwrite').objectStore('todo');
            const getAll = store.getAll();
            getAll.onsuccess = (e) => {
                const todo = e.target.result[li.id];
                const put = store.put({
                    ...todo,
                    deleted: false
                }, +li.id + 1);
                put.onsuccess = () => {
                    todos.innerHTML = '';
                    const getAll = store.getAll();
                    getAll.onsuccess = (e) => {
                        e.target.result.forEach(todo => {
                            addTodo({ ...todo, showDeleted: true });
                        });
                    }
                }
            }
        });
    } else {
        li.querySelector('.todo-del').addEventListener('click', (e) => {
            li.classList.add('deleted');
            lastlyDeleted = li;
            clearTimeout(timeout);
            const deleted = document.querySelector('#deleted');
            deleted.classList.add('show');
            timeout = setTimeout(() => deleted.classList.remove('show'), 5000);
            const store = db.transaction('todo', 'readwrite').objectStore('todo');
            const getAll = store.getAll();
            getAll.onsuccess = (e) => {
                console.log(e.target.result, li.id);
                const todo = e.target.result[li.id];
                store.put({
                    ...todo,
                    deleted: true
                }, +li.id + 1);
            }
        });
        li.querySelector('.todo-edit').addEventListener('click', (e) => {
            const title = prompt('Title', todoTitle.innerText) || todoTitle.innerText;
            const desc = prompt('Description', todoDesc.innerText) || todoDesc.innerText;
            console.log(title, desc);
            todoTitle.innerText = title;
            todoDesc.innerText = desc;
            const store = db.transaction('todo', 'readwrite').objectStore('todo');
            const getAll = store.getAll();
            getAll.onsuccess = (e) => {
                const todo = e.target.result[li.id];
                store.put({
                    ...todo,
                    title,
                    desc
                }, +li.id + 1);
            }
        });
    }
}



/**
* IndexedDB
*/

let db;
function loadDatabase() {
    const dbRequest = indexedDB.open('todo', 1);
    dbRequest.onupgradeneeded = (e) => {
        db = e.target.result;
        if (!db.objectStoreNames.contains('todo')) {
            db.createObjectStore('todo', { autoIncrement: true });
        }
    };
    dbRequest.onsuccess = (e) => {
        db = e.target.result;
        const store = db.transaction('todo', 'readonly').objectStore('todo');
        const getAll = store.getAll();
        getAll.onsuccess = (e) => {
            const todoList = e.target.result;
            todoList.forEach(todo => {
                const id = todoList.indexOf(todo);
                addTodo({ ...todo, id });
            });
        }
    };
}
loadDatabase();

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const todo = form.querySelector('#make-input');
    const desc = form.querySelector('#make-input-desc');
    const addObj = { 
        title: todo.value,
        desc: desc.value,
        completed: false,
        deleted: false
    };
    const store = db.transaction('todo', 'readwrite').objectStore('todo');
    const getAll = store.getAll();
    getAll.onsuccess = (e) => {
        const todoList = e.target.result;
        const put = store.put(addObj, todoList.length + 1);
        put.onsuccess = () => {
            addObj.id = todoList.length + 1;
            addTodo(addObj);
            todo.value = '';
            desc.value = '';
        }
    }
});



/**
* Import & Export & clear
*/


const [Clear, Import, Export] = document.querySelectorAll('footer button');

Clear.addEventListener('click', () => {
    const store = db.transaction('todo', 'readwrite').objectStore('todo');
    store.clear();
    todos.innerHTML = '';
});

Import.addEventListener('click', () => {
    try {
        const importList = JSON.parse(prompt('Enter JSON'));
        const store = db.transaction('todo', 'readwrite').objectStore('todo');
        store.clear();
        todos.innerHTML = '';
        importList.forEach(todo => {
            const getAll = store.getAll();
            getAll.onsuccess = (e) => {
                const todoList = e.target.result;
                const put = store.put(todo, importList.indexOf(todo) + 1);
                put.onsuccess = () => {
                    addTodo({ ...todo, id: todoList.length + 1 });
                }
            }
        });
    } catch (e) {
        alert('Invalid JSON');
        console.log(e);
    }
});

Export.addEventListener('click', () => {
    const store = db.transaction('todo', 'readonly').objectStore('todo');
    const getAll = store.getAll();
    getAll.onsuccess = (e) => {
        const textarea = document.createElement('textarea');
        textarea.value = JSON.stringify(e.target.result);
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        alert('copied to clipboard');
    }
});



/**
* Deleted Tab
*/

const deleted = document.querySelector('#deleted');
let lastlyDeleted;
deleted.querySelector('span').onclick = () => {
    if (!lastlyDeleted) return;
    lastlyDeleted.classList.remove('deleted');
    deleted.classList.remove('show');
    const store = db.transaction('todo', 'readwrite').objectStore('todo');
    const getAll = store.getAll();
    getAll.onsuccess = (e) => {
        const todoList = e.target.result;
        const todo = todoList[lastlyDeleted.id];
        const put = store.put({
            ...todo,
            deleted: false
        }, +lastlyDeleted.id + 1);
        lastlyDeleted = null;
        todos.innerHTML = '';
        put.onsuccess = (e) => {
            const getAll = store.getAll();
            getAll.onsuccess = (e) => {
                const todoList = e.target.result;
                todoList.forEach(todo => {
                    const id = todoList.indexOf(todo);
                    addTodo({ ...todo, id });
                });
            }
        }
    }
}



/**
* Options
*/


const checkDeleted = document.querySelector('#check-deleted');
checkDeleted.addEventListener('click', () => {
    todos.innerHTML = '';
    const store = db.transaction('todo', 'readonly').objectStore('todo');
    const getAll = store.getAll();
    getAll.onsuccess = (e) => {
        const todoList = e.target.result;
        todoList.forEach(todo => addTodo({ id: todoList.indexOf(todo), ...todo, showDeleted: checkDeleted.checked }));
    }
});