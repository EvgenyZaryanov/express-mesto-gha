const router = require("express").Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", getUserById);
router.patch("/me", updateUser);
router.patch("/me/avatar", updateUserAvatar);

module.exports = router;
