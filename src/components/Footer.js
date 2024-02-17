import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    
    <footer className="p-5 px-2 text-[0.7rem] md:text-sm md:px-20 flex justify-between items-center border-t mt-20 mx-10 text-gray-500 border-b-gray-400 '">
    <span>Created by: <Link to="https://github.com/codeuchay" target='_blank' className='font-bold text-slate-500 hover:underline'>CodeUchay</Link>  &#128526;</span> 
    <span>©️ 2024, All Rights Reserved</span>
    
  </footer>
  )
}

export default Footer