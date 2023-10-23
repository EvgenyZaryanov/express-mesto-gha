const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { errors } = require("celebrate");
const appRouter = require("./routes/index");
const error_handler = require("./middlewares/error_handler");

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDb");
  });

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.use(appRouter);
app.use(errors());
app.use(error_handler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
