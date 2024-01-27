import React, { useState} from 'react'
import { useParams, Link } from 'react-router-dom';



function Vote() {
  let { id } = useParams();
  


  return (
    <div> <nav className="p-5 flex justify-start items-center">
    
    <Link to="/" className="">
      Verzuz
    </Link>
  </nav>
  <hr/>
  </div>
  )
}

export default Vote