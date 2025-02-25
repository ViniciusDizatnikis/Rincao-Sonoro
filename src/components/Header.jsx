import React from 'react'
import logo from '../assets/imagens/logo.png'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className='header'>
      <Link to="/" className='header__image'>
        <img src={logo} alt="Logo Rincão Sonoro" />
      </Link>
      <Link to="/"><h1 className='header__title'>Rincão Sonoro</h1></Link>
    </div>
  )
}

export default Header