import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const ActiveRound = ({ activeRound, currentBattle, user }) => {
  const navigate = useNavigate();
  // Voting
  const [vote1Value, setVote1Value] = useState(0);
  const [vote2Value, setVote2Value] = useState(0);
  const [voted, setVoted] = useState(false);
  const [checkRange, setCheckRange] = useState(false);

  console.log("actif", activeRound);
  const active = activeRound;


  
  const castVote = async (e) => {
    e.preventDefault();
    // Disable the vote button
    e.target.disabled = true;

    const previousDateTime = localStorage.getItem("verzuzVoting");
    const currentDateTime = Date.now();
    const totalCastedVote = Math.trunc(Number(vote1Value))  + Math.trunc(Number(vote2Value));
    console.log("casted vote sum: ",totalCastedVote)
    if ((totalCastedVote === 10 && currentBattle.voteType === 'split') || (totalCastedVote === 1 && currentBattle.voteType === 'binary') ) {
      setCheckRange(false);
      console.log("vote casted");
      if (Number(previousDateTime) + 3 * 60 * 1000 < Number(currentDateTime)) {
        try {
          const vote1 = {
            opponent1: currentBattle.opponent1,
            vote: Number(vote1Value) || 0,
          };

          const vote2 = {
            opponent2: currentBattle.opponent2,
            vote: Number(vote2Value) || 0,
          };

          await addDoc(collection(db, "votes"), {
            battleId: currentBattle.id,
            username: user,
            vote1: vote1,
            vote2: vote2,
            round: activeRound.round, // Add round information
            time: new Date().toISOString(),
          });

          const date = Date.now();
          localStorage.setItem("verzuzVoting", date);
          console.log("Vote Casted");
          alert(`Vote Casted Successfully! Wait for next round`);
          // navigate("/");
        } catch (error) {
          console.error("Error casting vote:", error);
          alert(`Error occured, please try again`);
          e.target.disabled = false;
        }
      } else {
        alert("You've Voted Already!!!");
        navigate("/");
      }
    } else {
      setCheckRange(true);
    }
  };
  const toggleVotes = (no) => {
    if (no === 1 ){
        setVote1Value(1); setVote2Value(0)
    }
    if (no === 2 ){
        setVote1Value(0); setVote2Value(1)
    }
  }

  return (
    <form onSubmit={(e) => castVote(e)} className="">
      <h1 className="text-center p-3">
        <div className="flex flex-col">
          <span className="px-20 py-2">{activeRound.round} </span>
          <span className="px-20 py-2"> {activeRound.name} </span>
        </div>
      </h1>
      <div className="flex flex-col justify-center items-center gap-3">
        {currentBattle.voteType === "binary" ? (
          <>
            <div className="flex flex-row justify-start items-center gap-2 text-sm border accent-orange-600 rounded border-gray-400 px-2 h-10">
              <input
                type="radio"
                id="vote1"
                name="select_vote"
                value={currentBattle.opponent1}
                onClick={() => toggleVotes(1) }
              />
              <label htmlFor="vote1Value">{currentBattle.opponent1} </label>
              <input
                type="radio"
                id="vote2"
                name="select_vote"
                value={currentBattle.opponent2}
                onClick={() => toggleVotes(2) }
              />
              <label htmlFor="vote2Value">{currentBattle.opponent2}</label>
            </div>
          </>
        ) : (
          <>
            <div className="p-20 flex flex-row justify-center items-center gap-4">
              <div className="flex flex-column justify-center items-center text-center">
                <label htmlFor="vote1Value" className="block text-sm ">
                  {currentBattle.opponent1}
                </label>
                <input
                  type="number"
                  className="mt-2 appearance-none text-black rounded-md block w-20 px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-orange-100 focus:ring-orange-200  ring-1 "
                  onChange={(e) => setVote1Value(e.target.value)}
                  value={vote1Value}
                  required
                />
              </div>
              <span className="mt-10 text-md font-bold">Vs</span>
              <div className="flex flex-column justify-center items-center text-center">
                <label htmlFor="vote2Value" className="block text-sm  ">
                  {currentBattle.opponent2}
                </label>
                <input
                  type="number"
                  className="mt-2 appearance-none text-black rounded-md block w-20 px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-orange-100 focus:ring-orange-200  ring-1 "
                  onChange={(e) => setVote2Value(e.target.value)}
                  value={vote2Value}
                  required
                />
              </div>
            </div>
            <p className="text-xs">
              {" "}
              <b>Hint:</b> Divide 10 votes accross opponents &#128512;
            </p>
            <div>
              {checkRange ? (
                <p className="text-red-600 text-xs font-extralight">
                  Total votes should equal 10 & Single digits 0-10
                </p>
              ) : (
                <></>
              )}
            </div>
          </>
        )}
        <button
          type="submit"
          className="inline-flex justify-center w-40 mt-2 rounded-lg text-sm py-2.5 px-4 bg-orange-600 hover:bg-orange-700 "
        >
          <span className="text-white">Vote</span>
        </button>
      </div>
    </form>
  );
};

export default ActiveRound;
