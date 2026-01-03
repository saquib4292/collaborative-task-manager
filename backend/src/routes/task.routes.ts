import { toggleStatus } from "../controllers/task.controller";
import { Router } from "express";
import {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", protect, createTask);
router.get("/", getMyTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle-status", protect, toggleStatus);

export default router;
