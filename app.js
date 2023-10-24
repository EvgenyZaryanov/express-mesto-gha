// Модуль dotenv для добавления переменных окружения в process.env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const helmet = require("helmet");
const errorHandler = require("./middlewares/errorHandler");
const limiter = require("./middlewares/limiter");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const appRouter = require("./routes/index");

const { PORT, DB } = require("./utils/config");

const app = express();
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDb");
  });

//безопасность
app.use(limiter);
app.use(helmet());

//парсинг
app.use(express.json()); //сборка JSON-формата
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //подключение парсера кук

//миддлвэр-логгер запросов
app.use(requestLogger);

//роутер
app.use(appRouter);

//обработка ошибок
app.use(errorLogger); //логгер ошибок
app.use(errors()); //обработчик ошибок celebrate
app.use(errorHandler); //централизолванная обработка ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
