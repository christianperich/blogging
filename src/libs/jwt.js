import jwt from 'jsonwebtoken';

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

function validateToken(req, res, next) {
  const token = req.cookies['auth-token'];

  if (!token) return res.render('./auth/login', { title: 'Inicio de sesión', errormsg: 'Debes iniciar sesión para entrar ahí' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.locals.isAuthenticated = false;
      return res.status(403).json({ message: 'Invalid token' });
    } else {
      res.locals.isAuthenticated = true;
      req.user = user;
      next();
    }
  });

}


function checkAuth(req, res, next) {
  const token = req.cookies['auth-token'];

  if (!token) {
    res.locals.isAuthenticated = false;
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.locals.isAuthenticated = false;
    } else {
      res.locals.isAuthenticated = true;
      req.user = user;
      next();
    }
  });

}

export { generateAccessToken, validateToken, checkAuth };