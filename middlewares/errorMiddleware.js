//Error Middleware

const errorMiddleware = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    success: "False",
    message: "Something went wrong.",
    err,
  });
};

export default errorMiddleware;
