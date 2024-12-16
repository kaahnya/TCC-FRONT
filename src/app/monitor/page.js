'use client'
//utilizei o use client porque estou usando os estados do react

import { useState, useEffect } from 'react';
import axios from 'axios';
//para mandar requisições ao back utilizei a biblioteca axios
import '../css/page.css';
import Menu from "../../../componentes/menu/menu.js";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Select from "react-select";


export default function Monitores() {
  const [monitores, setMonitores] = useState([])
  const [users, setUsers] = useState([])
  const [userLog, setUserLog] = useState(null);
  const [search, setSearch] = useState('');
  const [values, setValues] = useState(
    { cpf: '', materia: '', professor: '' }
  )

  const handleInputChange = (event) => {
    setValues((prevValue) => ({
      ...prevValue, [event.target.name]: event.target.value
    }))
  }


  const handleSubmit = async () => {
    const response = await axios.post("http://localhost:3000/monitor", { cpf: values.cpf, materia: values.materia, professor: values.professor })
    if (response.data) {
      setMonitores(await getMonitores())
    }
  }


  const route = useRouter()

  const getMonitores = async () => {
    const response = await axios.get("http://localhost:3000/monitores")
    return response.data
  }

  const getUsuarios = async () => {
    const response = await axios.get("http://localhost:3000/usuarios")
    return response.data
  }
  //obter os usuarios atraves da biblioteca axios

  useEffect(() => {
    const handleData = async () => {
      setMonitores(await getMonitores())
      setUsers(await getUsuarios())
    }
    handleData()
  }, [])
  //executa ao iniciar a pagina, a função executada tem como objetivo obter os dados dos usuarios

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUserLog(JSON.parse(userData));
    } else {
      return route.push("/login")
    }
  }, []);

  const handleDelete = async (cpf) => {
    const response = await axios.delete(`http://localhost:3000/monitor/${cpf}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(cpf)
    if (response) {
      toast.success(" usuario " + response.data.nome + " foi deletado com sucesso ")
      setMonitores(await getMonitores())
    }
  }

  const usuariosFiltrados = monitores.filter((user) =>
    user.nome.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.cpf.toLowerCase().includes(search.toLowerCase()) ||
    user.id.toString().includes(search.toLowerCase())
  );

  const handleSelectChange = (selectedOption) => {
    setValues((prevValue) => ({
      ...prevValue,
      cpf: selectedOption.value
    }));
  };
  return (
    <div className='usuario'><Menu></Menu>
      <h1>Monitores</h1>

      {userLog && userLog.id == 1 &&
        (<div className="monitorBorder">
          <h2>Cadastrar um novo monitor</h2>
          <div>
            <Select
              options={users.map(user => ({ value: user.cpf, label: `Nome: ${user.nome}, CPF: ${user.cpf}` }))}
              onChange={handleSelectChange}
              placeholder="Selecione um usuário..."
              isSearchable
              className=''
            />
            <br />
            <div className='input'>
              <input id='materia' name='materia' onChange={handleInputChange} placeholder='Matéria' className='input2 mr' />
              <input id='professor' name='professor' onChange={handleInputChange} placeholder='Professor' className='input2' />
            </div>
          </div>
          <button onClick={handleSubmit} className="button">Criar</button>
  
        </div>)
      }

      <div className="buscarDiv">
        <input name="search" className="buscar" placeholder="Busque por Id, Nome, CPF ou Email" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div>

      </div>
      {userLog && userLog.id == 1 && (<h2>Monitores</h2>) }
      <div className='quadrado'>
        {usuariosFiltrados.map(({ id, nome, email, cpf, desc, senha, pfp, materia }) => (
          <div key={id} className='monitoresdiv'>
            <div className='fn'>
              <img src={`http://localhost:3000/usuario/pfp/${id}`} className='fotopfp' />
              <p className='p'>{nome}</p>
              <p className='p'>{materia}</p>
            </div>
            { userLog  && userLog.id == 1 && (
              <div className='botaoo'>
              <button onClick={(() => { handleDelete(cpf) })} className='deletar'>Deletar</button>
              </div>
           )}
          </div>
        ))}
      </div>
    </div>
  )
}

