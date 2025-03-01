import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import entregadorRoute from './routes/entregador.js'
import usuarioRoute from './routes/usuario.js'
import corridaRoute from './routes/corrida.js'

const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get('/', (req, res) => {
  res.send({ express: `Servidor Express Iniciado na porta ${port}!` });
});

console.log('Servidor inicializado !')

app.listen(port,() => {
  console.log(`Servidor rodando na porta ${port}`);
});

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/entregadores',entregadorRoute)
app.use('/usuarios',usuarioRoute)
app.use('/corridas',corridaRoute)