let mainStoredTodos = [];
window.addEventListener("DOMContentLoaded" , function loadData() {
    if (localStorage.getItem("todo") !== null) {
        mainStoredTodos = (JSON.parse(localStorage.getItem("todo")));
    }
    displayAll();
    document.querySelector(".fa-bolt").addEventListener("click",displayActive);
    document.querySelector(".fa-list").addEventListener("click",displayAll);
    document.querySelector(".check-menu").addEventListener("click",displayCompleted);
    addToLocalStorage();
});

const btn = document.getElementById("add-btn").parentElement;
const inpt = document.getElementById("todo-input");
const tasksContainer = document.querySelector(".tasks");
const taskcounter = document.getElementById("task-counter");
const removeCompleted = document.getElementById("remove-completed");

btn.addEventListener("click",function () {
    if (inpt.value){
        addTodo();
    }
    else{
        displayError("display-error" , "Input Field cannot be empty!!" , 3000);
    }
});
inpt.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        if (inpt.value){
            addTodo();
        }
        else{
            displayError("display-error" , "Input Field cannot be empty!!" , 3000);
        }
    }
})

function displayError (elementClass , elInnerText , duration ){
    document.getElementById(elementClass).innerText = elInnerText;
        setTimeout(() => {
            document.getElementById(elementClass).innerText = "";
        }, duration);
}

function addTodo(){
    creatTodoData(inpt.value);
    const containersChildren = tasksContainer.childElementCount;
    const todoHtml = `
    <div draggable="true" id="task-${containersChildren}" class="list-item move">
        <div class="checkandinput-container">
            <div class="check-con pointer">
            </div>
            <input class="todo-text" value="${mainStoredTodos[containersChildren].description}" disabled>
        </div>
        <div class="edit-delete">
            <i class="text-d fa-solid fa-pen pointer"></i>
            <i class="text-d disabled fa-solid fa-check ca-check pointer"></i>
            <i class="text-d fa-solid fa-trash pointer"></i>
        </div>
    </div>
    `;
    tasksLeft();
    tasksContainer.innerHTML += todoHtml;
    displayAll();
    inpt.value = "";
    inpt.focus();
    addToLocalStorage();
    addEventToBottons();
    themeSetter("light");
}

const addEventToBottons = () => {
    addClickEvent (".check-con" ,checkBoxEvent);
    addClickEvent (".fa-trash" ,trashBtnEvent);
    addClickEvent (".fa-pen" ,editBtnEvent);
    addClickEvent (".ca-check" ,checkBtnEvent);
}
function addClickEvent (elClass ,eFunctionName){
    document.querySelectorAll(elClass).forEach((item) => {
            item.addEventListener("click" , eFunctionName);
        });
}

function checkBoxEvent(e){
    const taskIndex =e.target.parentElement.parentElement.getAttribute("id").split("-")[1];
    completeTask(taskIndex , e.target.parentElement);
    tasksLeft();
    addToLocalStorage();
}
function trashBtnEvent(e){
    const taskIndex =e.target.parentElement.parentElement.getAttribute("id").split("-")[1];
    mainStoredTodos = deleteTask(taskIndex , e.target.parentElement.parentElement);
    tasksLeft();
    addToLocalStorage();
}
function editBtnEvent(e){
    const checkBtn = e.target.parentElement.children[1];
    const editInput = e.target.parentElement.parentElement.children[0].children[1];
    editTask(e.target , checkBtn ,editInput);
    addToLocalStorage();
}
function checkBtnEvent(e){
    const taskIndex =e.target.parentElement.parentElement.getAttribute("id").split("-")[1];
    const editInput = e.target.parentElement.parentElement.children[0].children[1]; 
    const checkBtn = e.target.parentElement.children[0];
    editTodoText(taskIndex , editInput , e.target ,checkBtn);
    addToLocalStorage();
}

const creatTodoData = (todoText) => {
    const containersChildren = tasksContainer.childElementCount;
    mainStoredTodos.push({
        index:containersChildren,
        description:todoText,
        isCompleted:false
    })
}

const completeTask = (index , elements) => {
    const selectedTask = mainStoredTodos.find((item) => item.index == index);
    if (selectedTask.isCompleted == false) {
        selectedTask.isCompleted = true;
        elements.children[0].classList.add("completed-img");
        elements.children[1].classList.add("completed-inp");
    }else if (selectedTask.isCompleted === true){
        selectedTask.isCompleted = false;
        elements.children[0].classList.remove("completed-img");
        elements.children[1].classList.remove("completed-inp");
    }
    return selectedTask
}

const deleteTask = (index , element) => {
    element.remove();
    return mainStoredTodos.filter((item) => item.index != index);
}

const editTask = (penBtn ,checkBtn , input)=> {
    penBtn.classList.add("disabled");
    checkBtn.classList.remove("disabled");
    input.removeAttribute("disabled");
    input.focus();
    input.select();
}

const editTodoText = ( index , input , checkBtn ,penBtn )=> {
    const selectedTask = mainStoredTodos.find((item) => item.index == index);
    selectedTask.description = input.value;
    input.setAttribute("disabled" , "");
    checkBtn.classList.add("disabled");
    penBtn.classList.remove("disabled");
    window.getSelection().removeAllRanges();
}

const tasksLeft = () => {
    let count=0;
    let completed = mainStoredTodos.filter((item) => item.isCompleted === true);
    count = mainStoredTodos.length - completed.length;
    taskcounter.innerText = `${count} Tasks Left`;
}

removeCompleted.addEventListener("click" , function(){
    let allCompletedTodos=[] ;
     Array.from(tasksContainer.children).map((item) => {
        if(item.children[0].children[0].classList.contains("completed-img")){
            allCompletedTodos.push(item);
        }
    });
    allCompletedTodos.forEach( item => {
        let index = item.getAttribute("id").split("-")[1];
        mainStoredTodos = deleteTask( index , item );
        addToLocalStorage();
    })
})

//adds the mainStoredTodos object to the localStorage
const addToLocalStorage = () => {
    localStorage.setItem("todo" , JSON.stringify(mainStoredTodos));
}

const classListSetter = (elClass , classSet , setClassName) => {
    document.querySelectorAll(elClass).forEach(item => {
        classSet ? item.classList.add(setClassName) : item.classList.remove(setClassName);
    });
}

const darkMode = () => {
    document.body.classList.add('body-darkmode');
    classListSetter(".check-con",true,"checkBox-Color");
    classListSetter(".list-item",true,"dark-Mode");
    classListSetter(".todo-text",true,"dark-text-color");
    classListSetter(".text-d",true,"dark-text-color");
    document.querySelector(".task-input").classList.add("dark-Mode");
    document.querySelector(".data-info").classList.add("data-info-dark-Mode");
    document.querySelector(".display-tasks").classList.add("dark-Mode");
    document.getElementById("add-btn").classList.add("dark-text-color");
    document.querySelector(".menu-container").classList.add("dark-Mode");
    document.querySelector(".header").style.backgroundImage = "url('../Images/Sizasiah.jpg')";
    document.querySelector(".header").style.backgroundColor = "black";
}

const lightMode= () => {
    document.body.classList.remove('body-darkmode');
    classListSetter(".check-con",false,"checkBox-Color");
    classListSetter(".list-item",false,"dark-Mode");
    classListSetter(".todo-text",false,"dark-text-color");
    classListSetter(".text-d",false,"dark-text-color");
    document.querySelector(".task-input").classList.remove("dark-Mode");
    document.querySelector(".data-info").classList.remove("data-info-dark-Mode");
    document.querySelector(".display-tasks").classList.remove("dark-Mode");
    document.getElementById("add-btn").classList.remove("dark-text-color");
    document.querySelector(".menu-container").classList.remove("dark-Mode");
    document.querySelector(".header").style.backgroundImage = "url('../Images/SizaSef.jpg')";
    document.querySelector(".header").style.backgroundColor = "white";
}

//sets the theme to "mode" if the user enter to the website for the first time
const themeSetter= (mode) => {
    if (localStorage.getItem("theme") !== null) {
        if (localStorage.getItem("theme") === "light") {
            lightMode();
        } else if (localStorage.getItem("theme") === "dark") {
            darkMode();
        }
    }else{
        localStorage.setItem("theme" , mode);
    }
}

const themeBtn = document.querySelectorAll(".theme");
    themeBtn.forEach((item) => {
        item.addEventListener("click" ,function(){
            if (localStorage.getItem("theme") === "light") {
                item.classList.add("disabled");
                document.querySelector(".fa-sun").classList.remove("disabled");
                darkMode();
                localStorage.setItem("theme" , "dark");
            }else if(localStorage.getItem("theme") === "dark"){
                item.classList.add("disabled");
                document.querySelector(".fa-moon").classList.remove("disabled");
                lightMode();
                localStorage.setItem("theme" , "light");
            }
        });
    })

function drag(){
    function dragStart(e) {
        this.style.opacity = '0.4';
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('html',this.innerHTML);
    };
      
    function dragEnter(e) {
        this.classList.add('over');
    }
      
    function dragLeave(e) {
        e.stopPropagation();
        this.classList.remove('over');
    }
      
    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }
      
    function dragDrop(e) {
        if (dragSrcEl != this) {
            console.log(dragSrcEl.innerHTML)
            dragSrcEl.innerHTML = this.innerHTML;
            console.log(dragSrcEl.innerHTML)
            this.innerHTML = e.dataTransfer.getData('html');
        }
        let container = this;
        container.children[0].children[0].addEventListener('click',checkBoxEvent);
        container.children[1].children[2].addEventListener('click',trashBtnEvent);
        container.children[1].children[1].addEventListener('click',checkBtnEvent);
        container.children[1].children[0].addEventListener('click',editBtnEvent);
        return false;
    }
    function dragEnd(e) {
        const listItems = document.querySelectorAll('.list-item');
        listItems.forEach(function(item) {
            item.classList.remove('over');
        });
        this.style.opacity = '1';
        let container = this;
        container.children[0].children[0].addEventListener('click',checkBoxEvent);
        container.children[1].children[2].addEventListener('click',trashBtnEvent);
        container.children[1].children[1].addEventListener('click',checkBtnEvent);
        container.children[1].children[0].addEventListener('click',editBtnEvent);
        setIndex();
    }

    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach(function(item) {
        item.addEventListener('dragstart', dragStart, false);
        item.addEventListener('dragenter', dragEnter, false);
        item.addEventListener('dragover', dragOver, false);
        item.addEventListener('dragleave', dragLeave, false);
        item.addEventListener('drop', dragDrop, false);
        item.addEventListener('dragend', dragEnd, false);
    });
}

function setIndex() {
    const objArray = [...document.querySelectorAll('.list-item')];
    const tempArr = objArray.map((element) => {
            return{
                index:element.id.split('-')[1],
                description:element.children[0].children[1].value,
                isCompleted:element.children[0].children[0].classList.contains('completed-img')? true : false,
            }
        }
    );
    mainStoredTodos = tempArr;
    addToLocalStorage();
  }
function displayActive(){
    const activaTasks = mainStoredTodos.filter((element) => element.isCompleted == false);
    tasksContainer.innerHTML ="";
    activaTasks.forEach(element => {
        taskCreator(element , false);
    });
    tasksLeft();
    inpt.value = "";
    document.querySelector("#menu-1").classList.add("active-container");
    document.querySelector("#menu-1").children[1].innerText = "Active";
    document.querySelector("#menu-2").classList.remove("all-container");
    document.querySelector("#menu-2").children[1].innerText = "";
    document.querySelector("#menu-3").classList.remove("completed-container");
    document.querySelector("#menu-3").children[1].innerText = "";
    document.querySelector(".drag-info").innerText = "";
    themeSetter("light");
    addEventToBottons();
}
function displayAll(){
    tasksContainer.innerHTML ="";
    mainStoredTodos.forEach(element => {
        taskCreator(element ,true);
    });
    tasksLeft();
    inpt.value = "";
    document.querySelector("#menu-1").classList.remove("active-container");
    document.querySelector("#menu-1").children[1].innerText = "";
    document.querySelector("#menu-2").classList.add("all-container");
    document.querySelector("#menu-2").children[1].innerText = "All";
    document.querySelector("#menu-3").classList.remove("completed-container");
    document.querySelector("#menu-3").children[1].innerText = "";
    document.querySelector(".drag-info").innerText = "Drag and Drop to reorder the List";
    themeSetter("light");
    addEventToBottons();
    drag();
}
function displayCompleted(){
    const completedTasks = mainStoredTodos.filter((element) => element.isCompleted);
    tasksContainer.innerHTML ="";
    completedTasks.forEach(element => {
        taskCreator(element ,false);
    });
    inpt.value = "";
    taskcounter.innerText = "";
    document.querySelector("#menu-1").classList.remove("active-container");
    document.querySelector("#menu-1").children[1].innerText = "";
    document.querySelector("#menu-2").classList.remove("all-container");
    document.querySelector("#menu-2").children[1].innerText = "";
    document.querySelector("#menu-3").classList.add("completed-container");
    document.querySelector("#menu-3").children[1].innerText = "Completed";
    document.querySelector(".drag-info").innerText = "";
    themeSetter("light");
    addEventToBottons();
}
const taskCreator = (element , dragable) => {
    const todoHtml = `
        <div ${dragable && 'draggable="true"'} id="task-${element.index}" class="list-item ${dragable && 'move'}">
            <div class="checkandinput-container">
                <div class="check-con pointer ${element.isCompleted && "completed-img" }">
                </div>
                <input class="todo-text ${element.isCompleted && "completed-inp" }" value="${element.description}" disabled>
            </div>
            <div class="edit-delete">
                <i class="text-d fa-solid fa-pen pointer"></i>
                <i class="text-d disabled fa-solid fa-check ca-check pointer"></i>
                <i class="text-d fa-solid fa-trash pointer"></i>
            </div>
        </div>
        `;
    tasksContainer.innerHTML += todoHtml;
}