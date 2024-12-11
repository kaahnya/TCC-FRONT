'use client'
//utilizei o use client porque estou usando os estados do react

import {useState, useEffect} from 'react';
import axios from 'axios';
//para mandar requisições ao back utilizei a biblioteca axios
import '../css/page.css';
import Menu from "../../../componentes/menu/menu.js";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


export default function Users(){
  const [users, setUsers] = useState([])
  const [userLog, setUserLog] = useState(null);
  const [search, setSearch] = useState('');

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

    const handleDelete = async (event) => {
      const id = event.target.dataset.userId
  
      const response = await axios.delete(`http://localhost:3000/usuario/${id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response){
        console.log(response)
        toast.success(" usuario " + response.data.nome + " foi deletado com sucesso ")
        setUsers( await getUsers())
      }
    } 

    const usuariosFiltrados = users.filter((user) =>
      user.nome.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) || 
    user.cpf.toLowerCase().includes(search.toLowerCase()) ||
    user.id.toString().includes(search.toLowerCase())
    );

  return(
  <div className='usuario'><Menu></Menu>
  <h1>Gestão de Usuários</h1>
 <div className="buscarDiv">
 <input name="search" className="buscar" placeholder="Busque por Id, Nome, CPF ou Email" value={search} onChange={(e) => setSearch(e.target.value)}/>
 </div>
  <div className='quadrado'>
      {usuariosFiltrados.map(({id, nome, email, cpf, desc, senha, pfp}) => (
        <div key={id} className='usersdiv'>
          <div className='fn'>
        <img src={`http://localhost:3000/usuario/pfp/${id}`} className='fotopfp' />
        <p className='p'>{nome}</p>
          </div>
        <div className='botaoo'>
        <button data-user-id={id} onClick={handleDelete} className='deletar'>Deletar</button>
        <button className='deletar'><a href={`./alterUser/${id}/`}className='branco'>Atualizar</a></button>
        </div>
        </div>
      ))}
  </div>
    </div>
  )
}

