module.exports = {
  get: (req, name) => {
    const cookies = req.headers && req.headers.cookie;
    if (!cookies) {
      return;
    }
    const prefix = name + '=';
<<<<<<< HEAD
    const cookie = cookies.split(';').find(cookie => cookie.startsWith(prefix));
    return cookie && cookie.substring(prefix.length);
=======
    const cookie = cookies.split(';').find(cookie => cookie.trim().startsWith(prefix));
    return cookie && cookie.trim().substring(prefix.length);
>>>>>>> 2d8d66364fc7386189f1542202bdb89883bb152c
  }
};
