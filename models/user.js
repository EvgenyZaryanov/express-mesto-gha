// Импорт пакетов
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Импорт валидаторов
const isEmail = require("validator/lib/isEmail");
const isUrl = require("validator/lib/isURL");

// Импорт классов ошибок
const UnauthorizedError = require("../errors/UnauthorizedError");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: "Некорректный адрес эл.почты",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Исследователь",
    },
    avatar: {
      type: String,
      validate: {
        validator: (avatar) => isUrl(avatar, { protocols: ["http", "https"], require_protocol: true }),
        message: "Некорректный адрес URL",
      },
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
  },
  // делаем, чтобы пароль не отправлялся при регистрации и отключаем поле с версиями ("__v")
  {
    toJSON: { useProjection: true },
    toObject: { useProjection: true },
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError("Неверные почта или пароль"),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError("Неверные почта или пароль"),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
