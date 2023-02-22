const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const todoRoutes = require("./routes/todo-routes");
const userRoutes = require("./routes/user-routes");
const HttpError = require("./models/http-error");
const { urlencoded } = require("body-parser");

const app = express();
const PORT = 8080;
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ijw3zif.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
    .connect(dbUrl)
    .then(() => console.log("Database connected"))
    .catch(() =>
        console.log("Some error occured while connecting to database")
    );

app.use(cors());

app.use(bodyParser.json());

app.use(
    urlencoded({
        extended: true,
    })
);

app.use("/api/todos", todoRoutes);

app.use("/api/user", userRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Provide route not found!!!", 404);
    return next(error);
});

app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json(error.message || "Unexpected error occured!!!");
});

app.listen(process.env.PORT || PORT, () => {
    console.log("Server started at", PORT);
});
