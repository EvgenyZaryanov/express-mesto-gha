const mongoose = require("mongoose");
const validator = require("validator");

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (url) => validator.isURL(url),
        message: "Некорректный адрес URL",
      },
    },
    owner: {
      ref: "user",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("card", cardSchema);
