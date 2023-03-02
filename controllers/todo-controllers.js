const jwt = require("jsonwebtoken");

const Todo = require("../models/todo-model");
const HttpError = require("../models/http-error");

const getAllTodoItem = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        const error = new HttpError(
            "Please provide authorization in headers.",
            422
        );
        return next(error);
    }
    const userId = await jwt.verify(token, process.env.JWT_KEY).id;

    const todos = await Todo.find({ creatorId: userId }).exec();

    res.json({ todos });
};

const getTodoById = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        const error = new HttpError(
            "Please provide authorization in headers.",
            422
        );
        return next(error);
    }
    const userId = await jwt.verify(token, process.env.JWT_KEY).id;

    const todoId = req.params.tid;
    let existingTodo;
    try {
        existingTodo = await Todo.find({
            _id: todoId,
            creatorId: userId,
        }).exec();
        if (existingTodo.length === 0) {
            const error = new HttpError("This todo is not added by you.", 422);
            return next(error);
        }
        res.json(existingTodo[0]);
    } catch (err) {
        const error = new HttpError("Invalid id", 422);
        return next(error);
    }
};

const addTodoItem = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        const error = new HttpError(
            "Please provide authorization in headers.",
            422
        );
        return next(error);
    }

    const creatorId = await jwt.verify(token, process.env.JWT_KEY).id;
    const title = req.body.title;
    const description = req.body.description || "";
    const completed = req.body.completed || false;

    if (!title || title.length === 0) {
        const error = new HttpError("Please provide title.", 422);
        return next(error);
    }
    const createdTodo = new Todo({
        title,
        createdAt: new Date().toISOString(),
        description,
        completed,
        creatorId,
    });

    console.log(createdTodo);

    const result = await createdTodo.save();
    res.json({ message: "Todo created.", data: result });
};

const deleteTodoById = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        const error = new HttpError(
            "Please provide authorization in headers.",
            422
        );
        return next(error);
    }
    const userId = await jwt.verify(token, process.env.JWT_KEY).id;

    const todoId = req.params.tid;

    if (typeof todoId !== "string" || todoId.length < 1) {
        const error = new HttpError("Please provide proper id.", 422);
        return next(error);
    }

    const existingTodo = await Todo.find({
        _id: todoId,
        creatorId: userId,
    }).exec();

    if (existingTodo.length === 0) {
        const error = new HttpError(
            "Todo not found for provided id or you ara not creator of this todo.",
            404
        );
        return next(error);
    }

    const result = Todo.deleteOne({ _id: todoId });
    res.json({ message: "Todo deleted.", data: result });
};

const updateTodoById = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        const error = new HttpError(
            "Please provide authorization in headers.",
            422
        );
        return next(error);
    }
    const userId = await jwt.verify(token, process.env.JWT_KEY).id;

    const todoId = req.params.tid;
    const { title, description } = req.body;
    const updatedTodo = {
        title,
        description,
        createdAt: new Date().toISOString(),
    };

    const existingTodo = await Todo.find({
        _id: todoId,
        creatorId: userId,
    }).exec();
    if (existingTodo.length === 0) {
        const error = new HttpError(
            "Todo not found for provided id or you are not creator of this todo.",
            404
        );
        return next(error);
    }

    if (
        !title ||
        title.length === 0 ||
        !description ||
        description.length === 0
    ) {
        const error = new HttpError(
            "Please provide title and description.",
            422
        );
        return next(error);
    }

    const result = Todo.updateOne({ _id: todoId }, updatedTodo);
    res.json({ message: "Todo updated.", data: result });
};
const updateTodoCompleted = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        const error = new HttpError(
            "Please provide authorization in headers.",
            422
        );
        return next(error);
    }
    const userId = await jwt.verify(token, process.env.JWT_KEY).id;

    const todoId = req.params.tid;
    const isCompleted = req.body.completed;

    const existingTodo = await Todo.find({
        _id: todoId,
        creatorId: userId,
    }).exec();
    if (existingTodo.length === 0) {
        const error = new HttpError(
            "Todo not found for provided id or you are not creator of this todo.",
            404
        );
        return next(error);
    }

    const result = Todo.updateOne({ _id: todoId }, { completed: isCompleted });
    res.json({ message: "Todo updated.", data: result });
};

exports.getAllTodoItem = getAllTodoItem;
exports.getTodoById = getTodoById;
exports.addTodoItem = addTodoItem;
exports.deleteTodoById = deleteTodoById;
exports.updateTodoById = updateTodoById;
exports.updateTodoCompleted = updateTodoCompleted;
