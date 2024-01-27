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
import { useNavigate } from "react-router-dom";

function Battles() {
  const [battles, setBattles] = useState([]);
  const navigate = useNavigate();

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

  const gotoBattle = (battleId) => {
    navigate(`vote/${battleId}`);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-center mt-3 p-3">
        {" "}
        <span className="border-b-2 px-20 py-2">Battles</span>
      </h1>
      {battles ? (
        <ul className="mt-3 flex flex-col justify-center item-center gap-5 ">
          {battles.map((battle, index) => (
            <div className=" text-sm " key={index}>
              <li
                onClick={() => gotoBattle(battle.id)}
                className="w-60 border py-3 text-center hover:cursor-pointer hover:bg-lime-600 hover:font-bold"
              >
                {battle.opponent1} <span className="font-extralight">vs</span>{" "}
                {battle.opponent2}
              </li>
            </div>
          ))}
        </ul>
      ) : (
        <p> No Battles</p>
      )}
    </div>
  );
}

export default Battles;
