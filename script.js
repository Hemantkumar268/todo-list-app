//  Take Elements from DOM
const inputArea = document.querySelector('.input-area');
const addBtn = document.querySelector('.btn-add');
const taskList = document.querySelector('.task-list');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');
const clearBtn = document.getElementById("clearAll");


// Intialize the todos array and current category
let todos = [];
let currentFilter = "all";


// Store the todo
function saveLocalTodos(){
    localStorage.setItem("todos",JSON.stringify(todos));
}

function loadTodos(){
    const data = localStorage.getItem("todos");

    if(data){
        todos = JSON.parse(data);
        todos.forEach(todo => todo.editing = false);
        renderTodos()
    }
}

addBtn.addEventListener("click", () =>{
      addTodo()
})

function addTodo(){
   const text = inputArea.value.trim();
   if(text === "") return;
   const todo = {
    id : Date.now(),
    text : text,
    completed : false,
    editing : false
   }

   todos.push(todo);
   inputArea.value = ""
   saveLocalTodos()
   renderTodos()
}


// Render the todo 
function renderTodos(){
    taskList.innerHTML = "";
    let filtertodos;

    if(currentFilter === "all"){
        filtertodos = todos;
    }
    
    else if(currentFilter === "active"){
        filtertodos = todos.filter( todo => !todo.completed);
    }
    
    else if(currentFilter === "completed"){
        filtertodos = todos.filter( todo => todo.completed);
    }
    else{
        filtertodos = todos;
    }
    
    filtertodos.forEach( (todo) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
        taskItem.innerHTML = `
        <div class="left-side">
            <input 
               type="checkbox" 
               class="form-check-input complete-checkbox" 
               data-id="${todo.id}"
               ${todo.completed ? "checked" : ""}
               ${todo.editing ? "disabled" : ""}>
            ${todo.editing 
                ? `
                <input
                   type="text" 
                   class="edit-input"
                   value="${todo.text}"
                >
                `
               : `
               <span
                    class="task-text 
                    ${todo.completed ? "completed" : ""}">
                    ${todo.text}
                </span>`
            }           
        </div>
        <div class="right-side">
            <button 
                class="${todo.editing ? "save-btn" :"edit-btn"}"
                ${todo.completed ? "disabled" : ""} 
                data-id=${todo.id}>
                ${todo.editing ? "save" : "edit"}
            </button>
            <button 
              class="delete-btn" data-id=${todo.id}>
              Delete
            </button>
        <div/>`
        taskList.append(taskItem)
    })

    const activeTasks = todos.filter(todo => !todo.completed);
    activeCount.innerText = activeTasks.length;
    const complete = todos.length - activeTasks.length;
    completedCount.innerHTML = complete
    

}


// Interactions with todo and relative results
taskList.addEventListener( "click" , (e) => {
   
    if(e.target.classList.contains("delete-btn")){   
        const id = Number(e.target.dataset.id);
        delTodo(id)
    }
    if(e.target.classList.contains("complete-checkbox")){   
        const id = Number(e.target.dataset.id);
        checkTodo(id)
    }

    if(e.target.classList.contains("edit-btn")){
        const id = Number(e.target.dataset.id);
        editTodo(id)
    }

    if(e.target.classList.contains("save-btn")){
        const id = Number(e.target.dataset.id);
        const taskItem = e.target.closest(".task-item");
        const input = taskItem.querySelector(".edit-input");
        const newText = input.value.trim();
        if(newText === '') return;
        saveTodo(id,newText)
    }
})


clearBtn.addEventListener("click", () => {
    todos = []
    saveLocalTodos()
    renderTodos()
})


//  Delete the todo and render new todos
function delTodo(id){
    todos = todos.filter(todo => todo.id !== id);
    saveLocalTodos()
    renderTodos()
}


// Complete the todo task
function checkTodo(id){
    const todo = todos.find( todo => todo.id === id);
    if(!todo) return
    todo.completed = !todo.completed;
    saveLocalTodos()
    renderTodos()
}

function editTodo(id){

    todos.forEach( todo => todo.editing = false);
    const todo = todos.find( todo => todo.id === id);
    if(!todo) return;
    todo.editing = true;
    if(todo.completed) return
    saveLocalTodos()
    renderTodos()
}

function saveTodo(id,newText){
    const todo = todos.find( todo => todo.id === id);
    if(!todo) return;
    todo.text = newText;
    todo.editing = false;
    saveLocalTodos()
    renderTodos()
}

const filterBtn = document.querySelectorAll(".filter-btn");

filterBtn.forEach( (btn) => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        filterBtn.forEach( b => b.classList.remove("active"));
        btn.classList.add("active");
        renderTodos()
    })
})

inputArea.addEventListener("keydown" ,(e) => {
    if(e.key === "Enter"){
       e.preventDefault();
       addTodo();
    }
})

taskList.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && e.target.classList.contains("edit-input")){
        e.preventDefault();
        
        const taskItem = e.target.closest(".task-item");
        const saveBtn = taskItem.querySelector(".save-btn");

        const id = Number(saveBtn.dataset.id);
        const newText = e.target.value.trim();

        if(newText === "") return;
        
        saveTodo(id,newText);
    }
})


loadTodos()

