'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/page.css';
import Image from "next/image";
import img from '../../img/adobe.jpg';
import Menu from "../../../../componentes/menu/menu.js";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useParams } from "next/navigation"

export default function Home() {
  const [user, setUser] = useState(null);
  const [userLog, setUserLog] = useState(null);
  const [values, setValues] = useState({
    nome: '', cpf: '', email: '', senha: '', desc: '', pfp: null, banner: null
  });
  const route = useRouter();
  const { id } = useParams();

  const getUsers = async () => {
    const response = await axios.get("http://localhost:3000/usuario/" + id);
    console.log(response.data)
    return response.data;
  };

  const handleInputChange = (event) => {
    if (event.target.type === 'file') {
      setValues((prevValue) => ({
        ...prevValue, [event.target.name]: event.target.files?.[0]
      }));
    } else {
      setValues((prevValue) => ({
        ...prevValue, [event.target.name]: event.target.value
      }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('nome', values.nome);
    formData.append('cpf', values.cpf);
    formData.append('email', values.email);
    formData.append('senha', values.senha);
    formData.append('desc', values.desc);
    formData.append('pfp', values.pfp);
    formData.append('banner', values.banner);

    const response = await axios.put("http://localhost:3000/alterarUsuario", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response) {
      toast.success("Alteração feita com sucesso " + response.data.nome);
      route.push("/users");
    }
  };

  useEffect(() => {
    const handleUsers = async () => {
      const userData = await getUsers();
      setUser(userData);
      setValues((prevValues) => ({
        ...prevValues,
        nome: userData?.nome,
        cpf: userData?.cpf,
        email: userData?.email,
        desc: userData?.desc
      }));
    };
    handleUsers();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUserLog(JSON.parse(userData));
    }
    console.log(userLog);
  }, []);

  return (
    <div>
      <div className='container'>
        <div className='e'><Image src={img} /></div>
        <div className='d'>
          <h1>Alterar</h1>
          <div className='input'>
            <input id='nome' name='nome' onChange={handleInputChange} value={values.nome} placeholder='NOME' className='input1' />
            <input id='cpf' name='cpf' onChange={handleInputChange} value={values.cpf} placeholder='CPF' className='input1' />
          </div>
          <input id='email' name='email' onChange={handleInputChange} value={values.email} placeholder='EMAIL' />
          <input id='senha' name='senha' onChange={handleInputChange} value={values.senha} placeholder='SENHA' />
          <input id='desc' name='desc' onChange={handleInputChange} value={values.desc} placeholder='DESCRIÇÃO' />
          <div className="buttonsUp">
            <input type="file" id="pfp" name="pfp" onChange={handleInputChange} className='foto' />
            <label htmlFor="pfp" className='buttonUp'>FOTO</label>
            <input type="file" id="banner" name="banner" onChange={handleInputChange} className='foto' />
            <label htmlFor="banner" className='buttonUp'>BANNER</label>
          </div>
          <button onClick={handleSubmit} className="button">Alterar</button>
          <p>Deseja cancelar? <a href='/users'>Cancelar</a></p>
        </div>
      </div>
    </div>
  );
}
