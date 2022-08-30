"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var mainStoredTodos = [];
window.addEventListener("DOMContentLoaded", function loadData() {
  if (localStorage.getItem("todo") !== null) {
    mainStoredTodos = JSON.parse(localStorage.getItem("todo"));
  }

  mainStoredTodos.forEach(function (element) {
    var todoHtml = "\n        <div draggable=\"true\" id=\"task-".concat(element.index, "\" class=\"list-item move\">\n            <div class=\"checkandinput-container\">\n                <div class=\"check-con pointer ").concat(element.isCompleted && "completed-img", "\">\n                </div>\n                <input class=\"todo-text ").concat(element.isCompleted && "completed-inp", "\" value=\"").concat(element.description, "\" disabled>\n            </div>\n            <div class=\"edit-delete\">\n                <i class=\"text-d fa-solid fa-pen pointer\"></i>\n                <i class=\"text-d disabled fa-solid fa-check pointer\"></i>\n                <i class=\"text-d fa-solid fa-trash pointer\"></i>\n            </div>\n        </div>\n        ");
    tasksLeft();
    tasksContainer.innerHTML += todoHtml;
    inpt.value = "";
    inpt.focus();
    addToLocalStorage();
    drag();
    var checkBox = document.querySelectorAll(".check-con");
    checkBox.forEach(function (item) {
      item.addEventListener("click", function (e) {
        var taskIndex = e.target.parentElement.parentElement.getAttribute("id").split("-")[1];
        completeTask(taskIndex, e.target.parentElement);
        tasksLeft();
        addToLocalStorage();
      });
    });
    var trashBtn = document.querySelectorAll(".fa-trash");
    trashBtn.forEach(function (item) {
      item.addEventListener("click", function (e) {
        var taskIndex = e.target.parentElement.parentElement.getAttribute("id").split("-")[1];
        mainStoredTodos = deleteTask(taskIndex, e.target.parentElement.parentElement);
        tasksLeft();
        addToLocalStorage();
      });
    });
    var editBtn = document.querySelectorAll(".fa-pen");
    editBtn.forEach(function (item) {
      item.addEventListener("click", function (e) {
        var checkBtn = e.target.parentElement.children[1];
        var editInput = e.target.parentElement.parentElement.children[0].children[1];
        editTask(e.target, checkBtn, editInput);
        addToLocalStorage();
      });
    });
    var checkBtn = document.querySelectorAll(".fa-check");
    checkBtn.forEach(function (item) {
      item.addEventListener("click", function (e) {
        var taskIndex = e.target.parentElement.parentElement.getAttribute("id").split("-")[1];
        var editInput = e.target.parentElement.parentElement.children[0].children[1];
        var checkBtn = e.target.parentElement.children[0];
        editTodoText(taskIndex, editInput, e.target, checkBtn);
        addToLocalStorage();
      });
    });
  });
  themeSetter("light");
});
var btn = document.getElementById("add-btn").parentElement;
var inpt = document.getElementById("todo-input");
var tasksContainer = document.querySelector(".tasks");
var taskcounter = document.getElementById("task-counter");
var removeCompleted = document.getElementById("remove-completed");
btn.addEventListener("click", function () {
  if (inpt.value) {
    addTodo();
  } else {
    document.getElementById("display-error").innerText = "Input Field cannot be empty!!";
    setTimeout(function () {
      document.getElementById("display-error").innerText = "";
    }, 3000);
  }
});
inpt.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    if (inpt.value) {
      addTodo();
    } else {
      document.getElementById("display-error").innerText = "Input Field cannot be empty!!";
      setTimeout(function () {
        document.getElementById("display-error").innerText = "";
      }, 3000);
    }
  }
});

function addTodo() {
  creatTodoData(inpt.value);
  var containersChildren = tasksContainer.childElementCount;
  var todoHtml = "\n        <div draggable=\"true\" id=\"task-".concat(containersChildren, "\" class=\"list-item move\">\n            <div class=\"checkandinput-container\">\n                <div class=\"check-con pointer\">\n                </div>\n                <input class=\"todo-text\" value=\"").concat(mainStoredTodos[containersChildren].description, "\" disabled>\n            </div>\n            <div class=\"edit-delete\">\n                <i class=\"text-d fa-solid fa-pen pointer\"></i>\n                <i class=\"text-d disabled fa-solid fa-check pointer\"></i>\n                <i class=\"text-d fa-solid fa-trash pointer\"></i>\n            </div>\n        </div>\n        ");
  tasksLeft();
  tasksContainer.innerHTML += todoHtml;
  inpt.value = "";
  inpt.focus();
  addToLocalStorage();
  drag();
  var checkBox = document.querySelectorAll(".check-con");
  checkBox.forEach(function (item) {
    item.addEventListener("click", function (e) {
      var taskIndex = e.target.parentElement.parentElement.getAttribute("id").split("-")[1];
      completeTask(taskIndex, e.target.parentElement);
      tasksLeft();
      addToLocalStorage();
    });
  });
  var trashBtn = document.querySelectorAll(".fa-trash");
  trashBtn.forEach(function (item) {
    item.addEventListener("click", function (e) {
      var taskIndex = e.target.parentElement.parentElement.getAttribute("id").split("-")[1];
      mainStoredTodos = deleteTask(taskIndex, e.target.parentElement.parentElement);
      tasksLeft();
      addToLocalStorage();
    });
  });
  var editBtn = document.querySelectorAll(".fa-pen");
  editBtn.forEach(function (item) {
    item.addEventListener("click", function (e) {
      var checkBtn = e.target.parentElement.children[1];
      var editInput = e.target.parentElement.parentElement.children[0].children[1];
      editTask(e.target, checkBtn, editInput);
      addToLocalStorage();
    });
  });
  var checkBtn = document.querySelectorAll(".fa-check");
  checkBtn.forEach(function (item) {
    item.addEventListener("click", function (e) {
      var taskIndex = e.target.parentElement.parentElement.getAttribute("id").split("-")[1];
      var editInput = e.target.parentElement.parentElement.children[0].children[1];
      var checkBtn = e.target.parentElement.children[0];
      editTodoText(taskIndex, editInput, e.target, checkBtn);
      addToLocalStorage();
    });
  });
  themeSetter("light");
}

var creatTodoData = function creatTodoData(todoText) {
  var containersChildren = tasksContainer.childElementCount;
  mainStoredTodos.push({
    index: containersChildren,
    description: todoText,
    isCompleted: false
  });
};

var completeTask = function completeTask(index, elements) {
  var selectedTask = mainStoredTodos.find(function (item) {
    return item.index == index;
  });

  if (!selectedTask.isCompleted) {
    selectedTask.isCompleted = true;
    elements.children[0].classList.add("completed-img");
    elements.children[1].classList.add("completed-inp");
  } else {
    selectedTask.isCompleted = false;
    elements.children[0].classList.remove("completed-img");
    elements.children[1].classList.remove("completed-inp");
  }
};

var deleteTask = function deleteTask(index, element) {
  element.remove();
  return mainStoredTodos.filter(function (item) {
    return item.index != index;
  });
};

var editTask = function editTask(penBtn, checkBtn, input) {
  penBtn.classList.add("disabled");
  checkBtn.classList.remove("disabled");
  input.removeAttribute("disabled");
  input.focus();
  input.select();
};

var editTodoText = function editTodoText(index, input, checkBtn, penBtn) {
  var selectedTask = mainStoredTodos.find(function (item) {
    return item.index == index;
  });
  selectedTask.description = input.value;
  input.setAttribute("disabled", "");
  checkBtn.classList.add("disabled");
  penBtn.classList.remove("disabled");
};

var tasksLeft = function tasksLeft() {
  var count = 0;
  var completed = mainStoredTodos.filter(function (item) {
    return item.isCompleted === true;
  });
  count = mainStoredTodos.length - completed.length;
  taskcounter.innerText = "".concat(count, " Task Left");
};

removeCompleted.addEventListener("click", function () {
  var allCompletedTodos = [];
  Array.from(tasksContainer.children).map(function (item) {
    if (item.children[0].children[0].classList.contains("completed-img")) {
      allCompletedTodos.push(item);
    }
  });
  allCompletedTodos.forEach(function (item) {
    var index = item.getAttribute("id").split("-")[1];
    mainStoredTodos = deleteTask(index, item);
    addToLocalStorage();
  });
});

var addToLocalStorage = function addToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(mainStoredTodos));
};

var darkMode = function darkMode() {
  document.body.classList.add('body-darkmode');
  var checkBoxes = document.querySelectorAll(".check-con");
  var listItems = document.querySelectorAll(".list-item");
  document.querySelector(".task-input").classList.add("dark-Mode");
  document.querySelector(".data-info").classList.add("data-info-dark-Mode");
  document.querySelector(".display-tasks").classList.add("dark-Mode");
  document.getElementById("add-btn").classList.add("dark-text-color");
  var todoTexts = document.querySelectorAll(".todo-text");
  var addEditTrashTexts = document.querySelectorAll(".text-d");
  checkBoxes.forEach(function (item) {
    item.classList.add("checkBox-Color");
  });
  listItems.forEach(function (item) {
    item.classList.add("dark-Mode");
  });
  todoTexts.forEach(function (item) {
    item.classList.add("dark-text-color");
  });
  addEditTrashTexts.forEach(function (item) {
    item.classList.add("dark-text-color");
  });
  document.querySelector(".header").style.backgroundImage = "url('../Images/Sizasiah.jpg')";
  document.querySelector(".header").style.backgroundColor = "black";
};

var lightMode = function lightMode() {
  document.body.classList.remove('body-darkmode');
  var checkBoxes = document.querySelectorAll(".check-con");
  var listItems = document.querySelectorAll(".list-item");
  document.querySelector(".task-input").classList.remove("dark-Mode");
  document.querySelector(".data-info").classList.remove("data-info-dark-Mode");
  document.querySelector(".display-tasks").classList.remove("dark-Mode");
  document.getElementById("add-btn").classList.remove("dark-text-color");
  var todoTexts = document.querySelectorAll(".todo-text");
  var addEditTrashTexts = document.querySelectorAll(".text-d");
  checkBoxes.forEach(function (item) {
    item.classList.remove("checkBox-Color");
  });
  listItems.forEach(function (item) {
    item.classList.remove("dark-Mode");
  });
  todoTexts.forEach(function (item) {
    item.classList.remove("dark-text-color");
  });
  addEditTrashTexts.forEach(function (item) {
    item.classList.remove("dark-text-color");
  });
  document.querySelector(".header").style.backgroundImage = "url('../Images/SizaSef.jpg')";
  document.querySelector(".header").style.backgroundColor = "white";
};

var themeSetter = function themeSetter(mode) {
  if (localStorage.getItem("theme") !== null) {
    if (localStorage.getItem("theme") === "light") {
      lightMode();
    } else if (localStorage.getItem("theme") === "dark") {
      darkMode();
    }
  } else {
    localStorage.setItem("theme", mode);
  }
};

var themeBtn = document.querySelectorAll(".theme");
themeBtn.forEach(function (item) {
  item.addEventListener("click", function () {
    if (localStorage.getItem("theme") === "light") {
      item.classList.add("disabled");
      document.querySelector(".fa-sun").classList.remove("disabled");
      darkMode();
      localStorage.setItem("theme", "dark");
    } else if (localStorage.getItem("theme") === "dark") {
      item.classList.add("disabled");
      document.querySelector(".fa-moon").classList.remove("disabled");
      lightMode();
      localStorage.setItem("theme", "light");
    }
  });
});

function drag() {
  function dragStart(e) {
    this.style.opacity = '0.15';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }

  ;

  function dragEnter(e) {
    this.classList.add("over");
  }

  function dragLeave(e) {
    // e.stopPropagation();
    this.classList.remove('over');
  }

  function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function dragDrop(e) {
    if (dragSrcEl != this) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
  }

  function dragEnd(e) {
    var listItens = document.querySelectorAll('.list-item');
    listItens.forEach(function (item) {
      item.classList.remove('over');
    });
    this.style.opacity = '1';
    setIndex();
  }

  function addEventsDragAndDrop(el) {
    el.addEventListener('dragstart', dragStart, false);
    el.addEventListener('dragenter', dragEnter, false);
    el.addEventListener('dragover', dragOver, false);
    el.addEventListener('dragleave', dragLeave, false);
    el.addEventListener('drop', dragDrop, false);
    el.addEventListener('dragend', dragEnd, false);
  }

  var listItens = document.querySelectorAll('.list-item');
  listItens.forEach(function (item) {
    addEventsDragAndDrop(item);
  });
}

var reAssignIndex = function reAssignIndex() {
  JSON.parse(localStorage.getItem("todo")).forEach(function (elem, index) {
    elem.index = index += 1;
  });
};

function setIndex() {
  var objArray = _toConsumableArray(document.querySelectorAll('.list-item'));

  var tempArr = objArray.map(function (element) {
    return {
      index: element.id.split('-')[1],
      description: element.children[0].children[1].value,
      isCompleted: element.children[0].children[0].classList.contains('completed-img') ? true : false
    };
  });
  mainStoredTodos = tempArr;
  reAssignIndex();
  addToLocalStorage();
}