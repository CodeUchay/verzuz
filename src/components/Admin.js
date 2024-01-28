import React, { useState, useEffect } from "react";
import {
  addDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import RoundList from "./Round";

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


  return (
    <>
    <nav className='p-5 flex justify-between items-center'>
        <span >Verzuz</span>
        <Link to="/add" className='bg-lime-500 px-2 py-1 rounded text-white'>Create</Link>
    </nav>
    <hr/>
   
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
    </div> </>
  );
}

export default Battles;
