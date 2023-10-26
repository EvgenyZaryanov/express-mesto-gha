// для центриализованной обработки ошибок
const errorHandler = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем статус кода 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // выставляем сообщение в зависимости от проверки статус
    message: statusCode === 500 ? 'Упс! Произошла ошибка сервера.' : message,
  });
  next();
};

module.exports = errorHandler;
