import express from 'express';
import { generateAccessToken, validateToken } from '../libs/jwt.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();


router.get('/login', (req, res) => {
  res.render('./auth/login', { title: 'Login', errormsg: '' });
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username })

  if (!user) {
    return res.render('./auth/login', {
      title: 'Login', errormsg: 'Usuario no encontrado'
    });
  };

  const matchPassword = await bcrypt.compareSync(password, user.password);

  if (!matchPassword) {
    return res.render('./auth/login', {
      title: 'Login', errormsg: 'Contraseña incorrecta'
    });
  };

  const token = await generateAccessToken(user.username);

  res.cookie('auth-token', token).redirect('/');
});


router.get('/register', (req, res) => {
  res.render('./auth/register', { title: 'Register', errormsg: '' });
});


router.post('/register', async (req, res) => {
  let { username, email, password, password2 } = req.body;

  if (password !== password2) {
    return res.render('./auth/register', {
      title: 'Register', errormsg:'Las contraseñas no coinciden'
    })
  };

  if (password.length < 6) {
    return res.render('./auth/register', {
      title: 'Register', errormsg:'La contraseña debe tener al menos 6 caracteres'
    })
  };

  const mailExists = await User.findOne({
    email: email
  });

  if (mailExists) {
    return res.render('./auth/register', {
      title: 'Register', errormsg:'El email ya está registrado'
    })
  };

  const userExists = await User.findOne({
    username: username
  });

  if (userExists) {
    return res.render('./auth/register', {
      title: 'Register', errormsg:'El nombre de usuario ya está registrado'
    })
  };

  password = bcrypt.hashSync(password, 10);

  const user = new User({
    username,
    email,
    password
  });

  await user.save()
    .then(() => {
      res.redirect('/login');
    })
    .catch((err) => {
      console.log(err);
    });

});


export default router;