import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const AdminRoundList = ({ battleId, battle, index }) => {
  const [rounds, setRounds] = useState(battle.rounds);
  const [roundName, setRoundName] = useState(false);
  const [status, setStatus] = useState(false);
  const [winnerName, setWinnerName] = useState("");

  const createRoundName = async (e, roundIndex) => {
    e.preventDefault();
    console.log("indexx", roundIndex);
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex].name = roundName;
    setRounds(updatedRounds);
    const nameRef = doc(db, "battles", `${battleId}`);
    await updateDoc(nameRef, {
      rounds: updatedRounds,
    });
  };

  

  const setActiveRound = async (e, roundIndex, roundStatus) => {
    e.preventDefault();
    setStatus(true);
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex].active = !roundStatus;
    setRounds(updatedRounds);
    const nameRef = doc(db, "battles", `${battleId}`);
    await updateDoc(nameRef, {
      rounds: updatedRounds,
    });
    //onUpdate();
    setStatus(false);
  };

  const createWinner = async () => {
    const winnerRef = doc(db, "battles", battleId);

    await updateDoc(winnerRef, {
      winner: winnerName,
    }).then(function () {
      console.log("Winner ", winnerName, " Updated");
      setWinnerName("");
      alert(
        "Winner " +
          winnerName +
          " Updated for " +
          battle.opponent1 +
          " vs " +
          battle.opponent2
      );
    });
  };

  return (
    <div>
      {rounds.map((round, index) => (
        <li
          className="text-sm w-60 py-3 border-b text-center flex flex-col justify-center items-center gap-1"
          key={index}
        >
          <div>{round.round}</div>
          <div>
            Active:{" "}
            {round.active == false ? (
              <button
                disabled={status}
                onClick={(e) => setActiveRound(e, index, round.active)}
                className="bg-lime-600 px-2 py-1 mt-3 rounded text-white"
              >
                Start
              </button>
            ) : (
              <button
                disabled={status}
                onClick={(e) => setActiveRound(e, index, round.active)}
                className="bg-red-600 px-2 py-1 mt-3 rounded text-white"
              >
                Stop
              </button>
            )}
          </div>

          <div>
            {round.name ? (
              <p> Name: {round.name}</p>
            ) : (
              <div className=" flex flex-col p-3 justify-items-center gap-1">
                <h2>Create Name</h2>
                <hr />
                <div className="flex flex-row mt-2 gap-2">
                  <input
                    onChange={(e) => setRoundName(e.target.value)}
                    type="text"
                    className="px-2 py-1 rounded w-28 bg-black border text-white"
                  />
                  <button
                    onClick={(e) => createRoundName(e, index)}
                    className="bg-cyan-600 px-2 py-1 text-xs rounded text-white"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
          </div>
        </li>
      ))}
      <div className=" flex flex-row mt-3 p-3 justify-items-center gap-2">
        <input
          onChange={(e) => setWinnerName(e.target.value)}
          value={winnerName}
          type="text"
          className="p-1 px-2 rounded w-28 bg-black border text-white"
          placeholder="Username"
        />
        <button
          onClick={(e) => createWinner()}
          className="bg-orange-500 py-1 px-2 text-xs rounded text-white"
        >
          Update Winner
        </button>
      </div>
    </div>
  );
};

export default AdminRoundList;