import React from 'react'
import Battles from './Battles'
import { Link } from 'react-router-dom'

function Home() {
    
  return (
    <div>
        <nav className='p-5 flex justify-between items-center'>
            <span >Verzuz</span>
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