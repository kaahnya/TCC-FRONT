'use client'

import {useState, useEffect} from 'react';
import axios from 'axios';

export default function Home(){
  const [users, setUsers] = useState([])
  const [values, setValues] = useState(
    {name:'', cpf:'', email:'', password:'', desc:'', pfp:null, banner:null}
  )

  const getUsers = async () =>{
    const response = await axios.get("http://localhost:3000/users")
    return response.data
  }

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

    useEffect(() =>{
      const handleUsers = async ()=>{
        setUsers( await getUsers())
      }
      handleUsers()
    },[])

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

    </div>
  )
}