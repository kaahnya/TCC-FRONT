'use client'
//utilizei o use client porque estou usando os estados do react

import { useState, useEffect } from 'react';
import axios from 'axios';
//para mandar requisições ao back utilizei a biblioteca axios
import '../../css/page.css';
import Menu from "../../../../componentes/menu/menu.js";
import Icon from "../../img/icons.png";
import { formatRelative } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import { toast } from 'sonner';


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

  const { id } = useParams();

  const getDuvidas = async () => {
    const response = await axios.get(`http://localhost:3000/usuario/${id}/duvidas`)
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

  const handleDelete = async (event) => {
    const id = event.target.dataset.duvidaId

    const response = await axios.delete(`http://localhost:3000/duvida/${id}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if(response){
      console.log(response)
      toast.success(" usuario " + response.data.nome + " foi deletado com sucesso ")
      setDuvidas( await getDuvidas())
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

      <img src={`http://localhost:3000/usuario/banner/${id}`} className=" banner" />
      <div className="perfil">
        <img src={`http://localhost:3000/usuario/pfp/${id}`} className="fotoComentario" />
      </div>
      <div className="perfilNome">
        <div>{userLog && userLog.nome}</div>
        <div>{userLog && userLog.desc} </div>
      </div>

      <div className="buscarDd">
        <input name="search" className="buscarD" placeholder="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>


      {duvidasFiltradas.length === 0 ?
        (<div className="no-results">
          Não encontramos nenhuma dúvida correspondente à sua busca.
        </div>) : duvidasFiltradas.map(({ id, titulo, conteudo, materia, descDuvida, usuario, duvidaImg, createdAt, comentario }) => (
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
                {comentario && comentario.map(({ id, texto, imgComentario, resposta, duvidaId, createdAt, usuario }) => (
                  <div key={id}>
                    <div className='divcoment '>
                      <img src={`http://localhost:3000/usuario/pfp/${usuario.id}`} className="fotoComentario" />
                      <div classname="inputComent ">
                        <div className="flex">
                          <div className="nomecomentario mt-2">{usuario.nome}</div>
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
  )
}