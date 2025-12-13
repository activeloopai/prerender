module.exports = {
  requestReceived: (req, res, next) => {
    let token = req.headers['x-prerender-token'];
    if (
      !token ||
      token !== process.env.AUTH_TOKEN
    )
      return res.send(401);

    return next();
  },
};
