(() => {
  const API_URL = "https://taskflowregisttrobackend.vercel.app/api/v1/tasks";

  const request = async (path = "", options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Error de red");
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  };

  const getTasks = () => request("");
  const createTask = (payload) => request("", { method: "POST", body: JSON.stringify(payload) });
  const updateTask = (id, payload) => request(`/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  const deleteTask = (id) => request(`/${id}`, { method: "DELETE" });

  window.TaskflowApi = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
  };
})();
