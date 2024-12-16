'use client'
import './css.css'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [usuario, setUsuario] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const route=useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dadosUsuario = localStorage.getItem('user');
      if (dadosUsuario) {
        setUsuario(JSON.parse(dadosUsuario)); 
      }
    }
  }, []);

  return (
    <div>
      <ul className="menu">
        <li title="home">
          <a href="#" className="menu-button about" onClick={toggleMenu}>menu</a>
        </li>
      {usuario && usuario.id == 1 && ( <li title="Gestão de Usuários"><a href="/users" className="search">Gestão de Usuários</a></li>)}
        <li title="Duvidas"><a href="/duvida" className="pencil">Duvidas</a></li>
        <li title="contact"><a href="/monitor" className="contact">Monitores</a></li>
        <li><button onClick={()=>{localStorage.removeItem('user'); route.push('/login')}} className="fa fa-reply" aria-hidden="true" id='b'></button></li>
      </ul>

      <ul className={`menu-bar ${isOpen ? 'open' : ''}`}>
        <li><a href="#" className="menu-button" onClick={toggleMenu}>{usuario && usuario.nome}</a></li>
        <li><a href={`/myDoubt/${usuario && usuario.id}`}>Meu Perfil</a></li>
        <li><a href={`/alterUser/${usuario && usuario.id}`}>Minha Conta</a></li>
      </ul>
    </div>
  );
};

export default Menu;
