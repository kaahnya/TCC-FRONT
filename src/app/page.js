'use client'
//utilizei o use client porque estou usando os estados do react

import {useState, useEffect} from 'react';
import axios from 'axios';
//para mandar requisições ao back utilizei a biblioteca axios

export default function Home(){
  const [users, setUsers] = useState([])
  const [values, setValues] = useState(
    {name:'', cpf:'', email:'', password:'', desc:'', pfp:null, banner:null}
  )

  const getUsers = async () =>{
    const response = await axios.get("http://localhost:3000/users")
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

    formData.append('name', values.name)
    formData.append('cpf', values.cpf)
    formData.append('email', values.email)
    formData.append('password', values.password)
    formData.append('desc', values.desc)
    formData.append('pfp', values.pfp)
    formData.append('banner', values.banner)

    const response = await axios.post("http://localhost:3000/user", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

  return(
    <div>
      <input id='name' name='name' onChange={handleInputChange}/>
      <input id='cpf' name='cpf' onChange={handleInputChange}/>
      <input id='email' name='email' onChange={handleInputChange}/>
      <input id='password' name='password' onChange={handleInputChange}/>
      <input id='desc' name='desc' onChange={handleInputChange}/>
      <input id='pfp' name='pfp' type='file' onChange={handleInputChange}/>
      <input id='banner' name='banner' type='file' onChange={handleInputChange}/>

      <button onClick={handleSubmit}>enviar</button>

      {users.map(({id, name, email, cpf, desc, password}) => (
        <div key={id}>{name}
        <img src={`http://localhost:3000/user/pfp/${id}`} />
        </div>
      ))}
      {/*mapeamento dos usuarios*/}
    </div>
  )
}