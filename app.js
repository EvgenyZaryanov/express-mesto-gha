const express = require("express");
const mongoose = require("mongoose");
const appRouter = require("./routes/index");

const ERROR_NOT_FOUND = 404;

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDb");
  });

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  req.user = {
    _id: "652932f8afb41fc0d7762d34",
  };

  next();
});

app.use(express.json());

app.use(appRouter);

app.use("/*", (req, res, next) => {
  res.status(ERROR_NOT_FOUND).send({ message: "Страница не найдена" });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
