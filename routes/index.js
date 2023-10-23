const router = require("express").Router();
const usersRouter = require("./users");
const cardsRouter = require("./cards");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");
const { authValidate, registerValidate } = require("../middlewares/validation");
const NotFoundError = require("../errors/NotFoundError");

router.post("/signup", registerValidate, createUser);
router.post("/signin", authValidate, login);

router.use(auth);

router.use("/users", usersRouter);
router.use("/cards", cardsRouter);

router.use(() => {
  throw new NotFoundError("Указан неверный путь");
});

module.exports = router;
