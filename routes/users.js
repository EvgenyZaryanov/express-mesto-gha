const router = require("express").Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.patch("/users", updateUser);
router.patch("/users/avatar", updateUserAvatar);

module.exports = router;
