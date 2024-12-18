'use client'
//utilizei o use client porque estou usando os estados do react

import {useState, useEffect} from 'react';
import axios from 'axios';
//para mandar requisições ao back utilizei a biblioteca axios
import '../css/page.css';
import Menu from "../../../componentes/menu/menu.js";

export default function Doubt(){
  const [users, setUsers] = useState([])
  const [values, setValues] = useState(
    {titulo:'', materia:'', conteudo:'', data:'', doubt:null, userId:''}
  )

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

    formData.append('titulo', values.titulo)
    formData.append('materia', values.materia)
    formData.append('conteudo', values.conteudo)
    formData.append('data', values.data)
    formData.append('doubt', values.doubt)
    formData.append('userId', values.userId)

    const response = await axios.post("http://localhost:3000/doubt", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } 
  /*utilizei o formData para enviar os dados que foram coletados atras dos inputs, escolhi formFata pois 
  é recomendado ao manipular imagens*/

  return(
  <div><Menu></Menu>
    <div className='container'>
      <input id='userId' name='userId' onChange={handleInputChange}/>
      <input id='titulo' name='titulo' onChange={handleInputChange} placeholder='TITULO'/>
      <input id='materia' name='materia' onChange={handleInputChange} placeholder='MATERIA'/>
      <input id='conteudo' name='conteudo' onChange={handleInputChange} placeholder='CONTEUDO'/>
      <input id='doubt' name='doubt' type='file' onChange={handleInputChange} placeholder='FOTO'/>

      <button onClick={handleSubmit}>enviar</button>

    </div>
  </div>
  )
}