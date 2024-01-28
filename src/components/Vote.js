import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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


function Vote() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [user, setUser] = useState();

  //Battle
  const [battles, setBattles] = useState([]);
  const [currentBattle, setCurrentBattle] = useState([]);
  const [activeRound, setActiveRound] = useState();

  // Voting
  const [vote1Value, setVote1Value] = useState();
  const [vote2Value, setVote2Value] = useState();
  const [voted, setVoted] = useState(false);
  const [checkRange, setCheckRange] = useState(false);

  // Get votes
  const [allVotes, setAllVotes] = useState([]);
  const [opponent1Votes, setOpponent1Votes] = useState();
  const [opponent2Votes, setOpponent2Votes] = useState();
  const [votingList, setVotingList] = useState();
  
  function logout() {
    localStorage.removeItem("userData");
  }
  useEffect(() => {
    const data = getUserData();
    if (data) {
      setUser(data);
    }
    getBattles();
  }, []);

  function saveUserData() {
    const verzusUserData = {
      username: username,
    };

    localStorage.setItem("verzusUserData", JSON.stringify(verzusUserData));
    setUser(verzusUserData);
    console.log("here>>>>>>>>.", localStorage.getItem("verzusUserData"));
  }

  function getUserData() {
    const storedData = localStorage.getItem("verzusUserData");
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      return null;
    }
  }

  const getBattles = async () => {
    const querySnapshot = await getDocs(collection(db, "battles"));
    const battleList = [];
    querySnapshot.forEach((doc) => {
      battleList.push({ id: doc.id, ...doc.data() });
    });
    console.log(battleList);
    setBattles(battleList);
    console.log(id);
    for (let i = 0; i < battleList.length; i++) {
      if (battleList[i].id === id) {
        console.log("here", battleList[i]);
        setCurrentBattle(battleList[i]);
        for (let j = 0; j < battleList[i].rounds.length; j++) {
          if (battleList[i].rounds[j].active === true) {
            setActiveRound(battleList[i].rounds[j]);
            console.log("Active FRound", activeRound);
          }
        }
      }
    }
  };

  const getAllVotes = async () => {
    const querySnapshot = await getDocs(collection(db, "votes"));
    const votingList = [];
    querySnapshot.forEach((doc) => {
      votingList.push({ id: doc.id, ...doc.data() });
    });

    const sortedList = [];
    for (let i = 0; i < votingList.length; i++) {
      if (votingList[i].battleId == currentBattle.id) {
        sortedList.push(votingList[i]);
      }
    }
    console.log("All:", votingList);
    console.log("Filtered:", sortedList);
    setAllVotes(sortedList);

    let sum1 = 0;
    let sum2 = 0;

    for (let i = 0; i < sortedList.length; i++) {
      sum1 += +sortedList[i].vote1.vote;
      sum2 += +sortedList[i].vote2.vote;
    }
    console.log("voter1 sum", sum1);
    console.log("voter1 sum", sum1);
    setOpponent1Votes(sum1);
    setOpponent2Votes(sum2);
    
  };

  useEffect(() => {
    if (currentBattle) {
      getAllVotes();
    }
  }, [currentBattle]);

  const castVote = async (e) => {
    e.preventDefault();
    if (voted === false) {
      if (
        vote1Value > -1 &&
        vote1Value < 11 &&
        vote2Value > -1 &&
        vote2Value < 11
      ) {
        setCheckRange(false);
        console.log("rounds created");

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
          });

          console.log("Vote Casted");
          alert(`Casted Successfully!`);
          navigate("/");
        } catch (error) {
          console.error("Error creating event:", error);
        }
      } else {
        setCheckRange(true);
      }
    } else {
      alert("You're not authorized");
    }
  };

  return (
    <div>
      <nav className="p-5 flex justify-between items-center">
        <Link to="/">Verzuz</Link>
        <div>
          {user ? (
            <span className="border border-lime-800 px-2 py-1 rounded text-white">
              Welcome, {user.username}{" "}
            </span>
          ) : (
            <p></p>
          )}
        </div>
      </nav>
      <hr />
      {user ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-center mt-3 p-3">
            <span className="border-b-2 px-20 py-2">Active Round</span>
          </h1>
          {/* Cast Vote */}
          <div>
            {activeRound ? (
              <form onSubmit={(e) => castVote(e)} className="mt-2">
                <h1 className="text-center mt-3 p-3">
                  {activeRound ? (
                    <span className="px-20 py-2">
                      Title: {activeRound.name}{" "}
                    </span>
                  ) : (
                    <></>
                  )}
                </h1>
                <div className="flex flex-col justify-center items-center gap-4">
                  <div className="flex  flex-row justify-center items-center gap-4">
                    <div>
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
                    <div>
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
                  <div>
                      {checkRange ? (
                        <p className="text-red-600 text-xs font-extralight">
                          Enter Valid Range between 0 and 10
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center w-40  rounded-lg text-sm py-2.5 px-4 bg-orange-600 hover:bg-orange-700 "
                    >
                      <span className="text-white">Vote</span>
                    </button>
                </div>
                
              </form>
            ) : (
              <p>No active round</p>
            )}
          </div>

          <h1 className="text-center mt-3 p-3">
            <span className="border-b-2 px-20 py-2">Total Votes</span>
          </h1>
          <hr />
          {opponent1Votes > 1 || opponent2Votes > 1 ? (
            <div>
              <div className="flex justify-center items-center">
                <h1>{currentBattle.opponent1}'s Votes: {" "}</h1>
                <p>{opponent1Votes}</p>
              </div>
              <div className="flex justify-center items-center">
                <h1>{currentBattle.opponent2}'s Votes: {" "}</h1>
                <p>{opponent2Votes}</p>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-start items-center  mt-6">
          <label htmlFor="username" className="block text-left leading-6 ">
            Enter Username To Vote
          </label>
          <div className="flex justify-center items-center gap-2 mt-4">
            <input
              type="text"
              id="username"
              className={` text-black rounded-md block w-60 px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-red-100 focus:ring-red-300 ring-1 `}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              value={username}
            />
            <button
              onClick={() => saveUserData()}
              className="bg-lime-500 px-2 py-1 h-10 rounded text-white"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vote;
