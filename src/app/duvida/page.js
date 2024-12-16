'use client'
//utilizei o use client porque estou usando os estados do react

import { useState, useEffect } from 'react';
import axios from 'axios';
//para mandar requisições ao back utilizei a biblioteca axios
import '../css/page.css';
import Menu from "../../../componentes/menu/menu.js";
import Icon from "../img/icons.png";
import { formatRelative } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Image } from 'next/image';

export default function duvida() {
  const [duvidas, setDuvidas] = useState([])
  const [values, setValues] = useState(
    { titulo: '', materia: '', conteudo: '', descDuvida: '', duvida: null, usuarioId: '' }
  )
  const [valuesComentario, setValuesComentario] = useState(
    { texto: '', resposta: '', imgComentario: null, usuarioId: '', duvidaId: '' }
  )
  const [userLog, setUserLog] = useState(null);
  const [search, setSearch] = useState('');

  const getDuvidas = async () => {
    const response = await axios.get("http://localhost:3000/duvidas")
    return response.data
  }
  //obter os usuarios atraves da biblioteca axios
  const date = new Date();
  useEffect(() => {
    const handleDuvidas = async () => {
      setDuvidas(await getDuvidas())
    }
    handleDuvidas()
  }, [])
  //executa ao iniciar a pagina, a função executada tem como objetivo obter os dados dos usuarios

  const route = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUserLog(JSON.parse(userData));
    } else {
      return route.push("/login")
    }
  }, []);

  const handleInputChange = (event) => {
    if (event.target.type === 'file') {
      setValues((prevValue) => ({
        ...prevValue, [event.target.name]: event.target.files?.[0]
      }))
    } else {
      setValues((prevValue) => ({
        ...prevValue, [event.target.name]: event.target.value
      }))
    }
  }
  /*função para lidar com a mudança dos valores dentro dos input, se o input for do tipo "file" ele guardara 
  a imagem, caso não, guardara o valor normalmente*/

  const handleSubmit = async () => {
    const formData = new FormData()
    values.usuarioId = userLog.id
    formData.append('titulo', values.titulo)
    formData.append('materia', values.materia)
    formData.append('conteudo', values.conteudo)
    formData.append('descDuvida', values.descDuvida)
    formData.append('duvida', values.duvida)
    formData.append('usuarioId', values.usuarioId)

    const response = await axios.post("http://localhost:3000/duvida", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response) {
      setDuvidas(await getDuvidas())
    }
  }
  /*utilizei o formData para enviar os dados que foram coletados atras dos inputs, escolhi formFata pois 
  é recomendado ao manipular imagens*/

  const handleDelete = async (event) => {
    const id = event.target.dataset.duvidaId

    const response = await axios.delete(`http://localhost:3000/duvida/${id}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if(response){
      console.log(response)
      toast.success("Duvida deletada com sucesso ")
      setDuvidas( await getDuvidas())
    }
  } 

  const handleSubmitComentario = async (event) => {
    const formData = new FormData()
    valuesComentario.usuarioId = userLog.id
    valuesComentario.duvidaId = event.target.dataset.duvidaId
    console.log(event.target.dataset.duvidaId)
    formData.append('texto', valuesComentario.texto)
    formData.append('resposta', valuesComentario.resposta)
    formData.append('imgComentario', valuesComentario.imgComentario)
    formData.append('usuarioId', valuesComentario.usuarioId)
    formData.append('duvidaId', valuesComentario.duvidaId)

    const response = await axios.post("http://localhost:3000/comentario", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if(response){
      setDuvidas(await getDuvidas())
    }
  }
  const handleInputChangeComentario = (event) => {
    if (event.target.type === 'file') {
      setValuesComentario((prevValue) => ({
        ...prevValue, [event.target.name]: event.target.files?.[0]
      }))
    } else {
      setValuesComentario((prevValue) => ({
        ...prevValue, [event.target.name]: event.target.value
      }))
    }
  }

  const duvidasFiltradas = duvidas.filter((duvida) =>
    duvida.titulo.toLowerCase().includes(search.toLowerCase()) ||
    duvida.materia.toLowerCase().includes(search.toLowerCase()) ||
    duvida.descDuvida.toLowerCase().includes(search.toLowerCase()) ||
    duvida.conteudo.toLowerCase().includes(search.toLowerCase()) ||
    duvida.id.toString().includes(search.toLowerCase())
  );

  return (
    <div><Menu></Menu>
      <div className='containerdd'>

        <div className='lll'>
          <div className='em'><h1 className='du'>Compartilhar Dúvida</h1></div>
          <div className='dm'><h3 className='du'></h3></div>
        </div>
        <div className='containerddd'>
          <div className='inputdddd'>
            <input id='materia' name='materia' onChange={handleInputChange} placeholder='MATÉRIA' className='ass' />
            <input id='conteudo' name='conteudo' onChange={handleInputChange} placeholder='CONTEÚDO' className='ass' />
            <input id='titulo' name='titulo' onChange={handleInputChange} placeholder='TÍTULO' className='ass' />
          </div>
          <div className='inputddddd'>
            <input id='descDuvida' name='descDuvida' onChange={handleInputChange} placeholder='DESCRIÇÃO DA DÚVIDA' className='asss' />
            <div className="buttonsUpd">
              <input type="file" id="duvida" name="duvida" onChange={handleInputChange} className='foto' />
              <label htmlFor="duvida" className='buttonUpd'>ADICIONAR ARQUIVO</label>
              <button onClick={handleSubmit} className='botaod'>ENVIAR</button>
            </div>
          </div>
        </div>

        <div className="buscarDd">
          <input name="search" className="buscarD" placeholder="Algum assunto especifico?" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {duvidasFiltradas.map(({ id, titulo, conteudo, materia, descDuvida, usuario, duvidaImg, createdAt, comentario }) => (
          <div key={id} className='containera'>
            <div className='divcoment'>
              <img src={`http://localhost:3000/usuario/pfp/${usuario.id}`} className="fotoComentario" />
              <div classname="inputComent">
                <div className="nomecomentario mt">{usuario && usuario.nome}</div>
                <span className='ttduvida ml'> {formatRelative(
                  createdAt,
                  date, { locale: ptBR }
                )}</span></div>
            </div>
            <h1 className='tduvida'>{titulo}</h1>         <button data-duvida-id={id} onClick={handleDelete} className='deletar'>Deletar</button>
            <div className="conteudomateria">{materia} - {conteudo}</div> 
            <div>{descDuvida}</div>
            {duvidaImg && (<img src={`http://localhost:3000/duvida/img/${id}`} className='fotoduvi' />)}

            <div className='borderComentarios'>
              <h2 className="titulocoment">Comentarios</h2>
              <div className='contentComentarios'>
                <div className='divcoment'>
                  <img src={`http://localhost:3000/usuario/pfp/${userLog.id}`} className="fotoComentario" />
                  <div classname="inputComent">
                    <div className="nomecomentario">{userLog && userLog.nome}</div>
                    <textarea id='texto' name='texto' onChange={handleInputChangeComentario} placeholder='RESPONDER' className='coment'></textarea>
                  </div>
                  <div className="iconesComentarios">
                    <input type="file" id="imgComentario" name="imgComentario" onChange={handleInputChangeComentario} className='fotoo'></input>
                    <label htmlFor="imgComentario" className='buttonUpdd'><img src='./img/icon.png' className='icon' /></label>
                  </div>
                  <button data-duvida-id={id} onClick={handleSubmitComentario} className='botaodd'>➤</button>
                </div>
                <br className="mt" />
                {comentario && comentario.map(({ id, texto, imgComentario, monitor, duvidaId, createdAt, usuario }) => (
                  <div key={id}>
                    <div className='divcoment '>
                      <img src={`http://localhost:3000/usuario/pfp/${usuario.id}`} className="fotoComentario" />
                      <div classname="inputComent ">
                        <div className="flex">
                          <div className="nomecomentario mt-2">{usuario.nome} {monitor && (<img src="../img/verificado.png"  className='icon'/>)}</div>
                          <div className='ttduvida mt'> {formatRelative(
                            createdAt,
                            date, { locale: ptBR })}
                          </div>
                        </div>
                        <div className="textocomentario">{texto}</div>
                      </div>
                    </div>
                    {imgComentario && (<img src={`http://localhost:3000/comentario/img/${id}`} className="imgcomentario" />)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}