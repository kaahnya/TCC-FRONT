'use client'
//utilizei o use client porque estou usando os estados do react

import {useState, useEffect} from 'react';
import axios from 'axios';
//para mandar requisições ao back utilizei a biblioteca axios
import './../css/page.css';
import Image from "next/image";
import img from '../img/adobe1.jpg';
import Menu from "../../../componentes/menu/menu.js";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Login(){
  const [values, setValues] = useState(
    {email:'', senha:''}
  )
  const [userLog, setUserLog] = useState(null);

  const route=useRouter()

  const handleInputChange = (event) => {
      setValues((prevValue) => ({
        ...prevValue, [event.target.name] : event.target.value
      }))
  }

  const handleSubmit = async () => {
    const response = await axios.post("http://localhost:3000/login",{email : values.email, senha: values.senha})


    if(response.data==404){
      toast.error("email não cadastrado")
    }else if(response.data==401){
      toast.error("Credências não batem")
    }else{
      const { id, nome, pfp, banner, desc } = response.data; 
    localStorage.setItem('user', JSON.stringify({ id, nome, pfp, banner, desc }));
      toast.success("bem vindo " + response.data.nome)
      route.push("/users")
    }
  }

  useEffect( () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUserLog(JSON.parse(userData));
     return route.push("/users")
    }
  }, []);

  return(
    <div>
    <div className='containerc'>
      <div className='ec'><Image src={img}/></div>
        <div className='dc'>
          <h1>Entre</h1>
          <div className='input'>
          <input id='email' name='email' onChange={handleInputChange} placeholder='EMAIL' className='input2'/>
          <input id='senha' name='senha' onChange={handleInputChange} placeholder='SENHA' className='input2'/>
          </div>
          <button onClick={handleSubmit} className="button">Logar</button>
        <p>Não possui uma conta?<a href='/'> Cadastrar-se</a></p>
        </div>
    </div>
  </div>
  )
}