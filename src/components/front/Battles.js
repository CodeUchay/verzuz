import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import HallOfFame from "./HallOfFame";

const Battles = () => {
  const [battles, setBattles] = useState([]);
  const [listNo, setListNo] = useState(5); // Using state to handle the number of items shown
  const navigate = useNavigate();

  const getBattles = async () => {
    const querySnapshot = await getDocs(collection(db, "battles"));
    const battleList = [];
    querySnapshot.forEach((doc) => {
      battleList.push({ id: doc.id, ...doc.data() });
    });

    battleList.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date);
      } else if (a.date && !b.date) {
        return -1;
      } else if (!a.date && b.date) {
        return 1;
      } else {
        return 0;
      }
    });
    console.log(battleList[0])
    setBattles(battleList);
  };

  const viewMore = () => {
    setListNo(prevListNo => prevListNo + 5); // Update state to show 5 more battles
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
        <span className="border-b-2 px-20 py-2">Battles</span>
      </h1>
      {battles.length > 0 ? (
        <ul className="mt-3 flex flex-col justify-center items-center gap-5">
          {battles.slice(0, listNo).map((battle, index) => (
            <div className="text-sm" key={index}>
              <li
                onClick={() => gotoBattle(battle.id)}
                className="w-60 border py-3 text-center hover:cursor-pointer hover:bg-lime-600 hover:font-bold"
              >
                {battle.opponent1} <span className="font-extralight">vs</span>{" "}
                {battle.opponent2}
              </li>
            </div>
          ))}
       
          {listNo < battles.length && (
            <div className="flex space-x-12 justify-between items-center ">
               <p className="text-sm text-gray-500">
               <b>{listNo}</b> {  " of " } <b>{battles.length}</b> {" battles" }
             </p>
            <button
              onClick={viewMore}
              className="text-sm text-gray-500 underline hover:text-gray-300"
            >
              Show more 
            </button>
            </div>
          )}
        </ul>
      ) : (
        <p>No Battles</p>
      )}
      <HallOfFame battles={battles} />
    </div>
  );
};

export default Battles;
