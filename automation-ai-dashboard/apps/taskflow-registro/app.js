const STORAGE_KEY = "taskflow_registro_tasks_clean";
const THEME_KEY = "taskflow_registro_theme_clean";

const folders = ["Contactos", "Páginas", "Desarrollo"];

let selectedFolder = "Contactos";
let currentDate = new Date();
let pendingDeleteId = null;

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { id: Date.now() + 1, folder: "Contactos", text: "Llamar a proveedor", done: false },
  { id: Date.now() + 2, folder: "Contactos", text: "Enviar correo a cliente", done: false },
  { id: Date.now() + 3, folder: "Páginas", text: "Diseñar landing principal", done: false },
  { id: Date.now() + 4, folder: "Páginas", text: "Corregir versión móvil", done: false },
  { id: Date.now() + 5, folder: "Desarrollo", text: "Revisar formulario login", done: true },
  { id: Date.now() + 6, folder: "Desarrollo", text: "Subir cambios a Git", done: true }
];

/**
 * Shortcut para seleccionar elementos del DOM por id.
 * @param {string} id
 * @returns {HTMLElement | null}
 */
const $ = (id) => document.getElementById(id);

// Main interface
const foldersDiv = $("folders");
const tasksWrap = $("tasksWrap");
const searchInput = $("search");

// Theme switch
const themeBtn = $("themeBtn");
const themeText = $("themeText");
const themeIcon = $("themeIcon");
const themeKnob = $("themeKnob");

// Add task modal
const addBtn = $("addBtn");
const modal = $("modal");
const taskInput = $("taskInput");
const cancelBtn = $("cancelBtn");
const saveBtn = $("saveBtn");
const currentFolderLabel = $("currentFolderLabel");

// Delete confirmation modal
const confirmModal = $("confirmModal");
const confirmText = $("confirmText");
const confirmCancel = $("confirmCancel");
const confirmOk = $("confirmOk");

// Calendar
const prevMonth = $("prevMonth");
const nextMonth = $("nextMonth");
const calendarTitle = $("calendarTitle");
const calendarGrid = $("calendarGrid");

// Clock
const hh = $("hh");
const mm = $("mm");
const ampm = $("ampm");

/**
 * Persists current task list in localStorage.
 */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Applies theme state to the root element and updates
 * the switch visual state.
 * @param {"light" | "dark"} theme
 */
function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.classList.toggle("dark", isDark);

  themeText.textContent = isDark ? "Modo oscuro" : "Modo claro";
  themeIcon.textContent = isDark ? "🌙" : "☀️";
  themeKnob.style.transform = isDark ? "translateX(20px)" : "translateX(0)";
}

/**
 * Loads the saved theme. Falls back to light mode.
 */
function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);
}

themeBtn.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");
  const nextTheme = isDark ? "light" : "dark";

  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
  renderCalendar();
});

/**
 * Renders the sidebar folders and highlights the selected one.
 */
function renderFolders() {
  foldersDiv.innerHTML = "";

  folders.forEach((folder) => {
    const isActive = folder === selectedFolder;
    const button = document.createElement("button");

    button.className =
      "block w-full rounded-xl border px-3 py-2 text-left text-sm font-semibold transition " +
      (isActive
        ? "border-slate-300 bg-slate-200/80 dark:border-slate-700 dark:bg-slate-800"
        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800");

    button.innerHTML = `📁 ${folder}`;

    button.addEventListener("click", () => {
      selectedFolder = folder;
      currentFolderLabel.textContent = selectedFolder;
      renderFolders();
    });

    foldersDiv.appendChild(button);
  });
}

/**
 * Returns the task list filtered by the global search input.
 * The search checks both task title and folder name.
 * @returns {Array}
 */
function getFilteredTasks() {
  let list = [...tasks];
  const query = searchInput.value.trim().toLowerCase();

  if (query) {
    list = list.filter((task) => {
      return (
        task.text.toLowerCase().includes(query) ||
        task.folder.toLowerCase().includes(query)
      );
    });
  }

  return list;
}

/**
 * Groups tasks by folder.
 * @param {Array} list
 * @returns {Record<string, Array>}
 */
function groupTasks(list) {
  const grouped = {};

  list.forEach((task) => {
    if (!grouped[task.folder]) {
      grouped[task.folder] = [];
    }

    grouped[task.folder].push(task);
  });

  return grouped;
}

/**
 * Renders grouped task blocks in the main content area.
 */
function renderTasks() {
  tasksWrap.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className =
      "rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400";
    emptyState.textContent = "No hay tareas que coincidan.";
    tasksWrap.appendChild(emptyState);
    return;
  }

  const groupedTasks = groupTasks(filteredTasks);

  folders.forEach((folder) => {
    if (!groupedTasks[folder]) return;

    const block = document.createElement("div");
    block.className =
      "rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950";

    const header = document.createElement("button");
    header.type = "button";
    header.className =
      "flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800";

    const content = document.createElement("div");
    content.className = "mt-2 space-y-2";

    let isOpen = true;

    header.innerHTML = `
      <div class="flex items-center gap-2">
        <span>📁</span>
        <span class="font-extrabold">${folder}</span>
      </div>
      <span class="text-slate-500">▾</span>
    `;

    header.addEventListener("click", () => {
      isOpen = !isOpen;
      content.style.display = isOpen ? "block" : "none";
    });

    groupedTasks[folder].forEach((task) => {
      const row = document.createElement("div");
      row.className =
        "flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900";

      const left = document.createElement("div");
      left.className = "flex min-w-0 items-center gap-3";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.className = "h-5 w-5 accent-slate-900 dark:accent-white";

      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      const text = document.createElement("span");
      text.className = "truncate text-sm font-semibold";
      text.textContent = task.text;

      if (task.done) {
        text.classList.add("line-through", "text-slate-400", "dark:text-slate-500");
      }

      left.append(checkbox, text);

      const removeButton = document.createElement("button");
      removeButton.className =
        "rounded-lg px-2 py-1 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800";
      removeButton.textContent = "🗑";

      removeButton.addEventListener("click", () => {
        pendingDeleteId = task.id;
        confirmText.textContent = `¿Seguro que quieres borrar esta tarea?\n\n"${task.text}"`;
        confirmModal.classList.remove("hidden");
        confirmModal.classList.add("flex");
      });

      row.append(left, removeButton);
      content.appendChild(row);
    });

    block.append(header, content);
    tasksWrap.appendChild(block);
  });
}

/**
 * Opens the add task modal and displays the selected folder.
 */
addBtn.addEventListener("click", () => {
  currentFolderLabel.textContent = selectedFolder;
  taskInput.value = "";
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  taskInput.focus();
});

/**
 * Closes the add task modal.
 */
cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

/**
 * Creates a new task in the currently selected folder.
 */
saveBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();

  if (!text) return;

  tasks.unshift({
    id: Date.now(),
    folder: selectedFolder,
    text,
    done: false
  });

  saveTasks();
  renderTasks();

  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

/**
 * Closes the delete confirmation modal.
 */
confirmCancel.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
  confirmModal.classList.remove("flex");
  pendingDeleteId = null;
});

/**
 * Deletes the currently selected task after confirmation.
 */
confirmOk.addEventListener("click", () => {
  if (!pendingDeleteId) return;

  tasks = tasks.filter((task) => task.id !== pendingDeleteId);
  saveTasks();
  renderTasks();

  confirmModal.classList.add("hidden");
  confirmModal.classList.remove("flex");
  pendingDeleteId = null;
});

// Global search
searchInput.addEventListener("input", renderTasks);

/**
 * Renders the month calendar shown in the sidebar.
 */
function renderCalendar() {
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  const totalDays = lastDay.getDate();

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const isDark = document.documentElement.classList.contains("dark");

  calendarTitle.textContent = `${monthNames[month]} ${year}`;
  calendarGrid.innerHTML = "";

  for (let i = 0; i < startDay; i++) {
    const blank = document.createElement("div");
    blank.className = "h-7";
    calendarGrid.appendChild(blank);
  }

  for (let day = 1; day <= totalDays; day++) {
    const isToday = isCurrentMonth && today.getDate() === day;
    const cell = document.createElement("div");

    cell.className = "flex h-7 items-center justify-center rounded-lg text-[11px] font-bold transition";

    if (isDark) {
      if (isToday) {
        cell.classList.add("bg-white", "text-slate-900");
      } else {
        cell.classList.add("text-slate-300", "hover:bg-white/10");
      }
    } else {
      if (isToday) {
        cell.classList.add("bg-slate-900", "text-white");
      } else {
        cell.classList.add("text-slate-200", "hover:bg-white/10");
      }
    }

    cell.textContent = day;
    calendarGrid.appendChild(cell);
  }
}

prevMonth.addEventListener("click", () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  renderCalendar();
});

/**
 * Updates the digital clock shown in the header.
 */
function updateClock() {
  const now = new Date();

  let hour = now.getHours();
  const minute = now.getMinutes();
  const meridian = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  if (hour === 0) hour = 12;

  hh.textContent = String(hour).padStart(2, "0");
  mm.textContent = String(minute).padStart(2, "0");
  ampm.textContent = meridian;
}

// Initial render
loadTheme();
renderFolders();
renderTasks();
renderCalendar();
updateClock();

setInterval(updateClock, 1000);