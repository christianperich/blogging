import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import ejs from 'ejs';
import expressEjsLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import router from './src/routes/index.js';
import connectDB from './src/db/db.js';
import authRouter from './src/routes/authRouter.js';
import cookieParser from 'cookie-parser';
import {checkAuth} from './src/libs/jwt.js';


//Configuraciones Globales
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

//Configuración de express
const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressEjsLayouts);
app.use(cookieParser());
app.use(checkAuth);

//Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

//Rutas
app.use('/', router);
app.use('/', authRouter)

//Conexión a la base de datos
connectDB();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
