'use client'
import './css.css'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';



const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const route=useRouter()

  return (
    <div>
      <ul className="menu">
        <li title="home">
          <a href="#" className="menu-button about" onClick={toggleMenu}>menu</a>
        </li>
        <li title="search"><a href="#" className="search">search</a></li>
        <li title="pencil"><a href="/duvida" className="pencil">pencil</a></li>
        <li title="contact"><a href="#" className="contact">contact</a></li>
        <li><button onClick={()=>{localStorage.removeItem('user'); route.push('/login')}} className="fa fa-reply" aria-hidden="true" id='b'></button></li>
      </ul>

      <ul className={`menu-bar ${isOpen ? 'open' : ''}`}>
        <li><a href="#" className="menu-button" onClick={toggleMenu}>Usuario</a></li>
        <li><a href="#">Meu Perfil</a></li>
        <li><a href="#">Minhas Duvidas</a></li>
        <li><a href="#">Minha Conta</a></li>
      </ul>
    </div>
  );
};

export default Menu;
