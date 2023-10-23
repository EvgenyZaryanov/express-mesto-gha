const error_handler = (err, req, res, next) => {
  const { status = 500, message } = err;

  res.status(status).send({
    message: status === 500 ? "Ошибка сервера" : message,
  });

  next();
};

module.exports = error_handler;
