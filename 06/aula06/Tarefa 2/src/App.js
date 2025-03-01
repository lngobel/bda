import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from './firebase.js';
import './App.css';
import * as React from 'react';
import { Button, FormControl, Icon, InputLabel,  Tab } from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote';
import Input from '@mui/material/Input';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function App(){

  console.log("Render!!")

  const collectionRef = collection(db, "entregadores");

  const [entregador, setEntregador] = useState({})
  const [entregadores, setEntregadores] = useState([])
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collectionRef,()=>{getEntregadores()})
  }, []);

  const getEntregadores = () => {
    setEntregadores([])
    getDocs(collectionRef)
      .then(querySnap => {
        const docs = querySnap.docs
        if (!docs.length)
          throw Error("Empty data!")

        const entregadores = docs.map(
          doc => ({
            id: doc.id,
            nome: doc.data().nome,
            cpf: doc.data().cpf,
            email: doc.data().email,
            nascimento: doc.data().nascimento
          })
        )
        setEntregadores(entregadores)
      }).catch(e =>
        console.error(e.message)
      );
  }

  const editEnt = (entId) => {
    const entregador = entregadores.filter(entregador => entregador.id === entId)[0]
    setNome(entregador.nome)
    setCpf(entregador.cpf)
    setEmail(entregador.email)
    setNascimento(entregador.nascimento)
    setEntregador(entregador)
    setEditMode(true)
  }

  const delEnt = async (entId) => {
    await deleteDoc(doc(db,"entregadores",entId))
    getEntregadores()
  }

  const confirmEdit = async e => {
    e.preventDefault()
    await updateDoc(doc(db,"entregadores",entregador.id),{
      nome: nome,
      cpf: cpf,
      email: email,
      nascimento: nascimento
    })
    setEntregador({})
    setNome("")
    setCpf("")
    setEmail("")
    setNascimento("")
    setEditMode(false)
    getEntregadores()
  }

  const cadastrar = async e => {
    e.preventDefault()
    await addDoc(collectionRef, {
      nome: nome,
      cpf: cpf,
      email: email,
      nascimento: nascimento
    })
    setNome("")
    setCpf("")
    setEmail("")
    setNascimento("")
    getEntregadores()
  }

  return (
    <div className='App'>
      <form>
        <fieldset>
          <legend> Cadastre um novo entregador </legend>
          <Tab></Tab><FormControl>
            <InputLabel htmlFor="nome">Nome</InputLabel>
            <Input required id="nome" value={nome} onChange={e =>
            setNome(e.target.value)}/>
          </FormControl>
          <Tab></Tab><FormControl>
            <InputLabel htmlFor="cpf">CPF</InputLabel>
            <Input required id="cpf" value={cpf} onChange={e =>
            setCpf(e.target.value)}/>
          </FormControl>
          <Tab></Tab><FormControl>
            <InputLabel htmlFor="email">E-mail</InputLabel>
            <Input required id="email" value={email} onChange={e =>
            setEmail(e.target.value)}/>
          </FormControl>
          <Tab></Tab><FormControl>
            <InputLabel htmlFor="nascimento">Nascimento</InputLabel>
            <Input required id="nascimento" value={nascimento} onChange={e =>
            setNascimento(e.target.value)}/>
          </FormControl>
          <p><Button type="submit" variant="contained" onClick={editMode ? confirmEdit : cadastrar}>
              {!editMode ? "Cadastrar" : "Editar"}
          </Button></p>
        </fieldset>
      </form>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Nome</TableCell>
              <TableCell align="right">CPF</TableCell>
              <TableCell align="right">E-mail</TableCell>
              <TableCell align="right">Nascimento</TableCell>
              <TableCell align="right">Editar/Apagar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entregadores.map((ent) => (
              <TableRow key={ent.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{ent.id}</TableCell>
                <TableCell align="right">{ent.nome}</TableCell>
                <TableCell align="right">{ent.cpf}</TableCell>
                <TableCell align="right">{ent.email}</TableCell>
                <TableCell align="right">{ent.nascimento}</TableCell>
                <TableCell align="right">
                  <Button color="primary" onClick={e => editEnt(ent.id)}>
                    <EditNoteIcon/>
                  </Button>
                  <Button color="error" onClick={e => delEnt(ent.id)}>
                    <Icon>delete_forever</Icon>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
      // <div>{todos.map((todo) => {
      //   return(<h1>{todo.text}</h1>)
      // })}
      // </div>
  );
}
export default App;