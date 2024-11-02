class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || []
        this.currentId = parseInt(localStorage.getItem('currentId')) || 1
        this.editingId = null;
        

        this.taskForm = document.getElementById('taskForm')
        this.taskInput = document.getElementById('taskInput')
        this.taskList = document.getElementById('taskList')
        this.totalTasksElement = document.getElementById('totalTasks')
        this.completedTasksElement = document.getElementById('completedTasks')
        this.editModal = new bootstrap.Modal(document.getElementById('editModal'))
        this.editInput = document.getElementById('editInput')
        this.saveEditBtn = document.getElementById('saveEdit')
        

        this.taskForm.addEventListener('submit', (e) => this.addTask(e))
        this.saveEditBtn.addEventListener('click', () => this.saveEdit())
        

        this.renderTasks()
    }
    
    addTask(e) {
        e.preventDefault()
        const text = this.taskInput.value.trim()
        if(text) {
            const task = {
                id: this.currentId++,
                text: text,
                completed: false,
                createdAt: new Date()
            };
            this.tasks.push(task)
            this.taskInput.value = ''
            this.saveTasks()
            this.renderTasks()
        }
    }
    
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id)
        this.saveTasks()
        this.renderTasks()
    }
    
    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id)
        if(task) {
            task.completed = !task.completed
            this.saveTasks()
            this.renderTasks()
        }
    }
    
    editTask(id) {
        const task = this.tasks.find(task => task.id === id)
        if(task) {
            this.editingId = id
            this.editInput.value = task.text
            this.editModal.show()
        }
    }
    
    saveEdit() {
        const task = this.tasks.find(task => task.id === this.editingId)
        if(task) {
            task.text = this.editInput.value.trim()
            this.saveTasks()
            this.renderTasks()
            this.editModal.hide()
        }
    }
    
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
        localStorage.setItem('currentId', this.currentId.toString())
    }
    
    renderTasks() {
        this.taskList.innerHTML = ''
        this.tasks.sort((a, b) => b.createdAt - a.createdAt).forEach(task => {
            const item = document.createElement('div')
            item.className = `list-group-item task-item d-flex justify-content-between align-items-center ${task.completed ? 'task-completed' : ''}`
            item.innerHTML = `
                <div class="d-flex align-items-center">
                    <button class="btn btn-link text-muted check-btn" onclick="app.toggleTask(${task.id})">
                        <i class="fas ${task.completed ? 'fa-check-square' : 'fa-square'}"></i>
                    </button>
                    <span class="${task.completed ? 'task-done' : ''}">${task.text}</span>
                </div>
                <div class="btn-group">
                    <button class="btn btn-link text-muted edit-btn" onclick="app.editTask(${task.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-link text-muted delete-btn" onclick="app.deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `
            this.taskList.appendChild(item)
        })
        
        
        const completed = this.tasks.filter(task => task.completed).length
        this.totalTasksElement.textContent = `Total: ${this.tasks.length}`
        this.completedTasksElement.textContent = `Concluídas: ${completed}`
    }
}


const app = new TodoApp()