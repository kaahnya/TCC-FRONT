'use client'
//utilizei o use client porque estou usando os estados do react

import {useState, useEffect} from 'react';
import axios from 'axios';
//para mandar requisições ao back utilizei a biblioteca axios
import '../css/page.css';
import Menu from "../../../componentes/menu/menu.js";
import { useRouter } from 'next/navigation';

export default function Users(){
  const [users, setUsers] = useState([])
  const [userLog, setUserLog] = useState(null);

  const route=useRouter()

  const getUsers = async () =>{
    const response = await axios.get("http://localhost:3000/usuarios")
    return response.data
  }
  //obter os usuarios atraves da biblioteca axios

    useEffect(() =>{
      const handleUsers = async ()=>{
        setUsers( await getUsers())
      }
      handleUsers()
    },[])
    //executa ao iniciar a pagina, a função executada tem como objetivo obter os dados dos usuarios

    useEffect(() => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUserLog(JSON.parse(userData));
      }else{
        return route.push("/login")
       }
    }, []);

  return(
  <div><Menu></Menu>
      {users.map(({id, nome, email, cpf, desc, senha}) => (
        <div key={id}>
        <img src={`http://localhost:3000/usuario/pfp/${id}`} className='user'/>
        {nome}
        </div>
      ))}
    </div>
  )
}