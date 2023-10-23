const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const appRouter = require("./routes/index");
const { authMiddleware } = require("./middlewares/authMiddleware");
const { createUser, login } = require("./controllers/auth");

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDb");
  });

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/signup", createUser);
app.post("/signin", login);

app.use(authMiddleware);
app.use(appRouter);
app.use(helmet());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
