const mongoose = require("mongoose");

const Todo = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    createdAt: { type: String, required: true },
    completed: { type: Boolean, required: true },
    creatorId: { type: String, required: true },
});

module.exports = mongoose.model("Todos", Todo);
