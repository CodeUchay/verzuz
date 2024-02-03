import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { GiBoxingGlove } from "react-icons/gi";
import { addDoc, collection, getDocs } from "firebase/firestore";
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
  const [roundVotes, setRoundVotes] = useState([]);

  function logout() {
    localStorage.removeItem("verzusUserData");
    navigate("/");
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

    const sortedList = votingList
      .filter((vote) => vote.battleId === currentBattle.id)
      .sort((a, b) => new Date(a.time) - new Date(b.time));

    setAllVotes(sortedList);
    console.log(sortedList);

    let sum1 = 0;
    let sum2 = 0;

    for (let i = 0; i < sortedList.length; i++) {
      sum1 += +sortedList[i].vote1.vote;
      sum2 += +sortedList[i].vote2.vote;
    }
    console.log("voter1 sum", sum1);
    console.log("voter2 sum2", sum2);
    setOpponent1Votes(sum1);
    setOpponent2Votes(sum2);

    // Calculate total votes per opponent per round
    const roundVoteTotals = {};
    sortedList.forEach((vote) => {
      const { round, vote1, vote2 } = vote;

      if (!roundVoteTotals[round]) {
        roundVoteTotals[round] = {
          [currentBattle.opponent1]: 0,
          [currentBattle.opponent2]: 0,
        };
      }

      roundVoteTotals[round][vote1.opponent1] += vote1.vote;
      roundVoteTotals[round][vote2.opponent2] += vote2.vote;
    });

    // Update the state with total votes per opponent per round
    setRoundVotes(
      Object.entries(roundVoteTotals).map(([round, totals]) => ({
        round,
        totals: Object.values(totals),
      }))
    );
    console.log(
      Object.entries(roundVoteTotals).map(([round, totals]) => ({
        round,
        totals: Object.values(totals),
      }))
    );
  };

  useEffect(() => {
    if (currentBattle) {
      getAllVotes();
    }
  }, [currentBattle]);

  const castVote = async (e) => {
    e.preventDefault();
    const previousDateTime = localStorage.getItem("verzuzVoting");
    const currentDateTime = Date.now();
    const totalCastedVote = Number(vote1Value) + Number(vote2Value);

    if (totalCastedVote === 10) {
      setCheckRange(false);
      console.log("rounds created");
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
          navigate("/");
        } catch (error) {
          console.error("Error creating event:", error);
        }
      } else {
        alert("You've Voted Already!!!");
        navigate("/");
      }
    } else {
      setCheckRange(true);
    }
  };

  return (
    <div>
      <nav className="p-5 px-6 flex justify-between items-center border-b border-b-gray-400 '">
        <Link
          to="/"
          className="font-bold flex flex-row justify-center items-center text-lg"
        >
          Verzuz <GiBoxingGlove size={20} className="ml-1" />
        </Link>
        <div>
          {user ? (
            <>
              {/* <button  onClick={(e) => logout(e)} className="bg-red-500 px-2 py-1 rounded mr-2">
              logout
            </button>          */}
              <span className=" bg-orange-700 px-2 py-1 rounded text-white">
                Welcome, {user.username}
              </span>
            </>
          ) : (
            <p></p>
          )}
        </div>
      </nav>
      {user ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-center mt-3 p-3">
            <span className="border-b-2 px-20 py-2 font-bold">
              Active Round
            </span>
          </h1>
          {/* Cast Vote */}
          <div>
            {activeRound ? (
              <form onSubmit={(e) => castVote(e)} className="mt-2">
                <h1 className="text-center mt-3 p-3">
                  {activeRound ? (
                    <div className="flex flex-col">
                      <span className="px-20 py-2">{activeRound.round} </span>
                      <span className="px-20 py-2">
                        Title: {activeRound.name}{" "}
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                </h1>
                <div className="flex flex-col justify-center items-center gap-4">
                  <div className="flex flex-row justify-center items-center gap-4">
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
                  <p className="text-xs">
                    {" "}
                    <b>Hint:</b> Divide 10 votes accross opponents &#128512;
                  </p>
                  <div>
                    {checkRange ? (
                      <p className="text-red-600 text-xs font-extralight">
                        Total votes should equal 10
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
          <h1 className="text-center mt-5 p-3">
            <span className="border-b-2 px-20 py-2 font-bold">Total Votes</span>
          </h1>
          <hr />

          {opponent1Votes > 1 || opponent2Votes > 1 ? (
            <div className="">
              <div className="flex justify-center items-center mt-3">
                <h1>{currentBattle.opponent1}'s Votes: </h1>
                <p className="ml-2 rounded-full bg-white px-2 text-black font-bold">
                  {opponent1Votes}
                </p>
              </div>
              <div className="flex justify-center items-center mt-3">
                <h1>{currentBattle.opponent2}'s Votes: </h1>
                <p className="ml-2 rounded-full bg-white px-2 text-black font-bold">
                  {opponent2Votes}
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}

          <h1 className="text-center mt-5 p-3">
            <span className="border-b-2 px-20 py-2 font-bold">
              Voters Table
            </span>
          </h1>
          <hr />
          {/* Voting Table */}

          <table className=" mt-2 text-xs">
            <thead>
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2"> Name</th>
                <th className="border p-2"> Round</th>
                <th className="border p-2">{currentBattle.opponent1}</th>
                <th className="border p-2">{currentBattle.opponent2}</th>
              </tr>
            </thead>
            <tbody>
              {allVotes.length > 1 ? (
                allVotes.map((vote, index) => (
                  <tr className="border-b-2" key={index}>
                    <td className="text-center font-semibold">{index + 1}</td>
                    <td className="px-3">{vote.username.username}</td>
                    <td className="px-3">{vote.round}</td>
                    <td className="p-3">{vote.vote1.vote}</td>
                    <td className="px-4">{vote.vote2.vote}</td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>

          <h1 className="text-center mt-5 p-3">
            <span className="border-b-2 px-20 py-2 font-bold">
              Total Votes Per Round
            </span>
          </h1>
          <hr />
          <table className="mt-2 text-xs">
            <thead>
              <tr>
                <th className="border p-2">Round</th>
                <th className="border p-2">{currentBattle.opponent1}</th>
                <th className="border p-2">{currentBattle.opponent2}</th>
              </tr>
            </thead>
            <tbody>
              {roundVotes.length > 0 ? (
                roundVotes.map((round, index) => (
                  <tr className="border-b-2" key={index}>
                    <td className="px-3">{round.round}</td>
                    <td className="p-3">{round.totals[0]}</td>
                    <td className="px-4">{round.totals[1]}</td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
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
