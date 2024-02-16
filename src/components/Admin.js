import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc
  
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import RoundList from "./Round";
import {GiBoxingGlove } from 'react-icons/gi'

function Battles() {
  const [battles, setBattles] = useState([]);
  const navigate = useNavigate();
  const [status, setStatus] = useState();

    
  const getBattles = async () => {
    const querySnapshot = await getDocs(collection(db, "battles"));
    const battleList = [];
    querySnapshot.forEach((doc) => {
      battleList.push({ id: doc.id, ...doc.data() });
    });
    console.log(battleList);
    setBattles(battleList);
  };
 
  useEffect(() => {
    getBattles();
  }, []);
  const handleUpdate = async () => {
    // Fetch battles from Firebase after updating a round name
    await getBattles();
  };

  const [deleteId, setDeleteId] = useState("");
  
  const deleteRoundById = async () => {
    
  };

  return (
    <>
    <nav className='p-5 px-4 shadow-sm shadow-gray-300 flex justify-between items-center border-b-2 border-b-gray-400 '>
    <Link to="/" className="font-bold flex flex-row justify-center items-center text-lg">Verzuz <GiBoxingGlove size={20} className="ml-1"/></Link>
        <Link to="/add" className='bg-lime-500 px-2 py-1 rounded text-white'>Create</Link>
    </nav>
   
   
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-center mt-3 p-3"> {" "}
        <span className="border-b-2 px-20 py-2">Battles</span>
      </h1>
      {battles ? (
        <ul className="mt-3 flex flex-col justify-center item-center gap-5 ">
          {battles.map((battle, index) => (
            <div className=" text-sm " key={index}>
              <li
                className="w-60 border py-3 text-center "
              >
                {battle.opponent1} <span className="font-extralight">vs</span>{" "}
                {battle.opponent2}
              </li>
                
              <ul className="mt-3 flex flex-col justify-center item-center gap-5 ">
          <RoundList key={index} battleId={battle.id} battle={battle} onUpdate={handleUpdate} />
        </ul>
            

            </div>
          ))}
        </ul>
        
      ) : (
        <p> No Battles</p>
      )}
    </div> 
    {/* <div>
    <input onChange={(e) => setDeleteId(e.target.value)} type="text" className="rounded w-28 bg-black border text-white" />
              <button onClick={(e) => createRoundName(e, index)} className="bg-red-600 px-2 py-1 text-xs rounded text-white">
              Delete
            </button>
    </div> */}
    </>
  );
}

export default Battles;
