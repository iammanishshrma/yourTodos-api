const express = require("express");

const todoControllers = require("../controllers/todo-controllers");

const router = express.Router();

router.get("/", todoControllers.getAllTodoItem);

router.get("/:tid", todoControllers.getTodoById);

router.post("/add-todo", todoControllers.addTodoItem);

router.delete("/:tid", todoControllers.deleteTodoById);

router.patch("/:tid", todoControllers.updateTodoById);

router.patch("/update-complete/:tid", todoControllers.updateTodoCompleted);

module.exports = router;
