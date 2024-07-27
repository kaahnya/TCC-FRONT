'use client'
//utilizei o use client porque estou usando os estados do react

import {useState, useEffect} from 'react';
import axios from 'axios';
//para mandar requisições ao back utilizei a biblioteca axios
import './../css/page.css';
import Menu from "../../../componentes/menu/menu.js";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Login(){
  const [values, setValues] = useState(
    {email:'', password:''}
  )

  const route=useRouter()

  const handleInputChange = (event) => {
      setValues((prevValue) => ({
        ...prevValue, [event.target.name] : event.target.value
      }))
  }

  const handleSubmit = async () => {
    const response = await axios.post("http://localhost:3000/login",{email : values.email, senha: values.password})


    if(response.data!=401){
      toast.success("bem vindo " + response.data.nome)
      route.push("/users")
    }else if(response.data==401){
      toast.error("ta maluco porra")
    }
  }

  return(
    <div className='container'><Menu></Menu>
      <input id='email' name='email' onChange={handleInputChange} placeholder='EMAIL'/>
      <input id='password' name='password' onChange={handleInputChange} placeholder='SENHA'/>

      <button onClick={handleSubmit}>enviar</button>
    </div>
  )
}