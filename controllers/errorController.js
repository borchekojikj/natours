const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. Please change it and try again.`;
  return new AppError(message, 400);
};

const HandleValidationError = err => {
  const errors = Object.values(err.errors)
    .map(el => el.message)
    .join(', ');
  const message = `Invalid input data. ${errors}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // Pr
  // Operational, trusted error: send message to client
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // console.log(err.message);
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
      // Programming or other unknown error: don't leak error details
    }
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
      error: err
    });
  }

  // RENDER

  if (err.isOperational) {
    console.log(err.message);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Oooppps something went wrong! Try again later! '
  });
};

const HandleJWTError = () =>
  new AppError('Invalid token, please log in again', 401);

const HandleJWTExpiredError = () =>
  new AppError('Your token has expired, please log in again!', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = HandleValidationError(err);
    if (err.name === 'JsonWebTokenError') error = HandleJWTError(err);

    if (err.name === 'TokenExpiredError') error = HandleJWTExpiredError(err);

    sendErrorProd(error, req, res);
  }
};
