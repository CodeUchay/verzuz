import React from 'react'
import Battles from './Battles'
import { Link } from 'react-router-dom'
import {GiBoxingGlove } from 'react-icons/gi'

function Home() {
    
  return (
    <div>
        <nav className='p-5 flex justify-between items-center'>
        <Link to="/" className="font-bold flex flex-row justify-center items-center text-lg">Verzuz <GiBoxingGlove size={20} className="ml-1"/></Link>
         <Link to="/add" className='bg-lime-500 px-2 py-1 rounded text-white'>Create</Link>
        </nav>
        <hr/>
        <div>
            <Battles/>
        </div>
    </div>
  )
}

export default Home