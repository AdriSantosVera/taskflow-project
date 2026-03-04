// Elementos del DOM
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const search = document.getElementById("searchInput");

let tasks = [];

// Cargar tareas guardadas
function loadTasks() {
  const data = localStorage.getItem("tasks");
  tasks = data ? JSON.parse(data) : [];
}

// Guardar tareas
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Renderizar tareas
function renderTasks() {
  list.innerHTML = "";

  const query = search.value.toLowerCase();

  const filtered = tasks.filter(t =>
    t.text.toLowerCase().includes(query)
  );

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = "item";

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = task.text;

    const btn = document.createElement("button");
    btn.className = "del";
    btn.textContent = "Eliminar";

    btn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(btn);

    list.appendChild(li);
  });

  count.textContent = tasks.length;
  empty.style.display = tasks.length ? "none" : "block";
}

// Añadir tarea
form.addEventListener("submit", e => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  tasks.unshift({
    id: Date.now(),
    text
  });

  input.value = "";

  saveTasks();
  renderTasks();
});

// Buscar tareas
search.addEventListener("input", renderTasks);

// Inicializar
loadTasks();
renderTasks();