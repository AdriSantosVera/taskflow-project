import {
  crearCategoria,
  crearTarea,
  actualizarTarea,
  eliminarCategoria,
  eliminarTarea,
  obtenerCategorias,
  obtenerTareas
} from "./src/api/client.js";
import { getPriorityCssClasses, pluralize } from "./src/utils.js";

const $ = (id) => document.getElementById(id);

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const BASE_FOLDERS = new Set(["Todas", "Trabajo", "Estudios", "Personal"]);

const state = {
  tasks: [],
  folders: [],
  selectedFolder: "General",
  selectedDate: formatDateKey(new Date()),
  currentDate: new Date(),
  statusFilter: "all",
  sortFilter: "none",
  priorityFilter: "all",
  searchQuery: "",
  theme: "light",
  editingTaskId: null,
  editingFolderName: null,
  pendingDelete: null
};

const els = {
  themeBtn: $("themeBtn"),
  themeText: $("themeText"),
  themeIcon: $("themeIcon"),
  themeKnob: $("themeKnob"),
  folders: $("folders"),
  addFolderBtn: $("addFolderBtn"),
  prevMonth: $("prevMonth"),
  nextMonth: $("nextMonth"),
  todayBtn: $("todayBtn"),
  calendarTitle: $("calendarTitle"),
  calendarGrid: $("calendarGrid"),
  completedTasksStat: $("completedTasksStat"),
  pendingTasksStat: $("pendingTasksStat"),
  pendingNextDate: $("pendingNextDate"),
  selectedDateLabel: $("selectedDateLabel"),
  clearDateFilterBtn: $("clearDateFilterBtn"),
  addBtn: $("addBtn"),
  search: $("search"),
  completeAllBtn: $("completeAllBtn"),
  clearCompletedBtn: $("clearCompletedBtn"),
  statusFilter: $("statusFilter"),
  sortFilter: $("sortFilter"),
  priorityFilter: $("priorityFilter"),
  feedbackMessage: $("feedbackMessage"),
  tasksWrap: $("tasksWrap"),
  hh: $("hh"),
  mm: $("mm"),
  ampm: $("ampm"),
  modal: $("modal"),
  taskForm: $("taskForm"),
  taskModalTitle: $("taskModalTitle"),
  taskInput: $("taskInput"),
  taskFolderSelect: $("taskFolderSelect"),
  taskPrioritySelect: $("taskPrioritySelect"),
  currentDateLabel: $("currentDateLabel"),
  cancelBtn: $("cancelBtn"),
  saveBtn: $("saveBtn"),
  folderModal: $("folderModal"),
  folderModalTitle: $("folderModalTitle"),
  folderInput: $("folderInput"),
  folderCancelBtn: $("folderCancelBtn"),
  folderSaveBtn: $("folderSaveBtn"),
  confirmModal: $("confirmModal"),
  confirmTitle: $("confirmTitle"),
  confirmText: $("confirmText"),
  confirmCancel: $("confirmCancel"),
  confirmOk: $("confirmOk"),
  taskTemplate: $("taskTemplate")
};

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDisplayDate(dateKey) {
  if (!dateKey) {
    return "Todas las fechas";
  }

  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(parseDateKey(dateKey));
}

function normalizeTask(task) {
  return {
    id: task.id,
    title: task.title ?? task.texto ?? "Sin título",
    completed: task.completed ?? task.completada ?? false,
    createdAt: task.createdAt ?? new Date().toISOString(),
    folder: task.folder ?? task.categoria ?? "General",
    date: task.date ?? task.fecha ?? null,
    priority: task.priority ?? task.prioridad ?? "media"
  };
}

function getVisibleTasks() {
  const query = state.searchQuery.trim().toLowerCase();

  let filtered = state.tasks.filter((task) => {
    const matchesFolder = task.folder === state.selectedFolder;
    const matchesDate = !state.selectedDate || task.date === state.selectedDate;
    const matchesSearch =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.folder.toLowerCase().includes(query) ||
      task.priority.toLowerCase().includes(query);
    const matchesStatus =
      state.statusFilter === "all" ||
      (state.statusFilter === "pending" && !task.completed) ||
      (state.statusFilter === "completed" && task.completed);
    const matchesPriority =
      state.priorityFilter === "all" || task.priority === state.priorityFilter;

    return matchesFolder && matchesDate && matchesSearch && matchesStatus && matchesPriority;
  });

  if (state.sortFilter === "az") {
    filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title, "es"));
  } else if (state.sortFilter === "za") {
    filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title, "es"));
  }

  return filtered;
}

function getFolderVisibleCount(folderName) {
  return state.tasks.filter((task) => {
    const matchesFolder = task.folder === folderName;
    const matchesDate = !state.selectedDate || task.date === state.selectedDate;
    const matchesStatus =
      state.statusFilter === "all" ||
      (state.statusFilter === "pending" && !task.completed) ||
      (state.statusFilter === "completed" && task.completed);
    const matchesPriority =
      state.priorityFilter === "all" || task.priority === state.priorityFilter;
    const matchesSearch =
      !state.searchQuery ||
      task.title.toLowerCase().includes(state.searchQuery) ||
      task.folder.toLowerCase().includes(state.searchQuery) ||
      task.priority.toLowerCase().includes(state.searchQuery);

    return matchesFolder && matchesDate && matchesStatus && matchesPriority && matchesSearch;
  }).length;
}

function showFeedback(message, kind = "error") {
  els.feedbackMessage.textContent = message;
  els.feedbackMessage.className =
    "bottom-6 left-1/2 z-[60] w-[140px] -translate-x-1/2 rounded-2xl border px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur transition-opacity duration-300";

  if (kind === "error") {
    els.feedbackMessage.classList.add(
      "block",
      "border-red-200",
      "bg-red-50",
      "text-red-700",
      "dark:border-red-900/40",
      "dark:bg-red-950/60",
      "dark:text-red-200"
    );
  } else {
    els.feedbackMessage.classList.add(
      "block",
      "border-emerald-200",
      "bg-emerald-50",
      "text-emerald-700",
      "dark:border-emerald-900/40",
      "dark:bg-emerald-950/60",
      "dark:text-emerald-200"
    );
  }

  window.clearTimeout(showFeedback.timeoutId);
  showFeedback.timeoutId = window.setTimeout(() => {
    els.feedbackMessage.classList.add("hidden");
  }, 3000);
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
  state.theme = theme;
  els.themeText.textContent = isDark ? "Modo oscuro" : "Modo claro";
  els.themeIcon.textContent = isDark ? "🌙" : "☀️";
  els.themeKnob.style.transform = isDark ? "translateX(20px)" : "translateX(0)";
}

function updateClock() {
  const now = new Date();
  let hour = now.getHours();
  const minute = now.getMinutes();
  const meridian = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  els.hh.textContent = String(hour).padStart(2, "0");
  els.mm.textContent = String(minute).padStart(2, "0");
  els.ampm.textContent = meridian;
}

function updateDateLabels() {
  els.selectedDateLabel.textContent = state.selectedDate ? formatDisplayDate(state.selectedDate) : "—";
  els.currentDateLabel.textContent = state.selectedDate ? formatDisplayDate(state.selectedDate) : "Sin filtro de fecha";
}

function updateStats() {
  const completed = state.tasks.filter((task) => task.completed).length;
  const pendingTasks = state.tasks.filter((task) => !task.completed);
  els.completedTasksStat.textContent = String(completed);
  els.pendingTasksStat.textContent = String(pendingTasks.length);

  if (!pendingTasks.length) {
    els.pendingNextDate.textContent = "Sin fecha pendiente";
    return;
  }

  const dated = pendingTasks.filter((task) => task.date).sort((a, b) => a.date.localeCompare(b.date));
  els.pendingNextDate.textContent = dated.length ? formatDisplayDate(dated[0].date) : "Sin fecha pendiente";
}

function attachSwipeToEdit(target, onEdit) {
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  const onPointerDown = (event) => {
    if (event.target.closest("[data-folder-delete]")) {
      return;
    }

    startX = event.clientX;
    currentX = 0;
    dragging = true;
    target.style.transition = "none";
  };

  const onPointerMove = (event) => {
    if (!dragging) {
      return;
    }

    currentX = Math.max(0, Math.min(event.clientX - startX, 84));
    target.style.transform = `translateX(${currentX}px)`;
  };

  const onPointerUp = () => {
    if (!dragging) {
      return;
    }

    dragging = false;
    target.style.transition = "transform 160ms ease";
    target.style.transform = "translateX(0)";

    if (currentX > 56) {
      onEdit();
    }
  };

  target.addEventListener("pointerdown", onPointerDown);
  target.addEventListener("pointermove", onPointerMove);
  target.addEventListener("pointerup", onPointerUp);
  target.addEventListener("pointercancel", onPointerUp);
  target.addEventListener("pointerleave", onPointerUp);
}

function renderFolders() {
  els.folders.innerHTML = "";

  state.folders.forEach((folder) => {
    const isBaseFolder = BASE_FOLDERS.has(folder);
    const button = document.createElement("button");
    button.type = "button";
    button.className = [
      "flex w-full items-center justify-between rounded-[24px] border px-4 py-3 text-left shadow-sm transition",
      folder === state.selectedFolder
        ? "border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/30"
        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    ].join(" ");

    button.innerHTML = `
      <span class="flex items-center gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-lg dark:bg-slate-800">📁</span>
        <span>
          <span class="block text-sm font-extrabold text-slate-800 dark:text-slate-100">${folder}</span>
          <span class="block text-sm text-slate-400">${getFolderVisibleCount(folder)} tareas visibles</span>
        </span>
      </span>
      ${
        isBaseFolder
          ? ""
          : `<button type="button" data-folder-delete="${folder}" class="rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">🗑</button>`
      }
    `;

    button.addEventListener("click", (event) => {
      if (event.target.closest("[data-folder-delete]")) {
        return;
      }

      state.selectedFolder = folder;
      renderAll();
    });

    attachSwipeToEdit(button, () => {
      state.editingFolderName = folder;
      els.folderModalTitle.textContent = "Editar carpeta";
      els.folderInput.value = folder;
      openModal(els.folderModal);
      els.folderInput.focus();
    });

    const deleteBtn = button.querySelector("[data-folder-delete]");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", async (event) => {
        event.stopPropagation();
        try {
          await eliminarCategoria(folder);
          if (state.selectedFolder === folder) {
            state.selectedFolder = "Todas";
          }
          await loadCategories();
          renderAll();
          showFeedback("Carpeta eliminada", "success");
        } catch (error) {
          showFeedback(error.message);
        }
      });
    }

    els.folders.appendChild(button);
  });
}

function renderCalendar() {
  const year = state.currentDate.getFullYear();
  const month = state.currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  els.calendarTitle.textContent = `${monthNames[month]} ${year}`;
  els.calendarGrid.innerHTML = "";

  for (let i = 0; i < startDay; i += 1) {
    const blank = document.createElement("div");
    blank.className = "h-8";
    els.calendarGrid.appendChild(blank);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);
    const isSelected = state.selectedDate === dateKey;
    const hasTasks = state.tasks.some((task) => task.date === dateKey);

    const button = document.createElement("button");
    button.type = "button";
    button.className = [
      "relative flex h-9 items-center justify-center rounded-2xl text-[12px] font-bold transition",
      isSelected ? "ring-2 ring-sky-300 ring-offset-1 ring-offset-slate-900 bg-white text-slate-950" : "text-slate-200 hover:bg-white/10"
    ].join(" ");
    button.textContent = String(day);

    if (hasTasks) {
      const dot = document.createElement("span");
      dot.className = "absolute bottom-1 h-1.5 w-1.5 rounded-full bg-sky-300";
      button.appendChild(dot);
    }

    button.addEventListener("click", () => {
      state.selectedDate = state.selectedDate === dateKey ? null : dateKey;
      updateDateLabels();
      renderAll();
    });

    els.calendarGrid.appendChild(button);
  }
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  els.tasksWrap.innerHTML = "";

  if (!visibleTasks.length) {
    els.tasksWrap.innerHTML = `
      <div class="rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div class="flex items-start gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-xl dark:bg-sky-950/50">🗂️</div>
          <div>
            <p class="text-lg font-black text-slate-800 dark:text-slate-100">No hay tareas para esta combinación.</p>
            <p class="mt-1 text-slate-500 dark:text-slate-400">Selecciona otra fecha, cambia el filtro o añade una tarea nueva en <strong>${state.selectedFolder}</strong>.</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const header = document.createElement("div");
  header.className = "mb-4 rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950";
  header.innerHTML = `
    <h2 class="text-base font-black text-slate-900 dark:text-slate-100">${state.selectedFolder}</h2>
    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${state.selectedDate ? formatDisplayDate(state.selectedDate) : "Todas las fechas"}</p>
  `;
  els.tasksWrap.appendChild(header);

  visibleTasks.forEach((task) => {
    const node = els.taskTemplate.content.firstElementChild.cloneNode(true);
    const checkbox = node.querySelector("[data-task-checkbox]");
    const title = node.querySelector("[data-task-title]");
    const meta = node.querySelector("[data-task-meta]");
    const priority = node.querySelector("[data-task-priority]");
    const deleteBtn = node.querySelector("[data-task-delete]");
    const row = node.querySelector("[data-task-row]");

    checkbox.checked = task.completed;
    title.textContent = task.title;
    meta.textContent = `${task.completed ? "Completada" : "Pendiente"} · ${task.date ? formatDisplayDate(task.date) : "Sin fecha"} · ${task.folder}`;
    priority.className = getPriorityCssClasses(task.priority);
    priority.textContent = task.priority;

    if (task.completed) {
      title.classList.add("line-through", "text-slate-400", "dark:text-slate-500");
    }

    checkbox.addEventListener("change", async () => {
      try {
        await actualizarTarea(task.id, { completada: checkbox.checked });
        await loadTasks();
        renderAll();
      } catch (error) {
        showFeedback(error.message);
      }
    });

    deleteBtn.addEventListener("click", async () => {
      try {
        await eliminarTarea(task.id);
        await loadTasks();
        renderAll();
        showFeedback("Tarea eliminada", "success");
      } catch (error) {
        showFeedback(error.message);
      }
    });

    row.addEventListener("dblclick", () => openTaskModal(task));
    els.tasksWrap.appendChild(node);
  });
}

function renderAll() {
  updateDateLabels();
  updateStats();
  renderFolders();
  renderCalendar();
  renderTasks();
}

function hydrateFolderSelect() {
  els.taskFolderSelect.innerHTML = state.folders
    .filter((folder) => folder !== "Todas")
    .map((folder) => `<option value="${folder}">${folder}</option>`)
    .join("");
}

function openTaskModal(task = null) {
  state.editingTaskId = task?.id ?? null;
  hydrateFolderSelect();
  els.taskModalTitle.textContent = task ? "Editar tarea" : "Nueva tarea";
  els.saveBtn.textContent = task ? "Actualizar" : "Guardar";
  els.taskInput.value = task?.title ?? "";
  els.taskFolderSelect.value = task?.folder ?? (state.selectedFolder === "Todas" ? "Trabajo" : state.selectedFolder);
  els.taskPrioritySelect.value = task?.priority ?? "media";
  els.currentDateLabel.textContent = state.selectedDate ? formatDisplayDate(state.selectedDate) : "Sin filtro de fecha";
  openModal(els.modal);
  els.taskInput.focus();
}

async function loadTasks() {
  const tasks = await obtenerTareas();
  state.tasks = tasks.map(normalizeTask);
}

async function loadCategories() {
  const categories = await obtenerCategorias();
  state.folders = categories;
  if (!state.folders.includes(state.selectedFolder)) {
    state.selectedFolder = state.folders[0] || "Todas";
  }
}

async function bootstrap() {
  applyTheme("light");
  updateClock();

  try {
    await Promise.all([loadTasks(), loadCategories()]);
    const firstDatedTask = state.tasks.find((task) => task.date);
    state.selectedDate = firstDatedTask?.date ?? formatDateKey(new Date());
    state.currentDate = parseDateKey(state.selectedDate);
    renderAll();
  } catch (error) {
    showFeedback("No se pudieron cargar las tareas. Revisa que el servidor esté activo.");
    renderAll();
  }
}

els.themeBtn.addEventListener("click", () => {
  applyTheme(state.theme === "dark" ? "light" : "dark");
});

els.addBtn.addEventListener("click", () => openTaskModal());
els.cancelBtn.addEventListener("click", () => closeModal(els.modal));
els.folderCancelBtn.addEventListener("click", () => closeModal(els.folderModal));
els.confirmCancel.addEventListener("click", () => closeModal(els.confirmModal));

els.addFolderBtn.addEventListener("click", () => {
  state.editingFolderName = null;
  els.folderModalTitle.textContent = "Nueva carpeta";
  els.folderInput.value = "";
  openModal(els.folderModal);
  els.folderInput.focus();
});

els.folderSaveBtn.addEventListener("click", async () => {
  const name = els.folderInput.value.trim();
  if (!name) {
    showFeedback("Escribe un nombre de carpeta");
    return;
  }

  try {
    if (state.editingFolderName) {
      const previousName = state.editingFolderName;

      if (previousName !== name) {
        await crearCategoria(name);

        const tasksToMove = state.tasks.filter((task) => task.folder === previousName);
        await Promise.all(tasksToMove.map((task) => actualizarTarea(task.id, { categoria: name })));

        await eliminarCategoria(previousName);
        await loadTasks();
      }
    } else {
      await crearCategoria(name);
    }

    await loadCategories();
    state.selectedFolder = name;
    state.editingFolderName = null;
    closeModal(els.folderModal);
    renderAll();
    showFeedback("Carpeta guardada", "success");
  } catch (error) {
    showFeedback(error.message);
  }
});

els.taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = els.taskInput.value.trim();

  if (title.length < 3) {
    showFeedback("El título debe tener al menos 3 caracteres");
    return;
  }

  const payload = {
    texto: title,
    categoria: els.taskFolderSelect.value,
    prioridad: els.taskPrioritySelect.value,
    fecha: state.selectedDate
  };

  try {
    if (state.editingTaskId) {
      await actualizarTarea(state.editingTaskId, payload);
    } else {
      await crearTarea(payload);
    }
    closeModal(els.modal);
    await loadTasks();
    state.selectedFolder = payload.categoria;
    renderAll();
    showFeedback(state.editingTaskId ? "Tarea actualizada" : "Tarea creada", "success");
  } catch (error) {
    showFeedback(error.message);
  }
});

els.search.addEventListener("input", (event) => {
  state.searchQuery = event.target.value.trim().toLowerCase();
  renderAll();
});

els.statusFilter.addEventListener("change", (event) => {
  state.statusFilter = event.target.value;
  renderAll();
});

els.sortFilter.addEventListener("change", (event) => {
  state.sortFilter = event.target.value;
  renderAll();
});

els.priorityFilter.addEventListener("change", (event) => {
  state.priorityFilter = event.target.value;
  renderAll();
});

els.clearDateFilterBtn.addEventListener("click", () => {
  state.selectedDate = null;
  renderAll();
});

els.completeAllBtn.addEventListener("click", async () => {
  const pending = getVisibleTasks().filter((task) => !task.completed);
  try {
    await Promise.all(pending.map((task) => actualizarTarea(task.id, { completada: true })));
    await loadTasks();
    renderAll();
    showFeedback("Tareas completadas", "success");
  } catch (error) {
    showFeedback(error.message);
  }
});

els.clearCompletedBtn.addEventListener("click", async () => {
  const completed = state.tasks.filter((task) => task.completed);
  try {
    await Promise.all(completed.map((task) => eliminarTarea(task.id)));
    await loadTasks();
    renderAll();
    showFeedback("Completadas borradas", "success");
  } catch (error) {
    showFeedback(error.message);
  }
});

els.prevMonth.addEventListener("click", () => {
  state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() - 1, 1);
  renderCalendar();
});

els.nextMonth.addEventListener("click", () => {
  state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 1);
  renderCalendar();
});

els.todayBtn.addEventListener("click", () => {
  const today = new Date();
  state.currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
  state.selectedDate = formatDateKey(today);
  renderAll();
});

setInterval(updateClock, 60_000);
bootstrap();
