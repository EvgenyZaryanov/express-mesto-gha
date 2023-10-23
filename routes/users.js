const router = require("express").Router();
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");

const {
  userValidate,
  userIdValidate,
  avatarValidate,
} = require("../middlewares/validation");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", userIdValidate, getUserById);
router.patch("/me", userValidate, updateUser);
router.patch("/me/avatar", avatarValidate, updateUserAvatar);

module.exports = router;
