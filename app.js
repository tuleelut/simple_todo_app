"use strict";
let url = "https://63d5107ac52305feff6d6315.mockapi.io/todos/";
let reload = () => location.reload();
let error = (error) => console.log(error.message);
let editing = false;
let editingPostId = null;
const searchField = document.querySelector(".search input");
const todosList = document.querySelector(".todos");

//ToDo list atvaizdavimas html READ
window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
  fetch(url)
    .then((response) => response.json())
    .then((todos) => {
      //   console.log(todos);
      todos.forEach((element) => {
        showTodo(element);
      });
    })
    .catch(error);
});

//ToDo pridėjimas
document.querySelector(".add").addEventListener("submit", (event) => {
  event.preventDefault();
  createTodo();
  event.target.reset();
});

//ToDo paieška
searchField.addEventListener("focus", (e) => {
  // e.preventDefault();
  fetch(url)
    .then((response) => response.json())
    .then((todos) => {
      searchField.addEventListener("keyup", () => {
        todosList.innerHTML = "";
        let searchString = searchField.value.trim();
        
        let searchResults = todos.filter((element) =>
          element.todo.toLowerCase().includes(searchString.toLowerCase())
        );

        if (searchResults.length == 0) {
          todosList.innerHTML = "Nieko neradome";
        } else {
          searchResults.forEach((element) => {
            showTodo(element);
          });
        }
      });
    })
    .catch(error);
});

// funkcija atvaizdavimui ir delete mygtukui
let showTodo = (el) => {
  todosList.innerHTML += `
    <li class="list-group-item d-flex justify-content-between align-items-center">
    <span>${el.todo}</span>
    <span>${el.createdAt.slice(0, 10)}</span>
    <i class="far fa-edit" onclick="editTodo('${el.todo}', ${el.id})"></i>
    <i class="far fa-trash-alt delete" onclick="deleteTodo(${el.id})"></i>
    </li>
    `;
};

// funkcija pridėjimui ADD
let createTodo = () => {
  let todoTitle = document.querySelector(".todo-input").value;

  if (todoTitle === "") {
    // document.querySelector(".input-error").innerHTML = "Empty field!!!";
    alert("Empty Todo title field 👀");
  } else {
    let todo = {
      createdAt: new Date(),
      todo: todoTitle,
    };

    if (editing) {
      //   console.log(editing, editingPostId);
      putTodo(todo);
    } else {
      postTodo(todo);
    }
  }
};

//funkcija trynimui DELETE
let deleteTodo = (id) => {
  if (confirm("Realyy??? 🤨")) {
    fetch(url + id, {
      method: "DELETE",
    })
      .then(reload)
      .catch(error);
  }
};

let editTodo = (title, id) => {
  document.querySelector(".todo-input").value = title;
  editing = true;
  editingPostId = id;
  //   console.log(title, id, editing);
};

//Update TODO via PUT
function putTodo(todo) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  };
  fetch(url + editingPostId, requestOptions).then(reload);
  editing = false;
}

//Add new TODO via POST
function postTodo(todo) {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  fetch(url, requestOptions).then(reload).catch(error);
}
