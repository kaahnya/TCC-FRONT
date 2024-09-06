'use client'
//utilizei o use client porque estou usando os estados do react

import {useState, useEffect} from 'react';
import axios from 'axios';
//para mandar requisições ao back utilizei a biblioteca axios
import '../css/page.css';
import Menu from "../../../componentes/menu/menu.js";
import {formatRelative} from 'date-fns';

export default function duvida(){
  const [duvidas, setDuvidas] = useState([])
  const [values, setValues] = useState(
    {titulo:'', materia:'', conteudo:'', descDuvida:'', duvida:null, usuarioId:''}
  )
  const [userLog, setUserLog] = useState(null);

  const getDuvidas = async () =>{
    const response = await axios.get("http://localhost:3000/duvidas")
    return response.data
  }
  //obter os usuarios atraves da biblioteca axios
  const date = new Date();
    useEffect(() =>{
      const handleDuvidas = async ()=>{
        setDuvidas( await getDuvidas())
      }
      handleDuvidas()
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
    values.usuarioId = userLog.id
    console.log(values.usuarioId)
    formData.append('titulo', values.titulo)
    formData.append('materia', values.materia)
    formData.append('conteudo', values.conteudo)
    formData.append('descDuvida', values.descDuvida)
    formData.append('duvida', values.duvida)
    console.log(values.duvida)
    formData.append('usuarioId', values.usuarioId)

    const response = await axios.post("http://localhost:3000/duvida", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } 
  /*utilizei o formData para enviar os dados que foram coletados atras dos inputs, escolhi formFata pois 
  é recomendado ao manipular imagens*/

  return(
<div><Menu></Menu>
  <div className='containerdd'>
    <div className='lll'>
     <div className='em'><h1 className='du'>Compartilhar Dúvida</h1></div>
      <div className='dm'><h3 className='du'>AJSBNUDFIEHIJNCFASEA</h3></div>
    </div>
    <div className='containerddd'>
       <div className='inputdddd'>
       <input id='materia' name='materia' onChange={handleInputChange} placeholder='MATÉRIA' className='ass'/>
       <input id='conteudo' name='conteudo' onChange={handleInputChange} placeholder='CONTEÚDO' className='ass'/>
       <input id='titulo' name='titulo' onChange={handleInputChange} placeholder='TÍTULO' className='ass'/>
       </div>
       <div className='inputddddd'>
      <input id='descDuvida' name='descDuvida' onChange={handleInputChange} placeholder='DESCRIÇÃO DA DÚVIDA' className='asss'/>
         <div className ="buttonsUpd">
           <input type="file" id="duvida" name="duvida" onChange={handleInputChange} className='foto' />
           <label htmlFor="duvida" className='buttonUpd'>ADICIONAR ARQUIVO</label>
           <button onClick={handleSubmit} className='botaod'>ENVIAR</button>
         </div>
       </div>
    </div>
    <hr/>
      {duvidas.map(({id, titulo, conteudo, materia, descDuvida, createdAt}) => (
        <div key={id} className='containera'>
        <img src={`http://localhost:3000/duvida/img/${id}`} />
        {titulo} - {formatRelative(
         createdAt,
          date
          )}
        </div>
      ))}

  </div>
</div>
  )
}