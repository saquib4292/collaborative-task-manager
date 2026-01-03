import { Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/auth.middleware";

// ================= CREATE TASK =================
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      assignedTo: req.body.assignedToId || null,
      createdBy: req.user!.id, // 🔥 IMPORTANT
    });

    req.app.get("io").emit("task-updated");
    res.status(201).json(task);
  } catch (err) {
    console.error("❌ CREATE TASK ERROR:", err);
    res.status(500).json({ message: "Task create failed" });
  }
};

// ================= GET MY TASKS =================
export const getMyTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await Task.find({
    $or: [
      { createdBy: req.user!.id },
      { assignedTo: req.user!.id },
    ],
  })
    .populate("assignedTo", "name")
    .sort({ createdAt: -1 });

  res.json(tasks);
};

// ================= UPDATE TASK (CREATOR ONLY) =================
export const updateTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.createdBy.toString() !== req.user!.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  Object.assign(task, req.body);
  await task.save();

  req.app.get("io").emit("task-updated");
  res.json(task);
};

// ================= DELETE TASK (CREATOR ONLY) =================
export const deleteTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.createdBy.toString() !== req.user!.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await task.deleteOne();
  req.app.get("io").emit("task-updated");

  res.json({ message: "Task deleted" });
};

// ================= TOGGLE STATUS (ASSIGNED USER) =================
export const toggleStatus = async (req: AuthRequest, res: Response) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.assignedTo?.toString() !== req.user!.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  task.status =
    task.status === "Completed" ? "Pending" : "Completed";

  await task.save();
  req.app.get("io").emit("task-updated");

  res.json(task);
};
