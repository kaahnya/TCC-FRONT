'use client'
//utilizei o use client porque estou usando os estados do react

import {useState, useEffect} from 'react';
import axios from 'axios';
//para mandar requisições ao back utilizei a biblioteca axios
import './css/page.css';
import Image from "next/image";
import img from './img/adobe.jpg';
import Menu from "../../componentes/menu/menu.js";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Home(){
  const [user, setUsers] = useState([])
  const [userLog, setUserLog] = useState(null);
  const [values, setValues] = useState(
    {nome:'', cpf:'', email:'', senha:'', desc:'', pfp:null, banner:null}
  )

  const route=useRouter()

  const getUsers = async () =>{
    const response = await axios.get("http://localhost:3000/usuarios")
    return response.data
  }
  //obter os usuarios atraves da biblioteca axios

  const handleInputChange = (event) => {
    if(event.target.type==='file'){
      setValues((prevValue) => ({
        ...prevValue, [event.target.name] : event.target.files?.[0]
      }))
    } else{
      setValues((prevValue) => ({
        ...prevValue, [event.target.name] : event.target.value
      }))
    }
  }
  /*função para lidar com a mudança dos valores dentro dos input, se o input for do tipo "file" ele guardara 
  a imagem, caso não, guardara o valor normalmente*/

  const handleSubmit = async () => {
    const formData = new FormData()

    formData.append('nome', values.nome)
    formData.append('cpf', values.cpf)
    formData.append('email', values.email)
    formData.append('senha', values.senha)
    formData.append('desc', values.desc)
    formData.append('pfp', values.pfp)
    formData.append('banner', values.banner)

    const response = await axios.post("http://localhost:3000/usuario", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if(response){
      toast.success("bem vindo " + response.data.nome)
      const { id, nome, pfp, banner, desc } = response.data; 
      localStorage.setItem('user', JSON.stringify({ id, nome, pfp, banner, desc }));
      toast.success("bem vindo " + response.data.nome)
      route.push("/users")
    }
  }
  /*utilizei o formData para enviar os dados que foram coletados atras dos inputs, escolhi formFata pois 
  é recomendado ao manipular imagens*/

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
      }
      console.log(userLog)
    }, []);

  return(
  <div>
    <div className='container'>
      <div className='e'><Image src={img}/></div>
        <div className='d'>
          <h1>Cadastre-se</h1>
          <div className='input'>
        <input id='nome' name='nome' onChange={handleInputChange} placeholder='NOME'className='input1'/>
        <input id='cpf' name='cpf' onChange={handleInputChange} placeholder='CPF' className='input1'/>
          </div>
        <input id='email' name='email' onChange={handleInputChange} placeholder='EMAIL'/>
        <input id='senha' name='senha' onChange={handleInputChange} placeholder='SENHA'/>
        <input id='desc' name='desc' onChange={handleInputChange} placeholder='DESCRIÇÃO'/>
           <div className ="buttonsUp">
           <input type="file" id="pfp" name="pfp" onChange={handleInputChange} className='foto' />
           <label htmlFor="pfp" className='buttonUp'>FOTO</label>
           <input type="file" id="banner" name="banner" onChange={handleInputChange} className='foto'/>
           <label htmlFor="banner" className='buttonUp'>BANNER</label>
           </div>
          <button onClick={handleSubmit} className="button">Cadastrar</button>
        <p>Já possui uma conta?<a href='/login'> Login</a></p>
        </div>
    </div>
  </div>
  )
}