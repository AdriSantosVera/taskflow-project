/**
 * Utilidades puras (sin dependencias de DOM ni estado).
 */

export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
}

export function toggleElementClasses(element, classString, shouldAdd) {
  const classes = classString.trim().split(/\s+/);
  if (shouldAdd) {
    element.classList.add(...classes);
  } else {
    element.classList.remove(...classes);
  }
}

export const PRIORITY_CSS_CLASSES = {
  alta: "rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  media: "rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  baja: "rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
};

export function getPriorityCssClasses(priority) {
  return PRIORITY_CSS_CLASSES[priority] ?? PRIORITY_CSS_CLASSES.media;
}

/**
 * Indica si una tarea cumple los criterios de filtro (carpeta, fecha, búsqueda, estado).
 */
export function taskMatchesFilter(task, folderName, searchQuery, selectedDateKey, filterValue) {
  const matchesFolder = task.folder === folderName;
  const matchesDate = task.date === selectedDateKey;
  const matchesSearch =
    !searchQuery ||
    task.title.toLowerCase().includes(searchQuery) ||
    task.folder.toLowerCase().includes(searchQuery);
  const matchesStatus =
    filterValue === "all" ||
    (filterValue === "pending" && !task.completed) ||
    (filterValue === "completed" && task.completed);
  return matchesFolder && matchesDate && matchesSearch && matchesStatus;
}
