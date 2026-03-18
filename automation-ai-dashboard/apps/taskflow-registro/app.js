const STORAGE_KEY = "taskflow_registro_tasks_clean";
const THEME_KEY = "taskflow_registro_theme_clean";
const FOLDERS_KEY = "taskflow_registro_folders_clean";

let folders = loadFolders();
let tasks = loadTasks();
let selectedFolder = folders[0] || "General";
let selectedDate = formatDateKey(new Date());
let currentDate = new Date();
let currentFilter = "all";
let currentSort = "none";
let priorityFilter = "all";
let pendingDelete = null;
let editingTaskId = null;
let editingFolderName = null;

const $ = (id) => document.getElementById(id);

const foldersDiv = $("folders");
const tasksWrap = $("tasksWrap");
const searchInput = $("search");
const selectedDateLabel = $("selectedDateLabel");

const themeBtn = $("themeBtn");
const themeText = $("themeText");
const themeIcon = $("themeIcon");
const themeKnob = $("themeKnob");

const addBtn = $("addBtn");
const modal = $("modal");
const taskForm = $("taskForm");
const taskModalTitle = $("taskModalTitle");
const taskInput = $("taskInput");
const taskFolderSelect = $("taskFolderSelect");
const taskPrioritySelect = $("taskPrioritySelect");
const cancelBtn = $("cancelBtn");
const saveBtn = $("saveBtn");
const currentDateLabel = $("currentDateLabel");

const folderModal = $("folderModal");
const folderModalTitle = $("folderModalTitle");
const folderInput = $("folderInput");
const addFolderBtn = $("addFolderBtn");
const folderCancelBtn = $("folderCancelBtn");
const folderSaveBtn = $("folderSaveBtn");

const confirmModal = $("confirmModal");
const confirmTitle = $("confirmTitle");
const confirmText = $("confirmText");
const confirmCancel = $("confirmCancel");
const confirmOk = $("confirmOk");

const prevMonth = $("prevMonth");
const nextMonth = $("nextMonth");
const todayBtn = $("todayBtn");
const calendarTitle = $("calendarTitle");
const calendarGrid = $("calendarGrid");

const hh = $("hh");
const mm = $("mm");
const ampm = $("ampm");

const completedTasksStat = $("completedTasksStat");
const pendingTasksStat = $("pendingTasksStat");
const pendingNextDate = $("pendingNextDate");

const statusFilter = $("statusFilter");
const completeAllBtn = $("completeAllBtn");
const clearCompletedBtn = $("clearCompletedBtn");
const sortSelect = $("sortSelect");
const priorityFilterSelect = $("priorityFilter");

const taskTemplate = $("taskTemplate");
const bgParticles = $("bgParticles");

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const styles = {
  folderButton:
    "relative z-10 flex w-full items-center justify-between gap-2 rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition will-change-transform",
  folderButtonActive:
    "border-sky-200 bg-white text-slate-950 shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100",
  folderButtonIdle:
    "border-slate-200/80 bg-white/90 hover:-translate-y-0.5 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  folderEditHint:
    "hidden",
  emptyState:
    "rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400",
  calendarCell:
    "relative flex h-9 cursor-pointer items-center justify-center rounded-2xl text-[12px] font-bold transition",
  selectedCalendarCell:
    "ring-2 ring-sky-400 ring-offset-1 ring-offset-slate-900 dark:ring-sky-300 dark:ring-offset-slate-800",
  todayCalendarCell:
    "border border-white/20 bg-white/10 text-white",
  folderGroup:
    "rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950",
  groupHeader:
    "mb-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900",
  badge:
    "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  filterActive:
    "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100"
};

function loadFolders() {
  try {
    const saved = JSON.parse(localStorage.getItem(FOLDERS_KEY));
    return Array.isArray(saved) && saved.length
      ? saved
      : ["Contactos", "Páginas", "Desarrollo"];
  } catch {
    return ["Contactos", "Páginas", "Desarrollo"];
  }
}

function getDefaultTasks() {
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

  return [
    { id: crypto.randomUUID(), title: "Llamar a proveedor", completed: false, createdAt: today.toISOString(), folder: "Contactos", date: formatDateKey(today), priority: "alta" },
    { id: crypto.randomUUID(), title: "Enviar correo a cliente", completed: false, createdAt: today.toISOString(), folder: "Contactos", date: formatDateKey(today), priority: "media" },
    { id: crypto.randomUUID(), title: "Diseñar landing principal", completed: false, createdAt: tomorrow.toISOString(), folder: "Páginas", date: formatDateKey(tomorrow), priority: "alta" },
    { id: crypto.randomUUID(), title: "Corregir versión móvil", completed: false, createdAt: nextWeek.toISOString(), folder: "Páginas", date: formatDateKey(nextWeek), priority: "media" },
    { id: crypto.randomUUID(), title: "Revisar formulario login", completed: true, createdAt: today.toISOString(), folder: "Desarrollo", date: formatDateKey(today), priority: "baja" },
    { id: crypto.randomUUID(), title: "Subir cambios a Git", completed: true, createdAt: tomorrow.toISOString(), folder: "Desarrollo", date: formatDateKey(tomorrow), priority: "media" }
  ];
}

function normalizeTask(task) {
  return {
    id: task.id || crypto.randomUUID(),
    title: task.title || task.text || "Tarea sin título",
    completed: typeof task.completed === "boolean" ? task.completed : Boolean(task.done),
    createdAt: task.createdAt || new Date().toISOString(),
    folder: task.folder || folders[0] || "General",
    date: task.date || formatDateKey(new Date()),
    priority: task.priority || "media"
  };
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return getDefaultTasks();
    }

    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) {
      return getDefaultTasks();
    }

    return saved.map(normalizeTask);
  } catch {
    return getDefaultTasks();
  }
}

function syncInitialSelection() {
  if (!tasks.length) {
    if (!folders.length) {
      folders = ["General"];
      saveFolders();
    }
    selectedFolder = folders[0];
    selectedDate = formatDateKey(new Date());
    return;
  }

  const folderWithTasks = folders.find((folder) => tasks.some((task) => task.folder === folder));
  if (folderWithTasks) {
    selectedFolder = folderWithTasks;
  }

  const todayKey = formatDateKey(new Date());
  const hasTasksToday = tasks.some(
    (task) => task.folder === selectedFolder && task.date === todayKey
  );

  if (hasTasksToday) {
    selectedDate = todayKey;
    currentDate = new Date();
    return;
  }

  const firstTaskForFolder = tasks.find((task) => task.folder === selectedFolder) || tasks[0];
  if (firstTaskForFolder) {
    selectedDate = firstTaskForFolder.date;
    const [year, month] = firstTaskForFolder.date.split("-").map(Number);
    currentDate = new Date(year, month - 1, 1);
  }
}

function getVisibleTasksForFolder(folder) {
  const query = searchInput.value.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesFolder = task.folder === folder;
    const matchesDate = task.date === selectedDate;
    const matchesQuery =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.folder.toLowerCase().includes(query);
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesStatus =
      currentFilter === "all" ||
      (currentFilter === "pending" && !task.completed) ||
      (currentFilter === "completed" && task.completed);

    return matchesFolder && matchesDate && matchesQuery && matchesPriority && matchesStatus;
  });
}

function getFolderTaskCount(folder) {
  return getVisibleTasksForFolder(folder).length;
}

function syncDateForSelectedFolder(preferredDate = selectedDate) {
  const hasTasksOnPreferredDate = tasks.some(
    (task) => task.folder === selectedFolder && task.date === preferredDate
  );

  if (hasTasksOnPreferredDate) {
    selectedDate = preferredDate;
    const [year, month] = preferredDate.split("-").map(Number);
    currentDate = new Date(year, month - 1, 1);
    return;
  }

  const firstTaskForFolder = tasks.find((task) => task.folder === selectedFolder);
  if (firstTaskForFolder) {
    selectedDate = firstTaskForFolder.date;
    const [year, month] = firstTaskForFolder.date.split("-").map(Number);
    currentDate = new Date(year, month - 1, 1);
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function saveFolders() {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(date);
}

function openModal(element) {
  element.classList.remove("hidden");
  element.classList.add("flex");
}

function closeModal(element) {
  element.classList.add("hidden");
  element.classList.remove("flex");
}

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.classList.toggle("dark", isDark);
  themeText.textContent = isDark ? "Modo oscuro" : "Modo claro";
  themeIcon.textContent = isDark ? "🌙" : "☀️";
  themeKnob.style.transform = isDark ? "translateX(20px)" : "translateX(0)";
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);
}

function updateSelectedDateLabels() {
  const formatted = formatDisplayDate(selectedDate);
  selectedDateLabel.textContent = formatted;
  currentDateLabel.textContent = formatted;
}

function updateStats() {
  completedTasksStat.textContent = String(tasks.filter((task) => task.completed).length);
  const pendingTasks = tasks.filter((task) => !task.completed);
  pendingTasksStat.textContent = String(pendingTasks.length);

  if (!pendingTasks.length) {
    pendingNextDate.textContent = "Sin fecha pendiente";
    return;
  }

  const nextPendingTask = [...pendingTasks].sort((a, b) => a.date.localeCompare(b.date))[0];
  pendingNextDate.textContent = `Próxima: ${formatDisplayDate(nextPendingTask.date)}`;
}

function getFilteredTasks() {
  const query = searchInput.value.trim().toLowerCase();

  let result = tasks.filter((task) => {
    const matchesFolder = task.folder === selectedFolder;
    const matchesDate = task.date === selectedDate;
    const matchesQuery =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.folder.toLowerCase().includes(query);
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesStatus =
      currentFilter === "all" ||
      (currentFilter === "pending" && !task.completed) ||
      (currentFilter === "completed" && task.completed);

    return matchesFolder && matchesDate && matchesQuery && matchesPriority && matchesStatus;
  });

  if (currentSort === "az") {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title, "es"));
  }

  return result;
}

function addTask(title, folder, date, priority = "media") {
  tasks.unshift({
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
    folder,
    date,
    priority
  });

  saveTasks();
}

function updateTask(id, updates) {
  tasks = tasks.map((task) => (
    task.id === id ? normalizeTask({ ...task, ...updates }) : task
  ));
  saveTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
}

function deleteFolder(folderName) {
  folders = folders.filter((folder) => folder !== folderName);
  tasks = tasks.filter((task) => task.folder !== folderName);

  if (!folders.length) {
    folders = ["General"];
  }

  if (!folders.includes(selectedFolder)) {
    selectedFolder = folders[0];
  }

  saveFolders();
  saveTasks();
}

function addFolder(name) {
  folders.push(name);
  saveFolders();
}

function renameFolder(previousName, nextName) {
  folders = folders.map((folder) => (folder === previousName ? nextName : folder));
  tasks = tasks.map((task) => (
    task.folder === previousName ? { ...task, folder: nextName } : task
  ));

  if (selectedFolder === previousName) {
    selectedFolder = nextName;
  }

  saveFolders();
  saveTasks();
}

function openTaskModal(task = null) {
  editingTaskId = task ? task.id : null;
  taskModalTitle.textContent = task ? "Editar tarea" : "Nueva tarea";
  saveBtn.textContent = task ? "Actualizar" : "Guardar";
  taskInput.value = task ? task.title : "";
  taskFolderSelect.innerHTML = "";

  folders.forEach((folder) => {
    const option = document.createElement("option");
    option.value = folder;
    option.textContent = folder;
    taskFolderSelect.appendChild(option);
  });

  taskFolderSelect.value = task ? task.folder : selectedFolder;
  taskPrioritySelect.value = task ? task.priority : "media";
  updateSelectedDateLabels();
  openModal(modal);
  taskInput.focus();
}

function openFolderModal(folderName = "") {
  editingFolderName = folderName || null;
  folderModalTitle.textContent = folderName ? "Editar carpeta" : "Nueva carpeta";
  folderSaveBtn.textContent = folderName ? "Actualizar" : "Guardar";
  folderInput.value = folderName;
  openModal(folderModal);
  folderInput.focus();
}

function attachSwipeToEdit(target, onEdit, hint = null) {
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  const pointerDown = (event) => {
    startX = event.clientX;
    currentX = 0;
    dragging = true;
    target.style.transition = "none";
    if (hint) {
      hint.style.opacity = "0";
    }
  };

  const pointerMove = (event) => {
    if (!dragging) return;

    currentX = Math.max(0, Math.min(event.clientX - startX, 90));
    target.style.transform = `translateX(${currentX}px)`;
    if (hint) {
      hint.style.opacity = currentX > 12 ? "1" : "0";
    }
  };

  const pointerUp = () => {
    if (!dragging) return;

    dragging = false;
    target.style.transition = "transform 150ms ease";

    if (currentX > 56) {
      target.style.transform = "translateX(0)";
      if (hint) {
        hint.style.opacity = "0";
      }
      onEdit();
      return;
    }

    target.style.transform = "translateX(0)";
    if (hint) {
      hint.style.opacity = "0";
    }
  };

  target.addEventListener("pointerdown", pointerDown);
  target.addEventListener("pointermove", pointerMove);
  target.addEventListener("pointerup", pointerUp);
  target.addEventListener("pointercancel", pointerUp);
  target.addEventListener("pointerleave", pointerUp);
}

function openDeleteModal(payload) {
  pendingDelete = payload;

  if (payload.type === "folder") {
    confirmTitle.textContent = "Eliminar carpeta";
    const count = tasks.filter((task) => task.folder === payload.folder).length;
    confirmText.textContent =
      `¿Seguro que quieres borrar la carpeta?\n\n"${payload.folder}"\n\nTambién se eliminarán ${count} tarea${count === 1 ? "" : "s"}.`;
  } else {
    confirmTitle.textContent = "Eliminar tarea";
    confirmText.textContent = `¿Seguro que quieres borrar esta tarea?\n\n"${payload.title}"`;
  }

  openModal(confirmModal);
}

function renderFolders() {
  foldersDiv.innerHTML = "";

  folders.forEach((folder) => {
    const isActive = folder === selectedFolder;
    const wrapper = document.createElement("div");
    wrapper.className = "relative overflow-hidden rounded-xl";

    const hint = document.createElement("div");
    hint.className = `absolute inset-y-0 left-0 flex items-center pl-4 ${styles.folderEditHint}`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = `${styles.folderButton} ${
      isActive ? styles.folderButtonActive : styles.folderButtonIdle
    }`;

    const label = document.createElement("span");
    label.className = "truncate";
    const countClass = isActive
      ? "text-slate-600 dark:text-slate-300"
      : "text-slate-400 dark:text-slate-400";
    const iconClass = isActive
      ? "bg-sky-100 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100";
    label.innerHTML = `
      <span class="flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-2xl ${iconClass}">📁</span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-extrabold">${folder}</span>
          <span class="block text-xs font-medium ${countClass}">${getFolderTaskCount(folder)} tareas visibles</span>
        </span>
      </span>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className =
      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-700 transition hover:bg-red-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-red-900/40 dark:hover:text-red-300";
    deleteButton.textContent = "🗑";
    deleteButton.setAttribute("aria-label", `Eliminar carpeta ${folder}`);
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openDeleteModal({ type: "folder", folder });
    });

    const actions = document.createElement("div");
    actions.className = "flex items-center gap-2";
    actions.append(deleteButton);

    button.append(label, actions);
    button.addEventListener("click", () => {
      selectedFolder = folder;
      syncDateForSelectedFolder(selectedDate);
      updateSelectedDateLabels();
      renderFolders();
      renderCalendar();
      renderTasks();
    });

    attachSwipeToEdit(button, () => openFolderModal(folder), hint);

    wrapper.append(hint, button);
    foldersDiv.appendChild(wrapper);
  });
}

function renderEmptyState() {
  const emptyState = document.createElement("div");
  emptyState.className = styles.emptyState;
  emptyState.innerHTML = `
    <div class="flex items-start gap-4">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-xl dark:bg-sky-950/50">🗂️</div>
      <div>
        <p class="font-bold text-slate-700 dark:text-slate-200">No hay tareas para esta combinación.</p>
        <p class="mt-1">Selecciona otra fecha, cambia el filtro o añade una tarea nueva en <strong>${selectedFolder}</strong>.</p>
      </div>
    </div>
  `;
  tasksWrap.appendChild(emptyState);
}

function createTaskRow(task) {
  const rowNode = taskTemplate.content.firstElementChild.cloneNode(true);
  const hint = rowNode.querySelector("[data-task-edit-hint]");
  const row = rowNode.querySelector("[data-task-row]");
  const checkbox = rowNode.querySelector("[data-task-checkbox]");
  const title = rowNode.querySelector("[data-task-title]");
  const meta = rowNode.querySelector("[data-task-meta]");
  const priority = rowNode.querySelector("[data-task-priority]");
  const removeButton = rowNode.querySelector("[data-task-delete]");

  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `Marcar tarea ${task.title}`);
  checkbox.addEventListener("change", () => {
    updateTask(task.id, { completed: checkbox.checked });
    renderTasks();
  });

  title.textContent = task.title;
  meta.textContent = `${task.completed ? "Completada" : "Pendiente"} · ${formatDisplayDate(task.date)}`;
  priority.textContent = task.priority;

  if (task.priority === "alta") {
    priority.className = "rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-rose-700 dark:bg-rose-950/40 dark:text-rose-300";
  } else if (task.priority === "media") {
    priority.className = "rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  } else {
    priority.className = "rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  }

  if (task.completed) {
    title.classList.add("line-through", "text-slate-400", "dark:text-slate-500");
  }

  removeButton.setAttribute("aria-label", `Eliminar tarea ${task.title}`);
  removeButton.addEventListener("click", () => {
    openDeleteModal({ type: "task", id: task.id, title: task.title });
  });

  attachSwipeToEdit(row, () => openTaskModal(task), hint);

  return rowNode;
}

function renderTasks() {
  tasksWrap.innerHTML = "";
  updateStats();

  const filteredTasks = getFilteredTasks();

  if (!filteredTasks.length) {
    renderEmptyState();
    return;
  }

  const group = document.createElement("section");
  group.className = styles.folderGroup;

  const header = document.createElement("div");
  header.className = styles.groupHeader;

  const title = document.createElement("div");
  title.innerHTML = `
    <h2 class="text-base font-black">${selectedFolder}</h2>
    <p class="text-sm text-slate-500 dark:text-slate-400">${formatDisplayDate(selectedDate)}</p>
  `;

  const badge = document.createElement("span");
  badge.className = styles.badge;
  badge.textContent = `${filteredTasks.length} tarea${filteredTasks.length === 1 ? "" : "s"}`;

  header.append(title, badge);
  group.appendChild(header);

  filteredTasks.forEach((task) => {
    group.appendChild(createTaskRow(task));
  });

  tasksWrap.appendChild(group);
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  const todayKey = formatDateKey(new Date());

  calendarTitle.textContent = `${monthNames[month]} ${year}`;
  calendarGrid.innerHTML = "";

  for (let i = 0; i < startDay; i += 1) {
    const blank = document.createElement("div");
    blank.className = "h-8";
    calendarGrid.appendChild(blank);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const cellDate = new Date(year, month, day);
    const cellDateKey = formatDateKey(cellDate);
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = styles.calendarCell;
    cell.textContent = String(day);
    cell.setAttribute("aria-label", `Seleccionar ${formatDisplayDate(cellDateKey)}`);

    if (cellDateKey === todayKey) {
      cell.classList.add(...styles.todayCalendarCell.split(" "));
    } else {
      cell.classList.add("text-slate-300", "hover:bg-white/10");
    }

    if (cellDateKey === selectedDate) {
      cell.classList.add(...styles.selectedCalendarCell.split(" "));
      if (cellDateKey === todayKey) {
        cell.classList.add("bg-sky-300", "text-slate-950", "border-sky-200");
      } else {
        cell.classList.add("bg-white", "text-slate-950", "shadow-sm");
      }
    }

    if (tasks.some((task) => task.date === cellDateKey)) {
      const dot = document.createElement("span");
      dot.className = "absolute bottom-1 h-1.5 w-1.5 rounded-full bg-sky-300";
      cell.appendChild(dot);
    }

    cell.addEventListener("click", () => {
      selectedDate = cellDateKey;
      updateSelectedDateLabels();
      renderCalendar();
      renderTasks();
    });

    calendarGrid.appendChild(cell);
  }
}

function updateClock() {
  const now = new Date();
  let hour = now.getHours();
  const minute = now.getMinutes();
  const meridian = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  hh.textContent = String(hour).padStart(2, "0");
  mm.textContent = String(minute).padStart(2, "0");
  ampm.textContent = meridian;
}

function initParticles() {
  if (!bgParticles) return;

  const ctx = bgParticles.getContext("2d");
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = {
    width: 0,
    height: 0,
    particles: [],
    animationId: null
  };

  const colors = {
    light: "rgba(37, 99, 235, 0.35)",
    dark: "rgba(56, 189, 248, 0.35)"
  };

  const resize = () => {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    bgParticles.width = Math.floor(state.width * window.devicePixelRatio);
    bgParticles.height = Math.floor(state.height * window.devicePixelRatio);
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    const targetCount = Math.min(90, Math.max(40, Math.floor(state.width / 14)));
    state.particles = Array.from({ length: targetCount }, () => ({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      r: 1 + Math.random() * 2.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: 0.15 + Math.random() * 0.35
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, state.width, state.height);
    const isDark = document.documentElement.classList.contains("dark");
    const baseColor = isDark ? colors.dark : colors.light;

    for (const particle of state.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20) particle.x = state.width + 20;
      if (particle.x > state.width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = state.height + 20;
      if (particle.y > state.height + 20) particle.y = -20;

      ctx.beginPath();
      ctx.fillStyle = baseColor.replace("0.35", particle.alpha.toFixed(2));
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    }

    state.animationId = window.requestAnimationFrame(draw);
  };

  const stop = () => {
    if (state.animationId) {
      window.cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
  };

  resize();

  if (!prefersReducedMotion) {
    draw();
  } else {
    ctx.clearRect(0, 0, state.width, state.height);
  }

  window.addEventListener("resize", () => {
    stop();
    resize();
    if (!prefersReducedMotion) {
      draw();
    }
  });
}

function completeAllVisibleTasks() {
  const visibleTaskIds = getFilteredTasks()
    .filter((task) => !task.completed)
    .map((task) => task.id);

  if (!visibleTaskIds.length) return;

  tasks = tasks.map((task) => (
    visibleTaskIds.includes(task.id) ? { ...task, completed: true } : task
  ));

  saveTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
}

themeBtn.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");
  const nextTheme = isDark ? "light" : "dark";

  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
  renderCalendar();
});

addBtn.addEventListener("click", () => {
  openTaskModal();
});

cancelBtn.addEventListener("click", () => {
  editingTaskId = null;
  closeModal(modal);
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  const folder = taskFolderSelect.value;
  const priority = taskPrioritySelect.value;

  if (!title) {
    taskInput.focus();
    return;
  }

  if (editingTaskId) {
    updateTask(editingTaskId, { title, folder, date: selectedDate, priority });
  } else {
    addTask(title, folder, selectedDate, priority);
  }

  selectedFolder = folder;
  editingTaskId = null;
  renderFolders();
  renderTasks();
  renderCalendar();
  closeModal(modal);
});

addFolderBtn.addEventListener("click", () => {
  openFolderModal();
});

folderCancelBtn.addEventListener("click", () => {
  editingFolderName = null;
  closeModal(folderModal);
});

folderSaveBtn.addEventListener("click", () => {
  const nextName = folderInput.value.trim();
  if (!nextName) {
    folderInput.focus();
    return;
  }

  const duplicated = folders.some((folder) => folder.toLowerCase() === nextName.toLowerCase());
  if (duplicated && editingFolderName?.toLowerCase() !== nextName.toLowerCase()) {
    folderInput.focus();
    return;
  }

  if (editingFolderName) {
    renameFolder(editingFolderName, nextName);
  } else {
    addFolder(nextName);
    selectedFolder = nextName;
  }

  editingFolderName = null;
  renderFolders();
  renderTasks();
  closeModal(folderModal);
});

confirmCancel.addEventListener("click", () => {
  pendingDelete = null;
  closeModal(confirmModal);
});

confirmOk.addEventListener("click", () => {
  if (!pendingDelete) return;

  if (pendingDelete.type === "folder") {
    deleteFolder(pendingDelete.folder);
    renderFolders();
  } else {
    deleteTask(pendingDelete.id);
  }

  pendingDelete = null;
  renderTasks();
  renderCalendar();
  closeModal(confirmModal);
});

searchInput.addEventListener("input", () => {
  renderFolders();
  renderTasks();
});

statusFilter.addEventListener("change", () => {
  currentFilter = statusFilter.value;
  renderFolders();
  renderTasks();
});

sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  renderTasks();
});

priorityFilterSelect.addEventListener("change", () => {
  priorityFilter = priorityFilterSelect.value;
  renderFolders();
  renderTasks();
});

completeAllBtn.addEventListener("click", () => {
  completeAllVisibleTasks();
  renderTasks();
});

clearCompletedBtn.addEventListener("click", () => {
  clearCompletedTasks();
  renderFolders();
  renderTasks();
  renderCalendar();
});

prevMonth.addEventListener("click", () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  renderCalendar();
});

todayBtn.addEventListener("click", () => {
  const today = new Date();
  currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
  selectedDate = formatDateKey(today);
  updateSelectedDateLabels();
  renderCalendar();
  renderTasks();
});

loadTheme();
syncInitialSelection();
updateSelectedDateLabels();
renderFolders();
renderTasks();
renderCalendar();
updateClock();
initParticles();

setInterval(updateClock, 60_000);
