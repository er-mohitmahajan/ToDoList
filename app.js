const addButton = document.getElementById('add-task');
// 1. Select the parent list element that is always on the page
const todoList = document.querySelector('.todo-container ul');
const input = document.getElementById('new-task');
const filterButtons = document.querySelectorAll('.filterbutton');
const searchContainer = document.querySelector('#searchContainer');
const completedCount = document.querySelector('#completedCount');
const pendingCount = document.querySelector('#pendingCount');
const clearCompleted = document.querySelector('#del-Comptask');
const searchInput = document.querySelector('#searchBar');
const searchButton = document.querySelector('#searchButton');
const taskArray = [];

class TodoItem {
  constructor(id, text, status) {
    this.id = id;
    this.text = text;
    this.completed = status;
  }
}

const saveTasks = () => {
    const tasks = document.querySelectorAll('li');
    taskArray.length = 0;
    tasks.forEach( task => {
        let taskText = task.querySelector('.task-text');
        let checkbox = task.querySelector('.task-checkbox');
        if (!taskText || !checkbox) {
            return;
        }

        let id = task.dataset.id;
        checkbox = checkbox.checked ? true : false;
        taskArray.push(new TodoItem(id,taskText.textContent,checkbox));
    });
    localStorage.setItem('tasklist',JSON.stringify(taskArray));
}
const loadTasks = () => {
    let savedTasks = localStorage.getItem('tasklist');
    
    if(!savedTasks) return;

    const savedArray = JSON.parse(savedTasks);
    savedArray.forEach( task => {
        addTasks(task.id, task.text, task.completed);
    })
}


addButton.addEventListener('click', () => {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    addTasks(null,taskText,false);
    taskInput.value = '';
    updateFilterVisibility();
    applyFilter();
    saveTasks();
    countTask();
});

const addTasks = (id,taskText,state) => {

    if (taskText) {
        const ul = document.querySelector('.todo-container ul');
        const li = document.createElement('li');

        if(id) li.dataset.id = id;
        else li.dataset.id = Date.now();

        const checkbox = document.createElement('input');
        checkbox.classList.add('task-checkbox');
        checkbox.type = 'checkbox';

        if(state) checkbox.checked = true;
    
        const span = document.createElement('span');
        span.classList.add('task-text');
        span.textContent = taskText;

        const editButton = document.createElement('button');
        editButton.classList.add('edit-task');
        editButton.textContent = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-task');
        deleteButton.textContent = 'Delete';

        const taskItemDiv = document.createElement('div');
        taskItemDiv.classList.add('task-item');

        const tasktextDiv = document.createElement('div');
        const taskdeleteDiv = document.createElement('div');
        taskdeleteDiv.classList.add('task-actions');

        tasktextDiv.appendChild(checkbox);
        tasktextDiv.appendChild(span);

        taskdeleteDiv.appendChild(editButton);
        taskdeleteDiv.appendChild(deleteButton);

        taskItemDiv.appendChild(tasktextDiv);
        taskItemDiv.appendChild(taskdeleteDiv);

        li.appendChild(taskItemDiv);
        ul.appendChild(li);
    }    
}

// 2. Listen for clicks anywhere inside the entire list
todoList.addEventListener('click', (event) => {
    
    // 3. Check if the element that was actually clicked has the delete class
    if (event.target.classList.contains('delete-task')) {
        
        // 4. Find the closest parent <li> of that specific button and delete it
        const li = event.target.closest('li');
        li.remove();
        saveTasks();
        countTask();
    }
});

clearCompleted.addEventListener('click' , (event) => {

    if (event.target.id === 'del-Comptask') {
        const tasks = document.querySelectorAll('.todo-container ul li');
        tasks.forEach(task => {
            const checkbox = task.querySelector('.task-checkbox');

            if (!checkbox) {
                return;
            }

            if(checkbox.checked) {
                const li = task.closest('li');
                li.remove();
            }      
        });
        saveTasks();
        countTask();
        updateFilterVisibility();
    }
});
todoList.addEventListener('click', (event) => {
    
    // 3. Check if the element that was actually clicked has the delete class
    if (event.target.classList.contains('edit-task')) {
        
        // 4. Find the closest parent <li> of that specific button and delete it
        const li = event.target.closest('li');
        taskText = li.querySelector('.task-text');
        taskText.contentEditable = true;
        taskText.focus();
        const eButton = event.target;
        if (eButton.textContent === 'Edit') {
            taskText.contentEditable = true;
            taskText.focus();
            eButton.textContent = 'Save';
            eButton.style.backgroundColor = '#2575fc';
        } else {
            taskText.contentEditable = false;
            eButton.textContent = 'Edit';
            eButton.style.backgroundColor = '#0bd232';
        }
        if (taskText.textContent.trim() === '') {
            showToast('Task cannot be empty. Deleting the task.');
            li.remove();
        }
    }
    updateFilterVisibility();
    saveTasks();
});


input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addButton.click();
    }
}); 

const showToast = (text) => {
    // Show it using JavaScript when needed
    const toast = document.getElementById('toast-message');
    toast.textContent = text;
    toast.style.display = 'block';

    // Automatically hide it after 3 seconds
    setTimeout(() => {
    toast.style.display = 'none';
    }, 3000);
}

const updateFilterVisibility = () => {
    const hasTask = document.querySelector('.todo-container ul li div div span') !== null;
       
    completedCount.style.display = hasTask ? 'block' : 'none';
    pendingCount.style.display = hasTask ? 'block' : 'none';
    
    if (filterButtons) {
        filterButtons.forEach(filterButtons => {
            filterButtons.style.display = hasTask ? 'block' : 'none';
            ;
        });    
    } 
    searchContainer.style.display = hasTask ? 'block' : 'none';
}
   
const filterTasks = () => {
    const all = document.getElementById('all');
    const completed = document.getElementById('completed');
    const pending = document.getElementById('pending');
    let activeFilter = 'all', completedCount = 0, pendingCount = 0;
    all.style.backgroundColor = "#0453da";

    const applyFilter = () => {
        const tasks = document.querySelectorAll('.todo-container ul li');
        
        tasks.forEach(task => {
            const checkbox = task.querySelector('.task-checkbox');
            if (!checkbox) {
                return;
            }

            // const shouldShow = activeFilter === 'all'
            //     || (activeFilter === 'completed' && checkbox.checked)
            //     || (activeFilter === 'pending' && !checkbox.checked);
            // task.style.display = shouldShow ? 'flex' : 'none';
            // console.log(shouldShow);
            
            if (activeFilter === 'all') {
                task.style.display = 'flex';    
            } 
            else if (activeFilter === 'completed') {
                task.style.display = checkbox.checked ? 'flex' : 'none'; 
                console.log(pendingCount);           
            } 
            else if (activeFilter === 'pending') {
                task.style.display = checkbox.checked ? 'none' : 'flex'; 
            }
        });
    };

    all.addEventListener('click', () => {
        activeFilter = 'all';
        all.style.backgroundColor = "#0453da";
        pending.style.backgroundColor = "#4183f5";
        completed.style.backgroundColor = "#4183f5";
        applyFilter();
    });

    completed.addEventListener('click', () => {
        activeFilter = 'completed';
        completed.style.backgroundColor = "#0453da";
        all.style.backgroundColor = "#4183f5";
        pending.style.backgroundColor = "#4183f5";
        applyFilter();
    });

    pending.addEventListener('click', () => {
        activeFilter = 'pending';
        pending.style.backgroundColor = "#0453da";
        all.style.backgroundColor = "#4183f5";
        completed.style.backgroundColor = "#4183f5";
        applyFilter();
    });

    todoList.addEventListener('change', event => {
        if (event.target.classList.contains('task-checkbox')) {
            applyFilter();
            saveTasks();
            countTask();
        }
    });

    return applyFilter;
};
const applyFilter = filterTasks();

const countTask = () => {
    let completedText = document.querySelector('#completedCount');
    let pendingText = document.querySelector('#pendingCount');
    const tasks = document.querySelectorAll('.todo-container ul li');
    let completedCount = 0, pendingCount = 0;
    tasks.forEach(task => {
        const checkbox = task.querySelector('.task-checkbox');

        if (!checkbox) {
            return;
        }

        if(checkbox.checked) completedCount++;
        else pendingCount++;      
    });
    completedText.textContent = `Completed ${completedCount}`;
    pendingText.textContent = `Pending ${pendingCount}`;
};
const SearchTask = () => {
    const tasks = document.querySelectorAll('.todo-container ul li');
    let searchInput = document.querySelector('#searchBar');
    let searchText = searchInput.value.trim().toLowerCase();

    tasks.forEach(task => {
        const taskText = task.querySelector('.task-text');
        const originalText = taskText.textContent;

        if (searchText === "") {
            task.style.display = 'block';
            taskText.textContent = originalText;
        } 
        else if (originalText.toLowerCase().includes(searchText)) {
            task.style.display = 'block';

            const regex = new RegExp(`(${searchText})`, 'gi');

            taskText.innerHTML = originalText.replace(
                regex,
                '<span class="highlight">$1</span>'
            );
        } 
        else {
            task.style.display = 'none';
            taskText.textContent = originalText;
        }
    });
};

searchButton.addEventListener('click', SearchTask);
searchInput.addEventListener('input', SearchTask);

searchInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        SearchTask();
    }
});


loadTasks();
updateFilterVisibility();
applyFilter();
countTask();
