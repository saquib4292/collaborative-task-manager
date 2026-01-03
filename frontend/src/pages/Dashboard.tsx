const userId = localStorage.getItem("userId");

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import socket from "../socket";
import toast from "react-hot-toast";

export default function Dashboard() {
  const queryClient = useQueryClient();

  // ================= FORM STATES =================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assignedToId, setAssignedToId] = useState("");

  // ================= FILTER STATES =================
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortByDueDate, setSortByDueDate] = useState(false);

  // ================= FETCH TASKS =================
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data;
    },
  });

  // ================= FETCH USERS =================
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data;
    },
  });

  // ================= FILTER + SORT =================
  const filteredTasks = tasks
    .filter((task: any) => {
      if (statusFilter !== "All" && task.status !== statusFilter) return false;
      if (priorityFilter !== "All" && task.priority !== priorityFilter)
        return false;
      return true;
    })
    .sort((a: any, b: any) => {
      if (!sortByDueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  // ================= CREATE TASK =================
  const createTask = useMutation({
    mutationFn: async () => {
      return api.post("/tasks", {
        title,
        description,
        dueDate,
        priority,
        assignedToId,
      });
    },
    onSuccess: () => {
      toast.success("✅ Task created");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      resetForm();
    },
    onError: () => {
      toast.error("❌ Task create failed");
    },
  });

  // ================= ACTION HANDLERS =================
  const editTask = (task: any) => {
    toast(`✏️ Edit clicked: ${task.title}`);
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Are you sure?")) return;
    await api.delete(`/tasks/${taskId}`);
    toast.success("🗑 Task deleted");
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  // ================= SOCKET =================
  useEffect(() => {
    socket.on("task-updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    return () => {
      socket.off("task-updated");
    };
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Low");
    setAssignedToId("");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        🗂 Task Dashboard
      </h2>

      {/* ================= CREATE TASK ================= */}
      <div className="bg-white shadow rounded p-4 mb-8">
        <h3 className="font-semibold text-lg mb-3 text-gray-700">
          ➕ Create New Task
        </h3>

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 w-full mb-2 rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <select
          className="border p-2 w-full mb-2 rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Urgent</option>
        </select>

        <select
          className="border p-2 w-full mb-3 rounded"
          value={assignedToId}
          onChange={(e) => setAssignedToId(e.target.value)}
        >
          <option value="">Assign user</option>
          {users.map((u: any) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => createTask.mutate()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>

      {/* ================= FILTER UI ================= */}
      <div className="bg-gray-50 p-3 rounded flex gap-4 mb-6 items-center">
        <span className="font-semibold text-gray-600">Filters:</span>

        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Review</option>
          <option>Completed</option>
        </select>

        <select
          className="border p-2 rounded"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Urgent</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sortByDueDate}
            onChange={() => setSortByDueDate(!sortByDueDate)}
          />
          Sort by Due Date
        </label>
      </div>

      {/* ================= TASK LIST ================= */}
      {filteredTasks.length === 0 && <p>No tasks found</p>}

      {filteredTasks.map((t: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);

        const isOverdue = due < today && t.status !== "Completed";

        return (
          <div
            key={t._id}
            className={`border p-4 mb-4 rounded shadow-sm transition ${
              isOverdue
                ? "bg-red-50 border-red-400"
                : "bg-white hover:shadow-md"
            }`}
          >
            <h3 className="font-bold text-lg">{t.title}</h3>
            <p className="text-gray-700 mb-1">{t.description}</p>

            <span className="inline-block mb-1 px-2 py-1 text-sm rounded bg-gray-100">
              Status: {t.status}
            </span>

            <p>Priority: {t.priority}</p>
            <p>Assigned: {t.assignedTo?.name || "NA"}</p>
            <p>Due: {new Date(t.dueDate).toLocaleDateString()}</p>

            {isOverdue && (
              <p className="text-red-600 font-semibold mt-1">
                ⚠ Overdue
              </p>
            )}

            {/* ===== ACTION BUTTONS ===== */}

            {t.createdBy === userId && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => editTask(t)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(t._id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            )}

            {t.assignedTo?._id === userId && (
              <button
                onClick={() =>
                  api.patch(`/tasks/${t._id}/toggle-status`)
                }
                className="mt-3 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Toggle Status
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
